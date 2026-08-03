import { AUTHTOKEN_COOKIE_NAMESPACE, SESSION_COOKIE_VALIDITY_s, USER_SESSION_VALIDITY_ms } from "@app/utils/constants";
import { getSessionIp, getSessionMetadata } from "@app/utils/headers";
import { ALL_PAT_SCOPES } from "@app/utils/pats";
import { type GlobalUserRole, UserSessionStates } from "@app/utils/types";
import type { Session, User } from "@prisma-client";
import type { Context } from "hono";
import type { CookieOptions } from "hono/utils/cookie";
import { GetPAT } from "~/db/pat_item";
import {
    CreateSession,
    DeleteManySessions,
    DeleteSession,
    GetManySessions,
    GetSession,
    GetSession_ByTokenHash,
    UpdateSession,
} from "~/db/session_item";
import { GetUser_ByIdOrUsername } from "~/db/user_item";
import type { SessionUserData } from "~/types";
import { sendNewSigninAlertEmail } from "~/utils/email";
import env from "~/utils/env";
import { deleteCookie, setCookie } from "~/utils/http";
import { generateDbId, generateRandomId } from "~/utils/str";
import { generateRandomToken, getUserSessionCookie, hashString } from "./index";

interface CreateNewSessionProps {
    userId: string;
    providerName: string;
    ctx: Context;
    isFirstSignIn?: boolean;
    user: User;
}

export async function createUserSession({ userId, providerName, ctx, isFirstSignIn, user }: CreateNewSessionProps) {
    function getHeader(key: string) {
        return ctx.req.header(key);
    }

    const sessionToken = generateRandomToken();
    const tokenHash = hashString(sessionToken);

    const revokeAccessCode = generateRandomId(32);
    const revokeAccessCodeHash = hashString(revokeAccessCode);

    const sessionIp = getSessionIp(getHeader, {
        fallbackIp: ctx.env?.ip?.address || "::1",
        cloudflareSecret: env.CLOUDFLARE_SECRET,
    });
    const sessionMetadata = getSessionMetadata(getHeader, sessionIp);

    if (!isFirstSignIn) {
        const significantIp = (sessionMetadata.ipAddr || "")?.slice(0, 9);
        const similarSession = await GetSession({
            where: {
                userId: userId,
                ip: {
                    startsWith: significantIp,
                },
            },
        });

        // Send email alert if the user is signing in from a new location
        if (!similarSession?.id) {
            sendNewSigninAlertEmail({
                fullName: user.name || user.userName,
                receiverEmail: user.email,
                region: sessionMetadata.city || "",
                country: sessionMetadata.country || "",
                ip: sessionMetadata.ipAddr || "",
                browserName: sessionMetadata.browserName || "",
                osName: sessionMetadata.os.name || "",
                authProviderName: providerName || "",
                revokeAccessCode: revokeAccessCode,
            });
        }
    }

    await CreateSession({
        data: {
            id: generateDbId(),
            tokenHash: tokenHash,
            userId: userId,
            providerName: providerName,
            dateExpires: new Date(Date.now() + USER_SESSION_VALIDITY_ms),
            status: UserSessionStates.ACTIVE,
            revokeAccessCode: revokeAccessCodeHash,
            os: `${sessionMetadata.os.name} ${sessionMetadata.os.version || ""}`,
            browser: sessionMetadata.browserName || "",
            ip: sessionMetadata.ipAddr || "",
            city: sessionMetadata.city || "",
            country: sessionMetadata.country || "",
            userAgent: sessionMetadata.userAgent || "",
        },
    });

    return sessionToken;
}

async function getUserFromSessionToken(ctx: Context, token: string) {
    const tokenHash = hashString(token);
    const session = await GetSession_ByTokenHash(tokenHash);
    if (!session) {
        deleteSessionCookie(ctx);
        return null;
    }

    // extend session if it's nearing expiry
    const now = Date.now();
    const timeToExpire = new Date(session.dateExpires).getTime() - now;

    if (timeToExpire <= 0) {
        deleteSessionCookie(ctx);
        await DeleteSession({ where: { id: session.id } });
        return null;
    } else if (timeToExpire < USER_SESSION_VALIDITY_ms / 3) {
        await UpdateSession({
            where: { id: session.id },
            data: {
                dateExpires: new Date(now + USER_SESSION_VALIDITY_ms),
            },
        });
    }

    const sessionUser = await GetUser_ByIdOrUsername(undefined, session.userId);
    if (!sessionUser) return null;

    return {
        id: sessionUser.id,
        email: sessionUser.email,
        avatar: sessionUser.avatar,
        userName: sessionUser.userName,
        name: sessionUser.name,
        dateJoined: sessionUser.dateJoined,
        emailVerified: sessionUser.emailVerified,
        role: sessionUser.role as GlobalUserRole,
        bio: sessionUser.bio,
        password: sessionUser.password,
        newSignInAlerts: sessionUser.newSignInAlerts,
        followingProjects: sessionUser.followingProjects,
        profilePageBg: sessionUser.profilePageBg,

        apiScopes: ALL_PAT_SCOPES,
        sessionId: session.id,
        patID: null,
    } satisfies SessionUserData;
}

async function getUserFromPAT(token: string): Promise<SessionUserData | null> {
    const tokenHash = hashString(token);
    const pat = await GetPAT(tokenHash);

    if (!pat) return null;
    if (new Date(pat.dateExpires).getTime() < Date.now()) return null;

    const patUser = await GetUser_ByIdOrUsername(undefined, pat.userId);
    if (!patUser) return null;

    return {
        id: patUser.id,
        email: patUser.email,
        avatar: patUser.avatar,
        userName: patUser.userName,
        name: patUser.name,
        dateJoined: patUser.dateJoined,
        emailVerified: patUser.emailVerified,
        role: patUser.role as GlobalUserRole,
        bio: patUser.bio,
        password: patUser.password,
        newSignInAlerts: patUser.newSignInAlerts,
        followingProjects: patUser.followingProjects,
        profilePageBg: patUser.profilePageBg,

        apiScopes: pat.scopes,
        sessionId: null,
        patID: pat.id,
    } satisfies SessionUserData;
}

const BEARER_PREFIX = "Bearer ";
const BASIC_PREFIX = "Basic ";
export async function validateContextSession(ctx: Context): Promise<SessionUserData | null> {
    const authHeader = ctx.req.header("Authorization") ?? "";
    if (authHeader.startsWith(BASIC_PREFIX)) {
        const basicCredentials = authHeader.slice(BASIC_PREFIX.length);

        try {
            const decoded = atob(basicCredentials);
            const colonIndex = decoded.indexOf(":");
            const basicToken = colonIndex !== -1 ? decoded.slice(colonIndex + 1) : decoded;

            return await getUserFromPAT(basicToken);
        } catch {
            return null;
        }
    }

    if (authHeader) {
        const bearerToken = authHeader.startsWith(BEARER_PREFIX) ? authHeader.slice(BEARER_PREFIX.length) : authHeader;
        return await getUserFromPAT(bearerToken);
    }

    const cookie = getUserSessionCookie(ctx);
    if (cookie) {
        return await getUserFromSessionToken(ctx, cookie);
    }

    return null;
}

export function invalidateSessionFromId(sessionId: string, userId?: string) {
    return DeleteSession({
        where: userId ? { id: sessionId, userId: userId } : { id: sessionId },
    });
}

export async function invalidateSessionFromToken(token: string): Promise<Session> {
    const tokenHash = hashString(token);
    return await DeleteSession({
        where: { tokenHash: tokenHash },
    });
}

export async function invalidateAllUserSessions(userId: string) {
    const sessionsList = await GetManySessions({
        where: { userId: userId },
    });

    const tokenHashes = sessionsList.map((session) => session.tokenHash);
    const sessionIds = sessionsList.map((session) => session.id);
    await DeleteManySessions(
        {
            where: {
                id: { in: sessionIds },
            },
        },
        tokenHashes,
    );
}

export async function invalidateAllOtherUserSessions(userId: string, currSessionId: string) {
    const sessionsList = await GetManySessions({
        where: {
            userId: userId,
            NOT: {
                id: currSessionId,
            },
        },
    });

    const tokenHashes = sessionsList.map((session) => session.tokenHash);
    const sessionIds = sessionsList.map((session) => session.id);
    await DeleteManySessions(
        {
            where: {
                id: { in: sessionIds },
            },
        },
        tokenHashes,
    );
}

// Cookie things
export function setSessionCookie(ctx: Context, value: string, options?: CookieOptions) {
    return setCookie(ctx, AUTHTOKEN_COOKIE_NAMESPACE, value, {
        httpOnly: true,
        secure: true,
        maxAge: SESSION_COOKIE_VALIDITY_s,
        ...options,
    });
}

export function deleteSessionCookie(ctx: Context, options?: CookieOptions) {
    return deleteCookie(ctx, AUTHTOKEN_COOKIE_NAMESPACE, options);
}

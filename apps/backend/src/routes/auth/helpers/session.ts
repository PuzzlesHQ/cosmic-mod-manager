import { AUTHTOKEN_COOKIE_NAMESPACE, USER_SESSION_VALIDITY_ms, USER_SESSION_VALIDITY_s } from "@app/utils/constants";
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
} from "~/db/session_item";
import { GetUser_ByIdOrUsername } from "~/db/user_item";
import type { ContextUserData } from "~/types";
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

    if (isFirstSignIn) return sessionToken;

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

    return sessionToken;
}

async function getUserFromSessionToken(token: string): Promise<ContextUserData | null> {
    const tokenHash = hashString(token);
    const session = await GetSession_ByTokenHash(tokenHash);
    if (!session) return null;

    const sessionUser = await GetUser_ByIdOrUsername(undefined, session.userId);
    if (!sessionUser) return null;

    return {
        id: sessionUser.id,
        email: sessionUser.email,
        avatar: sessionUser.avatar,
        userName: sessionUser.userName,
        name: sessionUser.name || sessionUser.userName,
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
    } satisfies ContextUserData;
}

async function getUserFromPAT(token: string): Promise<ContextUserData | null> {
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
        name: patUser.name || patUser.userName,
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
    } satisfies ContextUserData;
}

export async function validateContextSession(ctx: Context): Promise<ContextUserData | null> {
    const cookie = getUserSessionCookie(ctx);
    const authorizationHeader = ctx.req.header("Authorization");

    if (authorizationHeader) {
        return await getUserFromPAT(authorizationHeader);
    } else if (cookie) {
        const sessionData = await getUserFromSessionToken(cookie);
        if (!sessionData) deleteSessionCookie(ctx);

        return sessionData;
    } else {
        return null;
    }
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
        maxAge: USER_SESSION_VALIDITY_s,
        ...options,
    });
}

export function deleteSessionCookie(ctx: Context, options?: CookieOptions) {
    return deleteCookie(ctx, AUTHTOKEN_COOKIE_NAMESPACE, options);
}

import { AUTHTOKEN_COOKIE_NAMESPACE, USER_SESSION_VALIDITY, USER_SESSION_VALIDITY_ms } from "@app/utils/constants";
import { getSessionIp, getSessionMetadata } from "@app/utils/headers";
import { type GlobalUserRole, UserSessionStates } from "@app/utils/types";
import type { Prisma, Session, User } from "@prisma/client";
import type { Context } from "hono";
import type { CookieOptions } from "hono/utils/cookie";
import {
    CreateSession,
    DeleteManySessions,
    DeleteSession,
    GetManySessions,
    GetSession_First,
    GetSession_Unique,
    UpdateSession,
} from "~/db/session_item";
import { GetUser_ByIdOrUsername } from "~/db/user_item";
import { deleteSessionTokenAndIdCache, getSessionCacheFromToken, setSessionTokenCache } from "~/services/cache/session";
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
    const tokenHash = await hashString(sessionToken);

    const revokeAccessCode = generateRandomId(32);
    const revokeAccessCodeHash = await hashString(revokeAccessCode);

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
    const similarSession = await GetSession_First({
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

export async function validateSessionToken(token: string): Promise<ContextUserData | null> {
    const tokenHash = await hashString(token);
    if (tokenHash.length > 256) {
        return null;
    }

    // Check cache
    const cachedSession = await getSessionCacheFromToken(tokenHash, true); // SESSION_CACHE : GET
    if (cachedSession) return cachedSession;

    const session = await GetSession_Unique({
        where: {
            tokenHash: tokenHash,
        },
    });
    if (!session) {
        // TODO: await addInvalidAuthAttempt(ctx);
        return null;
    }

    const sessionUser = await GetUser_ByIdOrUsername(undefined, session.userId);
    if (!sessionUser) return null;

    const now = Date.now();
    const sessionExpiry = session.dateExpires.getTime();
    const timeToExpire = sessionExpiry - now;

    if (timeToExpire <= 0) {
        await DeleteSession({
            where: {
                id: session.id,
            },
        });

        await deleteSessionTokenAndIdCache([session.tokenHash], [session.id]); // SESSION_CACHE : DELETE
        return null;
    }

    const sessionUpdateData: Prisma.SessionUpdateInput = {
        dateLastActive: new Date(),
    };
    // If the session is about to expire, extend the session
    if (timeToExpire < USER_SESSION_VALIDITY_ms / 3) {
        sessionUpdateData.dateExpires = new Date(now + USER_SESSION_VALIDITY_ms);
    }

    await UpdateSession({
        where: {
            id: session.id,
        },
        data: sessionUpdateData,
    });

    await setSessionTokenCache(tokenHash, session.id, session.userId); // SESSION_CACHE : SET

    const sessionData: ContextUserData = {
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

        sessionId: session.id,
    };

    return sessionData;
}

export async function validateContextSession(ctx: Context): Promise<ContextUserData | null> {
    try {
        // Get the current cookie data
        const cookie = getUserSessionCookie(ctx);
        if (!cookie) {
            return null;
        }

        // Get the current logged in user from the cookie data
        const session = await validateSessionToken(cookie);
        if (!session?.id) {
            deleteSessionCookie(ctx);
            return null;
        }

        return session;
    } catch (error) {
        deleteSessionCookie(ctx);
        console.error(error);
        return null;
    }
}

export async function invalidateSessionFromId(sessionId: string, userId?: string): Promise<Session> {
    const deletedSession = await DeleteSession({
        where: userId ? { id: sessionId, userId: userId } : { id: sessionId },
    });

    await deleteSessionTokenAndIdCache([deletedSession.tokenHash], [deletedSession.id]); // SESSION_CACHE : DELETE
    return deletedSession;
}

export async function invalidateSessionFromToken(token: string): Promise<Session> {
    const tokenHash = await hashString(token);
    const deletedSession = await DeleteSession({
        where: { tokenHash: tokenHash },
    });

    await deleteSessionTokenAndIdCache([deletedSession.tokenHash], [deletedSession.id]); // SESSION_CACHE : DELETE
    return deletedSession;
}

export async function invalidateAllUserSessions(userId: string) {
    const sessionsList = await GetManySessions({
        where: { userId: userId },
    });

    const tokenHashes = sessionsList.map((session) => session.tokenHash);
    const sessionIds = sessionsList.map((session) => session.id);
    await DeleteManySessions({
        where: {
            id: { in: sessionIds },
        },
    });

    await deleteSessionTokenAndIdCache(tokenHashes, sessionIds); // SESSION_CACHE : DELETE
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
    await DeleteManySessions({
        where: {
            id: { in: sessionIds },
        },
    });

    await deleteSessionTokenAndIdCache(tokenHashes, sessionIds); // SESSION_CACHE : DELETE
}

// Cookie things
export function setSessionCookie(ctx: Context, value: string, options?: CookieOptions) {
    return setCookie(ctx, AUTHTOKEN_COOKIE_NAMESPACE, value, {
        httpOnly: true,
        secure: true,
        maxAge: USER_SESSION_VALIDITY,
        ...options,
    });
}

export function deleteSessionCookie(ctx: Context, options?: CookieOptions) {
    return deleteCookie(ctx, AUTHTOKEN_COOKIE_NAMESPACE, options);
}

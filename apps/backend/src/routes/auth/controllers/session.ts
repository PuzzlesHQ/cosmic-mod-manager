import type { UserSessionStates } from "@app/utils/types";
import type { SessionListData } from "@app/utils/types/api";
import type { Context } from "hono";
import { GetManySessions, GetSession } from "~/db/session_item";
import { addInvalidAuthAttempt } from "~/middleware/rate-limit/invalid-auth-attempt";
import { deleteSessionCookie, invalidateSessionFromId } from "~/routes/auth/helpers/session";
import type { ContextUserData } from "~/types";
import { HTTP_STATUS, invalidRequestResponseData } from "~/utils/http";
import { hashString } from "../helpers";

export async function getUserSessions(userSession: ContextUserData) {
    const sessions = await GetManySessions({
        where: {
            userId: userSession.id,
        },
        orderBy: { dateLastActive: "desc" },
    });

    if (!sessions?.[0]?.id) {
        return invalidRequestResponseData();
    }

    const list: SessionListData[] = [];
    for (const session of sessions) {
        list.push({
            id: session.id,
            userId: session.userId,
            dateCreated: session.dateCreated,
            dateLastActive: session.dateLastActive,
            providerName: session.providerName || "",
            status: session.status as UserSessionStates,
            os: session.os,
            browser: session.browser,
            city: session.city,
            country: session.country,
            ip: session.ip,
            userAgent: session.userAgent,
        });
    }

    return {
        data: list,
        status: HTTP_STATUS.OK,
    };
}

export async function deleteUserSession(ctx: Context, userSession: ContextUserData, sessionId: string) {
    const deletedSession = await invalidateSessionFromId(sessionId, userSession.id);

    if (!deletedSession?.id) {
        await addInvalidAuthAttempt(ctx);
        return invalidRequestResponseData();
    }
    if (userSession.sessionId === deletedSession.id) deleteSessionCookie(ctx);

    return {
        data: { success: true, message: `Session with id: ${sessionId} logged out successfully` },
        status: HTTP_STATUS.OK,
    };
}

export async function revokeSessionFromAccessCode(ctx: Context, code: string) {
    const revokeAccessCodeHash = await hashString(code);
    const targetSession = await GetSession({
        where: {
            revokeAccessCode: revokeAccessCodeHash,
        },
    });
    if (!targetSession?.id) {
        await addInvalidAuthAttempt(ctx);
        return { data: { success: false, message: "Invalid access code" }, status: HTTP_STATUS.BAD_REQUEST };
    }

    await invalidateSessionFromId(targetSession.id);
    return { data: { success: true, message: "Successfully revoked the session access" }, status: HTTP_STATUS.OK };
}

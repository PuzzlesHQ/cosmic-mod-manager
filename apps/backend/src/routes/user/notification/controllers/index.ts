import { isModerator } from "@app/utils/constants/roles";
import type { Context } from "hono";
import { addInvalidAuthAttempt } from "~/middleware/rate-limit/invalid-auth-attempt";
import prisma from "~/services/prisma";
import type { ContextUserData } from "~/types";
import { HTTP_STATUS, notFoundResponseData, unauthorizedReqResponseData } from "~/utils/http";

export async function getUserNotifications(
    ctx: Context,
    userSession: ContextUserData,
    notifUserSlug: string | undefined,
) {
    if (!hasNotificationAccess(userSession, notifUserSlug || userSession.id)) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData();
    }

    const notifications = await prisma.notification.findMany({
        where: {
            // if the user identifier comes from the URL, it could be either the username or the id
            // otherwise, use the session user's id
            user: notifUserSlug
                ? {
                      OR: [{ userNameLower: notifUserSlug.toLowerCase() }, { id: notifUserSlug }],
                  }
                : { id: userSession.id },
        },
        orderBy: {
            dateCreated: "desc",
        },
    });

    return { data: notifications, status: HTTP_STATUS.OK };
}

export async function getNotificationById(ctx: Context, userSession: ContextUserData, notifId: string) {
    const notification = await prisma.notification.findFirst({
        where: { id: notifId },
    });

    if (!notification) {
        return notFoundResponseData("Notification not found");
    }

    // Check permission
    if (!hasNotificationAccess(userSession, notification.userId)) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData();
    }

    return { data: notification, status: HTTP_STATUS.OK };
}

export async function markNotificationAsRead(
    ctx: Context,
    sessionUser: ContextUserData,
    notificationIds: string[],
    notifUserSlug: string | undefined,
) {
    if (!hasNotificationAccess(sessionUser, notifUserSlug || sessionUser.id)) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData();
    }

    const notifications = await prisma.notification.findMany({
        where: {
            id: {
                in: notificationIds,
            },
            user: notifUserSlug
                ? {
                      OR: [{ userNameLower: notifUserSlug }, { id: notifUserSlug }],
                  }
                : { id: sessionUser.id },
        },
    });
    if (!notifications.length) {
        return notFoundResponseData("Notification not found");
    }

    await prisma.notification.updateMany({
        where: {
            id: {
                in: notifications.map((n) => n.id),
            },
        },
        data: {
            read: true,
            dateRead: new Date(),
        },
    });

    return {
        data: {
            success: true,
            message: "Notifications marked as read.",
        },
        status: HTTP_STATUS.OK,
    };
}

export async function deleteNotifications(
    ctx: Context,
    userSession: ContextUserData,
    userSlug: string | undefined,
    notificationIds: string[],
) {
    if (!hasNotificationAccess(userSession, userSlug || userSession.id)) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData();
    }

    try {
        await prisma.notification.deleteMany({
            where: {
                id: {
                    in: notificationIds,
                },
                user: userSlug
                    ? {
                          OR: [{ userNameLower: userSlug.toLowerCase() }, { id: userSlug }],
                      }
                    : {
                          id: userSession.id,
                      },
            },
        });
    } catch {}

    return {
        data: {
            success: true,
            message: "Notifications deleted.",
        },
        status: HTTP_STATUS.OK,
    };
}

// Helpers
export function hasNotificationAccess(session: ContextUserData, notificationUser: string) {
    return (
        session.id === notificationUser ||
        session.userName.toLowerCase() === notificationUser.toLowerCase() ||
        isModerator(session.role)
    );
}

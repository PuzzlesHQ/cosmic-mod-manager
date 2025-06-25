import { isModerator } from "@app/utils/constants/roles";
import type { Context } from "hono";
import { addInvalidAuthAttempt } from "~/middleware/rate-limit/invalid-auth-attempt";
import prisma from "~/services/prisma";
import type { ContextUserData } from "~/types";
import { HTTP_STATUS, notFoundResponseData, unauthorizedReqResponseData } from "~/utils/http";

export async function getUserNotifications(ctx: Context, userSession: ContextUserData, notifUserId: string) {
    const notifications = await prisma.notification.findMany({
        where: {
            user: {
                OR: [
                    {
                        userName: {
                            equals: notifUserId,
                            mode: "insensitive",
                        },
                    },
                    { id: notifUserId },
                ],
            },
        },
        orderBy: {
            dateCreated: "desc",
        },
    });

    // Check if the user has access to the notifications
    if (!hasNotificationAccess(userSession, notifUserId)) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData();
    }

    return { data: notifications, status: HTTP_STATUS.OK };
}

export async function getNotificationById(ctx: Context, userSession: ContextUserData, notifId: string) {
    const notification = await prisma.notification.findFirst({
        where: {
            id: notifId,
        },
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
    userSession: ContextUserData,
    notificationIds: string[],
    notifUserId: string,
) {
    const notifications = await prisma.notification.findMany({
        where: {
            id: {
                in: notificationIds,
            },
            user: {
                OR: [
                    {
                        userName: {
                            equals: notifUserId,
                            mode: "insensitive",
                        },
                    },
                    { id: notifUserId },
                ],
            },
        },
    });
    if (!notifications.length) {
        return notFoundResponseData("Notification not found");
    }

    // Check permission
    if (!hasNotificationAccess(userSession, notifUserId)) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData();
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

    return { data: { success: true, message: "Notifications marked as read." }, status: HTTP_STATUS.OK };
}

export async function deleteNotifications(
    ctx: Context,
    userSession: ContextUserData,
    userSlug: string,
    notificationIds: string[],
) {
    if (!hasNotificationAccess(userSession, userSlug)) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData();
    }

    try {
        await prisma.notification.deleteMany({
            where: {
                id: {
                    in: notificationIds,
                },
                user: {
                    OR: [
                        {
                            userName: {
                                equals: userSlug,
                                mode: "insensitive",
                            },
                        },
                        { id: userSlug },
                    ],
                },
            },
        });
    } catch {}

    return { data: { success: true, message: "Notifications deleted." }, status: HTTP_STATUS.OK };
}

// Helpers
export function hasNotificationAccess(session: ContextUserData, notificationUser: string) {
    return (
        session.id === notificationUser ||
        session.userName.toLowerCase() === notificationUser.toLowerCase() ||
        isModerator(session.role)
    );
}

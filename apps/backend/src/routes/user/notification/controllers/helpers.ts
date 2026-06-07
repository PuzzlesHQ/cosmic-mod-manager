import type { NotificationBody } from "@app/utils/types/api/notification";
import prisma from "~/services/prisma";

type CreateNotificationData = {
    id: string;
    userId: string;
} & NotificationBody;

export async function createNotification(notification: CreateNotificationData) {
    return await createNotifications([notification]);
}

export async function createNotifications(notifications: CreateNotificationData[]) {
    return await prisma.notification.createMany({
        data: notifications,
    });
}

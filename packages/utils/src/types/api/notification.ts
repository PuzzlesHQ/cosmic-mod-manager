import type { ProjectPublishingStatus } from "~/types";

export enum NotificationType {
    // PROJECT_UPDATE = "project_update",
    TEAM_INVITE = "team_invite", // Project team invite
    ORGANIZATION_INVITE = "organization_invite", // Organisation team invite
    STATUS_CHANGE = "status_change",
}

export interface ProjectInvite_NotifBody {
    type: NotificationType.TEAM_INVITE;
    body: {
        role: string;
        projectId: string;
        teamId: string;
        invitedBy: string;
    };
}

export interface OrganizationInvite_NotifBody {
    type: NotificationType.ORGANIZATION_INVITE;
    body: {
        role: string;
        orgId: string;
        teamId: string;
        invitedBy: string;
    };
}

export interface StatusChange_NotifBody {
    type: NotificationType.STATUS_CHANGE;
    body: {
        projectId: string;
        new_status: ProjectPublishingStatus;
        prev_status: ProjectPublishingStatus;
    };
}

type NotificationBase = {
    id: string;
    userId: string;
    dateCreated: Date;
    read: boolean;
};

export type NotificationBody = ProjectInvite_NotifBody | OrganizationInvite_NotifBody | StatusChange_NotifBody;
export type Notification = NotificationBase & NotificationBody;

export type ProjectInviteNotification = NotificationBase & ProjectInvite_NotifBody;
export type OrganizationInviteNotification = NotificationBase & OrganizationInvite_NotifBody;
export type StatusChangeNotification = NotificationBase & StatusChange_NotifBody;

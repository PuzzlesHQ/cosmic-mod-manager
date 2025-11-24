import { encodeArrayIntoStr } from "@app/utils/string";
import type { OrganisationListItem, ProjectListItem } from "@app/utils/types/api";
import { type Notification, NotificationType } from "@app/utils/types/api/notification";
import type { UserProfileData } from "@app/utils/types/api/user";
import { CheckCheckIcon, HistoryIcon } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router";
import { fallbackOrgIcon, fallbackProjectIcon } from "~/components/icons";
import RefreshPage from "~/components/misc/refresh-page";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useNavigate, VariantButtonLink } from "~/components/ui/link";
import { toast } from "~/components/ui/sonner";
import { LoadingSpinner } from "~/components/ui/spinner";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";
import { OrgPagePath, ProjectPagePath } from "~/utils/urls";
import { StatusChangeNotif_Item, TeamInviteNotification } from "./item-card";

export interface NotificationsData {
    notifications: Notification[];
    relatedProjects: ProjectListItem[];
    relatedUsers: UserProfileData[];
    relatedOrgs: OrganisationListItem[];
}

export default function NotificationsPage({
    notifications,
    relatedProjects,
    relatedOrgs,
    relatedUsers,
}: NotificationsData) {
    const { t } = useTranslation();
    const [markingAsRead, setMarkingAsRead] = useState(false);
    const unreadNotifications = notifications?.filter((notification) => !notification.read);

    const navigate = useNavigate();
    const location = useLocation();

    async function markAllAsRead() {
        if (!unreadNotifications?.length || markingAsRead) return;
        setMarkingAsRead(true);
        try {
            const unreadNotificationIds = unreadNotifications.map((n) => n.id);
            const result = await clientFetch(`/api/notifications?ids=${encodeArrayIntoStr(unreadNotificationIds)}`, {
                method: "PATCH",
            });

            if (!result.ok) {
                return toast.error("Failed to mark notifications as read");
            }

            RefreshPage(navigate, location);
        } finally {
            setMarkingAsRead(false);
        }
    }

    return (
        <Card className="w-full">
            <CardHeader className="flex w-full flex-row flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <CardTitle className="w-fit">{t.dashboard.notifications}</CardTitle>

                {(notifications?.length || 0) > 0 && (
                    <div className="flex flex-wrap items-center justify-start gap-x-2 gap-y-1">
                        <VariantButtonLink to="/dashboard/notifications/history" className="w-fit">
                            <HistoryIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                            {t.dashboard.viewHistory}
                        </VariantButtonLink>

                        {(unreadNotifications?.length || 0) > 1 && (
                            <Button variant="secondary-destructive" disabled={markingAsRead} onClick={markAllAsRead}>
                                {markingAsRead ? (
                                    <LoadingSpinner size="xs" />
                                ) : (
                                    <CheckCheckIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                                )}
                                {t.dashboard.markAllRead}
                            </Button>
                        )}
                    </div>
                )}
            </CardHeader>

            <CardContent className="grid gap-panel-cards">
                {!unreadNotifications?.length && (
                    <span className="text-foreground-muted">{t.dashboard.noUnreadNotifs}</span>
                )}

                <NotificationsList
                    notifications={unreadNotifications}
                    relatedOrgs={relatedOrgs}
                    relatedProjects={relatedProjects}
                    relatedUsers={relatedUsers}
                    showMarkAsReadButton={true}
                />
            </CardContent>
        </Card>
    );
}

interface NotificationsListProps extends NotificationsData {
    showDeleteButton?: boolean;
    concise?: boolean;
    showMarkAsReadButton?: boolean;
}

export function NotificationsList(props: NotificationsListProps) {
    const [markingAsRead, setMarkingAsRead] = useState(false);
    const [deletingNotification, setDeletingNotification] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    async function markNotificationAsRead(notificationId: string, refresh = true) {
        if (deletingNotification || markingAsRead) return;
        setMarkingAsRead(true);
        try {
            const result = await clientFetch(`/api/notifications/${notificationId}`, {
                method: "PATCH",
            });

            if (!result.ok) {
                toast.error("Failed to mark notifications as read");
                return;
            }

            if (refresh) RefreshPage(navigate, location);
        } finally {
            setMarkingAsRead(false);
        }
    }

    async function deleteNotification(notificationId: string, refresh = true) {
        if (markingAsRead) return;
        setDeletingNotification(true);
        try {
            const result = await clientFetch(`/api/notifications/${notificationId}`, {
                method: "DELETE",
            });

            if (!result.ok) {
                toast.error("Failed to delete notification");
                return;
            }

            if (refresh) RefreshPage(navigate, location);
        } finally {
            setDeletingNotification(false);
        }
    }

    const commonProps = {
        showDeleteButton: props.showDeleteButton,
        concise: props.concise,
        showMarkAsReadButton: props.showMarkAsReadButton,
    };

    return (
        <ul aria-label="Notifications list" className="flex w-full flex-col gap-panel-cards">
            {props.notifications.map((notification) => {
                switch (notification.type) {
                    case NotificationType.TEAM_INVITE: {
                        const relatedProject = props.relatedProjects.find((p) => p.id === notification.body.projectId);
                        const relatedUser = props.relatedUsers.find((u) => u.id === notification.body.invitedBy);

                        return (
                            <TeamInviteNotification
                                key={notification.id}
                                notification={notification}
                                markNotificationAsRead={markNotificationAsRead}
                                deleteNotification={deleteNotification}
                                markingAsRead={markingAsRead}
                                deletingNotification={deletingNotification}
                                navigateTo={ProjectPagePath(
                                    relatedProject?.type[0] || "project",
                                    relatedProject?.slug || "",
                                )}
                                pageUrl={ProjectPagePath(
                                    relatedProject?.type[0] || "project",
                                    relatedProject?.slug || "",
                                )}
                                invitedBy={{
                                    userName: relatedUser?.userName || (notification.body?.invitedBy as string),
                                    avatar: relatedUser?.avatar || null,
                                }}
                                title={relatedProject?.name || (notification.body?.projectId as string)}
                                icon={relatedProject?.icon || null}
                                fallbackIcon={fallbackProjectIcon}
                                {...commonProps}
                            />
                        );
                    }

                    case NotificationType.ORGANIZATION_INVITE: {
                        const relatedOrg = props.relatedOrgs.find((p) => p.id === notification.body.orgId);
                        const relatedUser = props.relatedUsers.find((u) => u.id === notification.body.invitedBy);

                        return (
                            <TeamInviteNotification
                                key={notification.id}
                                notification={notification}
                                markNotificationAsRead={markNotificationAsRead}
                                deleteNotification={deleteNotification}
                                markingAsRead={markingAsRead}
                                deletingNotification={deletingNotification}
                                navigateTo={OrgPagePath(relatedOrg?.slug || "")}
                                pageUrl={OrgPagePath(relatedOrg?.slug || "")}
                                invitedBy={{
                                    userName: relatedUser?.userName || (notification.body?.invitedBy as string),
                                    avatar: relatedUser?.avatar || null,
                                }}
                                title={relatedOrg?.name || (notification.body?.orgId as string)}
                                icon={relatedOrg?.icon || null}
                                fallbackIcon={fallbackOrgIcon}
                                {...commonProps}
                            />
                        );
                    }

                    case NotificationType.STATUS_CHANGE: {
                        const relatedProject = props.relatedProjects.find((p) => p.id === notification.body.projectId);

                        return (
                            <StatusChangeNotif_Item
                                key={notification.id}
                                notification={notification}
                                project={relatedProject}
                                markNotificationAsRead={markNotificationAsRead}
                                deleteNotification={deleteNotification}
                                markingAsRead={markingAsRead}
                                deletingNotification={deletingNotification}
                                {...commonProps}
                            />
                        );
                    }
                }

                return null;
            })}
        </ul>
    );
}

import { SuspenseFallback } from "@app/components/ui/spinner";
import type { OrganisationListItem, ProjectListItem } from "@app/utils/types/api";
import { type Notification, NotificationType } from "@app/utils/types/api/notification";
import type { UserProfileData } from "@app/utils/types/api/user";
import { useLoaderData } from "react-router";
import { useTranslation } from "~/locales/provider";
import NotificationsPage from "~/pages/dashboard/notification/page";
import clientFetch from "~/utils/client-fetch";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { resJson } from "~/utils/server-fetch";

export default function () {
    const data = useLoaderData() as LoaderData;

    return (
        <NotificationsPage
            notifications={data.notifications || []}
            relatedProjects={data.projects || []}
            relatedUsers={data.users || []}
            relatedOrgs={data.orgs || []}
        />
    );
}

interface LoaderData {
    notifications: Notification[] | null;
    projects?: ProjectListItem[];
    orgs?: OrganisationListItem[];
    users?: UserProfileData[];
}

export async function clientLoader(): Promise<LoaderData> {
    const notificationsRes = await clientFetch("/api/notifications");
    const notifications = ((await resJson(notificationsRes)) as Notification[]) || [];

    if (!notifications?.length) return { notifications: null };

    const projectIds: string[] = [];
    const orgIds: string[] = [];
    const userIds: string[] = [];

    for (const notification of notifications) {
        switch (notification.type) {
            case NotificationType.ORGANIZATION_INVITE:
                orgIds.push(notification.body.orgId);
                userIds.push(notification.body.invitedBy);
                break;

            case NotificationType.TEAM_INVITE:
                projectIds.push(notification.body.projectId);
                userIds.push(notification.body.invitedBy);
                break;

            case NotificationType.STATUS_CHANGE:
                projectIds.push(notification.body.projectId);
        }
    }

    const [projectsRes, orgsRes, usersRes] = await Promise.all([
        clientFetch(`/api/projects?ids=${encodeURIComponent(JSON.stringify(projectIds))}`),
        clientFetch(`/api/organizations?ids=${encodeURIComponent(JSON.stringify(orgIds))}`),
        clientFetch(`/api/users?ids=${encodeURIComponent(JSON.stringify(userIds))}`),
    ]);

    const projects = ((await resJson(projectsRes)) as ProjectListItem[]) || null;
    const orgs = ((await resJson(orgsRes)) as OrganisationListItem[]) || null;
    const users = ((await resJson(usersRes)) as UserProfileData[]) || null;

    return {
        notifications,
        projects,
        orgs,
        users,
    };
}

export function HydrateFallback() {
    return <SuspenseFallback />;
}

export function meta() {
    const { t } = useTranslation();

    return MetaTags({
        title: t.meta.addContext(t.dashboard.notifications, Config.SITE_NAME_SHORT),
        description: t.dashboard.notifications,
        image: Config.SITE_ICON,
        url: undefined,
    });
}

import { encodeArrayIntoStr } from "@app/utils/string";
import type { OrganisationListItem, ProjectListItem } from "@app/utils/types/api";
import { type Notification, NotificationType } from "@app/utils/types/api/notification";
import type { UserProfileData } from "@app/utils/types/api/user";
import { useLoaderData } from "react-router";
import { SuspenseFallback } from "~/components/ui/spinner";
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
    projects?: ProjectListItem[] | null;
    orgs?: OrganisationListItem[] | null;
    users?: UserProfileData[] | null;
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
        clientFetch(`/api/projects?ids=${encodeArrayIntoStr(projectIds)}`),
        clientFetch(`/api/organizations?ids=${encodeArrayIntoStr(orgIds)}`),
        clientFetch(`/api/users?ids=${encodeArrayIntoStr(userIds)}`),
    ]);

    const projects = await resJson<ProjectListItem[]>(projectsRes);
    const orgs = await resJson<OrganisationListItem[]>(orgsRes);
    const users = await resJson<UserProfileData[]>(usersRes);

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

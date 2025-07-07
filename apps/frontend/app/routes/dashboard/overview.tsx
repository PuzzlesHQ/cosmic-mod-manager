import type { ProjectListItem } from "@app/utils/types/api";
import { useLoaderData } from "react-router";
import { SuspenseFallback } from "~/components/ui/spinner";
import { useSession } from "~/hooks/session";
import OverviewPage from "~/pages/dashboard/overview";
import clientFetch from "~/utils/client-fetch";
import { resJson } from "~/utils/server-fetch";
import { clientLoader as NotificationsLoader } from "./notifications/page";

export default function () {
    const session = useSession();
    const loaderData = useLoaderData<typeof clientLoader>();

    if (!session?.id) return;

    return (
        <OverviewPage
            userProjects={loaderData.userProjects}
            notifications={loaderData.notifications || []}
            relatedUsers={loaderData.users || []}
            relatedOrgs={loaderData.orgs || []}
            relatedProjects={loaderData.projects || []}
        />
    );
}

export function HydrateFallback() {
    return <SuspenseFallback />;
}

export async function clientLoader() {
    const [userProjectsRes, notificationData] = await Promise.all([clientFetch("/api/project"), NotificationsLoader()]);
    const userProjects = await resJson<ProjectListItem[]>(userProjectsRes);

    return {
        userProjects: userProjects || [],
        ...notificationData,
    };
}

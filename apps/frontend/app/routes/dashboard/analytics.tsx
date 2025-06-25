import type { ProjectListItem } from "@app/utils/types/api";
import { useLoaderData } from "react-router";
import { useTranslation } from "~/locales/provider";
import DashboardAnalyticsPage from "~/pages/dashboard/analytics";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { resJson, serverFetch } from "~/utils/server-fetch";
import type { Route } from "./+types/analytics";

export default function () {
    const data = useLoaderData<typeof loader>();
    const userProjectIds = data.map((p) => p.id);

    return <DashboardAnalyticsPage userProjects={userProjectIds} />;
}

export async function loader(props: Route.LoaderArgs) {
    const res = await serverFetch(props.request, "/api/project");
    if (!res.ok) return [];

    return (await resJson<ProjectListItem[]>(res)) || [];
}

export function shouldRevalidate() {
    return false;
}

export function meta() {
    const { t } = useTranslation();

    return MetaTags({
        title: t.meta.addContext(t.dashboard.analytics, Config.SITE_NAME_SHORT),
        description: t.dashboard.analytics,
        image: Config.SITE_ICON,
        url: undefined,
    });
}

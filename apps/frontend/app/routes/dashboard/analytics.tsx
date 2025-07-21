import type { ProjectListItem } from "@app/utils/types/api";
import { useLoaderData } from "react-router";
import DownloadsAnalyticsChart from "~/components/downloads-analytics";
import { useTranslation } from "~/locales/provider";
import { AnalyticsRoute_ShouldRevalidate, projectAnalyticsLoader } from "~/routes/_loaders/analytics";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { resJson, serverFetch } from "~/utils/server-fetch";
import type { Route } from "./+types/analytics";

export default function () {
    const data = useLoaderData<typeof loader>();
    if (!data) return null;

    return <DownloadsAnalyticsChart data={data} />;
}

export async function loader(props: Route.LoaderArgs) {
    const res = await serverFetch(props.request, "/api/project");
    if (!res.ok) return null;

    const projects = (await resJson<ProjectListItem[]>(res)) || [];
    const userProjectIds = projects.map((p) => p.id);

    return await projectAnalyticsLoader(props, userProjectIds);
}

export const shouldRevalidate = AnalyticsRoute_ShouldRevalidate;

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();

    return MetaTags({
        location: props.location,
        title: t.meta.addContext(t.dashboard.analytics, Config.SITE_NAME_SHORT),
        description: t.dashboard.analytics,
        image: Config.SITE_ICON,
        url: undefined,
    });
}

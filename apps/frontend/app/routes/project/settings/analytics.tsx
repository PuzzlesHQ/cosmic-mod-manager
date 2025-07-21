import { useLoaderData } from "react-router";
import DownloadsAnalyticsChart from "~/components/downloads-analytics";
import { useTranslation } from "~/locales/provider";
import { AnalyticsRoute_ShouldRevalidate, projectAnalyticsLoader } from "~/routes/_loaders/analytics";
import { getProjectLoaderData } from "~/routes/project/utils";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { resJson, serverFetch } from "~/utils/server-fetch";
import { ProjectPagePath } from "~/utils/urls";
import type { Route } from "./+types/analytics";

export default function () {
    const data = useLoaderData<typeof loader>();
    if (!data) return null;

    return <DownloadsAnalyticsChart data={data} />;
}

export async function loader(props: Route.LoaderArgs) {
    const res = await serverFetch(props.request, `/api/project/${props.params.projectSlug}/check`);
    if (!res.ok) return null;

    const projectId = (await resJson<{ id: string }>(res))?.id;
    if (!projectId) return null;

    return await projectAnalyticsLoader(props, [projectId]);
}

export const ShouldRevalidate = AnalyticsRoute_ShouldRevalidate;

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();
    const ctx = getProjectLoaderData(props.matches, props.location.pathname);

    return MetaTags({
        location: props.location,
        title: t.meta.addContext(ctx.projectData.name, t.dashboard.analytics),
        description: t.dashboard.analytics,
        image: Config.SITE_ICON,
        url: Config.FRONTEND_URL + ProjectPagePath(ctx.projectData.type[0], ctx.projectData.slug, "settings/analytics"),
    });
}

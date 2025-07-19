import type { ProjectListItem } from "@app/utils/types/api";
import { useLoaderData } from "react-router";
import DownloadsAnalyticsChart from "~/components/downloads-analytics";
import { useOrgData } from "~/hooks/org";
import { useTranslation } from "~/locales/provider";
import { AnalyticsRoute_ShouldRevalidate, projectAnalyticsLoader } from "~/routes/_loaders/analytics";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { resJson, serverFetch } from "~/utils/server-fetch";
import { OrgPagePath } from "~/utils/urls";
import type { Route } from "./+types/analytics";

export default function () {
    const data = useLoaderData<typeof loader>();
    if (!data) return null;

    return <DownloadsAnalyticsChart data={data} />;
}

export async function loader(props: Route.LoaderArgs) {
    const res = await serverFetch(props.request, `/api/organization/${props.params.orgSlug}/projects`);
    if (!res.ok) return null;

    const projects = (await resJson<ProjectListItem[]>(res)) || [];
    const userProjectIds = projects.map((p) => p.id);

    return await projectAnalyticsLoader(props, userProjectIds);
}

export const ShouldRevalidate = AnalyticsRoute_ShouldRevalidate;

export function meta() {
    const { t } = useTranslation();
    const ctx = useOrgData();

    return MetaTags({
        title: t.meta.addContext(t.dashboard.analytics, ctx.orgData.name),
        description: t.dashboard.analytics,
        image: Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}${OrgPagePath(ctx.orgData.slug)}/settings/analytics`,
    });
}

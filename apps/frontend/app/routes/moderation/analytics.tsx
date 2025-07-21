import { useLoaderData } from "react-router";
import DownloadsAnalyticsChart from "~/components/downloads-analytics";
import { useTranslation } from "~/locales/provider";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { AnalyticsRoute_ShouldRevalidate, projectAnalyticsLoader } from "../_loaders/analytics";
import type { Route } from "./+types/analytics";

export default function () {
    const data = useLoaderData<typeof loader>();

    if (!data) return null;

    return <DownloadsAnalyticsChart data={data} />;
}

function AllProjectsAnalyticsURL(searchParams: URLSearchParams) {
    return `/api/analytics/downloads/all?${searchParams.toString()}`;
}

export async function loader(props: Route.LoaderArgs) {
    return await projectAnalyticsLoader(props, [], AllProjectsAnalyticsURL);
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

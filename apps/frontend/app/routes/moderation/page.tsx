import type { Statistics, StorageUsageStats } from "@app/utils/types/api/stats";
import { useLoaderData } from "react-router";
import { useTranslation } from "~/locales/provider";
import StatsPage from "~/pages/moderation/page";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { resJson, serverFetch } from "~/utils/server-fetch";
import type { Route } from "./+types/page";

export default function () {
    const data = useLoaderData<typeof loader>();

    if (!data.stats || !data.storageStats) {
        return (
            <div>
                <span>Unable to load stats data.</span>
            </div>
        );
    }

    return <StatsPage stats={data.stats} storageStats={data.storageStats} />;
}

export async function loader({ request: req }: Route.LoaderArgs) {
    const [statsRes, storageStatRes] = await Promise.all([
        serverFetch(req, "/api/statistics"),
        serverFetch(req, "/api/statistics/storage"),
    ]);
    const stats = await resJson<Statistics>(statsRes);
    const storageStats = await resJson<StorageUsageStats>(storageStatRes);

    return { stats, storageStats };
}

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();

    return MetaTags({
        location: props.location,
        title: t.meta.addContext(t.moderation.statistics, Config.SITE_NAME_SHORT),
        description: t.moderation.statistics,
        image: Config.SITE_ICON,
        url: undefined,
    });
}

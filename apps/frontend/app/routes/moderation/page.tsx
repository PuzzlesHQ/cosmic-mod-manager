import type { Statistics } from "@app/utils/types/api/stats";
import { useLoaderData } from "react-router";
import { useTranslation } from "~/locales/provider";
import StatsPage from "~/pages/moderation/page";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { serverFetch } from "~/utils/server-fetch";
import type { Route } from "./+types/page";

export default function () {
    const stats = useLoaderData<Statistics>();

    if (!stats) {
        return (
            <div>
                <span>Unable to load stats data.</span>
            </div>
        );
    }

    return <StatsPage stats={stats} />;
}

export async function loader({ request: req }: Route.LoaderArgs) {
    const res = await serverFetch(req, "/api/statistics");
    const data = await res.json();

    return data as Statistics;
}

export function meta() {
    const { t } = useTranslation();

    return MetaTags({
        title: t.meta.addContext(t.moderation.statistics, Config.SITE_NAME_SHORT),
        description: t.moderation.statistics,
        image: Config.SITE_ICON,
        url: undefined,
    });
}

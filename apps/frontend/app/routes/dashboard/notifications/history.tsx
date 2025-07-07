import { useLoaderData } from "react-router";
import { SuspenseFallback } from "~/components/ui/spinner";
import { useTranslation } from "~/locales/provider";
import NotificationsHistoryPage from "~/pages/dashboard/notification/history";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { clientLoader as NotificationsDataLoader } from "./page";

export default function () {
    const data = useLoaderData<typeof clientLoader>();

    return (
        <NotificationsHistoryPage
            notifications={data.notifications || []}
            relatedProjects={data.projects || []}
            relatedUsers={data.users || []}
            relatedOrgs={data.orgs || []}
        />
    );
}

export const clientLoader = NotificationsDataLoader;

export function HydrateFallback() {
    return <SuspenseFallback />;
}

export function meta() {
    const { t } = useTranslation();

    return MetaTags({
        title: t.meta.addContext(t.dashboard.notifHistory, Config.SITE_NAME_SHORT),
        description: t.dashboard.viewNotifHistory,
        image: Config.SITE_ICON,
        url: undefined,
    });
}

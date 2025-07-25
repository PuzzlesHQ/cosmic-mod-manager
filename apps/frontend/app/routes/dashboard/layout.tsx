import Redirect from "~/components/ui/redirect";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import DashboardLayout from "~/pages/dashboard/layout";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import type { Route } from "./+types/layout";

export default function () {
    const session = useSession();

    if (!session?.id) return <Redirect to="/login" />;
    return <DashboardLayout />;
}

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();

    return MetaTags({
        location: props.location,
        title: t.meta.addContext(t.dashboard.dashboard, Config.SITE_NAME_SHORT),
        description: t.dashboard.dashboard,
        image: Config.SITE_ICON,
        url: undefined,
    });
}

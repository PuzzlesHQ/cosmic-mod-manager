import { useTranslation } from "~/locales/provider";
import AllProjectDownloadAnalytics from "~/pages/moderation/analytics";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";

export default AllProjectDownloadAnalytics;

export function meta() {
    const { t } = useTranslation();

    return MetaTags({
        title: t.meta.addContext(t.dashboard.analytics, Config.SITE_NAME_SHORT),
        description: t.dashboard.analytics,
        image: Config.SITE_ICON,
        url: undefined,
    });
}

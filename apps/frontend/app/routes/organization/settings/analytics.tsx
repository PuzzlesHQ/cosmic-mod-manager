import { useOrgData } from "~/hooks/org";
import { useTranslation } from "~/locales/provider";
import OrganizationAnalyticsPage from "~/pages/organization/settings/analytics";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { OrgPagePath } from "~/utils/urls";

export default OrganizationAnalyticsPage;

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

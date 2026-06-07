import { useOrgData } from "~/hooks/org";
import { useTranslation } from "~/locales/provider";
import OrgProjectsSettings from "~/pages/organization/settings/projects/page";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { OrgPagePath } from "~/utils/urls";
import type { Route } from "./+types/projects";

export default OrgProjectsSettings;

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();
    const ctx = useOrgData();
    if (!ctx?.orgData) return;

    return MetaTags({
        location: props.location,
        title: t.meta.addContext(t.dashboard.projects, ctx.orgData.name),
        description: t.dashboard.projects,
        image: Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}${OrgPagePath(ctx.orgData.slug)}/settings/projects`,
    });
}

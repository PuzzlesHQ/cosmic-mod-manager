import { useOrgData } from "~/hooks/org";
import { useTranslation } from "~/locales/provider";
import OrgMemberSettings from "~/pages/organization/settings/members/page";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { OrgPagePath } from "~/utils/urls";
import type { Route } from "./+types/members";

export default OrgMemberSettings;

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();
    const ctx = useOrgData();

    return MetaTags({
        location: props.location,
        title: t.meta.addContext(t.projectSettings.members, ctx.orgData.name),
        description: t.projectSettings.members,
        image: Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}${OrgPagePath(ctx.orgData.slug)}/settings/members`,
    });
}

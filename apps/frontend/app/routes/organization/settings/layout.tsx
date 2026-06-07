import { isModerator } from "@app/utils/constants/roles";
import Redirect from "~/components/ui/redirect";
import { useOrgData } from "~/hooks/org";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import OrgSettingsLayout from "~/pages/organization/settings/layout";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { OrgPagePath } from "~/utils/urls";
import type { Route } from "./+types/layout";

export default function () {
    const session = useSession();
    const ctx = useOrgData();

    if (!session?.id) return <Redirect to="/login" />;

    const currUsersMembership = ctx.currUsersMembership;
    if (!currUsersMembership && !isModerator(session.role)) return <Redirect to="/" />;

    return <OrgSettingsLayout />;
}

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();
    const ctx = useOrgData();
    if (!ctx?.orgData) return;

    return MetaTags({
        location: props.location,
        title: t.meta.addContext(t.organization.orgSettings, ctx.orgData.name),
        description: t.organization.orgSettings,
        image: Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}${OrgPagePath(ctx.orgData.slug)}/settings`,
    });
}

import { useTranslation } from "~/locales/provider";
import LicenseSettingsPage from "~/pages/project/settings/license";
import { getProjectLoaderData } from "~/routes/project/utils";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { ProjectPagePath } from "~/utils/urls";
import type { Route } from "./+types/license";

export default LicenseSettingsPage;

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();
    const ctx = getProjectLoaderData(props.matches, props.location.pathname);

    return MetaTags({
        location: props.location,
        title: t.meta.addContext(ctx.projectData.name, t.search.license),
        description: t.search.license,
        image: Config.SITE_ICON,
        url: Config.FRONTEND_URL + ProjectPagePath(ctx.projectData.type[0], ctx.projectData.slug, "settings/license"),
    });
}

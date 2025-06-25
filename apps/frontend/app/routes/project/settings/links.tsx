import { useTranslation } from "~/locales/provider";
import ExternalLinksSettingsPage from "~/pages/project/settings/links";
import { getProjectLoaderData } from "~/routes/project/utils";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { ProjectPagePath } from "~/utils/urls";
import type { Route } from "./+types/links";

export default ExternalLinksSettingsPage;

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();
    const ctx = getProjectLoaderData(props.matches);

    return MetaTags({
        title: t.meta.addContext(ctx.projectData.name, t.projectSettings.links),
        description: t.projectSettings.links,
        image: Config.SITE_ICON,
        url: Config.FRONTEND_URL + ProjectPagePath(ctx.projectData.type[0], ctx.projectData.slug, "settings/links"),
    });
}

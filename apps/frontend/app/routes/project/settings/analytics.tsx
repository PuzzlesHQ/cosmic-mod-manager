import { useTranslation } from "~/locales/provider";
import ProjectAnalyticsPage from "~/pages/project/settings/analytics";
import { getProjectLoaderData } from "~/routes/project/utils";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { ProjectPagePath } from "~/utils/urls";
import type { Route } from "./+types/analytics";

export default ProjectAnalyticsPage;

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();
    const ctx = getProjectLoaderData(props.matches);

    return MetaTags({
        title: t.meta.addContext(ctx.projectData.name, t.dashboard.analytics),
        description: t.dashboard.analytics,
        image: Config.SITE_ICON,
        url: Config.FRONTEND_URL + ProjectPagePath(ctx.projectData.type[0], ctx.projectData.slug, "settings/analytics"),
    });
}

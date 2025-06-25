import { useProjectData } from "~/hooks/project";
import { useTranslation } from "~/locales/provider";
import ProjectAnalyticsPage from "~/pages/project/settings/analytics";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { ProjectPagePath } from "~/utils/urls";

export default ProjectAnalyticsPage;

export function meta() {
    const { t } = useTranslation();
    const ctx = useProjectData();

    return MetaTags({
        title: t.meta.addContext(ctx.projectData.name, t.dashboard.analytics),
        description: t.dashboard.analytics,
        image: Config.SITE_ICON,
        url: Config.FRONTEND_URL + ProjectPagePath(ctx.projectData.type[0], ctx.projectData.slug, "settings/analytics"),
    });
}

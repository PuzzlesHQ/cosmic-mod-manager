import { useProjectData } from "~/hooks/project";
import { useTranslation } from "~/locales/provider";
import TagsSettingsPage from "~/pages/project/settings/tags";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { ProjectPagePath } from "~/utils/urls";

export default TagsSettingsPage;

export function meta() {
    const { t } = useTranslation();
    const ctx = useProjectData();

    return MetaTags({
        title: t.meta.addContext(ctx.projectData.name, t.projectSettings.tags),
        description: t.projectSettings.tags,
        image: Config.SITE_ICON,
        url: Config.FRONTEND_URL + ProjectPagePath(ctx.projectData.type[0], ctx.projectData.slug, "settings/tags"),
    });
}

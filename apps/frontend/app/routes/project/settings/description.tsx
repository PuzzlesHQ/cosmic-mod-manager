import { useProjectData } from "~/hooks/project";
import { useTranslation } from "~/locales/provider";
import DescriptionSettings from "~/pages/project/settings/description";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { ProjectPagePath } from "~/utils/urls";

export default DescriptionSettings;

export function meta() {
    const { t } = useTranslation();
    const ctx = useProjectData();

    return MetaTags({
        title: t.meta.addContext(ctx.projectData.name, t.form.description),
        description: t.form.description,
        image: Config.SITE_ICON,
        url: Config.FRONTEND_URL + ProjectPagePath(ctx.projectData.type[0], ctx.projectData.slug, "settings/description"),
    });
}

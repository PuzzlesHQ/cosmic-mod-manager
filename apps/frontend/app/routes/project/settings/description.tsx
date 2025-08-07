import { useTranslation } from "~/locales/provider";
import DescriptionSettings from "~/pages/project/settings/description";
import { getProjectLoaderData } from "~/routes/project/utils";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { ProjectPagePath } from "~/utils/urls";
import type { Route } from "./+types/description";

export default DescriptionSettings;

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();
    const ctx = getProjectLoaderData(props.matches, props.location.pathname);
    if (!ctx?.projectData) return;

    return MetaTags({
        location: props.location,
        title: t.meta.addContext(ctx.projectData.name, t.form.description),
        description: t.form.description,
        image: Config.SITE_ICON,
        url: Config.FRONTEND_URL + ProjectPagePath(ctx.projectData.type[0], ctx.projectData.slug, "settings/description"),
    });
}

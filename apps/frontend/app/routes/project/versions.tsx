import { useTranslation } from "~/locales/provider";
import ProjectVersionsPage from "~/pages/project/versions";
import { getProjectLoaderData } from "~/routes/project/utils";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { ProjectPagePath } from "~/utils/urls";
import type { Route } from "./+types/versions";

export default ProjectVersionsPage;

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();
    const ctx = getProjectLoaderData(props.matches, props.location.pathname);
    if (!ctx?.projectData) return;

    const project = ctx.projectData;
    return MetaTags({
        location: props.location,
        title: t.meta.addContext(project.name, t.project.versions),
        description: t.meta.versionsListDesc(project.name, ctx.versions.length),
        image: project.icon || "",
        url: `${Config.FRONTEND_URL}${ProjectPagePath(project.type?.[0], project.slug, "versions")}`,
        parentMetaTags: props.matches[1].meta,
    });
}

import { useProjectData } from "~/hooks/project";
import { useTranslation } from "~/locales/provider";
import ProjectVersionsPage from "~/pages/project/versions";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { ProjectPagePath } from "~/utils/urls";
import type { Route } from "./+types/versions";

export default ProjectVersionsPage;

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();
    const ctx = useProjectData();
    const project = ctx?.projectData;

    return MetaTags({
        title: t.meta.addContext(project.name, t.project.versions),
        description: t.meta.versionsListDesc(project.name, ctx.allProjectVersions.length),
        image: project.icon || "",
        url: `${Config.FRONTEND_URL}${ProjectPagePath(project.type?.[0], project.slug, "versions")}`,
        parentMetaTags: props.matches[1].meta,
    });
}

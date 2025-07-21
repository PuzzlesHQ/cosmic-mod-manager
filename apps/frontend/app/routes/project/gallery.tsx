import { getProjectTypeFromName } from "@app/utils/convertors";
import { useTranslation } from "~/locales/provider";
import ProjectGallery from "~/pages/project/gallery/page";
import { getProjectLoaderData } from "~/routes/project/utils";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { ProjectPagePath } from "~/utils/urls";
import type { Route } from "./+types/gallery";

export default ProjectGallery;

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();
    const ctx = getProjectLoaderData(props.matches, props.location.pathname);

    const project = ctx?.projectData;
    const projectType = t.navbar[getProjectTypeFromName(project.type[0])];

    return MetaTags({
        location: props.location,
        title: t.meta.addContext(project.name, t.project.gallery),
        description: t.meta.galleryDesc(project.gallery.length, project.name, projectType, Config.SITE_NAME_SHORT),
        image: project.icon || "",
        url: `${Config.FRONTEND_URL}${ProjectPagePath(project.type?.[0], project.slug, "gallery")}`,
        parentMetaTags: props.matches[1].meta,
    });
}

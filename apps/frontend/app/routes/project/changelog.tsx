import { useTranslation } from "~/locales/provider";
import VersionChangelogs from "~/pages/project/changelog";
import { getProjectLoaderData } from "~/routes/project/utils";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { ProjectPagePath } from "~/utils/urls";
import type { Route } from "./+types/changelog";

export default VersionChangelogs;

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();
    const ctx = getProjectLoaderData(props.matches, props.location.pathname);
    if (!ctx?.projectData) return;

    const project = ctx.projectData;
    return MetaTags({
        location: props.location,
        title: t.meta.addContext(project.name, t.project.changelog),
        description: t.meta.changelogDesc(project.name, ctx.versions.length),
        image: project.icon || "",
        url: `${Config.FRONTEND_URL}${ProjectPagePath(project.type?.[0], project.slug, "changelog")}`,
        parentMetaTags: props.matches[1].meta,
    });
}

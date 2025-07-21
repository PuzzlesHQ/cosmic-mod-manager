import { useTranslation } from "~/locales/provider";
import ModerationPage from "~/pages/project/moderation";
import { getProjectLoaderData } from "~/routes/project/utils";
import { MetaTags } from "~/utils/meta";
import type { Route } from "./+types/moderation";

export default ModerationPage;

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();
    const ctx = getProjectLoaderData(props.matches, props.location.pathname);
    const project = ctx?.projectData;

    if (!project?.id) return null;

    return MetaTags({
        location: props.location,
        title: t.meta.addContext(project.name, t.moderation.moderation),
        description: t.moderation.moderation,
        image: project.icon || "",
        url: undefined,
        parentMetaTags: props.matches[1].meta,
    });
}

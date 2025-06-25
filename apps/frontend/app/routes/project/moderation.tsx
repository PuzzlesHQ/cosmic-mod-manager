import { useProjectData } from "~/hooks/project";
import { useTranslation } from "~/locales/provider";
import ModerationPage from "~/pages/project/moderation";
import { MetaTags } from "~/utils/meta";
import type { Route } from "./+types/moderation";

export default ModerationPage;

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();
    const ctx = useProjectData();
    const project = ctx?.projectData;

    return MetaTags({
        title: t.meta.addContext(project.name, t.moderation.moderation),
        description: t.moderation.moderation,
        image: project.icon || "",
        url: undefined,
        parentMetaTags: props.matches[1].meta,
    });
}

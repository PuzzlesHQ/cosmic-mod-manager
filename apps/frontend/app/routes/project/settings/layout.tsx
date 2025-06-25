import { isModerator } from "@app/utils/src/constants/roles";
import Redirect from "~/components/ui/redirect";
import { useProjectData } from "~/hooks/project";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import ProjectSettingsLayout from "~/pages/project/settings/layout";
import { getProjectLoaderData } from "~/routes/project/utils";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { ProjectPagePath } from "~/utils/urls";
import type { Route } from "../+types/layout";

export default function () {
    const ctx = useProjectData();
    const session = useSession();

    if (!session?.id) return <Redirect to="/login" />;

    const currUsersMembership = ctx.currUsersMembership;
    if (!currUsersMembership && !isModerator(session.role)) return <Redirect to="/" />;
    return <ProjectSettingsLayout />;
}

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();
    const ctx = getProjectLoaderData(props.matches);

    return MetaTags({
        title: t.meta.addContext(ctx.projectData.name, t.common.settings),
        description: t.common.settings,
        image: Config.SITE_ICON,
        url: Config.FRONTEND_URL + ProjectPagePath(ctx.projectData.type[0], ctx.projectData.slug, "settings"),
    });
}

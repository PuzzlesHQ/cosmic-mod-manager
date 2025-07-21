import type { Organisation } from "@app/utils/types/api";
import { useLoaderData } from "react-router";
import { useTranslation } from "~/locales/provider";
import ProjectMemberSettingsPage from "~/pages/project/settings/members/page";
import { getProjectLoaderData } from "~/routes/project/utils";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { resJson, serverFetch } from "~/utils/server-fetch";
import { ProjectPagePath } from "~/utils/urls";
import type { Route } from "./+types/members";

export default function () {
    const orgs = useLoaderData() as Organisation[];

    return <ProjectMemberSettingsPage userOrgs={orgs} />;
}

export async function loader(props: Route.LoaderArgs): Promise<Organisation[]> {
    const orgsRes = await serverFetch(props.request, "/api/organization");
    const orgs = await resJson<Organisation[]>(orgsRes);

    return orgs || [];
}

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();
    const ctx = getProjectLoaderData(props.matches, props.location.pathname);

    return MetaTags({
        location: props.location,
        title: t.meta.addContext(ctx.projectData.name, t.projectSettings.members),
        description: t.projectSettings.members,
        image: Config.SITE_ICON,
        url: Config.FRONTEND_URL + ProjectPagePath(ctx.projectData.type[0], ctx.projectData.slug, "settings/members"),
    });
}

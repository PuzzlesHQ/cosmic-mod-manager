import type { ProjectListItem } from "@app/utils/types/api";
import { useLoaderData } from "react-router";
import { useTranslation } from "~/locales/provider";
import HomePage from "~/pages/page";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { resJson, serverFetch } from "~/utils/server-fetch";
import type { Route } from "./+types/page";

export default function () {
    const projects = useLoaderData() as ProjectListItem[];

    return <HomePage projects={projects} />;
}

export async function loader(props: Route.LoaderArgs): Promise<ProjectListItem[]> {
    const res = await serverFetch(props.request, "/api/projects/home-page-carousel");
    if (!res.ok) return [];
    const projects = await resJson<ProjectListItem[]>(res);

    return projects || [];
}

export function shouldRevalidate() {
    return false;
}

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();

    return MetaTags({
        location: props.location,
        title: Config.SITE_NAME_LONG,
        description: t.meta.siteDesc(Config.SITE_NAME_LONG, Config.SITE_NAME_SHORT),
        image: Config.SITE_ICON,
        url: Config.FRONTEND_URL,
    });
}

import type { ModerationProjectItem } from "@app/utils/types/api/moderation";
import { useLoaderData } from "react-router";
import { useTranslation } from "~/locales/provider";
import ReviewProjects from "~/pages/moderation/review";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { resJson, serverFetch } from "~/utils/server-fetch";
import type { Route } from "./+types/review";

export default function () {
    const projects = useLoaderData<typeof loader>();

    return <ReviewProjects projects={projects || []} />;
}

export async function loader({ request }: Route.LoaderArgs) {
    const res = await serverFetch(request, "/api/moderation/projects");
    const queuedProjects = resJson<ModerationProjectItem[]>(res);

    return queuedProjects;
}

export function meta() {
    const { t } = useTranslation();

    return MetaTags({
        title: t.meta.addContext(t.moderation.review, Config.SITE_NAME_SHORT),
        description: t.moderation.review,
        image: Config.SITE_ICON,
        url: undefined,
    });
}

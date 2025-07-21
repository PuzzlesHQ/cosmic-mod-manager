import type { Collection } from "@app/utils/types/api";
import { useLoaderData } from "react-router";
import Redirect from "~/components/ui/redirect";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import CollectionsDashboardPage from "~/pages/dashboard/collections/page";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { resJson, serverFetch } from "~/utils/server-fetch";
import type { Route } from "./+types/collections";

export default function () {
    const session = useSession();
    const collections = useLoaderData<typeof loader>();

    if (!session?.id) return <Redirect to="/login" />;
    return <CollectionsDashboardPage collections={collections} />;
}

export async function loader(props: Route.LoaderArgs): Promise<Collection[]> {
    const res = await serverFetch(props.request, "/api/collections");
    const collections = await resJson<Collection[]>(res);

    return collections || [];
}

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();

    return MetaTags({
        location: props.location,
        title: t.meta.addContext(t.dashboard.collections, Config.SITE_NAME_SHORT),
        description: t.dashboard.collections,
        image: Config.SITE_ICON,
        url: undefined,
    });
}

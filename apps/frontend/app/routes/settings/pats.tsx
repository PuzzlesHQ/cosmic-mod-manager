import type { PATData } from "@app/utils/types/api/pat";
import { useLoaderData } from "react-router";
import Redirect from "~/components/ui/redirect";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import PersonalAccessTokensSettingsPage from "~/pages/settings/pats/pats";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { resJson, serverFetch } from "~/utils/server-fetch";
import type { Route } from "./+types/pats";

export default function () {
    const session = useSession();
    const pats = useLoaderData<typeof loader>();

    if (!session?.id) return <Redirect to="/login" />;
    return <PersonalAccessTokensSettingsPage pats={pats} />;
}

export async function loader(props: Route.LoaderArgs): Promise<PATData[]> {
    const res = await serverFetch(props.request, "/api/pat");
    const pats = await resJson<PATData[]>(res);

    return pats || [];
}

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();

    return MetaTags({
        location: props.location,
        title: t.meta.addContext(t.common.settings, t.settings.personalAccessTokens),
        description: t.settings.personalAccessTokens,
        image: Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}/settings/pats`,
    });
}

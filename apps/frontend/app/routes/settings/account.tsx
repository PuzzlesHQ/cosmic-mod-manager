import type { LinkedProvidersListData } from "@app/utils/types";
import { useLoaderData } from "react-router";
import Redirect from "~/components/ui/redirect";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import AccountSettingsPage from "~/pages/settings/account/page";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { resJson, serverFetch } from "~/utils/server-fetch";
import type { Route } from "./+types/account";

export default function () {
    const session = useSession();
    const linkedProviders = useLoaderData() as LinkedProvidersListData[];

    if (!session?.id) return <Redirect to="/login" />;
    return <AccountSettingsPage session={session} linkedAuthProviders={linkedProviders || []} />;
}

export async function loader(props: Route.LoaderArgs): Promise<LinkedProvidersListData[]> {
    const res = await serverFetch(props.request, "/api/auth/linked-providers");
    const providersList = await resJson<LinkedProvidersListData[]>(res);

    return providersList || [];
}

export function meta() {
    const { t } = useTranslation();

    return MetaTags({
        title: t.meta.addContext(t.common.settings, t.settings.accountAndSecurity),
        description: t.settings.accountAndSecurity,
        image: Config.SITE_ICON,
        url: `${Config.FRONTEND_URL}/settings/account`,
    });
}

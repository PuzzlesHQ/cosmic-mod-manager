import type { Organisation } from "@app/utils/types/api";
import { useLoaderData } from "react-router";
import Redirect from "~/components/ui/redirect";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import OrganisationDashboardPage from "~/pages/dashboard/organization/page";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { resJson, serverFetch } from "~/utils/server-fetch";
import type { Route } from "./+types/organizations";

export default function () {
    const session = useSession();
    const orgs = useLoaderData<typeof loader>();

    if (!session?.id) return <Redirect to="/login" />;
    return <OrganisationDashboardPage organisations={orgs} />;
}

export async function loader(props: Route.LoaderArgs): Promise<Organisation[]> {
    const res = await serverFetch(props.request, "/api/organization");
    const orgs = await resJson<Organisation[]>(res);

    return orgs || [];
}

export function meta() {
    const { t } = useTranslation();

    return MetaTags({
        title: t.meta.addContext(t.dashboard.organizations, Config.SITE_NAME_SHORT),
        description: t.dashboard.organizations,
        image: Config.SITE_ICON,
        url: undefined,
    });
}

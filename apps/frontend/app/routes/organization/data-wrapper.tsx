import type { Organisation, ProjectListItem } from "@app/utils/types/api";
import { Outlet, type ShouldRevalidateFunctionArgs } from "react-router";
import { useOrgData } from "~/hooks/org";
import { useTranslation } from "~/locales/provider";
import NotFoundPage from "~/pages/not-found";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { resJson, serverFetch } from "~/utils/server-fetch";
import { OrgPagePath } from "~/utils/urls";
import type { Route } from "./+types/data-wrapper";

export default function () {
    const ctx = useOrgData();
    const { t } = useTranslation();

    if (!ctx?.orgData?.id) {
        return (
            <NotFoundPage
                title={t.error.oraganizationNotFound}
                description={t.error.oraganizationNotFoundDesc(ctx.orgSlug)}
                linkHref="/"
                linkLabel={t.common.home}
            />
        );
    }

    return <Outlet />;
}

export interface OrgLoaderData {
    orgSlug?: string;
    orgData: Organisation | null;
    orgProjects: ProjectListItem[];
}

export async function loader(props: Route.LoaderArgs): Promise<OrgLoaderData> {
    const orgSlug = props.params.orgSlug;

    const [orgDataRes, orgProjectsRes] = await Promise.all([
        serverFetch(props.request, `/api/organization/${orgSlug}`),
        serverFetch(props.request, `/api/organization/${orgSlug}/projects`),
    ]);
    const [orgData, orgProjects] = await Promise.all([resJson<Organisation>(orgDataRes), resJson<ProjectListItem[]>(orgProjectsRes)]);

    return {
        orgSlug,
        orgData,
        orgProjects: orgProjects || [],
    };
}

export function shouldRevalidate({ currentParams, nextParams, nextUrl, defaultShouldRevalidate }: ShouldRevalidateFunctionArgs) {
    const revalidate = nextUrl.searchParams.get("revalidate") === "true";
    if (revalidate) return true;

    const currentId = currentParams.orgSlug?.toLowerCase();
    const nextId = nextParams.orgSlug?.toLowerCase();

    if (currentId === nextId) return false;

    return defaultShouldRevalidate;
}

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();
    const data = props.data as OrgLoaderData;
    const orgData = data?.orgData;

    if (!orgData?.id) {
        return MetaTags({
            title: t.error.oraganizationNotFound,
            description: t.error.oraganizationNotFoundDesc(props.params.orgSlug),
            image: Config.SITE_ICON,
            url: undefined,
        });
    }

    return MetaTags({
        title: t.meta.organization(orgData.name),
        description: t.meta.organizationDesc(orgData.description || "", orgData.name, Config.SITE_NAME_SHORT),
        image: orgData.icon || "",
        url: `${Config.FRONTEND_URL}${OrgPagePath(orgData.slug)}`,
    });
}

import { getProjectTypeFromName } from "@app/utils/convertors";
import type { ProjectDetailsData, ProjectListItem, ProjectVersionData } from "@app/utils/types/api";
import { Outlet, type ShouldRevalidateFunctionArgs } from "react-router";
import { shouldForceRevalidate } from "~/components/misc/refresh-page";
import { useProjectData } from "~/hooks/project";
import { useTranslation } from "~/locales/provider";
import NotFoundPage from "~/pages/not-found";
import { getProjectLoaderData } from "~/routes/project/utils";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { resJson, serverFetch } from "~/utils/server-fetch";
import { ProjectPagePath, UserProfilePath } from "~/utils/urls";
import type { Route } from "./+types/data-wrapper";

export default function () {
    const { t } = useTranslation();
    const data = useProjectData();

    if (!data.projectSlug || !data.projectType) return null;

    if (!data.projectData?.id) {
        const type = getProjectTypeFromName(data?.projectType);

        return (
            <NotFoundPage
                title={t.error.projectNotFound}
                description={t.error.projectNotFoundDesc(t.navbar[type], data.projectSlug)}
                linkHref={`/${type}s`}
                linkLabel={t.project.browse[type]}
            />
        );
    }

    return <Outlet />;
}

export interface ProjectLoaderData {
    projectSlug: string | undefined;
    projectData?: ProjectDetailsData | null;
    versions?: ProjectVersionData[];
    dependencies?: {
        projects: ProjectListItem[];
        versions: ProjectVersionData[];
    };
}

export async function loader(props: Route.LoaderArgs): Promise<ProjectLoaderData> {
    const projectSlug = props.params?.projectSlug;

    if (!projectSlug) {
        return {
            projectSlug: projectSlug,
        };
    }

    const [projectRes, versionsRes, depsRes] = await Promise.all([
        serverFetch(props.request, `/api/project/${projectSlug}`),
        serverFetch(props.request, `/api/project/${projectSlug}/version`),
        serverFetch(props.request, `/api/project/${projectSlug}/dependencies`),
    ]);

    if (!projectRes.ok) {
        return {
            projectSlug: projectSlug,
        };
    }

    const projectData = (await resJson<{ project: ProjectDetailsData }>(projectRes))?.project;
    const versions = await resJson<{ data: ProjectVersionData[] }>(versionsRes);
    const dependencies = (await resJson(depsRes)) as {
        projects: ProjectListItem[];
        versions: ProjectVersionData[];
    };

    return {
        projectSlug: projectSlug,
        projectData: projectData || null,
        versions: versions?.data || [],
        dependencies: dependencies || [],
    };
}

export function meta(props: Route.MetaArgs) {
    const { t } = useTranslation();
    const data = getProjectLoaderData(props.matches, props.location.pathname);
    const project = data?.projectData;

    if (!project) {
        return MetaTags({
            location: props.location,
            title: t.meta.addContext(t.error.projectNotFound, Config.SITE_NAME_SHORT),
            description: t.error.projectNotFoundDesc(t.navbar[getProjectTypeFromName(data.projectType)], data.projectSlug),
            image: Config.SITE_ICON,
            url: Config.FRONTEND_URL,
        });
    }

    const creator = project.members.find((member) => member.isOwner);
    const author = project.organisation?.name || creator?.userName || "<unknown>";

    const authorProfileLink = creator?.userName ? `${Config.FRONTEND_URL}${UserProfilePath(creator.userName)}` : undefined;
    const projectType_translated = t.navbar[getProjectTypeFromName(project.type[0])];

    return MetaTags({
        location: props.location,
        title: t.meta.project(project.name, projectType_translated),
        description: t.meta.projectDesc(project.name, project.summary, projectType_translated, author, Config.SITE_NAME_SHORT),
        image: project.icon || "",
        url: `${Config.FRONTEND_URL}${ProjectPagePath(project.type?.[0], project.slug)}`,
        authorProfile: authorProfileLink,
    });
}

export function shouldRevalidate(props: ShouldRevalidateFunctionArgs) {
    const forceRevalidate = shouldForceRevalidate(props.currentUrl.searchParams, props.nextUrl.searchParams);
    if (forceRevalidate) return true;

    const currentId = props.currentParams.projectSlug?.toLowerCase();
    const nextId = props.nextParams.projectSlug?.toLowerCase();

    if (currentId === nextId) return false;

    return props.defaultShouldRevalidate;
}

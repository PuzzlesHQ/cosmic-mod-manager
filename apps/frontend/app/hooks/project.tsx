import { getProjectTypeFromName } from "@app/utils/convertors";
import { getCurrMember } from "@app/utils/project";
import type { ProjectType } from "@app/utils/types";
import type { ProjectDetailsData, ProjectListItem, ProjectVersionData, TeamMember } from "@app/utils/types/api";
import { useLocation, useRouteLoaderData } from "react-router";
import type { ProjectLoaderData } from "~/routes/project/data-wrapper";
import { useSession } from "./session";

export interface ProjectContextData {
    projectSlug: string;
    projectType: string;

    projectData: ProjectDetailsData;
    allProjectVersions: ProjectVersionData[];
    featuredProjectVersions: ProjectVersionData[] | null;
    currUsersMembership: TeamMember | null;
    dependencies: {
        projects: ProjectListItem[];
        versions: ProjectVersionData[];
    };
}

export function useProjectData(): ProjectContextData {
    const session = useSession();
    const projectType = useProjectType();
    // Getting the loader data
    const loaderData = useRouteLoaderData(`${projectType}__data-wrapper`) as ProjectLoaderData;

    // We can safely return incomplete data, because the data-wrapper will handle not found cases
    // So no component using this hook will break
    if (!loaderData?.projectData?.id)
        // @ts-expect-error
        return {
            projectSlug: loaderData?.projectSlug || "",
            projectType: projectType,
        };

    // Formatting the loader data
    const project = loaderData?.projectData as ProjectDetailsData;

    const featuredProjectVersions: ProjectVersionData[] = [];
    for (const version of loaderData.versions || []) {
        if (version.featured) {
            featuredProjectVersions.push(version);
        }
    }

    let currUsersMembership: TeamMember | null = null;
    if (!session?.id) currUsersMembership = null;
    else {
        const membership = getCurrMember(session.id, project.members, project.organisation?.members || []);

        if (membership?.id) {
            currUsersMembership = membership;
        } else {
            currUsersMembership = null;
        }
    }

    const deps = loaderData.dependencies || { projects: [], versions: [] };

    return {
        projectSlug: loaderData.projectSlug || "",
        projectType: projectType,

        projectData: project,
        allProjectVersions: loaderData.versions || [],
        featuredProjectVersions: featuredProjectVersions,
        currUsersMembership: currUsersMembership,
        dependencies: deps,
    };
}

export function useProjectType(customPath?: string): "project" | ProjectType {
    const loc = useLocation();
    const pathname = customPath ? customPath : loc.pathname;

    return getProjectTypeFromPath(pathname);
}

export function getProjectTypeFromPath(pathname: string): "project" | ProjectType {
    let typeStr = pathname?.split("/")[1];
    if (typeStr?.endsWith("s")) typeStr = typeStr.slice(0, -1);

    return typeStr === "project" ? "project" : getProjectTypeFromName(typeStr);
}

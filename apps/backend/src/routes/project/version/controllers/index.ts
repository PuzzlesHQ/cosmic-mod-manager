import { getCurrMember } from "@app/utils/project";
import type { ProjectVersionData } from "@app/utils/types/api";
import type { Prisma } from "@prisma-client";
import { GetProject_Details } from "~/db/project_item";
import { GetVersions } from "~/db/version_item";
import { getFilesFromId } from "~/routes/project/queries/file";
import { isProjectAccessible } from "~/routes/project/utils";
import type { SessionUserData } from "~/types";
import { HTTP_STATUS, isSuccessResponse, notFoundResponseData } from "~/utils/http";
import { GetReleaseChannelFilter } from "~/utils/project";
import { filterVersion, formatVersionData, type ProjectVersionFilters } from "./utils";

export async function getAllProjectVersions(slug: string, userSession: SessionUserData | null, featuredOnly = false) {
    const [project, _projectVersions] = await Promise.all([GetProject_Details(slug, slug), GetVersions(slug, slug)]);
    if (!project) return notFoundResponseData("Project not found");

    const projectVersions = [];
    for (const version of _projectVersions?.versions || []) {
        if (!version?.id) continue;
        if (featuredOnly === true && version.featured !== true) continue;

        projectVersions.push(version);
    }

    if (!isProjectAccessible(project, userSession)) {
        return notFoundResponseData("Project not found");
    }

    // Get all the filesData for each version
    const idsList = [];
    for (const version of projectVersions) {
        for (const file of version.files) {
            idsList.push(file.fileId);
        }
    }
    const versionFilesMap = await getFilesFromId(idsList);
    const versionsList: ProjectVersionData[] = [];

    for (let i = 0; i < projectVersions.length; i++) {
        const version = projectVersions[i];

        versionsList.push(
            formatVersionData(
                version,
                versionFilesMap,
                getCurrMember(version.author?.id, project.team.members, project.organisation?.team.members || [])?.role,
            ),
        );
    }

    return { data: { success: true, data: versionsList }, status: HTTP_STATUS.OK } as const;
}

export async function getProjectVersionData(
    projectSlug: string,
    versionId: string,
    userSession: SessionUserData | null,
) {
    const res = await getAllProjectVersions(projectSlug, userSession, false);
    if (!isSuccessResponse(res)) return res;

    const list = res.data.data || [];
    const targetVersion = list.find((version) => version.id === versionId || version.slug === versionId);
    if (!targetVersion?.id) return notFoundResponseData(`Version "${versionId}" not found`);

    return {
        data: {
            success: true,
            data: targetVersion,
        },
        status: HTTP_STATUS.OK,
    } as const;
}

export async function getLatestVersion(
    projectSlug: string,
    userSession: SessionUserData | null,
    filters: ProjectVersionFilters,
) {
    const whereInput: Prisma.VersionWhereInput = {};
    if (filters.releaseChannel?.length)
        whereInput.releaseChannel = { in: GetReleaseChannelFilter(filters.releaseChannel) };
    if (filters.gameVersion?.length) whereInput.gameVersions = { has: filters.gameVersion };
    if (filters.loader?.length) whereInput.loaders = { has: filters.loader };

    const res = await getAllProjectVersions(projectSlug, userSession, false);
    if (!isSuccessResponse(res)) return res;

    const list = res.data.data;
    if (!list.length) return notFoundResponseData("No version found for your query!");

    const latestVersion = list.find((v) => filterVersion(v, filters));
    if (!latestVersion) return notFoundResponseData("No version found for your query!");

    return { data: { success: true, data: latestVersion }, status: res.status } as const;
}

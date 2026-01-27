import { getCurrMember } from "@app/utils/project";
import type { ProjectVersionData } from "@app/utils/types/api";
import type { Prisma } from "@prisma-client";
import { GetProject_Details } from "~/db/project_item";
import { GetVersions } from "~/db/version_item";
import { getFilesFromId } from "~/routes/project/queries/file";
import { isProjectAccessible } from "~/routes/project/utils";
import type { UserSessionData } from "~/types";
import { HTTP_STATUS, notFoundResponseData } from "~/utils/http";
import { GetReleaseChannelFilter } from "~/utils/project";
import { formatVersionData } from "./utils";

export async function getAllProjectVersions(slug: string, userSession: UserSessionData | null, featuredOnly = false) {
    const [project, _projectVersions] = await Promise.all([GetProject_Details(slug, slug), GetVersions(slug, slug)]);
    if (!project) return notFoundResponseData("Project not found");

    const projectVersions = [];
    for (const version of _projectVersions?.versions || []) {
        if (!version?.id) continue;
        if (featuredOnly === true && version.featured !== true) continue;

        projectVersions.push(version);
    }

    const projectAccessible = isProjectAccessible({
        visibility: project.visibility,
        publishingStatus: project.status,
        userId: userSession?.id,
        teamMembers: project.team.members,
        orgMembers: project.organisation?.team.members || [],
        sessionUserRole: userSession?.role,
    });
    if (!projectAccessible) {
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
    userSession: UserSessionData | null,
) {
    const res = await getAllProjectVersions(projectSlug, userSession, false);

    if (("success" in res.data && res.data.success === false) || !("data" in res.data))
        return { data: res.data, status: res.status } as const;

    const list = res.data.data || [];
    const targetVersion = list.find((version) => version.id === versionId || version.slug === versionId);
    if (!targetVersion?.id) return notFoundResponseData(`Version "${versionId}" not found`);

    return { data: { success: true, data: targetVersion }, status: res.status } as const;
}

interface GetLatestVersionFilters {
    releaseChannel?: string;
    gameVersion?: string;
    loader?: string;
}

export async function getLatestVersion(
    projectSlug: string,
    userSession: UserSessionData | null,
    filters: GetLatestVersionFilters,
) {
    const whereInput: Prisma.VersionWhereInput = {};
    if (filters.releaseChannel?.length)
        whereInput.releaseChannel = { in: GetReleaseChannelFilter(filters.releaseChannel) };
    if (filters.gameVersion?.length) whereInput.gameVersions = { has: filters.gameVersion };
    if (filters.loader?.length) whereInput.loaders = { has: filters.loader };

    function filter(version: ProjectVersionData) {
        if (filters.releaseChannel?.length) {
            const channels = GetReleaseChannelFilter(filters.releaseChannel);
            if (!channels.includes(version.releaseChannel)) return false;
        }
        if (filters.gameVersion?.length) {
            if (!version.gameVersions.includes(filters.gameVersion)) return false;
        }
        if (filters.loader?.length) {
            if (!version.loaders.includes(filters.loader)) return false;
        }
        return true;
    }

    const res = await getAllProjectVersions(projectSlug, userSession, false);

    if (("success" in res.data && res.data.success === false) || !("data" in res.data))
        return { data: { success: false, message: res.data.message }, status: res.status } as const;

    const list = res.data.data;
    if (!list.length) return notFoundResponseData("No version found for your query!");

    const latestVersion = list.find(filter);
    if (!latestVersion) return notFoundResponseData("No version found for your query!");

    return { data: { success: true, data: latestVersion }, status: res.status } as const;
}

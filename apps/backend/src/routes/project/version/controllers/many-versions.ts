import type { ProjectVersionData } from "@app/utils/types/api";
import { GetMany_ProjectsVersions } from "~/db/version_item";
import type { SessionUserData } from "~/types";
import { HTTP_STATUS } from "~/utils/http";
import { getManyProjects } from "../../controllers";
import { getFilesFromId } from "../../queries/file";
import { filterVersion, formatVersionData, type ProjectVersionFilters } from "./utils";

interface Params extends ProjectVersionFilters {
    limit: number;
}

export async function getBulkProjectVersions(
    userSession: SessionUserData | null,
    projectIds: string[],
    filters: Params,
) {
    const projects = (await getManyProjects(userSession, projectIds)).data;
    const versions = await GetMany_ProjectsVersions(projects.map((p) => p.id));

    const fileIds: string[] = [];
    for (const item of versions) {
        for (const version of item.versions) {
            for (const file of version.files) {
                fileIds.push(file.fileId);
            }
        }
    }
    const files = await getFilesFromId(fileIds);

    const result: Record<string, ProjectVersionData[]> = {};

    for (const project of projects) {
        const version = versions.find((v) => v.id === project.id);
        if (!version) continue;

        let filteredVersions = version.versions.filter((v) => filterVersion(v, filters));
        if (filters.limit > 0 && filters.limit < filteredVersions.length) {
            filteredVersions = filteredVersions.slice(0, filters.limit);
        }

        const formattedVersions = filteredVersions.map((v) => formatVersionData(v, files));
        result[project.id] = formattedVersions;
    }

    return {
        data: result,
        status: HTTP_STATUS.OK,
    };
}

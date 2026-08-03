import type { DependencyType, VersionReleaseChannel } from "@app/utils/types";
import type { ProjectVersionData, VersionFile } from "@app/utils/types/api";
import type { Prisma } from "@prisma-client";
import { GetManyFiles } from "~/db/file_item";
import { GetManyProjects_ListItem } from "~/db/project_item";
import { GetMany_ProjectsVersions } from "~/db/version_item";
import { getFilesFromId } from "~/routes/project/queries/file";
import { DELETED_USER_AUTHOR_OBJ, isProjectAccessible } from "~/routes/project/utils";
import prisma from "~/services/prisma";
import { HashAlgorithms, type SessionUserData } from "~/types";
import { HTTP_STATUS, invalidRequestResponseData, notFoundResponseData } from "~/utils/http";
import { GetReleaseChannelFilter } from "~/utils/project";
import { userFileUrl, versionFileUrl } from "~/utils/urls";

export async function GetVersionFromFileHash(
    hash: string,
    algorithm: HashAlgorithms,
    sessionUser: SessionUserData | null,
) {
    const res = await GetVersionsFromFileHashes([hash], algorithm, sessionUser);

    if (res.status !== HTTP_STATUS.OK) return res;
    return {
        data: res.data[hash],
        status: res.status,
    };
}

export async function GetVersionsFromFileHashes(
    hashes: string[],
    algorithm: HashAlgorithms,
    sessionUser: SessionUserData | null,
) {
    const hashList = hashes.filter((hash) => !!hash.length && typeof hash === "string");
    if (hashList.length > 50)
        return invalidRequestResponseData("Maximum of 50 versions can be retrieved from hashes at once!");

    let filesWhere: Prisma.FileWhereInput = {
        sha512_hash: {
            in: hashList,
        },
    };
    if (algorithm === HashAlgorithms.SHA1) {
        filesWhere = {
            sha1_hash: {
                in: hashList,
            },
        };
    }
    const files = await GetManyFiles({
        where: filesWhere,
    });
    if (!files.length) return notFoundResponseData("No versions found from the provided hashes!");

    // A map of file ids to their respective input hash
    const fileToInputHashMap = new Map<string, string>();
    for (const file of files) {
        const matchingHash = hashList.find((h) => h === file.sha1_hash || h === file.sha512_hash);

        if (matchingHash) {
            fileToInputHashMap.set(file.id, matchingHash);
        }
    }

    const versionFiles = await prisma.versionFile.findMany({
        where: {
            fileId: {
                in: files.map((f) => f.id),
            },
        },
        include: {
            version: {
                include: {
                    dependencies: true,
                    files: true,
                    author: true,
                },
            },
        },
    });
    if (!versionFiles.length) return notFoundResponseData("No versions found from the provided hashes!");

    // A map of project ids to their respective input hash
    const projectToInputHashMap = new Map<string, string>();
    const fileIds: string[] = [];
    {
        const accessibleProjectIds: string[] = [];
        const projects = await GetManyProjects_ListItem(versionFiles.map((f) => f.version.projectId));
        for (const p of projects) {
            if (isProjectAccessible(p, sessionUser)) {
                accessibleProjectIds.push(p.id);
            }
        }

        for (const vFile of versionFiles) {
            if (!accessibleProjectIds.includes(vFile.version.projectId)) continue;
            for (const file of vFile.version.files) {
                fileIds.push(file.fileId);
            }

            const relatedInputHash = fileToInputHashMap.get(vFile.fileId);
            if (relatedInputHash) projectToInputHashMap.set(vFile.version.projectId, relatedInputHash);
        }

        if (!accessibleProjectIds.length) return notFoundResponseData();
    }

    const filesDataMap = await getFilesFromId(fileIds);
    const hashToVersionMap: Record<string, ProjectVersionData> = {};

    for (const item of versionFiles) {
        const version = item.version;

        const files: VersionFile[] = [];
        for (const versionFile of version.files) {
            const fileData = filesDataMap.get(versionFile.fileId);
            if (!fileData) continue;

            files.push({
                id: versionFile.id,
                isPrimary: versionFile.isPrimary,
                name: fileData.name,
                url: versionFileUrl(version.projectId, version.id, fileData.name) || "",
                size: fileData.size,
                type: fileData.type,
                sha1_hash: fileData.sha1_hash,
                sha512_hash: fileData.sha512_hash,
            });
        }

        let relatedInputHash = projectToInputHashMap.get(version.projectId);
        if (!relatedInputHash) {
            if (algorithm === HashAlgorithms.SHA1) relatedInputHash = files[0].sha1_hash || "";
            else relatedInputHash = files[0].sha512_hash || "";
        }

        hashToVersionMap[relatedInputHash] = {
            id: version.id,
            projectId: version.projectId,
            title: version.title,
            versionNumber: version.versionNumber,
            changelog: version.changelog,
            slug: version.slug,
            datePublished: version.datePublished,
            featured: version.featured,
            downloads: version.downloads,
            releaseChannel: version.releaseChannel as VersionReleaseChannel,
            gameVersions: version.gameVersions,
            loaders: version.loaders,
            primaryFile: files.find((f) => f.isPrimary) as VersionFile,
            files: files,
            author: version.author
                ? {
                      id: version.author.id,
                      userName: version.author.userName,
                      avatar: userFileUrl(version.author.id, version.author.avatar),
                      role: "",
                  }
                : DELETED_USER_AUTHOR_OBJ,
            dependencies: version.dependencies.map((dependency) => ({
                id: dependency.id,
                projectId: dependency.projectId,
                versionId: dependency.versionId,
                dependencyType: dependency.dependencyType as DependencyType,
            })),
        } satisfies ProjectVersionData;
    }

    return {
        data: hashToVersionMap,
        status: HTTP_STATUS.OK,
    };
}

interface VersionFilter {
    gameVersions?: string[];
    loader?: string;
    releaseChannel?: string;
}

export async function GetLatestProjectVersionFromHash(
    hash: string,
    algorithm: HashAlgorithms,
    filter: VersionFilter,
    sessionUser: SessionUserData | null,
) {
    const res = await GetLatestProjectVersionsFromHashes([hash], algorithm, filter, sessionUser);

    if (res.status !== HTTP_STATUS.OK) return res;
    return {
        data: res.data[hash],
        status: res.status,
    };
}

export async function GetLatestProjectVersionsFromHashes(
    hashes: string[],
    algorithm: HashAlgorithms,
    filter: VersionFilter,
    sessionUser: SessionUserData | null,
) {
    const hashList = hashes.filter((hash) => !!hash.length && typeof hash === "string");
    if (hashList.length > 50)
        return invalidRequestResponseData("Maximum of 50 versions can be retrieved from hashes at once!");

    let filesWhere: Prisma.FileWhereInput = {
        sha512_hash: {
            in: hashList,
        },
    };

    if (algorithm === HashAlgorithms.SHA1) {
        filesWhere = {
            sha1_hash: {
                in: hashList,
            },
        };
    }

    const files = await GetManyFiles({
        where: filesWhere,
    });
    if (!files.length) return notFoundResponseData("No versions found from the provided hashes!");

    // A map of file ids to their respective input hash
    const fileToInputHashMap = new Map<string, string>();
    for (const file of files) {
        const matchingHash = hashList.find((h) => h === file.sha1_hash || h === file.sha512_hash);

        if (matchingHash) {
            fileToInputHashMap.set(file.id, matchingHash);
        }
    }

    const versionFiles = await prisma.versionFile.findMany({
        where: {
            fileId: {
                in: files.map((f) => f.id),
            },
        },
        select: {
            fileId: true,
            version: {
                select: {
                    projectId: true,
                },
            },
        },
    });
    if (!versionFiles.length) return notFoundResponseData("No versions found from the provided hashes!");

    const projectIdToInputHashMap = new Map<string, string>();
    // checkPermissions
    const accessibleProjectIds: string[] = [];
    {
        const projectIds = [];
        for (const item of versionFiles) {
            projectIds.push(item.version.projectId);

            const relatedInputHash = fileToInputHashMap.get(item.fileId);
            if (relatedInputHash) projectIdToInputHashMap.set(item.version.projectId, relatedInputHash);
        }

        const projects = await GetManyProjects_ListItem(projectIds);
        for (const p of projects) {
            if (isProjectAccessible(p, sessionUser)) {
                accessibleProjectIds.push(p.id);
            }
        }
    }
    if (!accessibleProjectIds.length) return notFoundResponseData();

    const projects = await GetMany_ProjectsVersions(accessibleProjectIds);
    const filteredProjects = [];
    for (const project of projects) {
        const versions = [];

        for (const version of project.versions) {
            if (!version) continue;

            if (filter.gameVersions?.length && !version.gameVersions.some((gv) => filter.gameVersions?.includes(gv)))
                continue;
            if (filter.loader && !version.loaders.includes(filter.loader)) continue;
            if (
                filter.releaseChannel &&
                !GetReleaseChannelFilter(filter.releaseChannel).includes(
                    version.releaseChannel as VersionReleaseChannel,
                )
            ) {
                continue;
            }

            versions.push(version);
        }

        if (versions.length) {
            filteredProjects.push({
                id: project.id,
                versions: versions,
            });
        }
    }

    const versionFileIds = [];
    for (const project of filteredProjects) {
        for (const version of project.versions) {
            for (const file of version.files) {
                versionFileIds.push(file.fileId);
            }
        }
    }

    const versionFilesMap = await getFilesFromId(versionFileIds);
    // Input hash to latest version data map
    const latestVersionMap: Record<string, ProjectVersionData> = {};

    for (const project of filteredProjects) {
        const version = project.versions[0];
        if (!version?.id) continue;

        const files: VersionFile[] = [];
        for (const versionFile of version.files) {
            const fileData = versionFilesMap.get(versionFile.fileId);
            if (!fileData) continue;

            files.push({
                id: versionFile.id,
                isPrimary: versionFile.isPrimary,
                name: fileData.name,
                url: versionFileUrl(version.projectId, version.id, fileData.name) || "",
                size: fileData.size,
                type: fileData.type,
                sha1_hash: fileData.sha1_hash,
                sha512_hash: fileData.sha512_hash,
            });
        }

        let relatedInputHash = projectIdToInputHashMap.get(project.id);
        if (!relatedInputHash) {
            if (algorithm === HashAlgorithms.SHA1) relatedInputHash = files[0].sha1_hash || "";
            else relatedInputHash = files[0].sha512_hash || "";
        }

        latestVersionMap[relatedInputHash] = {
            id: version.id,
            projectId: version.projectId,
            title: version.title,
            versionNumber: version.versionNumber,
            changelog: version.changelog,
            slug: version.slug,
            datePublished: version.datePublished,
            featured: version.featured,
            downloads: version.downloads,
            releaseChannel: version.releaseChannel as VersionReleaseChannel,
            gameVersions: version.gameVersions,
            loaders: version.loaders,
            primaryFile: files.find((f) => f.isPrimary) as VersionFile,
            files: files,
            author: version.author
                ? {
                      id: version.author.id,
                      userName: version.author.userName,
                      avatar: userFileUrl(version.author.id, version.author.avatar),
                      role: "",
                  }
                : DELETED_USER_AUTHOR_OBJ,
            dependencies: version.dependencies.map((dependency) => ({
                id: dependency.id,
                projectId: dependency.projectId,
                versionId: dependency.versionId,
                dependencyType: dependency.dependencyType as DependencyType,
            })),
        } satisfies ProjectVersionData;
    }

    return {
        data: latestVersionMap,
        status: HTTP_STATUS.OK,
    };
}

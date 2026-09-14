import { gameVersionsList } from "@app/utils/constants/game-versions";
import { sortVersionsWithReference } from "@app/utils/project";
import type { DependencyType, VersionReleaseChannel } from "@app/utils/types";
import type { ProjectVersionData, VersionFile } from "@app/utils/types/api";
import type { UnwrapArray } from "@app/utils/types/helpers";
import type { File as DBFile } from "@prisma-client";
import type { TVersions } from "~/db/version_item";
import { DELETED_USER_AUTHOR_OBJ } from "~/routes/project/utils";
import { GetReleaseChannelFilter } from "~/utils/project";
import { userFileUrl, versionFileUrl } from "~/utils/urls";

type VersionProp = UnwrapArray<NonNullable<TVersions>["versions"]>;
type VersionFilesMap = Map<string, DBFile>;

export function formatVersionData(
    v: VersionProp,
    versionFilesMap: VersionFilesMap,
    authorRole?: string,
): ProjectVersionData {
    let primaryFile: VersionFile | null = null;
    const files: VersionFile[] = [];

    for (const file of v.files) {
        const fileData = versionFilesMap.get(file.fileId);
        if (!fileData?.id) continue;

        const formattedFile = {
            id: file.id,
            isPrimary: file.isPrimary,
            name: fileData.name,
            size: fileData.size,
            type: fileData.type,
            url: versionFileUrl(v.projectId, v.id, fileData.name) || "",
            sha1_hash: fileData.sha1_hash,
            sha512_hash: fileData.sha512_hash,
        };

        files.push(formattedFile);
        if (formattedFile.isPrimary === true) {
            primaryFile = formattedFile;
        }
    }

    return {
        id: v.id,
        projectId: v.projectId,
        title: v.title,
        versionNumber: v.versionNumber,
        slug: v.slug,
        datePublished: v.datePublished,
        featured: v.featured,
        downloads: v.downloads,
        changelog: v.changelog,
        releaseChannel: v.releaseChannel as VersionReleaseChannel,
        gameVersions: sortVersionsWithReference(v.gameVersions, gameVersionsList),
        loaders: v.loaders,
        primaryFile: primaryFile?.id ? primaryFile : null,
        files: files,
        author: v.author
            ? {
                  id: v.author.id,
                  userName: v.author.userName,
                  avatar: userFileUrl(v.author.id, v.author.avatar),
                  role: authorRole || "",
              }
            : DELETED_USER_AUTHOR_OBJ,
        dependencies: v.dependencies.map((dependency) => ({
            projectId: dependency.projectId,
            versionId: dependency.versionId,
            dependencyType: dependency.dependencyType as DependencyType,
        })),
    };
}

export interface ProjectVersionFilters {
    releaseChannel?: string;
    gameVersion?: string;
    loader?: string;
}

export function filterVersion<T extends { loaders: string[]; gameVersions: string[]; releaseChannel: string }>(
    version: T,
    filters: ProjectVersionFilters,
) {
    if (filters.releaseChannel?.length) {
        const channels = GetReleaseChannelFilter(filters.releaseChannel);
        if (!channels.includes(version.releaseChannel as VersionReleaseChannel)) return false;
    }
    if (filters.gameVersion?.length) {
        if (!version.gameVersions.includes(filters.gameVersion)) return false;
    }
    if (filters.loader?.length) {
        if (!version.loaders.includes(filters.loader)) return false;
    }
    return true;
}

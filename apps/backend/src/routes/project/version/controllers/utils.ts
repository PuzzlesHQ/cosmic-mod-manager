import { gameVersionsList } from "@app/utils/constants/game-versions";
import { sortVersionsWithReference } from "@app/utils/project";
import type { DependencyType, VersionReleaseChannel } from "@app/utils/types";
import type { VersionFile } from "@app/utils/types/api";
import type { UnwrapArray } from "@app/utils/types/helpers";
import type { File as DBFile } from "@prisma-client";
import type { GetVersions_ReturnType } from "~/db/version_item";
import { DELETED_USER_AUTHOR_OBJ } from "~/routes/project/utils";
import { userFileUrl, versionFileUrl } from "~/utils/urls";

type VersionProp = UnwrapArray<NonNullable<GetVersions_ReturnType>["versions"]>;
type VersionFilesMap = Map<string, DBFile>;

export function formatVersionData(v: VersionProp, versionFilesMap: VersionFilesMap, authorRole?: string) {
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

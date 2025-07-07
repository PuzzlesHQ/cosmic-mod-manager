import { type Loader, loaders } from "@app/utils/constants/loaders";
import { getFileType } from "@app/utils/convertors";
import { combineProjectMembers, type PartialTeamMember, sortVersionsWithReference } from "@app/utils/project";
import { gameVersionsList } from "@app/utils/src/constants/game-versions";
import { isModerator } from "@app/utils/src/constants/roles";
import { type GlobalUserRole, ProjectPublishingStatus, ProjectVisibility } from "@app/utils/types";
import type { File as DBFile, VersionFile } from "@prisma/client";
import { rsort } from "semver";
import { CreateManyFiles, DeleteManyFiles_ByID, GetManyFiles } from "~/db/file_item";
import prisma from "~/services/prisma";
import { deleteProjectVersionFile, saveProjectVersionFile } from "~/services/storage";
import { createFilePathSafeString } from "~/services/storage/utils";
import type { FILE_STORAGE_SERVICE } from "~/types";
import { createHashFromFile } from "~/utils/file";
import { generateRandomId } from "~/utils/str";

export function isProjectPrivate(visibility: string) {
    return visibility === ProjectVisibility.PRIVATE;
}

export function isProjectListed(visibility: string) {
    return [ProjectVisibility.LISTED, ProjectVisibility.ARCHIVED].includes(visibility as ProjectVisibility);
}

export function isProjectPublic(visibility: string, publishingStatus: string) {
    const isPublic = visibility !== ProjectVisibility.PRIVATE;
    const isPublished = publishingStatus === ProjectPublishingStatus.APPROVED;

    return isPublic && isPublished;
}

export function isProjectIndexable(visibility: string, publishingStatus: string) {
    return isProjectPublic(visibility, publishingStatus) && visibility !== ProjectVisibility.UNLISTED;
}

interface IsProjectAccessible<T> {
    visibility: string;
    publishingStatus: string;
    userId: string | undefined;
    teamMembers: T[];
    orgMembers: T[];
    sessionUserRole: GlobalUserRole | undefined;
}

export function isProjectAccessible<T extends PartialTeamMember>({
    visibility,
    publishingStatus,
    userId,
    teamMembers,
    orgMembers,
    sessionUserRole,
}: IsProjectAccessible<T>) {
    if (isModerator(sessionUserRole) === true) return true;

    const combinedMembers = combineProjectMembers(teamMembers, orgMembers);
    const isMember = userId ? combinedMembers.has(userId) : false;
    const isPublic = isProjectPublic(visibility, publishingStatus);

    return isPublic || isMember;
}

export interface CreateVersionFileProps {
    files: File[];
    versionId: string;
    projectId: string;
    storageService: FILE_STORAGE_SERVICE;
    isPrimary?: boolean;
}

export async function createVersionFile(
    file: File,
    versionId: string,
    projectId: string,
    storageService: FILE_STORAGE_SERVICE,
    isPrimaryFile = false,
) {
    return await createVersionFiles({
        versionId,
        projectId,
        files: [
            {
                file: file,
                isPrimary: isPrimaryFile,
                storageService,
            },
        ],
    });
}

interface createVersionFilesProps {
    versionId: string;
    projectId: string;
    files: {
        file: File;
        isPrimary: boolean;
        storageService: FILE_STORAGE_SERVICE;
    }[];
}

export async function createVersionFiles({ versionId, projectId, files }: createVersionFilesProps) {
    if (!files.length) return [];

    const createdFiles: string[] = [];
    const filesToCreate: DBFile[] = [];
    const versionFilesToCreate: VersionFile[] = [];

    for (const { file, isPrimary, storageService } of files) {
        const fileType = await getFileType(file);
        if (!fileType) continue;

        const sha1_hash = await createHashFromFile(file, "sha1");
        if (createdFiles.includes(sha1_hash)) continue;

        const sha512_hash = await createHashFromFile(file, "sha512");
        const fileName = createFilePathSafeString(file.name);
        const path = await saveProjectVersionFile(storageService, projectId, versionId, file, fileName);
        if (!path) continue;

        const fileId = generateRandomId();
        filesToCreate.push({
            id: fileId,
            name: fileName,
            size: file.size,
            type: fileType,
            storageService: storageService,
            url: path,
            sha1_hash: sha1_hash,
            sha512_hash: sha512_hash,
        });

        versionFilesToCreate.push({
            id: generateRandomId(),
            versionId: versionId,
            fileId: fileId,
            isPrimary: isPrimary,
        });

        createdFiles.push(sha1_hash);
    }

    await Promise.all([
        prisma.versionFile.createMany({
            data: versionFilesToCreate,
        }),
        CreateManyFiles({
            data: filesToCreate,
        }),
    ]);

    return versionFilesToCreate;
}

export async function deleteVersionFiles(projectId: string, versionId: string, filesData: (DBFile | null)[]) {
    // Delete files from storage
    const promises = [];
    const fileIds = [];
    for (const file of filesData) {
        if (!file) continue;

        fileIds.push(file.id);
        promises.push(
            deleteProjectVersionFile(file.storageService as FILE_STORAGE_SERVICE, projectId, versionId, `/${file.name}`),
        );
    }

    // Delete files from database
    promises.push(DeleteManyFiles_ByID(fileIds));

    // Delete the deleted versionFiles from database
    promises.push(
        prisma.versionFile.deleteMany({
            where: {
                versionId: versionId,
                fileId: {
                    in: fileIds,
                },
            },
        }),
    );

    await Promise.all(promises);
}

interface isAnyDuplicateFileProps {
    projectId: string;
    files: File[];
}

export async function isAnyDuplicateFile({ projectId, files }: isAnyDuplicateFileProps) {
    const sha1_hashes: string[] = [];
    for (const file of files) {
        const hash = await createHashFromFile(file, "sha1");
        sha1_hashes.push(hash);
    }

    const dbFilesData = await GetManyFiles({
        where: {
            sha1_hash: {
                in: sha1_hashes,
            },
        },
    });

    if (dbFilesData.length === 0) return false;

    // List of files which has matching hashes
    const dbFileIds = new Set<string>();
    const dbFilesMap = new Map<string, DBFile>();

    for (const file of dbFilesData) {
        dbFileIds.add(file.id);
        dbFilesMap.set(file.id, file);
    }

    // Corresponding versionFile of those files
    const versionFiles = await prisma.versionFile.findMany({
        where: {
            fileId: {
                in: Array.from(dbFileIds),
            },
        },
        include: {
            version: true,
        },
    });

    if (!versionFiles?.length) return false;

    const associatedProjectIds = new Set<string>();
    for (const versionFile of versionFiles) {
        associatedProjectIds.add(versionFile.version.projectId);
    }

    // Check if the file is associated with another project or is from the same project
    for (const associatedProjectId of Array.from(associatedProjectIds)) {
        if (associatedProjectId !== projectId) return true;
    }

    return false;
}

// Aggregators
export function aggregateVersions(versionsList: string[]) {
    const uniqueItems = Array.from(new Set(versionsList));
    return rsort(uniqueItems);
}

export function aggregateGameVersions(versions: string[]) {
    const uniqueItems = Array.from(new Set(versions));
    return sortVersionsWithReference(uniqueItems, gameVersionsList);
}

export function aggregateProjectLoaders(projectLoaders: string[]) {
    const nameList: string[] = [];
    const loaderList: Loader[] = [];
    for (const LOADER of loaders) {
        if (projectLoaders.includes(LOADER.name) && !nameList.includes(LOADER.name)) {
            loaderList.push(LOADER);
            nameList.push(LOADER.name);
        }
    }

    return loaderList;
}

export function aggregateProjectLoaderNames(projectLoaders: string[]) {
    return aggregateProjectLoaders(projectLoaders).map((loader) => loader.name);
}

export const DELETED_USER_AUTHOR_OBJ = {
    id: "deleted_user",
    userName: "deleted_user",
    avatar: null,
    role: "",
};

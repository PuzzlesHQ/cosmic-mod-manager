import { isUrl } from "@app/utils/url";
import { FILE_STORAGE_SERVICE } from "~/types";
import { deleteFromLocalStorage, getFileFromLocalStorage, saveFileToLocalStorage, type WritableFile } from "./local";
import { collectionDir, orgDir, projectGalleryDir, projectsDir, userDir, versionsDir } from "./utils";

export async function getFile(storageService: FILE_STORAGE_SERVICE, path: string) {
    try {
        switch (storageService) {
            case FILE_STORAGE_SERVICE.LOCAL:
                return await getFileFromLocalStorage(path);
            default:
                return null;
        }
    } catch {
        return null;
    }
}

export async function saveFile(storageService: FILE_STORAGE_SERVICE, file: WritableFile, path: string) {
    try {
        switch (storageService) {
            case FILE_STORAGE_SERVICE.LOCAL:
                return await saveFileToLocalStorage(path, file);
            default:
                return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function deleteFile(storageService: FILE_STORAGE_SERVICE, path: string) {
    try {
        switch (storageService) {
            case FILE_STORAGE_SERVICE.LOCAL:
                return await deleteFromLocalStorage(path);
            default:
                return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function deleteDirectory(storageService: FILE_STORAGE_SERVICE, path: string) {
    try {
        switch (storageService) {
            case FILE_STORAGE_SERVICE.LOCAL:
                return await deleteFromLocalStorage(path);
            default:
                return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

// ? User Files
export async function saveUserFile(
    storageService: FILE_STORAGE_SERVICE,
    userId: string,
    file: WritableFile,
    fileName: string,
) {
    return await saveFile(storageService, file, userDir(userId, fileName));
}

export async function deleteUserFile(storageService: FILE_STORAGE_SERVICE, userId: string, fileName: string) {
    return await deleteFile(storageService, userDir(userId, fileName));
}

export async function deleteUserDirectory(storageService: FILE_STORAGE_SERVICE, userId: string) {
    return await deleteDirectory(storageService, userDir(userId));
}

export async function getUserFile(storageService: FILE_STORAGE_SERVICE, userId: string, fileName: string) {
    return await getFile(storageService, userDir(userId, fileName));
}

// ? Project Files
export async function saveProjectFile(
    storageService: FILE_STORAGE_SERVICE,
    projectId: string,
    file: WritableFile,
    fileName: string,
) {
    return await saveFile(storageService, file, projectsDir(projectId, fileName));
}

export async function deleteProjectFile(storageService: FILE_STORAGE_SERVICE, projectId: string, fileName: string) {
    return await deleteFile(storageService, projectsDir(projectId, fileName));
}

export async function deleteProjectDirectory(storageService: FILE_STORAGE_SERVICE, projectId: string) {
    return await deleteDirectory(storageService, projectsDir(projectId));
}

export async function getProjectFile(storageService: FILE_STORAGE_SERVICE, projectId: string, fileName: string) {
    return await getFile(storageService, projectsDir(projectId, fileName));
}

// ? Project Version Files
export async function saveProjectVersionFile(
    storageService: FILE_STORAGE_SERVICE,
    projectId: string,
    versionId: string,
    file: WritableFile,
    fileName: string,
) {
    return await saveFile(storageService, file, versionsDir(projectId, versionId, fileName));
}

export async function deleteProjectVersionFile(
    storageService: FILE_STORAGE_SERVICE,
    projectId: string,
    versionId: string,
    fileName: string,
) {
    return await deleteFile(storageService, versionsDir(projectId, versionId, fileName));
}

export async function deleteProjectVersionDirectory(
    storageService: FILE_STORAGE_SERVICE,
    projectId: string,
    versionId: string,
) {
    return await deleteDirectory(storageService, versionsDir(projectId, versionId));
}

export async function getProjectVersionFile(
    storageService: FILE_STORAGE_SERVICE,
    projectId: string,
    versionId: string,
    fileName: string,
) {
    return await getFile(storageService, versionsDir(projectId, versionId, fileName));
}

// ? Project Gallery Files
export async function getProjectGalleryFile(storageService: FILE_STORAGE_SERVICE, projectId: string, fileName: string) {
    if (isUrl(fileName)) return fileName;
    return await getFile(storageService, projectGalleryDir(projectId, fileName));
}

export async function saveProjectGalleryFile(
    storageService: FILE_STORAGE_SERVICE,
    projectId: string,
    file: WritableFile,
    fileName: string,
) {
    if (isUrl(fileName)) return fileName;
    return await saveFile(storageService, file, projectGalleryDir(projectId, fileName));
}

export async function deleteProjectGalleryFile(
    storageService: FILE_STORAGE_SERVICE,
    projectId: string,
    fileName: string,
) {
    if (isUrl(fileName)) return fileName;
    return await deleteFile(storageService, projectGalleryDir(projectId, fileName));
}

// ? Organization Files
export function saveOrgFile(storageService: FILE_STORAGE_SERVICE, orgId: string, file: WritableFile, fileName: string) {
    return saveFile(storageService, file, orgDir(orgId, fileName));
}

export function deleteOrgFile(storageService: FILE_STORAGE_SERVICE, orgId: string, fileName: string) {
    return deleteFile(storageService, orgDir(orgId, fileName));
}

export function deleteOrgDirectory(storageService: FILE_STORAGE_SERVICE, orgId: string) {
    return deleteDirectory(storageService, orgDir(orgId));
}

export function getOrgFile(storageService: FILE_STORAGE_SERVICE, orgId: string, fileName: string) {
    return getFile(storageService, orgDir(orgId, fileName));
}

// ? Collection Files
export function saveCollectionFile(
    storageService: FILE_STORAGE_SERVICE,
    collectionId: string,
    file: WritableFile,
    filename: string,
) {
    return saveFile(storageService, file, collectionDir(collectionId, filename));
}

export function deleteCollectionFile(storageService: FILE_STORAGE_SERVICE, collectionId: string, filename: string) {
    return deleteFile(storageService, collectionDir(collectionId, filename));
}

export function deleteCollectionDirectory(storageService: FILE_STORAGE_SERVICE, collectionId: string) {
    return deleteDirectory(storageService, collectionDir(collectionId));
}

export function getCollectionFile(storageService: FILE_STORAGE_SERVICE, collectionId: string, filename: string) {
    return getFile(storageService, collectionDir(collectionId, filename));
}

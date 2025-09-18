import type { BunFile } from "bun";
import { projectTypes } from "~/config/project";
import { loaders } from "~/constants/loaders";
import { getFileSignatures } from "~/file-signature";
import { AuthProvider, ConfirmationType, FileType, GlobalUserRole, ProjectType, ProjectVisibility } from "~/types";

export function getUserRoleFromString(roleName: string) {
    return getEnumEntryFromStr(roleName.toLowerCase(), GlobalUserRole, GlobalUserRole.USER);
}

export function getProjectTypesFromNames(list: string[]) {
    const result = [];
    for (const projectType of projectTypes) {
        if (list.includes(projectType)) {
            result.push(projectType);
        }
    }

    return result;
}

export function getProjectTypeFromName(type: string): ProjectType {
    return getProjectTypesFromNames([type])?.[0] || ProjectType.MOD;
}

export function getAuthProviderFromString(providerName: string) {
    return getEnumEntryFromStr(providerName.toLowerCase(), AuthProvider, AuthProvider.UNKNOWN);
}

export function getConfirmActionTypeFromStringName(type: string) {
    return getEnumEntryFromStr(type, ConfirmationType, null);
}

export function getProjectVisibilityFromString(visibility: string) {
    return getEnumEntryFromStr(visibility.toLowerCase(), ProjectVisibility, ProjectVisibility.LISTED);
}

export function getFileTypeFromFileExtension(fileName: string) {
    const fileExtension = fileName.split(".").pop();
    if (!fileExtension) return null;

    switch (fileExtension.toLowerCase()) {
        case "jpg":
        case "jpeg":
            return FileType.JPEG;
        case "webp":
            return FileType.WEBP;
        case "png":
            return FileType.PNG;
        case "gif":
            return FileType.GIF;

        case "mp4":
            return FileType.MP4;
        case "webm":
            return FileType.WEBM;
        case "mkv":
            return FileType.MKV;

        case "jar":
            return FileType.JAR;
        case "zip":
            return FileType.ZIP;
        case "7z":
            return FileType.SEVEN_Z;
        case "gz":
            return FileType.GZ;
        case "tar":
            return FileType.TAR;

        default:
            return null;
    }
}

export async function getFileType(file: File | BunFile) {
    const fileExtensionType = getFileTypeFromFileExtension(file.name);
    if (!fileExtensionType) return null;

    const fileSignatureType = await getFileSignatures(file);
    if (!fileSignatureType || !fileSignatureType.includes(fileExtensionType)) return null;

    return fileExtensionType;
}

export function getLoaderFromString(loaderName: string) {
    for (const LOADER of loaders) {
        if (LOADER.name === loaderName.toLowerCase()) {
            return LOADER;
        }
    }
    return null;
}

export function getLoadersFromNames(loaderNames: string[]) {
    const loadersList = [];

    for (let i = 0; i < loaderNames.length; i++) {
        const loader = getLoaderFromString(loaderNames[i]);
        if (loader) {
            loadersList.push(loader);
        }
    }
    return loadersList;
}

export function getEnumEntryFromStr<T extends object, K>(
    str: string | undefined | null,
    enumObj: T,
    defaultValue: K,
): T[keyof T] | K {
    if (!str) return defaultValue;

    return Object.values(enumObj).find((v) => v === str) || defaultValue;
}

import { FileType, ProjectType } from "~/types";

export function allowedPrimaryFileTypes(projectType: ProjectType[]) {
    const allowedFileTypes = new Set<FileType>();

    if (projectType.includes(ProjectType.MOD) || projectType.includes(ProjectType.PLUGIN)) {
        allowedFileTypes.add(FileType.JAR);
    }

    if (projectType.includes(ProjectType.SHADER)) {
        allowedFileTypes.add(FileType.JAR);
        allowedFileTypes.add(FileType.ZIP);
        allowedFileTypes.add(FileType.SEVEN_Z);
        allowedFileTypes.add(FileType.GZ);
        allowedFileTypes.add(FileType.TAR);
    }

    if (
        projectType.includes(ProjectType.RESOURCE_PACK) ||
        projectType.includes(ProjectType.MODPACK) ||
        projectType.includes(ProjectType.DATAMOD) ||
        projectType.includes(ProjectType.WORLD)
    ) {
        allowedFileTypes.add(FileType.ZIP);
        allowedFileTypes.add(FileType.SEVEN_Z);
        allowedFileTypes.add(FileType.GZ);
        allowedFileTypes.add(FileType.TAR);
    }

    return allowedFileTypes;
}

export function isVersionPrimaryFileValid(projectType: ProjectType[], fileType: FileType | null) {
    if (!fileType) return false;
    const allowedFileTypes = allowedPrimaryFileTypes(projectType);

    return allowedFileTypes.has(fileType);
}

export function isImageFile(fileType: FileType | null, allowGif = true) {
    if (!fileType) return false;

    const validImageTypes = [FileType.JPEG, FileType.PNG, FileType.WEBP];
    if (allowGif) validImageTypes.push(FileType.GIF);

    return validImageTypes.includes(fileType);
}

export function isVideoFile(fileType: FileType | null) {
    if (!fileType) return false;

    const validVideoTypes = [FileType.MP4, FileType.WEBM, FileType.MKV];
    return validVideoTypes.includes(fileType);
}

import env from "~/utils/env";

const DIRECT_CDN_PREFIX = `${env.CDN_SERVER_URL}/cdn/data`;
const CACHE_CDN_PREFIX = `${env.CACHE_CDN_URL}/cdn/data`;

export function cdnUrl(path: string | null, pathPrefix?: string, cdnPrefix = CACHE_CDN_PREFIX) {
    if (!path) return null;
    if (path.startsWith("http")) return path;

    return pathPrefix ? `${cdnPrefix}/${pathPrefix}/${path}` : `${cdnPrefix}/${path}`;
}

export function projectIconUrl(projectId: string, icon: string | null) {
    return cdnUrl(icon, `project/${projectId}`);
}

export function projectGalleryFileUrl(projectId: string, galleryFile: string) {
    return cdnUrl(encodeURIComponent(galleryFile), `project/${projectId}/gallery`);
}

export function versionFileUrl(projectId: string, versionId: string, fileName: string, useCacheCdn = false) {
    return cdnUrl(
        encodeURIComponent(fileName),
        `project/${projectId}/version/${versionId}`,
        useCacheCdn ? CACHE_CDN_PREFIX : DIRECT_CDN_PREFIX,
    );
}

export function orgIconUrl(orgId: string, icon: string | null) {
    return cdnUrl(icon, `organization/${orgId}`);
}

export function userFileUrl(userId: string, icon: string | null) {
    return cdnUrl(icon, `user/${userId}`);
}

export function collectionIconUrl(collectionId: string, icon: string | null) {
    return cdnUrl(icon, `collection/${collectionId}`);
}

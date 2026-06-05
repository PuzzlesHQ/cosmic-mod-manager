import { GetTimestamp } from "@app/utils/date";

// Store files outeside of the project folder
export const LOCAL_BASE_STORAGE_PATH = "./../../../uploads";

export const USERS_FOLDER_NAMESPACE = "users";
export const PROJECTS_FOLDER_NAMESPACE = "projects";
export const VERSIONS_FOLDER_NAMESPACE = "versions";
export const GALLERY_FOLDER_NAMESPACE = "gallery";
export const ORGS_FOLDER_NAMESPACE = "organizations";
export const COLLECTIONS_FOLDER_NAMESPACE = "collections";

// ? User Files
export function userDir(userId: string, extra?: string) {
	let path = `${USERS_FOLDER_NAMESPACE}/${userId}`;
	if (extra) path += `/${extra}`;

	return path;
}

// ? Project Files
export function projectsDir(projectId: string, extra?: string) {
	let path = `${PROJECTS_FOLDER_NAMESPACE}/${projectId}`;
	if (extra) path += `/${extra}`;

	return path;
}

export function versionsDir(projectId: string, versionId: string, extra?: string) {
	let path = projectsDir(projectId, `${VERSIONS_FOLDER_NAMESPACE}/${versionId}`);
	if (extra) path += `/${extra}`;

	return path;
}

export function projectGalleryDir(projectId: string, extra?: string) {
	let path = projectsDir(projectId, GALLERY_FOLDER_NAMESPACE);
	if (extra) path += `/${extra}`;

	return path;
}

// ? Organization Files
export function orgDir(orgId: string, extra?: string) {
	let path = `${ORGS_FOLDER_NAMESPACE}/${orgId}`;
	if (extra) path += `/${extra}`;

	return path;
}

// ? Collection Files
export function collectionDir(collectionId: string, extra?: string) {
	let path = `${COLLECTIONS_FOLDER_NAMESPACE}/${collectionId}`;
	if (extra) path += `/${extra}`;

	return path;
}

export function createFilePathSafeString(str: string) {
	return str.replace(/[^a-zA-Z0-9._-]/gi, "-");
}

export function LogWithTimestamp(...args: unknown[]) {
	const timestamp = GetTimestamp();
	console.log(`[${timestamp}] `, ...args);
}

export function ErrorLogWithTimestamp(...args: unknown[]) {
	const timestamp = GetTimestamp();
	console.error(`[${timestamp}] `, ...args);
}

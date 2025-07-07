import { getMimeFromType } from "@app/utils/file-signature";
import type { Context } from "hono";
import { GetCollection } from "~/db/collection_item";
import { GetFile, type GetFile_ReturnType, GetManyFiles_ByID } from "~/db/file_item";
import { GetOrganization_BySlugOrId } from "~/db/organization_item";
import { GetProject_Details, GetProject_ListItem } from "~/db/project_item";
import { GetUser_ByIdOrUsername } from "~/db/user_item";
import { GetVersions } from "~/db/version_item";
import { getUserIpAddress } from "~/routes/auth/helpers";
import { isProjectAccessible, isProjectPublic } from "~/routes/project/utils";
import {
    getCollectionFile,
    getOrgFile,
    getProjectFile,
    getProjectGalleryFile,
    getProjectVersionFile,
    getUserFile,
} from "~/services/storage";
import type { ContextUserData, FILE_STORAGE_SERVICE } from "~/types";
import { HTTP_STATUS, notFoundResponse } from "~/utils/http";
import { collectionIconUrl, orgIconUrl, projectGalleryFileUrl, projectIconUrl, userIconUrl, versionFileUrl } from "~/utils/urls";
import { addToDownloadsQueue } from "./downloads-counter";

export async function serveVersionFile(
    ctx: Context,
    projectId: string,
    versionId: string,
    fileName: string,
    userSession: ContextUserData | undefined,
    isCdnRequest = true,
) {
    const [project, _projectVersions] = await Promise.all([
        GetProject_ListItem(undefined, projectId),
        GetVersions(undefined, projectId),
    ]);

    const targetVersion = (_projectVersions?.versions || []).find((version) => version.id === versionId);
    if (!project?.id || !targetVersion?.files?.[0]?.fileId) {
        return notFoundResponse(ctx);
    }

    const accessibleToCurrentSession = isProjectAccessible({
        visibility: project.visibility,
        publishingStatus: project.status,
        userId: userSession?.id,
        teamMembers: project.team.members,
        orgMembers: project.organisation?.team.members || [],
        sessionUserRole: userSession?.role,
    });
    if (!accessibleToCurrentSession) {
        return notFoundResponse(ctx);
    }

    const isPublicallyAccessible = isProjectPublic(project.visibility, project.status);
    const fileIds = targetVersion.files.map((file) => file.fileId);
    const VersionFileDataList = await GetManyFiles_ByID(fileIds);

    let requiredFile: GetFile_ReturnType | undefined;
    for (const file of VersionFileDataList) {
        if (!file) continue;
        if (file.name === fileName) {
            requiredFile = file;
            break;
        }
    }
    if (!requiredFile?.id) {
        return ctx.json({ message: "File not found" }, HTTP_STATUS.NOT_FOUND);
    }

    // Get corresponding file from version
    const targetVersionFile = targetVersion.files.find((file) => file.fileId === requiredFile.id);

    // If the request was not made from the CDN, add the download count
    if (!isCdnRequest && targetVersionFile?.isPrimary === true) {
        // add download count
        await addToDownloadsQueue({
            ipAddress: getUserIpAddress(ctx) || "",
            userId: userSession?.id || ctx.get("guest-session"),
            projectId: project.id,
            versionId: targetVersion.id,
        });
    }

    // Redirect to the cdn url if the project is public
    if (!isCdnRequest && isPublicallyAccessible) {
        return ctx.redirect(`${versionFileUrl(project.id, targetVersion.id, fileName, true)}`);
    }

    const file = await getProjectVersionFile(
        requiredFile.storageService as FILE_STORAGE_SERVICE,
        project.id,
        targetVersion.id,
        requiredFile.name,
    );
    if (!file) return ctx.json({ message: "File not found" }, HTTP_STATUS.NOT_FOUND);

    if (typeof file === "string") return ctx.redirect(file);

    const response = new Response(file, { status: HTTP_STATUS.OK });
    response.headers.set("Cache-Control", "public, max-age=31536000");
    response.headers.set("Content-Type", getMimeFromType(requiredFile.type));
    response.headers.set("Content-Disposition", `attachment; filename="${requiredFile.name}"`);

    return response;
}

export async function serveProjectIconFile(ctx: Context, projectId: string, isCdnRequest: boolean) {
    const project = await GetProject_ListItem(undefined, projectId);
    if (!project?.iconFileId) return ctx.json({}, HTTP_STATUS.NOT_FOUND);

    const iconFileData = await GetFile(project.iconFileId);
    if (!iconFileData?.id) return ctx.json({}, HTTP_STATUS.NOT_FOUND);

    if (!isCdnRequest) {
        return ctx.redirect(`${projectIconUrl(project.id, project.iconFileId)}`);
    }

    const iconFile = await getProjectFile(iconFileData.storageService as FILE_STORAGE_SERVICE, project.id, iconFileData.name);

    // Redirect to the file if it's a URL
    if (typeof iconFile === "string") return ctx.redirect(iconFile);

    const response = new Response(iconFile);
    response.headers.set("Cache-Control", "public, max-age=31536000"); // For a full year
    response.headers.set("Content-Type", getMimeFromType(iconFileData.type));
    response.headers.set("Content-Disposition", `inline; filename="${iconFileData.name}"`);
    return response;
}

export async function serveProjectGalleryImage(ctx: Context, projectId: string, imgFileId: string, isCdnRequest: boolean) {
    const project = await GetProject_Details(undefined, projectId);
    if (!project || !project?.gallery?.[0]?.id) return notFoundResponse(ctx);

    const targetGalleryItem = project.gallery.find(
        (item) => item.imageFileId === imgFileId || item.thumbnailFileId === imgFileId,
    );
    if (!targetGalleryItem) return notFoundResponse(ctx);

    const dbFile = await GetFile(imgFileId);
    if (!dbFile?.id) return notFoundResponse(ctx);

    // If it's not a CDN request redirect to the cache_cdn url
    if (!isCdnRequest) {
        return ctx.redirect(`${projectGalleryFileUrl(project.id, dbFile.id)}`);
    }

    // Get the file from the storage service
    const file = await getProjectGalleryFile(dbFile.storageService as FILE_STORAGE_SERVICE, project.id, dbFile.name);
    if (!file) return ctx.json({}, HTTP_STATUS.NOT_FOUND);

    // If the file is a URL, redirect to it
    if (typeof file === "string") return ctx.redirect(file);

    const response = new Response(file);
    response.headers.set("Cache-Control", "public, max-age=31536000"); // 1 year
    response.headers.set("Content-Type", getMimeFromType(dbFile.type));
    response.headers.set("Content-Disposition", `inline; filename="${dbFile.name}"`);
    return response;
}

export async function serveOrgIconFile(ctx: Context, orgId: string, isCdnRequest: boolean) {
    const org = await GetOrganization_BySlugOrId(undefined, orgId);
    if (!org?.iconFileId) return notFoundResponse(ctx);

    const iconFileData = await GetFile(org.iconFileId);
    if (!iconFileData?.id) return notFoundResponse(ctx);

    if (!isCdnRequest) {
        return ctx.redirect(`${orgIconUrl(org.id, org.iconFileId)}`);
    }

    const icon = await getOrgFile(iconFileData.storageService as FILE_STORAGE_SERVICE, org.id, iconFileData.name);

    // Redirect to the file if it's a URL
    if (typeof icon === "string") return ctx.redirect(icon);

    const response = new Response(icon);
    response.headers.set("Cache-Control", "public, max-age=31536000"); // For a full year
    response.headers.set("Content-Type", getMimeFromType(iconFileData.type));
    response.headers.set("Content-Disposition", `inline; filename="${iconFileData.name}"`);
    return response;
}

export async function serveUserAvatar(ctx: Context, userId: string, isCdnRequest: boolean) {
    const user = await GetUser_ByIdOrUsername(undefined, userId);
    if (!user?.avatar) return notFoundResponse(ctx);

    const iconFileData = await GetFile(user.avatar);
    if (!iconFileData?.id) return notFoundResponse(ctx);

    if (!isCdnRequest) {
        return ctx.redirect(`${userIconUrl(user.id, user.avatar)}`);
    }

    const icon = await getUserFile(iconFileData.storageService as FILE_STORAGE_SERVICE, user.id, iconFileData.name);

    // Redirect to the file if it's a URL
    if (typeof icon === "string") return ctx.redirect(icon);

    const response = new Response(icon);
    response.headers.set("Cache-Control", "public, max-age=31536000"); // For a full year
    response.headers.set("Content-Type", getMimeFromType(iconFileData.type));
    response.headers.set("Content-Disposition", `inline; filename="${iconFileData.name}"`);
    return response;
}

export async function serveCollectionIcon(ctx: Context, collectionId: string, isCdnRequest: boolean) {
    const collection = await GetCollection(collectionId);
    if (!collection?.iconFileId) return notFoundResponse(ctx);

    const iconFileData = await GetFile(collection.iconFileId);
    if (!iconFileData?.id) return notFoundResponse(ctx);

    if (!isCdnRequest) {
        return ctx.redirect(`${collectionIconUrl(collection.id, collection.iconFileId)}`);
    }

    const icon = await getCollectionFile(iconFileData.storageService as FILE_STORAGE_SERVICE, collection.id, iconFileData.name);
    if (typeof icon === "string") return ctx.redirect(icon);

    const response = new Response(icon);
    response.headers.set("Cache-Control", "public, max-age=31536000");
    response.headers.set("Content-Type", getMimeFromType(iconFileData.type));
    response.headers.set("Content-Disposition", `inline; filename="${iconFileData.name}"`);
    return response;
}

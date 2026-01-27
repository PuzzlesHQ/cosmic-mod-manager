import { getMimeFromType } from "@app/utils/file-signature";
import { MiB } from "@app/utils/number";
import type { Context } from "hono";
import { GetFile, GetManyFiles_ByID } from "~/db/file_item";
import { GetProject_ListItem } from "~/db/project_item";
import { GetVersions } from "~/db/version_item";
import { getUserIpAddress } from "~/routes/auth/helpers";
import { isProjectAccessible, isProjectPublic } from "~/routes/project/utils";
import { getProjectVersionFile } from "~/services/storage";
import type { FILE_STORAGE_SERVICE, UserSessionData } from "~/types";
import { HTTP_STATUS, notFoundResponse } from "~/utils/http";
import { versionFileUrl } from "~/utils/urls";
import { addToDownloadsQueue } from "./downloads-counter";

const MAX_FASTLY_FILE_SIZE = 19 * MiB;

export async function serveVersionFile(
    ctx: Context,
    projectId: string,
    versionId: string,
    fileName: string,
    userSession: UserSessionData | null,
    isCdnRequest = true,
) {
    const [project, _projectVersions] = await Promise.all([GetProject_ListItem(projectId), GetVersions(projectId)]);

    const associatedProjectVersion = (_projectVersions?.versions || []).find((version) => version.id === versionId);
    if (!project?.id || !associatedProjectVersion?.files?.[0]?.fileId) {
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
    const fileIds = associatedProjectVersion.files.map((file) => file.fileId);
    const VersionFileDataList = await GetManyFiles_ByID(fileIds);

    const file_meta = VersionFileDataList.find((_file) => _file?.name === fileName || _file?.id === fileName);
    if (!file_meta?.id) return notFoundResponse(ctx, "File not found");

    // Get corresponding file from version
    const versionFile = associatedProjectVersion.files.find((file) => file.fileId === file_meta.id);

    // If the request was not made from the CDN, add the download count
    if (!isCdnRequest && versionFile?.isPrimary === true) {
        // add download count
        await addToDownloadsQueue({
            ipAddress: getUserIpAddress(ctx) || "",
            userId: userSession?.id || ctx.get("guest-session"),
            projectId: project.id,
            versionId: associatedProjectVersion.id,
        });
    }

    const fileUnder_FastlyCdn_SizeLimit = file_meta.size < MAX_FASTLY_FILE_SIZE;

    // Redirect to the cdn url if the project is public and the file is under the CDN size limit
    if (!isCdnRequest && isPublicallyAccessible && fileUnder_FastlyCdn_SizeLimit) {
        return ctx.redirect(
            `${versionFileUrl(project.id, associatedProjectVersion.id, fileName, true)}`,
            HTTP_STATUS.TEMPORARY_REDIRECT,
        );
    }

    const file = await getProjectVersionFile(
        file_meta.storageService as FILE_STORAGE_SERVICE,
        project.id,
        associatedProjectVersion.id,
        file_meta.name,
    );
    if (!file) return notFoundResponse(ctx, "File not found");

    const response = new Response(file, { status: HTTP_STATUS.OK });
    response.headers.set("Cache-Control", "public, max-age=31536000");
    response.headers.set("Content-Type", getMimeFromType(file_meta.type));
    response.headers.set("Content-Disposition", `attachment; filename="${file_meta.name}"`);

    return response;
}

interface ServeImageFileProps {
    ctx: Context;
    entityId: string;
    fileId: string;
    isCdnRequest: boolean;
    cdnUrlOfFile: string;
    getFile: (
        storageService: FILE_STORAGE_SERVICE,
        entityId: string,
        fileSlug: string,
    ) => Promise<Bun.BunFile | string | null>;
}

export async function serveImageFile(props: ServeImageFileProps) {
    const fileMeta = await GetFile(props.fileId);
    if (!fileMeta?.id) return notFoundResponse(props.ctx);

    if (!props.isCdnRequest && fileMeta.size < MAX_FASTLY_FILE_SIZE) {
        return props.ctx.redirect(props.cdnUrlOfFile);
    }

    const image = await props.getFile(fileMeta.storageService as FILE_STORAGE_SERVICE, props.entityId, fileMeta.name);
    if (!image) return notFoundResponse(props.ctx);
    if (typeof image === "string") return props.ctx.redirect(image);

    const response = new Response(image);
    response.headers.set("Cache-Control", "public, max-age=31536000");
    response.headers.set("Content-Type", getMimeFromType(fileMeta.type));
    response.headers.set("Content-Disposition", `inline; filename="${fileMeta.name}"`);
    return response;
}

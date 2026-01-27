import { getFileType } from "@app/utils/convertors";
import { doesMemberHaveAccess, getCurrMember } from "@app/utils/project";
import type {
    addNewGalleryImageFormSchema,
    updateGalleryImageFormSchema,
} from "@app/utils/schemas/project/settings/gallery";
import { GALLERY_IMG_THUMBNAIL_WIDTH, MAX_PROJECT_GALLERY_IMAGES_COUNT } from "@app/utils/src/constants";
import { FileType, ProjectPermission } from "@app/utils/types";
import type { z } from "zod/v4";
import { CreateManyFiles, DeleteFile_ByID } from "~/db/file_item";
import { CreateGalleryItem, DeleteGalleryItem, UpdateGalleryItem } from "~/db/gallery_item";
import { GetProject_Details } from "~/db/project_item";
import { deleteProjectGalleryFile, saveProjectGalleryFile } from "~/services/storage";
import { FILE_STORAGE_SERVICE, type UserSessionData } from "~/types";
import {
    HTTP_STATUS,
    invalidRequestResponseData,
    notFoundResponseData,
    serverErrorResponseData,
    unauthorizedReqResponseData,
} from "~/utils/http";
import { ConvertToWebp, resizeImageToWebp } from "~/utils/images";
import { generateDbId } from "~/utils/str";

export async function addNewGalleryImage(
    projectId: string,
    userSession: UserSessionData,
    formData: z.infer<typeof addNewGalleryImageFormSchema>,
) {
    const project = await GetProject_Details(projectId);
    if (!project?.id) return notFoundResponseData();
    if (project.gallery.length >= MAX_PROJECT_GALLERY_IMAGES_COUNT)
        return invalidRequestResponseData(`Maximum of ${MAX_PROJECT_GALLERY_IMAGES_COUNT} gallery images allowed!`);

    // Check if the order index is not already occupied
    for (const item of project.gallery) {
        if (item.orderIndex === formData.orderIndex) {
            return invalidRequestResponseData("An image with same order index already exists");
        }
    }

    // Check if the user has the required permissions
    const memberObj = getCurrMember(userSession.id, project.team.members, project.organisation?.team?.members || []);
    const hasEditAccess = doesMemberHaveAccess(
        ProjectPermission.EDIT_DETAILS,
        memberObj?.permissions as ProjectPermission[],
        memberObj?.isOwner,
        userSession.role,
    );
    if (!hasEditAccess) {
        return unauthorizedReqResponseData();
    }

    // Check if there's already a featured image
    if (formData.featured === true) {
        const existingFeaturedImage = project.gallery.some((item) => item.featured === true);
        if (existingFeaturedImage) return invalidRequestResponseData("A featured gallery image already exists");
    }

    const storageService = FILE_STORAGE_SERVICE.LOCAL;
    const uploadedImage_Type = (await getFileType(formData.image)) || FileType.PNG;

    // Save the raw file
    const rawImg_Type = FileType.WEBP;
    const rawImg_Webp = await ConvertToWebp(formData.image, uploadedImage_Type);
    const rawImg_DBId = `${generateDbId()}.${rawImg_Type}`;
    const rawImg_Url = await saveProjectGalleryFile(storageService, project.id, rawImg_Webp, rawImg_DBId);

    // Generate thumbnail for the image
    const thumbnailImgType = FileType.WEBP;
    const thumbnailImg = await resizeImageToWebp(rawImg_Webp, uploadedImage_Type, {
        width: GALLERY_IMG_THUMBNAIL_WIDTH,
        fit: "contain",
        withoutEnlargement: true,
    });
    const thumbnailImg_DBId = `${generateDbId()}_${GALLERY_IMG_THUMBNAIL_WIDTH}.${thumbnailImgType}`;
    const thumbnailImg_Url = await saveProjectGalleryFile(storageService, project.id, thumbnailImg, thumbnailImg_DBId);

    if (!rawImg_Url || !thumbnailImg_Url) return serverErrorResponseData("Failed to upload the image");

    await CreateManyFiles({
        data: [
            {
                id: rawImg_DBId,
                name: rawImg_DBId,
                size: rawImg_Webp.size,
                type: rawImg_Type,
                url: rawImg_Url,
                storageService: storageService,
            },
            {
                id: thumbnailImg_DBId,
                name: thumbnailImg_DBId,
                size: thumbnailImg.size,
                type: thumbnailImgType,
                url: thumbnailImg_Url,
                storageService: storageService,
            },
        ],
    });

    // Create the gallery item
    await CreateGalleryItem({
        data: {
            id: generateDbId(),
            projectId: project.id,
            name: formData.title,
            description: formData.description || "",
            featured: formData.featured,
            imageFileId: rawImg_DBId,
            thumbnailFileId: thumbnailImg_DBId,
            orderIndex: formData.orderIndex || (project.gallery?.[0]?.orderIndex || 0) + 1,
        },
    });

    return { data: { success: true, message: "Added the new gallery image" }, status: HTTP_STATUS.OK };
}

export async function removeGalleryImage(projectId: string, userSession: UserSessionData, galleryItemId: string) {
    const project = await GetProject_Details(projectId);
    if (!project?.id) return notFoundResponseData();

    const galleryItem = project.gallery.find((item) => item.id === galleryItemId);
    if (!galleryItem) return notFoundResponseData();

    const currMember = getCurrMember(userSession.id, project.team.members, project.organisation?.team.members || []);
    if (
        !doesMemberHaveAccess(
            ProjectPermission.EDIT_DETAILS,
            currMember?.permissions as ProjectPermission[],
            currMember?.isOwner,
            userSession.role,
        )
    ) {
        return unauthorizedReqResponseData();
    }

    // Delete gallery item from database
    await DeleteGalleryItem({
        where: { id: galleryItemId },
    });

    const filesToDelete = [galleryItem.imageFileId];
    if (galleryItem.thumbnailFileId) filesToDelete.push(galleryItem.thumbnailFileId);

    for (const fileId of filesToDelete) {
        // Delete the file from database
        const deletedDbFile = await DeleteFile_ByID(fileId);

        // Delete the file from storage
        await deleteProjectGalleryFile(
            deletedDbFile.storageService as FILE_STORAGE_SERVICE,
            project.id,
            deletedDbFile.name,
        );
    }

    return { data: { success: true, message: "Gallery image deleted" }, status: HTTP_STATUS.OK };
}

export async function updateGalleryImage(
    projectId: string,
    userSession: UserSessionData,
    galleryItemId: string,
    formData: z.infer<typeof updateGalleryImageFormSchema>,
) {
    const project = await GetProject_Details(projectId);
    if (!project?.id) return notFoundResponseData();

    // Check if the order index is not already occupied
    for (const item of project.gallery) {
        if (item.id === galleryItemId) continue;
        if (item.id !== galleryItemId && item.orderIndex === formData.orderIndex) {
            return invalidRequestResponseData("An image with same order index already exists");
        }
    }

    const memberObj = getCurrMember(userSession.id, project.team.members, project.organisation?.team.members || []);
    if (
        !doesMemberHaveAccess(
            ProjectPermission.EDIT_DETAILS,
            memberObj?.permissions as ProjectPermission[],
            memberObj?.isOwner,
            userSession.role,
        )
    ) {
        return notFoundResponseData();
    }

    // Check if there's already a featured image
    if (formData.featured === true) {
        const ExistingFeaturedImage = project.gallery.some(
            (item) => item.featured === true && item.id !== galleryItemId,
        );
        if (ExistingFeaturedImage) return invalidRequestResponseData("A featured gallery image already exists");
    }

    await UpdateGalleryItem({
        where: {
            id: galleryItemId,
            projectId: project.id,
        },
        data: {
            name: formData.title,
            description: formData.description || "",
            orderIndex: formData.orderIndex,
            featured: formData.featured,
        },
    });

    return { data: { success: true, message: "Image updated" }, status: HTTP_STATUS.OK };
}

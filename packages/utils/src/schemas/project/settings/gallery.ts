import { z } from "zod/v4";
import { MAX_GALLERY_DESCRIPTION_LENGTH, MAX_GALLERY_TITLE_LENGTH, MAX_PROJECT_GALLERY_IMAGE_SIZE } from "~/constants";
import { getFileType } from "~/convertors";
import { fileMaxSize_ErrMsg } from "~/schemas/utils";
import { isImageFile } from "~/schemas/validation";

export const addNewGalleryImageFormSchema = z.object({
    image: z
        .file()
        .max(MAX_PROJECT_GALLERY_IMAGE_SIZE, fileMaxSize_ErrMsg(MAX_PROJECT_GALLERY_IMAGE_SIZE))
        .refine(
            async (file) => {
                const type = await getFileType(file);
                return isImageFile(type);
            },
            { error: "Invalid file type! Only image files allowed" },
        ),

    title: z.string().min(2).max(MAX_GALLERY_TITLE_LENGTH),
    description: z.string().max(256).nullable(),
    orderIndex: z.number().min(0).max(MAX_GALLERY_DESCRIPTION_LENGTH),
    featured: z.boolean(),
});

export const updateGalleryImageFormSchema = z.object({
    title: z.string().min(2).max(MAX_GALLERY_TITLE_LENGTH),
    description: z.string().max(256).nullable(),
    orderIndex: z.number().min(0).max(MAX_GALLERY_DESCRIPTION_LENGTH),
    featured: z.boolean(),
});

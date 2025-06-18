import { z } from "zod";
import { MAX_GALLERY_DESCRIPTION_LENGTH, MAX_GALLERY_TITLE_LENGTH, MAX_PROJECT_GALLERY_IMAGE_SIZE } from "~/constants";
import { getFileType } from "~/convertors";
import { isImageFile } from "~/schemas/validation";

export const addNewGalleryImageFormSchema = z.object({
    image: z
        .instanceof(File)
        .refine(
            (file) => {
                if (file instanceof File) {
                    if (file.size > MAX_PROJECT_GALLERY_IMAGE_SIZE) return false;
                }
                return true;
            },
            { message: `Gallery image can only be a maximum of ${MAX_PROJECT_GALLERY_IMAGE_SIZE / 1048576} MiB` },
        )
        .refine(
            async (file) => {
                if (file instanceof File) {
                    const type = await getFileType(file);
                    if (!type || !isImageFile(type)) {
                        return false;
                    }
                }

                return true;
            },
            { message: "Invalid file type! Only image files allowed" },
        ),

    title: z.string().min(2).max(MAX_GALLERY_TITLE_LENGTH),
    description: z.string().max(256).optional(),
    orderIndex: z.number().min(0).max(MAX_GALLERY_DESCRIPTION_LENGTH),
    featured: z.boolean(),
});

export const updateGalleryImageFormSchema = z.object({
    title: z.string().min(2).max(MAX_GALLERY_TITLE_LENGTH),
    description: z.string().max(256).optional(),
    orderIndex: z.number().min(0).max(MAX_GALLERY_DESCRIPTION_LENGTH),
    featured: z.boolean(),
});

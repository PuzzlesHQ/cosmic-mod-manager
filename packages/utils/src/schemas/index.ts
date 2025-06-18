import { z } from "zod";
import { MAX_ICON_SIZE } from "~/constants";
import { getFileType } from "~/convertors";
import { isImageFile } from "./validation";

export { z };

export const iconFieldSchema = z
    .instanceof(File)
    .refine(
        (file) => {
            if (file instanceof File) {
                if (file.size > MAX_ICON_SIZE) return false;
            }
            return true;
        },
        { message: `Icon can only be a maximum of ${MAX_ICON_SIZE / 1024} KiB` },
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
        { message: "Invalid file type, only image files allowed" },
    );

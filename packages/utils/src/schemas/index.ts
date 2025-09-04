import { z } from "zod/v4";
import { MAX_ICON_SIZE } from "~/constants";
import { getFileType } from "~/convertors";
import { isImageFile } from "./validation";

export { z };

export const iconFieldSchema = z
    .file()
    .max(MAX_ICON_SIZE, `Icon can only be a maximum of ${MAX_ICON_SIZE / 1024} KiB`)
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

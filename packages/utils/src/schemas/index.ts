import { z } from "zod/v4";
import { MAX_ICON_SIZE } from "~/constants";
import { getFileType } from "~/convertors";
import { fileMaxSize_ErrMsg, validImgFileExtensions } from "./utils";
import { isImageFile } from "./validation";

export { z };

export const iconFieldSchema = z
    .file()
    .max(MAX_ICON_SIZE, fileMaxSize_ErrMsg(MAX_ICON_SIZE))
    .refine(
        async (file) => {
            const type = await getFileType(file);
            if (!type || !isImageFile(type)) return false;

            return true;
        },
        { error: `Invalid file type! Allowed files: ${validImgFileExtensions.join(", ")}` },
    );

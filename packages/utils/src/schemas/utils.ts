import z from "zod/v4";
import { parseFileSize } from "~/number";

export async function zodParse<T extends z.Schema, K>(schema: T, data: unknown, params?: K) {
    const parsedData = await schema.safeParseAsync(data, params);

    if (parsedData.success) {
        return { data: parsedData.data, error: null };
    } else {
        const error = parsedData.error;
        const errorMsg = error?.issues?.[0]?.message;
        const errorPath = error?.issues?.[0]?.path?.[0];
        return {
            data: null,
            error: errorMsg && (errorPath as string) ? `[${String(errorPath)}] ${errorMsg}` : z.prettifyError(error),
        };
    }
}

export function fileMaxSize_ErrMsg(size_bytes: number) {
    return `Too big: expected file to be less than ${parseFileSize(size_bytes)}`;
}

export function mustBeURLSafe(fieldName?: string) {
    return `${fieldName || "String"} must be URL-safe (no spaces, special characters, etc.)`;
}

export const validImgFileExtensions = [".jpg", ".jpeg", ".png", ".apng", ".gif", ".webp"];
export const validVideoFileExtensions = [".mp4", ".webm", ".mkv"];

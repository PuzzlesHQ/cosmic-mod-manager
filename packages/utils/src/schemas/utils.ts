import type z from "zod/v4";
import { parseFileSize } from "~/number";

export async function zodParse<T extends z.Schema, K>(schema: T, data: unknown, params?: K) {
    try {
        const parsedData = (await schema.parseAsync(data, params)) as z.infer<typeof schema>;
        return { data: parsedData, error: null };
    } catch (error) {
        const errorMsg = error?.issues?.[0]?.message;
        const errorPath = error?.issues?.[0]?.path?.[0];
        return {
            data: null,
            error: errorMsg && (errorPath as string) ? `${errorPath}: ${errorMsg}` : (error as string),
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

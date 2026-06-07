import { rm } from "node:fs/promises";
import { LOCAL_BASE_STORAGE_PATH } from "./utils";

export type WritableFile = File | Blob | NodeJS.TypedArray | ArrayBufferLike | string;

export async function doesPathExist(path: string) {
    try {
        return await Bun.file(`${LOCAL_BASE_STORAGE_PATH}/${path}`).exists();
    } catch {
        return false;
    }
}

export async function saveFileToLocalStorage(path: string, file: WritableFile) {
    try {
        await Bun.write(`${LOCAL_BASE_STORAGE_PATH}/${path}`, file);
        return path;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getFileFromLocalStorage(path: string) {
    try {
        const file = Bun.file(`${LOCAL_BASE_STORAGE_PATH}/${path}`);
        return file;
    } catch {
        return null;
    }
}

export async function deleteFromLocalStorage(path: string) {
    try {
        await rm(`${LOCAL_BASE_STORAGE_PATH}/${path}`, { recursive: true, force: true });
        return path;
    } catch (error) {
        console.error(error);
        return null;
    }
}

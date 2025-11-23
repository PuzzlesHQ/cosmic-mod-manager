import type { File as DBFile } from "@prisma-client";
import { GetManyFiles_ByID } from "~/db/file_item";

export async function getFilesFromId(fileIds: string[]) {
    const data = await GetManyFiles_ByID(fileIds);

    const map = new Map<string, DBFile>();
    for (const file of data) {
        if (!file) continue;
        map.set(file.id, file);
    }

    return map;
}

import type { Prisma } from "@prisma-client";
import { cacheKey } from "~/services/cache/utils";
import prisma from "~/services/prisma";
import valkey from "~/services/redis";
import { FILE_ITEM_CACHE_KEY } from "~/types/namespaces";
import { FILE_ITEM_EXPIRY_seconds, GetData_FromCache, SetCache } from "./_cache";

export type GetFile_ReturnType = Awaited<ReturnType<typeof GetFile_FromDb>>;
function GetFile_FromDb(id: string) {
    return prisma.file.findUnique({
        where: { id: id },
    });
}

export async function GetFile(id: string) {
    const cachedData = await GetData_FromCache<GetFile_ReturnType>(FILE_ITEM_CACHE_KEY, id);
    if (cachedData) return cachedData;

    const data = await GetFile_FromDb(id);
    if (data) await Set_FileCache(id, data);

    return data;
}

export function GetManyFiles<T extends Prisma.FileFindManyArgs>(args: Prisma.SelectSubset<T, Prisma.FileFindManyArgs>) {
    return prisma.file.findMany(args);
}

export async function GetManyFiles_ByID(ids: string[]) {
    const FileIds = Array.from(new Set(ids));
    const Files = [];

    // Get cached files from redis
    const FileIds_RetrievedFromCache: string[] = [];
    {
        const _cachedFiles_promises: Promise<GetFile_ReturnType>[] = [];
        for (const id of FileIds) {
            const cachedData = GetData_FromCache<GetFile_ReturnType>(FILE_ITEM_CACHE_KEY, id);
            _cachedFiles_promises.push(cachedData);
        }

        const _cachedFiles = await Promise.all(_cachedFiles_promises);
        for (const file of _cachedFiles) {
            if (!file) continue;
            FileIds_RetrievedFromCache.push(file.id);
            Files.push(file);
        }
    }

    // Get remaining files from db
    const FileIds_ToRetrieveFromDb = FileIds.filter((id) => !FileIds_RetrievedFromCache.includes(id));
    const _DB_Files =
        FileIds_ToRetrieveFromDb.length > 0
            ? await prisma.file.findMany({
                  where: { id: { in: FileIds_ToRetrieveFromDb } },
              })
            : [];

    // Set cache for remaining files
    {
        const _setCache_promises = [];
        for (const file of _DB_Files) {
            const setCache = Set_FileCache(file.id, file);
            _setCache_promises.push(setCache);
            Files.push(file);
        }

        await Promise.all(_setCache_promises);
    }

    return Files;
}

export async function CreateFile<T extends Prisma.FileCreateArgs>(args: Prisma.SelectSubset<T, Prisma.FileCreateArgs>) {
    const data = await prisma.file.create(args);
    if (data?.id) await Set_FileCache(data.id, data);

    return data;
}

export async function CreateManyFiles<T extends Prisma.FileCreateManyAndReturnArgs>(
    args: Prisma.SelectSubset<T, Prisma.FileCreateManyAndReturnArgs>,
) {
    const createdFiles = await prisma.file.createManyAndReturn(args);
    {
        const _setCache_promises = [];
        for (const file of createdFiles) {
            const setCache = Set_FileCache(file.id, file);
            _setCache_promises.push(setCache);
        }

        await Promise.all(_setCache_promises);
    }

    return createdFiles;
}

// Update and delete fns
export async function UpdateFile<T extends Prisma.FileUpdateArgs>(args: Prisma.SelectSubset<T, Prisma.FileUpdateArgs>) {
    const data = await prisma.file.update(args);
    if (data?.id) await Delete_FileCache(data.id);

    return data;
}

export async function DeleteFile_ByID(id: string) {
    const data = await prisma.file.delete({ where: { id: id } });
    if (data?.id) await Delete_FileCache(id);

    return data;
}

export async function DeleteManyFiles_ByID(ids: string[]) {
    const data = await prisma.file.deleteMany({ where: { id: { in: ids } } });
    {
        const _deleteCache_promises = [];
        for (const id of ids) {
            const deleteCache = Delete_FileCache(id);
            _deleteCache_promises.push(deleteCache);
        }

        await Promise.all(_deleteCache_promises);
    }

    return data;
}

// Cache functions
async function Set_FileCache(id: string, data: GetFile_ReturnType) {
    await SetCache(FILE_ITEM_CACHE_KEY, id, JSON.stringify(data), FILE_ITEM_EXPIRY_seconds);
}

async function Delete_FileCache(id: string) {
    await valkey.del(cacheKey(id, FILE_ITEM_CACHE_KEY));
}

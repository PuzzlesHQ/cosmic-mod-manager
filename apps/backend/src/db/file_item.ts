import type { Prisma } from "@prisma-client";
import prisma from "~/services/prisma";
import { FILE_ITEM_CACHE_KEY } from "~/types/namespaces";
import { cacheKey, DeleteCache, FILE_ITEM_EXPIRY_seconds, GetData_FromCache, SetCache } from "./_cache";

type TFileFromDB = Awaited<ReturnType<typeof GetFile_FromDb>>;
function GetFile_FromDb(id: string) {
    return prisma.file.findUnique({
        where: { id: id },
    });
}

export type TFile = TFileFromDB;
export async function GetFile(id: string): Promise<TFile> {
    const cachedData = await GetData_FromCache<TFileFromDB>(FILE_ITEM_CACHE_KEY, id);
    if (cachedData) return cachedData;

    const data = await GetFile_FromDb(id);
    if (data) await Set_FileCache(id, data);

    return data;
}

export type TManyFiles = TFile[];
export async function GetManyFiles_ByID(fileIds: string[]): Promise<TManyFiles> {
    const uniqueFileIds = Array.from(new Set(fileIds));
    const files: TManyFiles = [];

    // Get cached files from redis
    const filesFromCache: string[] = [];
    {
        const promises: Promise<TFileFromDB>[] = [];
        for (const id of uniqueFileIds) {
            const cachedData = GetData_FromCache<TFileFromDB>(FILE_ITEM_CACHE_KEY, id);
            promises.push(cachedData);
        }

        for (const file of await Promise.all(promises)) {
            if (!file) continue;
            filesFromCache.push(file.id);
            files.push(file);
        }
    }

    // Get remaining files from db
    const remainingFileIds = uniqueFileIds.filter((id) => !filesFromCache.includes(id));
    const remainingFiles =
        remainingFileIds.length > 0
            ? await prisma.file.findMany({
                  where: { id: { in: remainingFileIds } },
              })
            : [];

    // Set cache for remaining files
    {
        const promises = [];
        for (const file of remainingFiles) {
            const setCache = Set_FileCache(file.id, file);
            promises.push(setCache);
            files.push(file);
        }

        await Promise.all(promises);
    }

    return files;
}

export function GetManyFiles<T extends Prisma.FileFindManyArgs>(args: Prisma.SelectSubset<T, Prisma.FileFindManyArgs>) {
    return prisma.file.findMany(args);
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
        const promises = [];
        for (const file of createdFiles) {
            const setCache = Set_FileCache(file.id, file);
            promises.push(setCache);
        }

        await Promise.all(promises);
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
        const promises = [];
        for (const id of ids) {
            const deleteCache = Delete_FileCache(id);
            promises.push(deleteCache);
        }

        await Promise.all(promises);
    }

    return data;
}

// Cache functions
async function Set_FileCache(id: string, data: TFileFromDB) {
    await SetCache(FILE_ITEM_CACHE_KEY, id, JSON.stringify(data), FILE_ITEM_EXPIRY_seconds);
}

async function Delete_FileCache(id: string) {
    await DeleteCache(cacheKey(id, FILE_ITEM_CACHE_KEY));
}

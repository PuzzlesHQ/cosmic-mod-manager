import type { Prisma } from "@prisma-client";
import prisma from "~/services/prisma";
import valkey from "~/services/redis";
import { COLLECTION_DATA_CACHE_KEY, USER_COLLECTIONS_LIST_CACHE_KEY } from "~/types/namespaces";
import { COLLECTION_CACHE_EXPIRY_seconds, cacheKey, GetData_FromCache, SetCache } from "./_cache";

const COLLECTION_SELECT_FIELDS = {
    id: true,
    userId: true,
    name: true,
    description: true,
    iconFileId: true,
    visibility: true,
    dateCreated: true,
    dateUpdated: true,
    projects: true,
} satisfies Prisma.CollectionSelect;

type TCollectionFromDB = Awaited<ReturnType<typeof GetCollectionFromDB>>;
function GetCollectionFromDB(id: string) {
    return prisma.collection.findUnique({
        where: {
            id: id,
        },
        select: COLLECTION_SELECT_FIELDS,
    });
}

export type TCollection = NonNullable<TCollectionFromDB>;
export async function GetCollection(id: string): Promise<TCollection | null> {
    const cached = await GetData_FromCache<TCollectionFromDB>(COLLECTION_DATA_CACHE_KEY, id);
    if (cached) return cached;

    const data = await GetCollectionFromDB(id);
    await SetCollectionCache(data);
    return data;
}

export type TManyCollections = TCollection[];
export async function GetManyCollections_ById(idsList: string[]): Promise<TManyCollections> {
    const uniqueIds = Array.from(new Set(idsList));
    const collections: TManyCollections = [];

    // Get cached items
    const collectionsFromCache: string[] = [];
    {
        const promises = [];
        for (const id of uniqueIds) {
            const cachedCollection = GetData_FromCache<TCollectionFromDB>(COLLECTION_DATA_CACHE_KEY, id);
            promises.push(cachedCollection);
        }

        for (const collection of await Promise.all(promises)) {
            if (!collection?.id) continue;

            collectionsFromCache.push(collection.id);
            collections.push(collection);
        }
    }

    // Get missing items
    const remainingToFetch = uniqueIds.filter((id) => !collectionsFromCache.includes(id));
    // If there are no missing items, just return
    if (!remainingToFetch.length) return collections;

    const remainingCollections = await prisma.collection.findMany({
        where: {
            id: {
                in: remainingToFetch,
            },
        },
    });

    // Cache missing items
    {
        const promises = [];
        for (const collection of remainingCollections) {
            promises.push(SetCollectionCache(collection));
            collections.push(collection);
        }

        await Promise.all(promises);
    }

    return collections;
}

export async function GetCollections_ByUserId(userId: string) {
    const collections = await GetData_FromCache<string[]>(USER_COLLECTIONS_LIST_CACHE_KEY, userId);
    if (collections) return collections;

    const userCollections = await prisma.collection.findMany({
        where: {
            userId: userId,
        },
    });

    const collectionIds = userCollections.map((collection) => collection.id);
    await Set_UserCollectionsListCache(userId, collectionIds);
    return collectionIds;
}

export async function CreateCollection<T extends Prisma.CollectionCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.CollectionCreateArgs>,
) {
    const collection = await prisma.collection.create(args);
    await Delete_UserCollectionsListCache(collection.userId);

    return collection;
}

export async function UpdateCollection<T extends Prisma.CollectionUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.CollectionUpdateArgs>,
) {
    const data = await prisma.collection.update(args);
    await Delete_CollectionCache(data.id);
    return data;
}

export async function GetManyCollections<T extends Prisma.CollectionFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.CollectionFindManyArgs>,
) {
    return prisma.collection.findMany(args);
}

export async function DeleteCollection<T extends Prisma.CollectionDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.CollectionDeleteArgs>,
) {
    const collection = await prisma.collection.delete(args);
    await Delete_CollectionCache(collection.id);
    await Delete_UserCollectionsListCache(collection.userId);
    return collection;
}

export async function DeleteManyCollections_ByUserId(userId: string) {
    const collectionIds = await GetCollections_ByUserId(userId);
    if (!collectionIds) return [];

    await Promise.all([
        Delete_UserCollectionsListCache(userId),
        ...collectionIds.map((id) => Delete_CollectionCache(id)),
    ]);
    await prisma.collection.deleteMany({
        where: {
            userId: userId,
        },
    });

    return collectionIds;
}

// Cache things
interface SetCache_Data {
    id: string;
}

async function SetCollectionCache<T extends SetCache_Data | null>(data: T) {
    if (!data?.id) return;

    const jsonStr = JSON.stringify(data);
    await SetCache(COLLECTION_DATA_CACHE_KEY, data.id, jsonStr, COLLECTION_CACHE_EXPIRY_seconds);
}

export async function Delete_CollectionCache(id: string) {
    return await valkey.del(cacheKey(id, COLLECTION_DATA_CACHE_KEY));
}

async function Set_UserCollectionsListCache(userId: string, collections: string[]) {
    const jsonStr = JSON.stringify(collections);
    await SetCache(USER_COLLECTIONS_LIST_CACHE_KEY, userId, jsonStr, COLLECTION_CACHE_EXPIRY_seconds);
}

export async function Delete_UserCollectionsListCache(userId: string) {
    return await valkey.del(cacheKey(userId, USER_COLLECTIONS_LIST_CACHE_KEY));
}

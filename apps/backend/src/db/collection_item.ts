import type { Prisma } from "@prisma-client";
import { cacheKey } from "~/services/cache/utils";
import prisma from "~/services/prisma";
import valkey from "~/services/redis";
import { COLLECTION_DATA_CACHE_KEY, USER_COLLECTIONS_LIST_CACHE_KEY } from "~/types/namespaces";
import { COLLECTION_CACHE_EXPIRY_seconds, GetData_FromCache, SetCache } from "./_cache";

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

export type GetCollection_ReturnType = Awaited<ReturnType<typeof GetCollection_FromDb>>;
function GetCollection_FromDb(id: string) {
    return prisma.collection.findUnique({
        where: {
            id: id,
        },
        select: COLLECTION_SELECT_FIELDS,
    });
}

export async function GetCollection(id: string) {
    const cached_data = await GetData_FromCache<GetCollection_ReturnType>(COLLECTION_DATA_CACHE_KEY, id);
    if (cached_data) return cached_data;

    const data = await GetCollection_FromDb(id);
    await Set_CollectionCache(data);
    return data;
}

export async function GetManyCollections_ById(ids: string[]) {
    const CollectionIds = Array.from(new Set(ids));
    const Collections = [];

    // Get cached items
    const Collections_RetrievedFromCache: string[] = [];
    {
        const _CacheCollection_Promises = [];
        for (const id of CollectionIds) {
            const cachedCollection = GetData_FromCache<GetCollection_ReturnType>(COLLECTION_DATA_CACHE_KEY, id);
            _CacheCollection_Promises.push(cachedCollection);
        }

        const _CachedCollections = await Promise.all(_CacheCollection_Promises);
        for (const collection of _CachedCollections) {
            if (!collection?.id) continue;

            Collections_RetrievedFromCache.push(collection.id);
            Collections.push(collection);
        }
    }

    // Get missing items
    const CollectionIds_ToFetch = CollectionIds.filter((id) => !Collections_RetrievedFromCache.includes(id));
    // If there are no missing items, just return
    if (!CollectionIds_ToFetch.length) return Collections;

    const _RemainingCollections = await prisma.collection.findMany({
        where: {
            id: {
                in: CollectionIds_ToFetch,
            },
        },
    });

    // Cache missing items
    {
        const _Set_CollectionCache_Promises = [];
        for (const collection of _RemainingCollections) {
            _Set_CollectionCache_Promises.push(Set_CollectionCache(collection));
            Collections.push(collection);
        }

        await Promise.all(_Set_CollectionCache_Promises);
    }

    return Collections;
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
    const collection_ids = await GetCollections_ByUserId(userId);
    if (!collection_ids) return [];

    await Promise.all([
        Delete_UserCollectionsListCache(userId),
        ...collection_ids.map((id) => Delete_CollectionCache(id)),
    ]);
    await prisma.collection.deleteMany({
        where: {
            userId: userId,
        },
    });

    return collection_ids;
}

// export function DeleteManyCollections<T extends Prisma.CollectionDeleteManyArgs>(
//     args: Prisma.SelectSubset<T, Prisma.CollectionDeleteManyArgs>,
// ) {
//     return prisma.collection.deleteMany(args);
// }

// Cache things
interface SetCache_Data {
    id: string;
}

async function Set_CollectionCache<T extends SetCache_Data | null>(data: T) {
    if (!data?.id) return;

    const json_string = JSON.stringify(data);
    await SetCache(COLLECTION_DATA_CACHE_KEY, data.id, json_string, COLLECTION_CACHE_EXPIRY_seconds);
}

export async function Delete_CollectionCache(id: string) {
    return await valkey.del(cacheKey(id, COLLECTION_DATA_CACHE_KEY));
}

async function Set_UserCollectionsListCache(userId: string, collections: string[]) {
    const json_string = JSON.stringify(collections);
    await SetCache(USER_COLLECTIONS_LIST_CACHE_KEY, userId, json_string, COLLECTION_CACHE_EXPIRY_seconds);
}

export async function Delete_UserCollectionsListCache(userId: string) {
    return await valkey.del(cacheKey(userId, USER_COLLECTIONS_LIST_CACHE_KEY));
}

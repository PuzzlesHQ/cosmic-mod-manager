import type { Prisma } from "@prisma-client";
import prisma from "~/services/prisma";
import { PAT_CACHE_KEY as PAT_DATA_CACHE_KEY, PAT_ID_TO_HASH_CACHE_KEY, USER_PATs_CACHE_KEY } from "~/types/namespaces";
import { cacheKey, DeleteCache, GetData_FromCache, PAT_CACHE_EXPIRY_seconds, SetCache } from "./_cache";

type TPatFromDB = Awaited<ReturnType<typeof GetPAT_FromDb>>;
async function GetPAT_FromDb(tokenHash: string) {
    try {
        return await prisma.personalAccessToken.update({
            where: {
                tokenHash: tokenHash,
            },
            data: {
                dateLastUsed: new Date(),
            },
        });
    } catch {
        return null;
    }
}

export type TPat = TPatFromDB;
export async function GetPAT(tokenHash: string): Promise<TPat> {
    const cachedPat = await getPAT_FromCache(tokenHash);
    if (cachedPat) return cachedPat;

    const pat = await GetPAT_FromDb(tokenHash);
    if (pat) await setPAT_Cache(pat);
    return pat;
}

type TManyPATsFromDB = Awaited<ReturnType<typeof GetPATs_ByUserID_FromDb>>;
function GetPATs_ByUserID_FromDb(userId: string) {
    return prisma.personalAccessToken.findMany({
        where: { userId: userId },
        orderBy: { dateCreated: "desc" },
    });
}

export async function GetManyPATs_ByUserID(userId: string): Promise<TManyPATs> {
    const cachedPATs = await GetData_FromCache<string[]>(USER_PATs_CACHE_KEY, userId);
    if (cachedPATs) {
        return await GetManyPATs_ByIDs(cachedPATs);
    }

    const PATs = await GetPATs_ByUserID_FromDb(userId);
    await SetCache(USER_PATs_CACHE_KEY, userId, JSON.stringify(PATs.map((pat) => pat.id)), PAT_CACHE_EXPIRY_seconds);

    return PATs;
}

export type TManyPATs = TManyPATsFromDB;
export async function GetManyPATs_ByIDs(ids: string[]): Promise<TManyPATs> {
    const uniquePatIds = Array.from(new Set(ids));
    if (uniquePatIds.length === 0) return [];
    const PATs = [];

    const patsFromCache: string[] = [];
    {
        const promises: Promise<TPatFromDB>[] = [];
        for (const id of uniquePatIds) {
            const cachedPAT = getPAT_FromCache(id);
            promises.push(cachedPAT);
        }

        for (const pat of await Promise.all(promises)) {
            if (!pat) continue;
            patsFromCache.push(pat.id);
            PATs.push(pat);
        }
    }

    const remainingPATIds = uniquePatIds.filter((id) => !patsFromCache.includes(id));
    if (remainingPATIds.length > 0) {
        const remainingPATs = await prisma.personalAccessToken.findMany({
            where: { id: { in: remainingPATIds } },
        });

        const promises = [];
        for (const pat of remainingPATs) {
            if (!pat) continue;
            PATs.push(pat);
            promises.push(setPAT_Cache(pat));
        }
        await Promise.all(promises);
    }

    return PATs.sort((a, b) => {
        return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
    });
}

export async function GetPAT_ById(id: string): Promise<TPat> {
    const cachedPat = await getPAT_FromCache(id);
    if (cachedPat) return cachedPat;

    const pat = await prisma.personalAccessToken.findUnique({
        where: { id: id },
    });
    if (pat) await setPAT_Cache(pat);
    return pat;
}

export async function CreatePAT<T extends Prisma.PersonalAccessTokenCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.PersonalAccessTokenCreateArgs>,
) {
    const patData = await prisma.personalAccessToken.create(args);
    if (patData) await setPAT_Cache(patData);
    await DeleteCache(cacheKey(patData.userId, USER_PATs_CACHE_KEY));

    return patData;
}

export async function UpdatePAT<T extends Prisma.PersonalAccessTokenUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.PersonalAccessTokenUpdateArgs>,
) {
    const updatedPAT = await prisma.personalAccessToken.update(args);
    if (updatedPAT) await deletePAT_Cache(updatedPAT.id, updatedPAT.tokenHash);

    return updatedPAT;
}

export async function DeletePAT<T extends Prisma.PersonalAccessTokenDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.PersonalAccessTokenDeleteArgs>,
) {
    const deletedPAT = await prisma.personalAccessToken.delete(args);
    if (deletedPAT) await deletePAT_Cache(deletedPAT.id, deletedPAT.tokenHash);
    await DeleteCache(cacheKey(deletedPAT.userId, USER_PATs_CACHE_KEY));

    return deletedPAT;
}

// ? Cache helpers

// key can be either `tokenHash` or `id`
async function getPAT_FromCache(key: string) {
    type CachedReturnType = (Omit<NonNullable<TPatFromDB>, "scopes"> & { scopes: string }) | null;

    const cachedPAT = await GetData_FromCache<CachedReturnType>(PAT_DATA_CACHE_KEY, key);
    if (!cachedPAT) return null;

    return {
        ...cachedPAT,
        scopes: BigInt(cachedPAT.scopes), // JSON.parse can't deal with BigInt
    };
}

// need to do this chain shit just so it can have two keys (kinda) pointing to the same data
async function setPAT_Cache(pat: NonNullable<TPatFromDB>) {
    // ID -> tokenHash
    await SetCache(PAT_ID_TO_HASH_CACHE_KEY, pat.id, pat.tokenHash, PAT_CACHE_EXPIRY_seconds);

    // tokenHash -> PAT data
    await SetCache(
        PAT_DATA_CACHE_KEY,
        pat.tokenHash,
        JSON.stringify({
            ...pat,
            scopes: pat.scopes.toString(), // JSON.stringify can't deal with BigInt
        }),
        PAT_CACHE_EXPIRY_seconds,
    );
}

async function deletePAT_Cache(id: string, tokenHash: string) {
    await DeleteCache(cacheKey(id, PAT_ID_TO_HASH_CACHE_KEY), cacheKey(tokenHash, PAT_DATA_CACHE_KEY));
}

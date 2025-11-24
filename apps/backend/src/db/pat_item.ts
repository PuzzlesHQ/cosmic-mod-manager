import type { Prisma } from "@prisma-client";
import { cacheKey } from "~/services/cache/utils";
import prisma from "~/services/prisma";
import { PAT_CACHE_KEY as PAT_DATA_CACHE_KEY, PAT_ID_TO_HASH_CACHE_KEY, USER_PATs_CACHE_KEY } from "~/types/namespaces";
import { DeleteCache, GetData_FromCache, PAT_CACHE_EXPIRY_seconds, SetCache } from "./_cache";

export type GetPAT_ReturnType = Awaited<ReturnType<typeof GetPAT_FromDb>>;
function GetPAT_FromDb(tokenHash: string) {
    return prisma.personalAccessToken.findFirst({
        where: { tokenHash: tokenHash },
    });
}

export async function GetPAT(tokenHash: string): Promise<GetPAT_ReturnType> {
    let pat = await getPAT_FromCache(tokenHash);

    if (!pat) {
        pat = await GetPAT_FromDb(tokenHash);
        if (pat) await setPAT_Cache(pat);
    }

    // Update last used date if not used in the last 5 minutes; this is to prevent excessive writes
    if (pat && (!pat?.dateLastUsed || Date.now() - new Date(pat.dateLastUsed).getTime() > 300_000)) {
        await UpdatePAT({
            where: { id: pat.id },
            data: { dateLastUsed: new Date() },
        });
    }

    return pat;
}

export type GetPATs_ReturnType = Awaited<ReturnType<typeof GetPATs_ByUserID_FromDb>>;
function GetPATs_ByUserID_FromDb(userId: string) {
    return prisma.personalAccessToken.findMany({
        where: { userId: userId },
        orderBy: { dateCreated: "desc" },
    });
}

export async function GetManyPATs_ByUserID(userId: string): Promise<GetPATs_ReturnType> {
    const cachedPATs = await GetData_FromCache<string[]>(USER_PATs_CACHE_KEY, userId);
    if (cachedPATs) {
        return await GetManyPATs_ByIDs(cachedPATs);
    }

    const PATs = await GetPATs_ByUserID_FromDb(userId);
    await SetCache(USER_PATs_CACHE_KEY, userId, JSON.stringify(PATs.map((pat) => pat.id)), PAT_CACHE_EXPIRY_seconds);

    return PATs;
}

export async function GetManyPATs_ByIDs(ids: string[]) {
    if (ids.length === 0) return [];
    const PATs = [];

    const PAts_retrievedFromCache: string[] = [];
    {
        const _cachedPATs_promises: Promise<GetPAT_ReturnType>[] = [];
        for (const id of ids) {
            const cachedPAT = getPAT_FromCache(id);
            _cachedPATs_promises.push(cachedPAT);
        }

        const _cachedPATs = await Promise.all(_cachedPATs_promises);
        for (const pat of _cachedPATs) {
            if (!pat) continue;
            PAts_retrievedFromCache.push(pat.id);
            PATs.push(pat);
        }
    }

    const PATs_toRetrieveFromDb_ids = ids.filter((id) => !PAts_retrievedFromCache.includes(id));
    if (PATs_toRetrieveFromDb_ids.length > 0) {
        const _DB_PATs = await prisma.personalAccessToken.findMany({
            where: { id: { in: PATs_toRetrieveFromDb_ids } },
        });

        const _setCache_promises = [];
        for (const pat of _DB_PATs) {
            if (!pat) continue;
            PATs.push(pat);
            _setCache_promises.push(setPAT_Cache(pat));
        }
        await Promise.all(_setCache_promises);
    }

    return PATs.sort((a, b) => {
        return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
    });
}

export async function GetPAT_ById(id: string): Promise<GetPAT_ReturnType> {
    const pat = await getPAT_FromCache(id);
    if (pat) return pat;

    const dbPat = await prisma.personalAccessToken.findUnique({
        where: { id: id },
    });
    if (dbPat) await setPAT_Cache(dbPat);
    return dbPat;
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
    type CachedReturnType = (Omit<NonNullable<GetPAT_ReturnType>, "scopes"> & { scopes: string }) | null;

    const cachedPAT = await GetData_FromCache<CachedReturnType>(PAT_DATA_CACHE_KEY, key);
    if (!cachedPAT) return null;

    return {
        ...cachedPAT,
        scopes: BigInt(cachedPAT.scopes), // JSON.parse can't deal with BigInt
    };
}

// need to do this chain shit just so it can have two keys (kinda) pointing to the same data
async function setPAT_Cache(pat: NonNullable<GetPAT_ReturnType>) {
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

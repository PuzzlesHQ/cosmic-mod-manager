import type { Prisma } from "@prisma-client";
import { cacheKey } from "~/services/cache/utils";
import prisma from "~/services/prisma";
import { USER_SESSION_CACHE_KEY } from "~/types/namespaces";
import { DeleteCache, GetData_FromCache } from "./_cache";

export type GetSession_ReturnType = Awaited<ReturnType<typeof GetSession_ByTokenHash_FromDb>>;
function GetSession_ByTokenHash_FromDb(tokenHash: string) {
    return prisma.session.findUnique({
        where: { tokenHash: tokenHash },
    });
}

export async function GetSession_ByTokenHash(tokenHash: string) {
    const cachedSession = await GetData_FromCache<GetSession_ReturnType>(USER_SESSION_CACHE_KEY, tokenHash);
    if (cachedSession) return cachedSession;

    const session = await GetSession_ByTokenHash_FromDb(tokenHash);
    return session;
}

export function GetSession<T extends Prisma.SessionFindFirstArgs>(args: Prisma.SelectSubset<T, Prisma.SessionFindFirstArgs>) {
    return prisma.session.findFirst(args);
}

export function GetManySessions<T extends Prisma.SessionFindManyArgs>(args: Prisma.SelectSubset<T, Prisma.SessionFindManyArgs>) {
    return prisma.session.findMany(args);
}

export function CreateSession<T extends Prisma.SessionCreateArgs>(args: Prisma.SelectSubset<T, Prisma.SessionCreateArgs>) {
    return prisma.session.create(args);
}

export async function UpdateSession<T extends Prisma.SessionUpdateArgs>(args: Prisma.SelectSubset<T, Prisma.SessionUpdateArgs>) {
    const session = await prisma.session.update(args);
    await DeleteCache(cacheKey(session.tokenHash, USER_SESSION_CACHE_KEY));
    return session;
}

export async function DeleteSession<T extends Prisma.SessionDeleteArgs>(args: Prisma.SelectSubset<T, Prisma.SessionDeleteArgs>) {
    const session = await prisma.session.delete(args);
    await DeleteCache(cacheKey(session.tokenHash, USER_SESSION_CACHE_KEY));
    return session;
}

export async function DeleteManySessions<T extends Prisma.SessionDeleteManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.SessionDeleteManyArgs>,
    tokenHashes: string[],
) {
    await DeleteCache(...tokenHashes.map((tokenHash) => cacheKey(tokenHash, USER_SESSION_CACHE_KEY)));
    return await prisma.session.deleteMany(args);
}

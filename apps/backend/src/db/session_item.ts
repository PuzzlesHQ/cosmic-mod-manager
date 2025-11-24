import { USER_SESSION_VALIDITY_ms } from "@app/utils/constants";
import type { Prisma } from "@prisma-client";
import { cacheKey } from "~/services/cache/utils";
import prisma from "~/services/prisma";
import { USER_SESSION_CACHE_KEY } from "~/types/namespaces";
import { DeleteCache, GetData_FromCache, SetCache, USER_SESSION_CACHE_EXPIRY_seconds } from "./_cache";

export type GetSession_ReturnType = Awaited<ReturnType<typeof GetSession_ByTokenHash_FromDb>>;
function GetSession_ByTokenHash_FromDb(tokenHash: string) {
    try {
        return prisma.session.update({
            where: { tokenHash: tokenHash },
            data: {
                dateLastActive: new Date(),
            },
        });
    } catch {
        return null;
    }
}

export async function GetSession_ByTokenHash(tokenHash: string): Promise<GetSession_ReturnType> {
    const cachedSession = await GetData_FromCache<GetSession_ReturnType>(USER_SESSION_CACHE_KEY, tokenHash);
    if (cachedSession) return cachedSession;

    const session = await GetSession_ByTokenHash_FromDb(tokenHash);
    if (session) {
        // ? extend session if it's nearing expiry
        const now = Date.now();
        const timeToExpire = session.dateExpires.getTime() - now;

        if (timeToExpire <= 0) {
            await DeleteSession({ where: { id: session.id } });
            return null;
        } else if (timeToExpire < USER_SESSION_VALIDITY_ms / 4) {
            await UpdateSession({
                where: { id: session.id },
                data: {
                    dateExpires: new Date(now + USER_SESSION_VALIDITY_ms),
                },
            });
        }

        await SetCache(USER_SESSION_CACHE_KEY, tokenHash, JSON.stringify(session), USER_SESSION_CACHE_EXPIRY_seconds);
    }
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

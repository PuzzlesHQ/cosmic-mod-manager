import type { Prisma } from "@prisma/client";
import { cacheKey } from "~/services/cache/utils";
import prisma from "~/services/prisma";
import valkey from "~/services/redis";
import { USER_DATA_CACHE_KEY, USER_ORGANIZATIONS_CACHE_KEY, USER_PROJECTS_CACHE_KEY } from "~/types/namespaces";
import { GetData_FromCache, SetCache, USER_DATA_CACHE_EXPIRY_seconds } from "./_cache";

const USER_DATA_SELECT_FIELDS = {
    id: true,
    email: true,
    avatar: true,
    userName: true,
    name: true,
    dateJoined: true,
    emailVerified: true,
    role: true,
    bio: true,
    password: true,
    newSignInAlerts: true,
    followingProjects: true,
} satisfies Prisma.UserSelect;

export type GetUser_ReturnType = Awaited<ReturnType<typeof GetUser_FromDb>>;
async function GetUser_FromDb(userName?: string, id?: string) {
    if (!userName && !id) throw new Error("Either userName or id is required!");

    let data = null;
    // If both id and slug are provided, check if any table matches either one
    if (id && userName) {
        data = await prisma.user.findFirst({
            where: {
                OR: [
                    { id: id },
                    {
                        userName: {
                            equals: userName,
                            mode: "insensitive",
                        },
                    },
                ],
            },
            select: USER_DATA_SELECT_FIELDS,
        });
    } else if (id) {
        data = await prisma.user.findUnique({
            where: {
                id: id,
            },
            select: USER_DATA_SELECT_FIELDS,
        });
    } else {
        data = await prisma.user.findFirst({
            where: {
                userName: {
                    equals: userName,
                    mode: "insensitive",
                },
            },
            select: USER_DATA_SELECT_FIELDS,
        });
    }

    return data;
}

export async function GetUser_ByIdOrUsername(userName?: string, id?: string) {
    if (!userName && !id) throw new Error("Either userName or id is required!");

    const cachedData = await GetData_FromCache<GetUser_ReturnType>(USER_DATA_CACHE_KEY, userName?.toLowerCase() || id);
    if (cachedData) return cachedData;

    const user = await GetUser_FromDb(userName, id);
    if (user) await Set_UserCache(user);

    return user;
}

export async function GetManyUsers_ByIds(ids: string[]) {
    const UserIds = Array.from(new Set(ids));
    const Users = [];

    // Get cached users from redis
    const UserIds_RetrievedFromCache: string[] = [];
    {
        const _cachedUsers_promises: Promise<GetUser_ReturnType | null>[] = [];
        for (const id of UserIds) {
            const cachedUser = GetData_FromCache<GetUser_ReturnType>(USER_DATA_CACHE_KEY, id);
            _cachedUsers_promises.push(cachedUser);
        }

        const _cachedUsers = await Promise.all(_cachedUsers_promises);
        for (const user of _cachedUsers) {
            if (!user) continue;
            UserIds_RetrievedFromCache.push(user.id);
            Users.push(user);
        }
    }

    // Get remaining users from db
    const UserIds_ToFetchFromDb = UserIds.filter((id) => !UserIds_RetrievedFromCache.includes(id));
    const _DB_Users =
        UserIds_ToFetchFromDb.length > 0
            ? await prisma.user.findMany({
                  where: { id: { in: UserIds_ToFetchFromDb } },
              })
            : [];

    // Set cache for remaining users
    {
        const _setCache_promises = [];
        for (const user of _DB_Users) {
            const setCache = Set_UserCache(user);
            _setCache_promises.push(setCache);
            Users.push(user);
        }

        await Promise.all(_setCache_promises);
    }

    return Users;
}

export async function Get_UserProjects(userId: string) {
    const CachedData = await GetData_FromCache<string[]>(USER_PROJECTS_CACHE_KEY, userId);
    if (CachedData) return CachedData;

    const UserProjects = await prisma.project.findMany({
        where: {
            team: {
                members: {
                    some: {
                        userId: userId,
                    },
                },
            },
        },
        select: {
            id: true,
        },
    });

    const ProjectIds = UserProjects.map((project) => project.id);
    await SetCache(USER_PROJECTS_CACHE_KEY, userId, JSON.stringify(ProjectIds), USER_DATA_CACHE_EXPIRY_seconds);
    return ProjectIds;
}

export async function Get_UserOrganizations(userId: string) {
    const CachedData = await GetData_FromCache<string[]>(USER_ORGANIZATIONS_CACHE_KEY, userId);
    if (CachedData) return CachedData;

    const UserOrgs = await prisma.organisation.findMany({
        where: {
            team: {
                members: {
                    some: {
                        userId: userId,
                    },
                },
            },
        },
        select: {
            id: true,
        },
    });
    const UserOrgs_Id = UserOrgs.map((org) => org.id);
    await SetCache(USER_ORGANIZATIONS_CACHE_KEY, userId, JSON.stringify(UserOrgs_Id), USER_DATA_CACHE_EXPIRY_seconds);

    return UserOrgs_Id;
}

export function GetUser_Unique<T extends Prisma.UserFindUniqueArgs>(args: Prisma.SelectSubset<T, Prisma.UserFindUniqueArgs>) {
    return prisma.user.findUnique(args);
}

export function GetUser_First<T extends Prisma.UserFindFirstArgs>(args: Prisma.SelectSubset<T, Prisma.UserFindFirstArgs>) {
    return prisma.user.findFirst(args);
}

export function GetManyUsers<T extends Prisma.UserFindManyArgs>(args: Prisma.SelectSubset<T, Prisma.UserFindManyArgs>) {
    return prisma.user.findMany(args);
}

export function CreateUser<T extends Prisma.UserCreateArgs>(args: Prisma.SelectSubset<T, Prisma.UserCreateArgs>) {
    return prisma.user.create(args);
}

export async function DeleteUser<T extends Prisma.UserDeleteArgs>(args: Prisma.SelectSubset<T, Prisma.UserDeleteArgs>) {
    const user = await prisma.user.delete(args);

    await Promise.all([
        Delete_UserCache(user.id, user.userName),
        Delete_UserProjectsCache(user.id),
        Delete_UserOrganizationsCache(user.id),
    ]);

    return user;
}

export async function UpdateUser<T extends Prisma.UserUpdateArgs>(args: Prisma.SelectSubset<T, Prisma.UserUpdateArgs>) {
    const user = await prisma.user.update(args);
    if (user) await Delete_UserCache(user.id);
    return user;
}

// Cache functions
export async function Delete_UserCache(id: string, _userName?: string) {
    let UserName: string | undefined = _userName?.toLowerCase();

    // If userName is not provided, get it from the cache
    if (!UserName) {
        UserName = (await valkey.get(cacheKey(id, USER_DATA_CACHE_KEY))) || "";
    }

    return await valkey.del([cacheKey(id, USER_DATA_CACHE_KEY), cacheKey(UserName.toLowerCase(), USER_DATA_CACHE_KEY)]);
}

interface SetCache_Data {
    id: string;
    userName: string;
}
async function Set_UserCache<T extends SetCache_Data | null>(user: T) {
    if (!user?.id) return;
    const json_string = JSON.stringify(user);
    const userName = user.userName.toLowerCase();

    const p1 = SetCache(USER_DATA_CACHE_KEY, user.id, userName, USER_DATA_CACHE_EXPIRY_seconds);
    const p2 = SetCache(USER_DATA_CACHE_KEY, userName, json_string, USER_DATA_CACHE_EXPIRY_seconds);
    await Promise.all([p1, p2]);
}

export async function Delete_UserProjectsCache(userId: string) {
    return await valkey.del(cacheKey(userId, USER_PROJECTS_CACHE_KEY));
}

export async function Delete_UserOrganizationsCache(userId: string) {
    return await valkey.del(cacheKey(userId, USER_ORGANIZATIONS_CACHE_KEY));
}

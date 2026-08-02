import type { Prisma } from "@prisma-client";
import prisma from "~/services/prisma";
import valkey from "~/services/redis";
import { USER_DATA_CACHE_KEY, USER_ORGANIZATIONS_CACHE_KEY, USER_PROJECTS_CACHE_KEY } from "~/types/namespaces";
import { cacheKey, GetData_FromCache, SetCache, USER_DATA_CACHE_EXPIRY_seconds } from "./_cache";

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
    profilePageBg: true,
} satisfies Prisma.UserSelect;

type TUserFromDB = Awaited<ReturnType<typeof GetUser_FromDb>>;
async function GetUser_FromDb(userName?: string, id?: string) {
    if (!userName && !id) throw new Error("Either userName or id is required!");

    let data = null;
    // If both id and slug are provided, check if any table matches either one
    if (id && userName) {
        data = await prisma.user.findFirst({
            where: {
                OR: [{ id: id }, { userNameLower: userName }],
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
    } else if (userName) {
        data = await prisma.user.findFirst({
            where: {
                userNameLower: userName,
            },
            select: USER_DATA_SELECT_FIELDS,
        });
    }

    return data;
}

export type TUser = NonNullable<TUserFromDB>;
export async function GetUser_ByIdOrUsername(userName?: string, id?: string): Promise<TUser | null> {
    if (!userName && !id) throw new Error("Either userName or id is required!");
    const userNameLower = userName?.toLowerCase();

    const cachedData = await GetData_FromCache<TUserFromDB>(USER_DATA_CACHE_KEY, userNameLower || id);
    if (cachedData) return cachedData;

    const user = await GetUser_FromDb(userNameLower, id);
    if (user) await Set_UserCache(user);

    return user;
}

export type TManyUsers = TUser[];
export async function GetManyUsers_ByIds(ids: string[]): Promise<TManyUsers> {
    const uniqueUserIds = Array.from(new Set(ids));
    const users = [];

    // Get cached users from redis
    const usersFromCache: string[] = [];
    {
        const promises: Promise<TUserFromDB>[] = [];
        for (const id of uniqueUserIds) {
            const cachedUser = GetData_FromCache<TUserFromDB>(USER_DATA_CACHE_KEY, id);
            promises.push(cachedUser);
        }

        for (const user of await Promise.all(promises)) {
            if (!user) continue;
            usersFromCache.push(user.id);
            users.push(user);
        }
    }

    // Get remaining users from db
    const remainingUsersIds = uniqueUserIds.filter((id) => !usersFromCache.includes(id));
    const remainingUsers =
        remainingUsersIds.length > 0
            ? await prisma.user.findMany({
                  where: { id: { in: remainingUsersIds } },
              })
            : [];

    // Set cache for remaining users
    {
        const promises = [];
        for (const user of remainingUsers) {
            const setCache = Set_UserCache(user);
            promises.push(setCache);
            users.push(user);
        }

        await Promise.all(promises);
    }

    return users;
}

export async function Get_UserProjects(userId: string) {
    const cached = await GetData_FromCache<string[]>(USER_PROJECTS_CACHE_KEY, userId);
    if (cached) return cached;

    const userProjects = await prisma.project.findMany({
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

    const projectIds = userProjects.map((project) => project.id);
    await SetCache(USER_PROJECTS_CACHE_KEY, userId, JSON.stringify(projectIds), USER_DATA_CACHE_EXPIRY_seconds);
    return projectIds;
}

export async function Get_UserOrganizations(userId: string) {
    const cached = await GetData_FromCache<string[]>(USER_ORGANIZATIONS_CACHE_KEY, userId);
    if (cached) return cached;

    const userOrgs = await prisma.organisation.findMany({
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
    const orgIds = userOrgs.map((org) => org.id);
    await SetCache(USER_ORGANIZATIONS_CACHE_KEY, userId, JSON.stringify(orgIds), USER_DATA_CACHE_EXPIRY_seconds);

    return orgIds;
}

export function GetUser_Unique<T extends Prisma.UserFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.UserFindUniqueArgs>,
) {
    return prisma.user.findUnique(args);
}

export function GetUser_First<T extends Prisma.UserFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.UserFindFirstArgs>,
) {
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
    let userName = _userName?.toLowerCase();

    // If userName is not provided, get it from the cache
    if (!userName) {
        userName = (await valkey.get(cacheKey(id, USER_DATA_CACHE_KEY))) || "";
    }

    return await valkey.del([cacheKey(id, USER_DATA_CACHE_KEY), cacheKey(userName.toLowerCase(), USER_DATA_CACHE_KEY)]);
}

interface SetCache_Data {
    id: string;
    userName: string;
}
async function Set_UserCache<T extends SetCache_Data | null>(user: T) {
    if (!user?.id) return;
    const json_string = JSON.stringify(user);
    const userNameLower = user.userName.toLowerCase();

    const p1 = SetCache(USER_DATA_CACHE_KEY, user.id, userNameLower, USER_DATA_CACHE_EXPIRY_seconds);
    const p2 = SetCache(USER_DATA_CACHE_KEY, userNameLower, json_string, USER_DATA_CACHE_EXPIRY_seconds);
    await Promise.all([p1, p2]);
}

export async function Delete_UserProjectsCache(userId: string) {
    return await valkey.del(cacheKey(userId, USER_PROJECTS_CACHE_KEY));
}

export async function Delete_UserOrganizationsCache(userId: string) {
    return await valkey.del(cacheKey(userId, USER_ORGANIZATIONS_CACHE_KEY));
}

import type { Prisma } from "@prisma-client";
import prisma from "~/services/prisma";
import valkey from "~/services/redis";
import { PROJECT_VERSIONS_CACHE_KEY } from "~/types/namespaces";
import { cacheKey, GetData_FromCache, SetCache, VERSION_CACHE_EXPIRY_seconds } from "./_cache";
import { Delete_ProjectCache_All } from "./project_item";

export const VERSION_SELECT = {
    id: true,
    projectId: true,
    authorId: true,
    title: true,
    versionNumber: true,
    changelog: true,
    slug: true,
    datePublished: true,
    featured: true,
    downloads: true,
    releaseChannel: true,
    gameVersions: true,
    loaders: true,
    author: {
        select: {
            id: true,
            userName: true,
            avatar: true,
        },
    },
    files: {
        select: {
            id: true,
            fileId: true,
            isPrimary: true,
        },
    },
    dependencies: {
        select: {
            id: true,
            projectId: true,
            versionId: true,
            dependencyType: true,
        },
    },
} satisfies Prisma.VersionSelect;

type TVersionsFromDB = Awaited<ReturnType<typeof GetVersions_FromDb>>;
async function GetVersions_FromDb(projectId?: string, projectSlug?: string) {
    if (!projectSlug && !projectId) throw new Error("Either the project id or slug is required!");

    let data = null;
    // If both id and slug are provided, check if any table matches either one
    if (projectId && projectSlug) {
        data = await prisma.project.findFirst({
            where: {
                OR: [{ id: projectId }, { slug: projectSlug?.toLowerCase() }],
            },
            select: {
                id: true,
                slug: true,
                versions: {
                    select: VERSION_SELECT,
                    orderBy: { datePublished: "desc" },
                },
            },
        });
    } else if (projectId) {
        data = await prisma.project.findUnique({
            where: {
                id: projectId,
            },
            select: {
                id: true,
                slug: true,
                versions: {
                    select: VERSION_SELECT,
                    orderBy: { datePublished: "desc" },
                },
            },
        });
    } else if (projectSlug) {
        data = await prisma.project.findUnique({
            where: {
                slug: projectSlug.toLowerCase(),
            },
            select: {
                id: true,
                slug: true,
                versions: {
                    select: VERSION_SELECT,
                    orderBy: { datePublished: "desc" },
                },
            },
        });
    }

    return data;
}

export type TVersions = NonNullable<TVersionsFromDB>;

export async function GetVersions(projectId: string, projectSlug?: undefined): Promise<TVersions | null>;
export async function GetVersions(projectId: undefined, projectSlug: string): Promise<TVersions | null>;
export async function GetVersions(projectId: string, projectSlug: string): Promise<TVersions | null>;
export async function GetVersions(projectId?: string, projectSlug?: string): Promise<TVersions | null> {
    if (!projectSlug && !projectId) throw new Error("Either the project id or slug is required!");

    const cachedData = await GetData_FromCache<TVersionsFromDB>(
        PROJECT_VERSIONS_CACHE_KEY,
        projectId || projectSlug?.toLowerCase(),
    );
    if (cachedData) return cachedData;

    const data = await GetVersions_FromDb(projectId, projectSlug);
    if (data) await Set_VersionsCache(PROJECT_VERSIONS_CACHE_KEY, data);

    return data;
}

export type TManyVersions = TVersions[];
export async function GetMany_ProjectsVersions(projectIds: string[]): Promise<TManyVersions> {
    const uniqueProjectIds = Array.from(new Set(projectIds));
    const projects = [];

    // Get cached projects from redis
    const projectsFromCache: string[] = [];
    {
        const promises = [];
        for (const projectId of uniqueProjectIds) {
            const cachedData = GetData_FromCache<TVersionsFromDB>(PROJECT_VERSIONS_CACHE_KEY, projectId);
            promises.push(cachedData);
        }

        for (const project of await Promise.all(promises)) {
            if (!project) continue;
            projectsFromCache.push(project.id);
            projects.push(project);
        }
    }

    // Get the remaining projects from the database
    const remainingProjectIds = uniqueProjectIds.filter((id) => !projectsFromCache.includes(id));
    if (remainingProjectIds.length === 0) return projects;

    const remainingProjects = await prisma.project.findMany({
        where: {
            id: { in: remainingProjectIds },
        },
        select: {
            id: true,
            slug: true,
            versions: {
                select: VERSION_SELECT,
                orderBy: { datePublished: "desc" },
            },
        },
    });

    // Set cache for the remaining projects
    {
        const promises = [];
        for (const project of remainingProjects) {
            promises.push(Set_VersionsCache(PROJECT_VERSIONS_CACHE_KEY, project));
            projects.push(project);
        }

        await Promise.all(promises);
    }

    return projects;
}

export async function CreateVersion<T extends Prisma.VersionCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.VersionCreateArgs>,
) {
    const version = await prisma.version.create(args);
    if (version?.projectId) await Delete_VersionCache(version.projectId);

    return version;
}

export async function UpdateVersion<T extends Prisma.VersionUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.VersionUpdateArgs>,
) {
    const version = await prisma.version.update(args);
    if (version?.projectId) await Delete_VersionCache(version.projectId);

    return version;
}

export async function DeleteVersion<T extends Prisma.VersionDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.VersionDeleteArgs>,
) {
    const version = await prisma.version.delete(args);
    if (version?.projectId) await Delete_VersionCache(version.projectId);

    return version;
}

export async function DeleteManyVersions<T extends Prisma.VersionDeleteManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.VersionDeleteManyArgs>,
) {
    const versions = await prisma.version.deleteMany(args);
    if (typeof args?.where?.projectId === "string") {
        await Delete_VersionCache(args.where.projectId);
    }

    return versions;
}

export async function DeleteManyVersions_ByIds(versionIds: string[], projectId: string) {
    await prisma.version.deleteMany({ where: { id: { in: versionIds } } });

    await Delete_VersionCache(projectId);
}

export async function DeleteManyVersions_ByProjectID(projectId: string) {
    await prisma.version.deleteMany({
        where: {
            projectId: projectId,
        },
    });

    await Delete_VersionCache(projectId);
}

// ? Cache functions
interface SetCache_Data {
    id: string;
    slug: string;
}
async function Set_VersionsCache<T extends SetCache_Data | null>(NAMESPACE: string, projectWithVersions: T) {
    if (!projectWithVersions) return;
    const jsonStr = JSON.stringify(projectWithVersions);
    const slug = projectWithVersions.slug.toLowerCase();

    const p1 = SetCache(NAMESPACE, projectWithVersions.id, slug, VERSION_CACHE_EXPIRY_seconds);
    const p2 = SetCache(NAMESPACE, slug, jsonStr, VERSION_CACHE_EXPIRY_seconds);
    await Promise.all([p1, p2]);
}

export async function Delete_VersionCache(projectId: string, _projectSlug?: string) {
    let projectSlug = _projectSlug?.toLowerCase();

    // If slug is not provided, get it from the cache
    if (!projectSlug) {
        projectSlug = (await valkey.get(cacheKey(projectId, PROJECT_VERSIONS_CACHE_KEY))) || "";
    }

    const delKeys = valkey.del([
        cacheKey(projectId, PROJECT_VERSIONS_CACHE_KEY),
        cacheKey(projectSlug, PROJECT_VERSIONS_CACHE_KEY),
    ]);
    const delProjectCache = Delete_ProjectCache_All(projectId, projectSlug);

    await Promise.all([delKeys, delProjectCache]);
}

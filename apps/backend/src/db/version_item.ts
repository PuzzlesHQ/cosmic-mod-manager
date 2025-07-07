import type { Prisma } from "@prisma/client";
import { cacheKey } from "~/services/cache/utils";
import prisma from "~/services/prisma";
import valkey from "~/services/redis";
import { PROJECT_VERSIONS_CACHE_KEY } from "~/types/namespaces";
import { GetData_FromCache, SetCache, VERSION_CACHE_EXPIRY_seconds } from "./_cache";
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

export type GetVersions_ReturnType = Awaited<ReturnType<typeof GetVersions_FromDb>>;
async function GetVersions_FromDb(projectSlug?: string, projectId?: string) {
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
    } else {
        data = await prisma.project.findUnique({
            where: {
                slug: projectSlug?.toLowerCase(),
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

export async function GetVersions(projectSlug?: string, projectId?: string) {
    if (!projectSlug && !projectId) throw new Error("Either the project id or slug is required!");

    const cachedData = await GetData_FromCache<GetVersions_ReturnType>(
        PROJECT_VERSIONS_CACHE_KEY,
        projectSlug?.toLowerCase() || projectId,
    );
    if (cachedData) return cachedData;

    const data = await GetVersions_FromDb(projectSlug, projectId);
    if (data) await Set_VersionsCache(PROJECT_VERSIONS_CACHE_KEY, data);

    return data;
}

export async function GetMany_ProjectsVersions(_ProjectIds: string[]) {
    const ProjectIds = Array.from(new Set(_ProjectIds));
    const Projects = [];

    // Get cached projects from redis
    const ProjectIds_RetrievedFromCache: string[] = [];
    {
        const _CachedVersionsPromises = [];
        for (const projectId of ProjectIds) {
            const cachedData = GetData_FromCache<GetVersions_ReturnType>(PROJECT_VERSIONS_CACHE_KEY, projectId);
            _CachedVersionsPromises.push(cachedData);
        }

        const _CachedVersions = await Promise.all(_CachedVersionsPromises);
        for (const project of _CachedVersions) {
            if (!project) continue;
            ProjectIds_RetrievedFromCache.push(project.id);
            Projects.push(project);
        }
    }

    // Get the remaining projects from the database
    const ProjectIds_ToRetrieve = ProjectIds.filter((id) => !ProjectIds_RetrievedFromCache.includes(id));
    if (ProjectIds_ToRetrieve.length === 0) return Projects;

    const Remaining_ProjectVersions = await prisma.project.findMany({
        where: {
            id: { in: ProjectIds_ToRetrieve },
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
        const _SetCachePromises = [];
        for (const project of Remaining_ProjectVersions) {
            _SetCachePromises.push(Set_VersionsCache(PROJECT_VERSIONS_CACHE_KEY, project));
            Projects.push(project);
        }

        await Promise.all(_SetCachePromises);
    }

    return Projects;
}

export async function CreateVersion<T extends Prisma.VersionCreateArgs>(args: Prisma.SelectSubset<T, Prisma.VersionCreateArgs>) {
    const version = await prisma.version.create(args);
    if (version?.projectId) await Delete_VersionCache(version.projectId);

    return version;
}

export async function UpdateVersion<T extends Prisma.VersionUpdateArgs>(args: Prisma.SelectSubset<T, Prisma.VersionUpdateArgs>) {
    const version = await prisma.version.update(args);
    if (version?.projectId) await Delete_VersionCache(version.projectId);

    return version;
}

export async function DeleteVersion<T extends Prisma.VersionDeleteArgs>(args: Prisma.SelectSubset<T, Prisma.VersionDeleteArgs>) {
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
async function Set_VersionsCache<T extends SetCache_Data | null>(NAMESPACE: string, project_withVersions: T) {
    if (!project_withVersions) return;
    const json_string = JSON.stringify(project_withVersions);
    const slug = project_withVersions.slug.toLowerCase();

    const p1 = SetCache(NAMESPACE, project_withVersions.id, slug, VERSION_CACHE_EXPIRY_seconds);
    const p2 = SetCache(NAMESPACE, slug, json_string, VERSION_CACHE_EXPIRY_seconds);
    await Promise.all([p1, p2]);
}

export async function Delete_VersionCache(projectId: string, _projectSlug?: string) {
    let projectSlug: string | undefined = _projectSlug?.toLowerCase();

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

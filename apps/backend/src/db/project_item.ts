import type { Prisma } from "@prisma-client";
import { isProjectIndexable } from "~/routes/project/utils";
import {
    AddProjects_ToSearchIndex,
    RemoveProjects_FromSearchIndex,
    UpdateProjects_SearchIndex,
} from "~/routes/search/search-db";
import prisma from "~/services/prisma";
import valkey from "~/services/redis";
import { PROJECT_DETAILS_CACHE_KEY, PROJECT_LIST_ITEM_CACHE_KEY } from "~/types/namespaces";
import { cacheKey, DeleteCache, GetData_FromCache, PROJECT_CACHE_EXPIRY_seconds, SetCache } from "./_cache";
import {
    Delete_OrganizationCache_All,
    GetManyOrganizations_ById,
    GetOrganization_Data,
    type TOrganizationData,
} from "./organization_item";
import { GetManyTeams_ById, GetTeam, type TTeam } from "./team_item";

// ? Select fields
function PROJECT_DETAILS_SELECT_FIELDS() {
    return {
        id: true,
        threadId: true,
        teamId: true,
        organisationId: true,

        name: true,
        slug: true,
        type: true,
        summary: true,
        description: true,
        iconFileId: true,
        licenseId: true,
        licenseName: true,
        licenseUrl: true,
        downloads: true,
        followers: true,
        categories: true,
        featuredCategories: true,
        loaders: true,
        gameVersions: true,

        datePublished: true,
        dateUpdated: true,
        dateApproved: true,
        dateQueued: true,
        requestedStatus: true,
        status: true,
        visibility: true,

        clientSide: true,
        serverSide: true,

        issueTrackerUrl: true,
        projectSourceUrl: true,
        projectWikiUrl: true,
        discordInviteUrl: true,

        color: true,

        gallery: {
            select: {
                id: true,
                imageFileId: true,
                thumbnailFileId: true,
                projectId: true,
                name: true,
                description: true,
                featured: true,
                dateCreated: true,
                orderIndex: true,
            },
            orderBy: { orderIndex: "desc" },
        },
    } satisfies Prisma.ProjectSelect;
}

function PROJECT_LIST_ITEM_SELECT_FIELDS() {
    return {
        id: true,
        threadId: true,
        teamId: true,
        iconFileId: true,
        organisationId: true,

        slug: true,
        name: true,
        summary: true,
        type: true,
        downloads: true,
        followers: true,
        clientSide: true,
        serverSide: true,
        featuredCategories: true,
        categories: true,
        gameVersions: true,
        loaders: true,
        color: true,

        dateUpdated: true,
        datePublished: true,
        dateQueued: true,
        dateApproved: true,
        status: true,
        requestedStatus: true,
        visibility: true,
    } satisfies Prisma.ProjectSelect;
}

// ? Get project functions
type TProjectDetailsFromDB = Awaited<ReturnType<typeof GetProject_Details_FromDb>>;
async function GetProject_Details_FromDb(id?: string, slug?: string) {
    if (!slug && !id) throw new Error("Either the project id or slug is required!");

    let data = null;
    if (id && slug) {
        data = await prisma.project.findFirst({
            where: {
                OR: [{ id: id }, { slug: slug?.toLowerCase() }],
            },
            select: PROJECT_DETAILS_SELECT_FIELDS(),
        });
    } else if (id) {
        data = await prisma.project.findUnique({
            where: {
                id: id,
            },
            select: PROJECT_DETAILS_SELECT_FIELDS(),
        });
    } else if (slug) {
        data = await prisma.project.findUnique({
            where: {
                slug: slug.toLowerCase(),
            },
            select: PROJECT_DETAILS_SELECT_FIELDS(),
        });
    }

    return data;
}

type Project_OrgAndTeamData = {
    organisation: TOrganizationData | null;
    team: NonNullable<TTeam>;
};

export type TProjectDetails = TProjectDetailsFromDB & Project_OrgAndTeamData;

export async function GetProject_Details(id: string, slug?: undefined): Promise<TProjectDetails | null>;
export async function GetProject_Details(id: undefined, slug: string): Promise<TProjectDetails | null>;
export async function GetProject_Details(id: string, slug: string): Promise<TProjectDetails | null>;
export async function GetProject_Details(id?: string, slug?: string): Promise<TProjectDetails | null> {
    if (!slug && !id) throw new Error("Either the project id or slug is required!");

    let project = await GetData_FromCache<TProjectDetailsFromDB>(PROJECT_DETAILS_CACHE_KEY, slug || id);
    if (!project) project = await GetProject_Details_FromDb(id, slug);
    if (!project) return null;

    await Set_ProjectCache(PROJECT_DETAILS_CACHE_KEY, project);

    const [org, projectTeam] = await Promise.all([
        project.organisationId ? GetOrganization_Data(project.organisationId) : null,
        GetTeam(project.teamId),
    ]);
    if (!projectTeam) return null;

    return Object.assign(project, { organisation: org, team: projectTeam });
}

export type TManyProjectsDetails = TProjectDetails[];
export async function GetManyProjects_Details(projectIds: string[]): Promise<TManyProjectsDetails> {
    const uniqueProjectIds = Array.from(new Set(projectIds));

    const projects = [];
    const orgIds = new Set<string>();
    const teamIds = new Set<string>();

    const projectsFromCache: string[] = [];

    // Get all the project from cache
    {
        const promises = [];
        for (const id of uniqueProjectIds) {
            if (!id) continue;
            promises.push(GetData_FromCache<TProjectDetailsFromDB>(PROJECT_DETAILS_CACHE_KEY, id));
        }

        for (const cachedProject of await Promise.all(promises)) {
            if (!cachedProject?.id) continue;

            projectsFromCache.push(cachedProject.id);
            projects.push(cachedProject);
            if (cachedProject.organisationId) orgIds.add(cachedProject.organisationId);
            teamIds.add(cachedProject.teamId);
        }
    }

    // Get all non-cached projects
    const remainingProjectIds = uniqueProjectIds.filter((id) => !projectsFromCache.includes(id));

    const remainingProjects =
        remainingProjectIds.length > 0
            ? await prisma.project.findMany({
                  where: {
                      id: {
                          in: remainingProjectIds,
                      },
                  },
                  select: PROJECT_DETAILS_SELECT_FIELDS(),
              })
            : [];

    // Set cache for all non-cached projects
    {
        const promises = [];
        for (const project of remainingProjects) {
            if (!project?.id) continue;
            promises.push(Set_ProjectCache(PROJECT_DETAILS_CACHE_KEY, project));

            projects.push(project);
            if (project.organisationId) orgIds.add(project.organisationId);
            teamIds.add(project.teamId);
        }

        await Promise.all(promises);
    }

    const [orgs, teams] = await Promise.all([
        GetManyOrganizations_ById(Array.from(orgIds)),
        GetManyTeams_ById(Array.from(teamIds)),
    ]);

    const formattedProjects: TManyProjectsDetails = [];
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        const team = teams.find((team) => team?.id === project.teamId);
        if (!team) continue;

        const org = orgs.find((org) => org?.id === project.organisationId);
        formattedProjects.push(Object.assign(project, { organisation: org || null, team: team }));
    }

    return formattedProjects;
}

type TProjectListItemFromDB = Awaited<ReturnType<typeof GetProject_ListItem_FromDb>>;
async function GetProject_ListItem_FromDb(id?: string, slug?: string) {
    if (!slug && !id) throw new Error("Either the project id or slug is required!");

    let data = null;
    if (id && slug) {
        data = await prisma.project.findFirst({
            where: {
                OR: [{ id: id }, { slug: slug.toLowerCase() }],
            },
            select: PROJECT_LIST_ITEM_SELECT_FIELDS(),
        });
    }
    // Prioritize using id for query over using slugs
    else if (id) {
        data = await prisma.project.findUnique({
            where: {
                id: id,
            },
            select: PROJECT_LIST_ITEM_SELECT_FIELDS(),
        });
    } else if (slug) {
        data = await prisma.project.findUnique({
            where: {
                slug: slug?.toLowerCase(),
            },
            select: PROJECT_LIST_ITEM_SELECT_FIELDS(),
        });
    }

    return data;
}

export type TProjectListItem = TProjectListItemFromDB & Project_OrgAndTeamData;

export async function GetProject_ListItem(id: string, slug?: undefined): Promise<TProjectListItem | null>;
export async function GetProject_ListItem(id: undefined, slug: string): Promise<TProjectListItem | null>;
export async function GetProject_ListItem(id: string, slug: string): Promise<TProjectListItem | null>;
export async function GetProject_ListItem(id?: string, slug?: string): Promise<TProjectListItem | null> {
    if (!slug && !id) throw new Error("Either the project id or slug is required!");

    let project = await GetData_FromCache<TProjectListItemFromDB>(PROJECT_LIST_ITEM_CACHE_KEY, id || slug);
    if (!project) project = await GetProject_ListItem_FromDb(id, slug);
    if (!project) return null;

    await Set_ProjectCache(PROJECT_LIST_ITEM_CACHE_KEY, project);

    const [org, projectTeam] = await Promise.all([
        project.organisationId ? GetOrganization_Data(project.organisationId) : null,
        GetTeam(project.teamId),
    ]);
    if (!projectTeam) return null;

    return Object.assign(project, { organisation: org, team: projectTeam });
}

export type ManyProjectsListItem_T = TProjectListItem[];
export async function GetManyProjects_ListItem(projectIds: string[]): Promise<ManyProjectsListItem_T> {
    const uniqueProjectIds = Array.from(new Set(projectIds));

    const projects = [];
    const orgIds = new Set<string>();
    const teamIds = new Set<string>();

    const projectsFromCache: string[] = [];

    // Get all the project from cache
    {
        const promises = [];
        for (const id of uniqueProjectIds) {
            if (!id) continue;
            promises.push(GetData_FromCache<TProjectListItemFromDB>(PROJECT_LIST_ITEM_CACHE_KEY, id));
        }

        for (const proj of await Promise.all(promises)) {
            if (!proj?.id) continue;

            projectsFromCache.push(proj.id);
            projects.push(proj);
            if (proj.organisationId) orgIds.add(proj.organisationId);
            teamIds.add(proj.teamId);
        }
    }

    // Get all non-cached projects
    const remainingProjectIds = uniqueProjectIds.filter((id) => !projectsFromCache.includes(id));
    const remainingProjects =
        remainingProjectIds.length > 0
            ? await prisma.project.findMany({
                  where: {
                      id: {
                          in: remainingProjectIds,
                      },
                  },
                  select: PROJECT_LIST_ITEM_SELECT_FIELDS(),
              })
            : [];

    // Set cache for all non-cached projects
    {
        const promises = [];
        for (const project of remainingProjects) {
            if (!project?.id) continue;
            promises.push(Set_ProjectCache(PROJECT_LIST_ITEM_CACHE_KEY, project));

            projects.push(project);
            if (project.organisationId) orgIds.add(project.organisationId);
            teamIds.add(project.teamId);
        }

        await Promise.all(promises);
    }

    const [orgs, teams] = await Promise.all([
        GetManyOrganizations_ById(Array.from(orgIds)),
        GetManyTeams_ById(Array.from(teamIds)),
    ]);

    const formattedProjects: ManyProjectsListItem_T = [];
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        const team = teams.find((team) => team?.id === project.teamId);
        if (!team) continue;

        const org = orgs.find((org) => org.id === project.organisationId);
        formattedProjects.push(Object.assign(project, { organisation: org || null, team: team }));
    }

    return formattedProjects;
}

export async function CreateProject<T extends Prisma.ProjectCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.ProjectCreateArgs>,
) {
    const project = await prisma.project.create(args);
    if (project.organisationId) await Delete_OrganizationCache_All(project.organisationId);

    return project;
}

// ? Update and delete project functions
export async function UpdateProject<T extends Prisma.ProjectUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.ProjectUpdateArgs>,
) {
    const project = await prisma.project.update(args);
    if (project?.id) await Delete_ProjectCache_All(project.id);
    if (isProjectIndexable(project.visibility, project.status)) {
        const shouldUpdateIndex = [
            args.data.gameVersions,
            args.data.loaders,
            args.data.featuredCategories,
            args.data.categories,
            args.data.visibility,
            args.data.status,
            args.data.dateUpdated,
            args.data.downloads,
            args.data.type,
            args.data.iconFileId,
            args.data.organisationId,
        ].some(isNonEmpty);

        if (shouldUpdateIndex) UpdateProjects_SearchIndex([project.id]);
    }

    return project;
}

export async function UpdateManyProjects<T extends Prisma.ProjectUpdateManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.ProjectUpdateManyArgs>,
    projectIds: string[],
) {
    const promises = [];
    for (const id of projectIds) {
        promises.push(Delete_ProjectCache_All(id));
    }
    await Promise.all(promises);

    return await prisma.project.updateMany(args);
}

export async function DeleteProject<T extends Prisma.ProjectDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.ProjectDeleteArgs>,
) {
    const project = await prisma.project.delete(args);
    if (project?.id) await Delete_ProjectCache_All(project.id, project.slug);
    if (project?.organisationId) await Delete_OrganizationCache_All(project.organisationId);
    if (isProjectIndexable(project.visibility, project.status)) await RemoveProjects_FromSearchIndex([project.id]);

    return project;
}

// ? Caching functions
// Cache structure: ProjectId -> ProjectSlug
//                  ProjectSlug -> ProjectData

export async function Delete_ProjectCache_All(id: string, slug?: string) {
    let projectSlug = slug?.toLowerCase();

    // If slug is not provided, get it from the cache
    if (!projectSlug) {
        const [slug1, slug2] = await Promise.all([
            valkey.get(cacheKey(id, PROJECT_DETAILS_CACHE_KEY)),
            valkey.get(cacheKey(id, PROJECT_LIST_ITEM_CACHE_KEY)),
        ]);

        projectSlug = slug1 || slug2 || "";
    }

    return await DeleteCache([
        cacheKey(id, PROJECT_LIST_ITEM_CACHE_KEY),
        cacheKey(projectSlug, PROJECT_LIST_ITEM_CACHE_KEY),
        cacheKey(id, PROJECT_DETAILS_CACHE_KEY),
        cacheKey(projectSlug, PROJECT_DETAILS_CACHE_KEY),
    ]);
}

interface SetCache_Data {
    id: string;
    slug: string;
}
async function Set_ProjectCache<T extends SetCache_Data | null>(NAMESPACE: string, project: T) {
    if (!project?.id) return;
    const jsonStr = JSON.stringify(project);
    const slug = project.slug.toLowerCase();

    const p1 = SetCache(NAMESPACE, project.id, slug, PROJECT_CACHE_EXPIRY_seconds);
    const p2 = SetCache(NAMESPACE, slug, jsonStr, PROJECT_CACHE_EXPIRY_seconds);
    await Promise.all([p1, p2]);
}

// Search index functions
interface IndexCriteriaFields {
    visibility: string;
    status: string;
}

export async function UpdateOrRemoveProject_FromSearchIndex(
    projectId: string,
    oldStats: IndexCriteriaFields,
    newStats: IndexCriteriaFields,
) {
    const wasPreviouslyIndexable = isProjectIndexable(oldStats.visibility, oldStats.status);
    const isNowIndexable = isProjectIndexable(newStats.visibility, newStats.status);

    // Remove the project from the search index if it was previously indexable and but is not indexable anymore
    if (wasPreviouslyIndexable && !isNowIndexable) await RemoveProjects_FromSearchIndex([projectId]);
    // Add the project to the search index if it was not previously indexable
    else if (!wasPreviouslyIndexable && isNowIndexable) await AddProjects_ToSearchIndex([projectId]);
    // Update the project in the search index if it was previously indexable and still is indexable
    else if (wasPreviouslyIndexable && isNowIndexable) await UpdateProjects_SearchIndex([projectId]);
}

function isNonEmpty<T>(value: T | undefined): boolean {
    return value !== undefined;
}

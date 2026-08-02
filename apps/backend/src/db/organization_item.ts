import type { Prisma } from "@prisma-client";
import prisma from "~/services/prisma";
import valkey from "~/services/redis";
import { ORGANIZATION_DATA_CACHE_KEY, USER_ORGANIZATIONS_CACHE_KEY } from "~/types/namespaces";
import { cacheKey, GetData_FromCache, ORGANIZATION_DATA_CACHE_EXPIRY_seconds, SetCache } from "./_cache";
import { GetManyTeams_ById, GetTeam, type TTeam } from "./team_item";

const ORGANIZATION_SELECT_FIELDS = {
    id: true,
    teamId: true,
    slug: true,
    name: true,
    description: true,
    iconFileId: true,
    projects: {
        select: {
            id: true,
            teamId: true,
        },
    },
} satisfies Prisma.OrganisationSelect;

type TOrganizationFromDB = Awaited<ReturnType<typeof GetOrganization_FromDb>>;
async function GetOrganization_FromDb(id?: string, slug?: string) {
    if (!slug && !id) throw new Error("Either slug or id is required!");

    let org = null;
    // If both id and slug are provided, check if any table matches either one
    if (id && slug) {
        org = await prisma.organisation.findFirst({
            where: {
                OR: [{ id: id }, { slug: slug }],
            },
            select: ORGANIZATION_SELECT_FIELDS,
        });
    } else if (id) {
        org = await prisma.organisation.findUnique({
            where: {
                id: id,
            },
            select: ORGANIZATION_SELECT_FIELDS,
        });
    } else {
        org = await prisma.organisation.findUnique({
            where: {
                slug: slug,
            },
            select: ORGANIZATION_SELECT_FIELDS,
        });
    }

    return org;
}

export type TOrganizationData = TOrganizationFromDB & { team: NonNullable<TTeam> };

export async function GetOrganization_Data(id: string, _slug?: undefined): Promise<TOrganizationData | null>;
export async function GetOrganization_Data(id: undefined, _slug: string): Promise<TOrganizationData | null>;
export async function GetOrganization_Data(id: string, _slug: string): Promise<TOrganizationData | null>;
export async function GetOrganization_Data(id?: string, _slug?: string): Promise<TOrganizationData | null> {
    if (!_slug && !id) throw new Error("Either slug or id is required!");
    const slug = _slug?.toLowerCase();

    let orgData = await GetData_FromCache<TOrganizationFromDB>(ORGANIZATION_DATA_CACHE_KEY, id || slug);
    if (!orgData) orgData = await GetOrganization_FromDb(id, slug);
    if (!orgData) return null;

    await Set_OrganizationCache(ORGANIZATION_DATA_CACHE_KEY, orgData);

    const orgTeam = await GetTeam(orgData.teamId);
    if (!orgTeam) return null;

    return Object.assign(orgData, { team: orgTeam });
}

export type TManyOrganizations = TOrganizationData[];
export async function GetManyOrganizations_ById(orgIds: string[]): Promise<TManyOrganizations> {
    const uniqueOrgIds = Array.from(new Set(orgIds));
    const organizations = [];
    const orgTeamIds = [];

    // Getting cached items
    const orgsFromCache: string[] = [];
    {
        const promises = [];
        for (const id of uniqueOrgIds) {
            const cachedOrg = GetData_FromCache<TOrganizationFromDB>(ORGANIZATION_DATA_CACHE_KEY, id);
            promises.push(cachedOrg);
        }

        for (const org of await Promise.all(promises)) {
            if (!org) continue;
            orgsFromCache.push(org.id);
            organizations.push(org);
            orgTeamIds.push(org.teamId);
        }
    }

    // Get the items that were not found in the cache
    const remainingOrgIds = uniqueOrgIds.filter((id) => !orgsFromCache.includes(id));
    const remainingOrgs =
        remainingOrgIds.length > 0
            ? await prisma.organisation.findMany({
                  where: {
                      id: {
                          in: remainingOrgIds,
                      },
                  },
                  select: ORGANIZATION_SELECT_FIELDS,
              })
            : [];

    // Cache the items that were not found in the cache
    {
        const promises = [];
        for (const org of remainingOrgs) {
            promises.push(Set_OrganizationCache(ORGANIZATION_DATA_CACHE_KEY, org));

            organizations.push(org);
            orgTeamIds.push(org.teamId);
        }
        await Promise.all(promises);
    }

    // Get the teams for the organizations
    const orgTeams = await GetManyTeams_ById(orgTeamIds);

    const orgsList: TManyOrganizations = [];
    // Combine the organizations with their teams
    for (let i = 0; i < organizations.length; i++) {
        const org = organizations[i];
        const team = orgTeams.find((t) => t.id === org.teamId);
        if (!team) continue;

        orgsList.push(Object.assign(org, { team: team }));
    }

    return orgsList;
}

export function GetOrganization_Unique<T extends Prisma.OrganisationFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.OrganisationFindUniqueArgs>,
) {
    return prisma.organisation.findUnique(args);
}

export async function UpdateOrganization<T extends Prisma.OrganisationUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.OrganisationUpdateArgs>,
) {
    const data = await prisma.organisation.update(args);
    await Delete_OrganizationCache_All(data.id);
    return data;
}

export async function CreateOrganization<T extends Prisma.OrganisationCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.OrganisationCreateArgs>,
    ownerUserId: string,
) {
    await valkey.del(cacheKey(ownerUserId, USER_ORGANIZATIONS_CACHE_KEY));
    return await prisma.organisation.create(args);
}

export function GetManyOrganizations<T extends Prisma.OrganisationFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.OrganisationFindManyArgs>,
) {
    return prisma.organisation.findMany(args);
}

export async function DeleteOrganization<T extends Prisma.OrganisationDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.OrganisationDeleteArgs>,
) {
    const data = await prisma.organisation.delete(args);
    await Delete_OrganizationCache_All(data.id, data.slug);
    return data;
}

export async function DeleteManyOrganizations<T extends Prisma.OrganisationDeleteManyArgs>(
    ids: string[],
    args: Prisma.SelectSubset<T, Prisma.OrganisationDeleteManyArgs>,
) {
    {
        const promises = [];
        for (const orgId of ids) {
            promises.push(Delete_OrganizationCache_All(orgId));
        }

        await Promise.all(promises);
    }

    return await prisma.organisation.deleteMany(args);
}

// Cache functions
interface SetCache_Data {
    id: string;
    slug: string;
}
async function Set_OrganizationCache<T extends SetCache_Data | null>(NAMESPACE: string, org: T) {
    if (!org?.id) return;
    const jsonStr = JSON.stringify(org);
    const slug = org.slug.toLowerCase();

    const p1 = SetCache(NAMESPACE, org.id, slug, ORGANIZATION_DATA_CACHE_EXPIRY_seconds);
    const p2 = SetCache(NAMESPACE, slug, jsonStr, ORGANIZATION_DATA_CACHE_EXPIRY_seconds);
    await Promise.all([p1, p2]);
}

export async function Delete_OrganizationCache_All(id: string, slug?: string) {
    let orgSlug = slug?.toLowerCase();
    // If slug is not provided, get it from the cache
    if (!orgSlug) {
        orgSlug = (await valkey.get(cacheKey(id, ORGANIZATION_DATA_CACHE_KEY))) || "";
    }

    return await valkey.del([
        cacheKey(id, ORGANIZATION_DATA_CACHE_KEY),
        cacheKey(orgSlug, ORGANIZATION_DATA_CACHE_KEY),
    ]);
}

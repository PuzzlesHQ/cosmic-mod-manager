import type { Prisma } from "@prisma/client";
import { cacheKey } from "~/services/cache/utils";
import prisma from "~/services/prisma";
import valkey from "~/services/redis";
import { ORGANIZATION_DATA_CACHE_KEY, USER_ORGANIZATIONS_CACHE_KEY } from "~/types/namespaces";
import { GetData_FromCache, ORGANIZATION_DATA_CACHE_EXPIRY_seconds, SetCache } from "./_cache";
import { GetManyTeams_ById, GetTeam } from "./team_item";

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

export type GetOrganization_ReturnType = Awaited<ReturnType<typeof GetOrganization_FromDb>>;
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

export async function GetOrganization_Data(id?: string, _slug?: string) {
    if (!_slug && !id) throw new Error("Either slug or id is required!");
    const slug = _slug?.toLowerCase();

    let OrgData = await GetData_FromCache<GetOrganization_ReturnType>(ORGANIZATION_DATA_CACHE_KEY, id || slug);
    if (!OrgData) OrgData = await GetOrganization_FromDb(id, slug);
    if (!OrgData) return null;

    await Set_OrganizationCache(ORGANIZATION_DATA_CACHE_KEY, OrgData);

    const OrgTeam = await GetTeam(OrgData.teamId);
    if (!OrgTeam) return null;

    return Object.assign(OrgData, { team: OrgTeam });
}

export type GetManyOrganizations_ReturnType = Awaited<ReturnType<typeof GetManyOrganizations_ById>>;
export async function GetManyOrganizations_ById(ids: string[]) {
    const OrgIds = Array.from(new Set(ids));
    const Organizations = [];
    const _OrgTeamIds = [];

    // Getting cached items
    const OrgsIds_RetrievedFromCache: string[] = [];
    {
        const _CachedOrgs_promises = [];
        for (const id of OrgIds) {
            const cachedOrg = GetData_FromCache<GetOrganization_ReturnType>(ORGANIZATION_DATA_CACHE_KEY, id);
            _CachedOrgs_promises.push(cachedOrg);
        }

        const _CachedOrgs = await Promise.all(_CachedOrgs_promises);
        for (const org of _CachedOrgs) {
            if (!org) continue;
            OrgsIds_RetrievedFromCache.push(org.id);
            Organizations.push(org);
            _OrgTeamIds.push(org.teamId);
        }
    }

    // Get the items that were not found in the cache
    const OrgsIds_ToRetrieve = OrgIds.filter((id) => !OrgsIds_RetrievedFromCache.includes(id));
    const _RemainingOrgItems =
        OrgsIds_ToRetrieve.length > 0
            ? await prisma.organisation.findMany({
                  where: {
                      id: {
                          in: OrgsIds_ToRetrieve,
                      },
                  },
                  select: ORGANIZATION_SELECT_FIELDS,
              })
            : [];

    // Cache the items that were not found in the cache
    {
        const _Set_OrganizationCache_promises = [];
        for (const org of _RemainingOrgItems) {
            _Set_OrganizationCache_promises.push(Set_OrganizationCache(ORGANIZATION_DATA_CACHE_KEY, org));

            Organizations.push(org);
            _OrgTeamIds.push(org.teamId);
        }
        await Promise.all(_Set_OrganizationCache_promises);
    }

    // Get the teams for the organizations
    const OrgItems_Teams = await GetManyTeams_ById(_OrgTeamIds);

    const FormattedOrgs = [];
    // Combine the organizations with their teams
    for (let i = 0; i < Organizations.length; i++) {
        const org = Organizations[i];
        const team = OrgItems_Teams.find((t) => t.id === org.teamId);
        if (!team) continue;

        FormattedOrgs.push(Object.assign(org, { team: team }));
    }

    return FormattedOrgs;
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
    const json_string = JSON.stringify(org);
    const slug = org.slug.toLowerCase();

    const p1 = SetCache(NAMESPACE, org.id, slug, ORGANIZATION_DATA_CACHE_EXPIRY_seconds);
    const p2 = SetCache(NAMESPACE, slug, json_string, ORGANIZATION_DATA_CACHE_EXPIRY_seconds);
    await Promise.all([p1, p2]);
}

export async function Delete_OrganizationCache_All(id: string, slug?: string) {
    let orgSlug = slug?.toLowerCase();
    // If slug is not provided, get it from the cache
    if (!orgSlug) {
        orgSlug = (await valkey.get(cacheKey(id, ORGANIZATION_DATA_CACHE_KEY))) || "";
    }

    return await valkey.del([cacheKey(id, ORGANIZATION_DATA_CACHE_KEY), cacheKey(orgSlug, ORGANIZATION_DATA_CACHE_KEY)]);
}

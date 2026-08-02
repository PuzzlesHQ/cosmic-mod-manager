import type { Prisma } from "@prisma-client";
import prisma from "~/services/prisma";
import valkey from "~/services/redis";
import { TEAM_DATA_CACHE_KEY } from "~/types/namespaces";
import { cacheKey, GetData_FromCache, SetCache, TEAM_DATA_CACHE_EXPIRY_seconds } from "./_cache";
import { GetManyUsers_ByIds, type TUser } from "./user_item";

function TEAM_SELECT_FIELDS() {
    return {
        id: true,

        members: {
            select: {
                id: true,
                teamId: true,
                userId: true,
                role: true,
                isOwner: true,
                permissions: true,
                organisationPermissions: true,
                accepted: true,
                dateAccepted: true,

                user: {
                    select: {
                        id: true,
                    },
                },
            },
            orderBy: { dateAccepted: "asc" },
        },

        project: {
            select: {
                id: true,
            },
        },

        organisation: {
            select: {
                id: true,
            },
        },
    } satisfies Prisma.TeamSelect;
}

type TTeamFromDb = Awaited<ReturnType<typeof GetTeam_FromDb>>;
function GetTeam_FromDb(teamId: string) {
    return prisma.team.findUnique({
        where: {
            id: teamId,
        },
        select: TEAM_SELECT_FIELDS(),
    });
}

type TBaseMember = NonNullable<TTeamFromDb>["members"][number];
type TExtendedMember = Omit<TBaseMember, "user"> & {
    user: {
        id: TUser["id"];
        userName: TUser["userName"];
        avatar: TUser["avatar"];
    };
};

export type TTeam = Omit<NonNullable<TTeamFromDb>, "members"> & {
    members: TExtendedMember[];
};

export async function GetTeam(teamId: string): Promise<TTeam | null> {
    let team = await GetData_FromCache<TTeamFromDb>(TEAM_DATA_CACHE_KEY, teamId);
    if (!team) team = await GetTeam_FromDb(teamId);
    if (!team) return null;

    await Set_TeamCache(TEAM_DATA_CACHE_KEY, team.id, team);

    // Get all members of the team
    const teamUserIds = team.members.map((member) => member.userId);
    const users = await GetManyUsers_ByIds(teamUserIds);

    const members: TExtendedMember[] = [];
    for (const member of team.members) {
        const user = users.find((user) => user.id === member.userId);
        if (!user) continue;

        members.push({
            ...member,
            user: {
                id: user.id,
                userName: user.userName,
                avatar: user.avatar,
            },
        });
    }

    return {
        ...team,
        members: members,
    };
}

export type TManyTeams = TTeam[];
export async function GetManyTeams_ById(ids: string[]): Promise<TManyTeams> {
    const uniqueTeamIds = Array.from(new Set(ids));
    const teams = [];
    const userIds = new Set<string>();

    // Getting cached items
    const teamsFromCache: string[] = [];
    {
        const promises = [];
        for (const id of uniqueTeamIds) {
            const cachedTeam = GetData_FromCache<TTeamFromDb>(TEAM_DATA_CACHE_KEY, id);
            promises.push(cachedTeam);
        }

        for (const team of await Promise.all(promises)) {
            if (!team) continue;

            teamsFromCache.push(team.id);
            teams.push(team);
            for (const member of team.members) {
                userIds.add(member.userId);
            }
        }
    }

    // Get the remaining teams from the database
    const remainingTeamsIds = uniqueTeamIds.filter((id) => !teamsFromCache.includes(id));
    const remainingTeams =
        remainingTeamsIds.length > 0
            ? await prisma.team.findMany({
                  where: {
                      id: { in: remainingTeamsIds },
                  },
                  select: TEAM_SELECT_FIELDS(),
              })
            : [];

    // Cache the remaining teams
    {
        const promises = [];
        for (const team of remainingTeams) {
            promises.push(Set_TeamCache(TEAM_DATA_CACHE_KEY, team.id, team));

            teams.push(team);
            for (const member of team.members) {
                userIds.add(member.userId);
            }
        }
        await Promise.all(promises);
    }
    // Get the user data of all the team members
    const users = await GetManyUsers_ByIds(Array.from(userIds));

    // Attach user data to the team members
    const formattedTeams: TManyTeams = teams.map((team) => {
        const members: TExtendedMember[] = [];
        for (const member of team.members) {
            const user = users.find((user) => user.id === member.userId);
            if (!user) continue;

            members.push(
                Object.assign(member, {
                    user: {
                        id: user.id,
                        userName: user.userName,
                        avatar: user.avatar,
                    },
                }),
            );
        }

        return { ...team, members: members };
    });

    return formattedTeams;
}

export async function DeleteTeam<T extends Prisma.TeamDeleteArgs>(args: Prisma.SelectSubset<T, Prisma.TeamDeleteArgs>) {
    const team = await prisma.team.delete(args);
    await Clear_TeamCache(team.id);
    return team;
}

// Cache
async function Set_TeamCache(NAMESPACE: string, id: string, data: TTeamFromDb) {
    await SetCache(NAMESPACE, id, JSON.stringify(data), TEAM_DATA_CACHE_EXPIRY_seconds);
}

export async function Clear_TeamCache(teamId: string) {
    await valkey.del(cacheKey(teamId, TEAM_DATA_CACHE_KEY));
}

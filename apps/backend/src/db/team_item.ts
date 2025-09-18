import type { Prisma } from "@prisma/client";
import { cacheKey } from "~/services/cache/utils";
import prisma from "~/services/prisma";
import valkey from "~/services/redis";
import { TEAM_DATA_CACHE_KEY } from "~/types/namespaces";
import { GetData_FromCache, SetCache, TEAM_DATA_CACHE_EXPIRY_seconds } from "./_cache";
import { TEAM_SELECT_FIELDS } from "./_queries";
import { GetManyUsers_ByIds } from "./user_item";

export type GetTeam_ReturnType = Awaited<ReturnType<typeof GetTeam_FromDb>>;
function GetTeam_FromDb(teamId: string) {
    return prisma.team.findUnique({
        where: {
            id: teamId,
        },
        select: TEAM_SELECT_FIELDS.select,
    });
}

export async function GetTeam(teamId: string) {
    let team = await GetData_FromCache<GetTeam_ReturnType>(TEAM_DATA_CACHE_KEY, teamId);
    if (!team) team = await GetTeam_FromDb(teamId);
    if (!team) return null;

    await Set_TeamCache(TEAM_DATA_CACHE_KEY, team.id, team);

    // Get all members of the team
    const TeamMember_UserIds = team.members.map((member) => member.userId);
    const Users = await GetManyUsers_ByIds(TeamMember_UserIds);

    const MembersList = [];
    for (const member of team.members) {
        const User = Users.find((user) => user.id === member.userId);
        if (!User) continue;

        MembersList.push({
            ...member,
            user: {
                id: User.id,
                userName: User.userName,
                avatar: User.avatar,
            },
        });
    }

    return {
        ...team,
        members: MembersList,
    };
}

export async function GetManyTeams_ById(ids: string[]) {
    const TeamIds = Array.from(new Set(ids));
    const Teams = [];
    const _UserIds = new Set<string>();

    // Getting cached items
    const TeamIds_RetrievedFromCache: string[] = [];
    {
        const _CachedTeams_promises = [];
        for (const id of TeamIds) {
            const cachedTeam = GetData_FromCache<GetTeam_ReturnType>(TEAM_DATA_CACHE_KEY, id);
            _CachedTeams_promises.push(cachedTeam);
        }

        const _CachedTeams = await Promise.all(_CachedTeams_promises);
        for (const team of _CachedTeams) {
            if (!team) continue;

            TeamIds_RetrievedFromCache.push(team.id);
            Teams.push(team);
            for (const member of team.members) {
                _UserIds.add(member.userId);
            }
        }
    }

    // Get the remaining teams from the database
    const TeamIds_ToRetrieve = TeamIds.filter((id) => !TeamIds_RetrievedFromCache.includes(id));
    const _Db_Teams =
        TeamIds_ToRetrieve.length > 0
            ? await prisma.team.findMany({
                  where: {
                      id: { in: TeamIds_ToRetrieve },
                  },
                  select: TEAM_SELECT_FIELDS.select,
              })
            : [];

    // Cache the remaining teams
    {
        const _Set_TeamCache_promises = [];
        for (const team of _Db_Teams) {
            _Set_TeamCache_promises.push(Set_TeamCache(TEAM_DATA_CACHE_KEY, team.id, team));

            Teams.push(team);
            for (const member of team.members) {
                _UserIds.add(member.userId);
            }
        }
        await Promise.all(_Set_TeamCache_promises);
    }
    // Get the user data of all the team members
    const Users = await GetManyUsers_ByIds(Array.from(_UserIds));

    // Attach user data to the team members
    const FormattedTeams = Teams.map((team) => {
        const MembersList = [];
        for (const member of team.members) {
            const User = Users.find((user) => user.id === member.userId);
            if (!User) continue;

            MembersList.push(Object.assign(member, { user: User }));
        }

        return { ...team, members: MembersList };
    });

    return FormattedTeams;
}

export function GetManyTeams<T extends Prisma.TeamFindManyArgs>(args: Prisma.SelectSubset<T, Prisma.TeamFindManyArgs>) {
    return prisma.team.findMany(args);
}

export async function DeleteTeam<T extends Prisma.TeamDeleteArgs>(args: Prisma.SelectSubset<T, Prisma.TeamDeleteArgs>) {
    const team = await prisma.team.delete(args);
    await Clear_TeamCache(team.id);
    return team;
}

// Cache
async function Set_TeamCache(NAMESPACE: string, id: string, data: GetTeam_ReturnType) {
    await SetCache(NAMESPACE, id, JSON.stringify(data), TEAM_DATA_CACHE_EXPIRY_seconds);
}

export async function Clear_TeamCache(teamId: string) {
    await valkey.del(cacheKey(teamId, TEAM_DATA_CACHE_KEY));
}

import type { Prisma } from "@prisma/client";
import prisma from "~/services/prisma";
import { Clear_TeamCache } from "./team_item";
import { Delete_UserOrganizationsCache, Delete_UserProjectsCache } from "./user_item";

export async function CreateTeamMember<T extends Prisma.TeamMemberCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.TeamMemberCreateArgs>,
) {
    const data = await prisma.teamMember.create(args);
    await Promise.all([
        Clear_TeamCache(data.teamId),
        Delete_UserProjectsCache(data.userId),
        Delete_UserOrganizationsCache(data.userId),
    ]);
    return data;
}

export async function Create_ManyTeamMembers<T extends Prisma.TeamMemberCreateManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.TeamMemberCreateManyArgs>,
    teamIds: string[],
    userIds: string[],
) {
    const data = await prisma.teamMember.createMany(args);
    {
        const _DeleteCache_Promises = [];
        for (const teamId of teamIds) {
            _DeleteCache_Promises.push(Clear_TeamCache(teamId));
        }
        for (const userId of userIds) {
            _DeleteCache_Promises.push(Delete_UserProjectsCache(userId));
            _DeleteCache_Promises.push(Delete_UserOrganizationsCache(userId));
        }
        await Promise.all(_DeleteCache_Promises);
    }
    return data;
}

export async function UpdateTeamMember<T extends Prisma.TeamMemberUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.TeamMemberUpdateArgs>,
) {
    const data = await prisma.teamMember.update(args);
    await Clear_TeamCache(data.teamId);
    return data;
}

export async function UpdateManyTeamMembers<T extends Prisma.TeamMemberUpdateManyArgs>(
    teamIds: string[],
    args: Prisma.SelectSubset<T, Prisma.TeamMemberUpdateManyArgs>,
) {
    const _DeleteCache_Promises = [];
    for (const id of teamIds) {
        _DeleteCache_Promises.push(Clear_TeamCache(id));
    }
    await Promise.all(_DeleteCache_Promises);
    return await prisma.teamMember.updateMany(args);
}

export async function DeleteTeamMember<T extends Prisma.TeamMemberDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.TeamMemberDeleteArgs>,
) {
    const data = await prisma.teamMember.delete(args);
    await Promise.all([
        Clear_TeamCache(data.teamId),
        Delete_UserProjectsCache(data.userId),
        Delete_UserOrganizationsCache(data.userId),
    ]);
    return data;
}

export async function Delete_ManyTeamMembers<T extends Prisma.TeamMemberDeleteManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.TeamMemberDeleteManyArgs>,
    teamIds: string[],
    userIds: string[],
) {
    const data = await prisma.teamMember.deleteMany(args);
    {
        const _DeleteCache_Promises = [];
        for (const teamId of teamIds) {
            _DeleteCache_Promises.push(Clear_TeamCache(teamId));
        }

        for (const userId of userIds) {
            _DeleteCache_Promises.push(Delete_UserProjectsCache(userId));
            _DeleteCache_Promises.push(Delete_UserOrganizationsCache(userId));
        }

        await Promise.all(_DeleteCache_Promises);
    }
    return data;
}

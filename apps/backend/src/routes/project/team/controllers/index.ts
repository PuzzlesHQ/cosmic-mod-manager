import { doesMemberHaveAccess, doesOrgMemberHaveAccess, getCurrMember } from "@app/utils/project";
import type { overrideOrgMemberFormSchema, updateTeamMemberFormSchema } from "@app/utils/schemas/project/settings/members";
import { hasRootAccess } from "@app/utils/src/constants/roles";
import { OrganisationPermission, ProjectPermission } from "@app/utils/types";
import { NotificationType } from "@app/utils/types/api/notification";
import type { Context } from "hono";
import type { z } from "zod/v4";
import { GetOrganization_BySlugOrId } from "~/db/organization_item";
import { GetManyProjects_ListItem, GetProject_ListItem } from "~/db/project_item";
import { CreateTeamMember, DeleteTeamMember, Delete_ManyTeamMembers, UpdateTeamMember } from "~/db/team-member_item";
import { GetTeam } from "~/db/team_item";
import { GetUser_ByIdOrUsername } from "~/db/user_item";
import { addInvalidAuthAttempt } from "~/middleware/rate-limit/invalid-auth-attempt";
import { createNotification } from "~/routes/user/notification/controllers/helpers";
import type { ContextUserData } from "~/types";
import { HTTP_STATUS, invalidReqestResponseData, notFoundResponseData, unauthorizedReqResponseData } from "~/utils/http";
import { generateDbId } from "~/utils/str";

export async function inviteMember(ctx: Context, userSession: ContextUserData, userSlug: string, teamId: string) {
    const Team = await GetTeam(teamId);
    if (!Team) return notFoundResponseData("Team not found");

    // The team will either be associated with a project or an organization, one of them will be null
    const [TeamProject, TeamOrg] = await Promise.all([
        Team.project?.id ? GetProject_ListItem(Team.project?.id) : null,
        Team.organisation?.id ? GetOrganization_BySlugOrId(undefined, Team.organisation?.id) : null,
    ]);
    if (!TeamProject && !TeamOrg) return notFoundResponseData();

    // Organization associated with the team's project
    const TeamProjects_Org = TeamProject?.organisationId
        ? await GetOrganization_BySlugOrId(undefined, TeamProject.organisationId)
        : null;

    let canManageInvites = false;
    // Handle organiszation team invite
    if (TeamOrg?.id) {
        const currMember = Team.members.find((member) => member.userId === userSession.id);
        canManageInvites = doesOrgMemberHaveAccess(
            OrganisationPermission.MANAGE_INVITES,
            currMember?.organisationPermissions as OrganisationPermission[],
            currMember?.isOwner,
            userSession.role,
        );
    }
    // Handle project team invite
    else {
        const currMember = getCurrMember(userSession.id, Team.members || [], TeamProjects_Org?.team.members || []);
        canManageInvites = doesMemberHaveAccess(
            ProjectPermission.MANAGE_INVITES,
            currMember?.permissions as ProjectPermission[],
            currMember?.isOwner,
            userSession.role,
        );
    }
    if (!canManageInvites) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData("You don't have access to manage member invites");
    }

    const targetUser = await GetUser_ByIdOrUsername(userSlug, userSlug);
    if (!targetUser?.id) return notFoundResponseData("User not found");

    const existingMember = Team.members.find((member) => member.userId === targetUser.id);
    if (existingMember) {
        if (existingMember.accepted === false)
            return invalidReqestResponseData(`"${targetUser.userName}" has already been invited to this team`);
        return invalidReqestResponseData(`"${targetUser.userName}" is already a member of this team`);
    }

    let isAlreadyProjectOrgMember = false;
    if (TeamProjects_Org?.id) {
        const orgMembership = TeamProjects_Org?.team?.members.find((member) => member.userId === targetUser.id);
        isAlreadyProjectOrgMember = !!orgMembership?.id && orgMembership.accepted;

        if (orgMembership?.isOwner === true) {
            return invalidReqestResponseData("You cannot override the permissions of organization's owner in a project team");
        }
    }

    // No need to send an invite if the user is already a member of the organisation which the project belongs to
    const defaultAccepted = isAlreadyProjectOrgMember;
    const newMember = await CreateTeamMember({
        data: {
            id: generateDbId(),
            teamId: Team.id,
            userId: targetUser.id,
            role: "Member",
            isOwner: false,
            permissions: [],
            organisationPermissions: [],
            accepted: defaultAccepted === true,
            dateAccepted: defaultAccepted === true ? new Date() : null,
        },
    });

    if (defaultAccepted) return { data: { success: true }, status: HTTP_STATUS.OK };

    if (TeamOrg?.id) {
        await createNotification({
            id: generateDbId(),
            userId: targetUser.id,
            type: NotificationType.ORGANIZATION_INVITE,
            body: {
                teamId: Team.id,
                orgId: TeamOrg.id,
                invitedBy: userSession.id,
                role: newMember.role,
            },
        });
    } else if (TeamProject) {
        await createNotification({
            id: generateDbId(),
            userId: targetUser.id,
            type: NotificationType.TEAM_INVITE,
            body: {
                teamId: Team.id,
                projectId: TeamProject.id,
                invitedBy: userSession.id,
                role: newMember.role,
            },
        });
    }

    return { data: { success: true }, status: HTTP_STATUS.OK };
}

export async function acceptProjectTeamInvite(ctx: Context, userSession: ContextUserData, teamId: string) {
    const Team = await GetTeam(teamId);
    if (!Team) return notFoundResponseData();

    const TargetMember = Team.members.find((member) => member.userId === userSession.id && member.accepted === false);
    if (!TargetMember?.id || TargetMember.accepted) {
        await addInvalidAuthAttempt(ctx);
        return invalidReqestResponseData();
    }

    await UpdateTeamMember({
        where: {
            id: TargetMember.id,
        },
        data: {
            accepted: true,
            dateAccepted: new Date(),
        },
    });

    return { data: { success: true, message: "Joined successfully" }, status: HTTP_STATUS.OK };
}

export async function leaveProjectTeam(ctx: Context, userSession: ContextUserData, teamId: string) {
    const Team = await GetTeam(teamId);
    if (!Team) return notFoundResponseData();

    const TargetMember = Team.members.find((member) => member.userId === userSession.id);
    if (!TargetMember?.id) {
        await addInvalidAuthAttempt(ctx);
        return invalidReqestResponseData("You're not a member of this team");
    }
    if (TargetMember.isOwner === true) return invalidReqestResponseData("You can't leave the team while you're the owner");

    // If this is a project team, the project is part of an organization and, the user is also part of the organization
    // Then the user shouldn't be allowed to leave the project team directly, this would cause the overriden permissions to reset to default
    // which might be a bad thing in some cases
    const TeamProject = Team.project?.id ? await GetProject_ListItem(undefined, Team.project.id) : null;

    if (TeamProject?.id && TeamProject.organisationId) {
        const UserIsPartOf_TeamProjects_Org = TeamProject.organisation?.team.members.some(
            (member) => member.userId === TargetMember.userId,
        );
        if (UserIsPartOf_TeamProjects_Org)
            return invalidReqestResponseData(
                "You can't leave the project team directly, please leave the parent organization in order to be removed from this project team!",
            );
    }

    // Remove the member from the team
    await DeleteTeamMember({
        where: {
            id: TargetMember.id,
        },
    });

    // If this is an organization team, remove the member from all the projects of the organization
    // This should only be done if the user is an accepted member of the organization
    // Reason: If the user is still a pending member of the organization, then the only reason they are in any of the org project's team
    // is because they were explicitly added to the project, we don't want to remove members from the project in this case
    if (Team.organisation?.id && TargetMember.accepted === true) {
        await removeMemberFromAllOrgProjects(Team.organisation.id, TargetMember.userId);
    }

    return { data: { success: true, message: "Left the project team" }, status: HTTP_STATUS.OK };
}

export async function editProjectMember(
    ctx: Context,
    userSession: ContextUserData,
    targetMemberId: string,
    teamId: string,
    formData: z.infer<typeof updateTeamMemberFormSchema>,
) {
    const Team = await GetTeam(teamId);
    if (!Team) return notFoundResponseData();

    const TeamProject = Team.project?.id ? await GetProject_ListItem(undefined, Team.project.id) : null;
    const currMember = getCurrMember(userSession.id, Team.members || [], TeamProject?.organisation?.team.members || []);
    let canEditMembers = false;

    if (Team.organisation?.id) {
        canEditMembers = doesOrgMemberHaveAccess(
            OrganisationPermission.EDIT_MEMBER,
            currMember?.organisationPermissions as OrganisationPermission[],
            currMember?.isOwner,
            userSession.role,
        );
    } else {
        canEditMembers = doesMemberHaveAccess(
            ProjectPermission.EDIT_MEMBER,
            currMember?.permissions as ProjectPermission[],
            currMember?.isOwner,
            userSession.role,
        );
    }
    if (!canEditMembers) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData("You don't have access to edit members");
    }

    const targetMember = Team.members.find((member) => member.id === targetMemberId);
    if (!targetMember?.id) return notFoundResponseData("Member not found");

    // Only owner can add permissions to the member
    if (!hasRootAccess(currMember?.isOwner, userSession.role)) {
        for (const permission of formData.permissions || []) {
            if (!targetMember.permissions.includes(permission)) {
                // If this is an org team, check if the user has access to edit default permissions
                if (Team.organisation?.id) {
                    const canEditDefaultPermissions = doesOrgMemberHaveAccess(
                        OrganisationPermission.EDIT_MEMBER_DEFAULT_PERMISSIONS,
                        currMember?.organisationPermissions as OrganisationPermission[],
                        currMember?.isOwner,
                        userSession.role,
                    );

                    if (canEditDefaultPermissions) break;
                }

                return unauthorizedReqResponseData("You don't have access to add permissions to the member");
            }
        }

        for (const permission of formData.organisationPermissions || []) {
            if (!targetMember.organisationPermissions.includes(permission)) {
                return unauthorizedReqResponseData("You don't have access to add permissions to the member");
            }
        }
    }

    const updatedPerms = {
        permissions: formData.permissions || [],
        organisationPermissions: Team.organisation?.id ? formData.organisationPermissions : [],
    };

    await UpdateTeamMember({
        where: {
            id: targetMember.id,
        },
        data: {
            role: formData.role,
            ...(targetMember.isOwner ? {} : updatedPerms),
        },
    });

    return { data: { success: true, message: "Member updated" }, status: HTTP_STATUS.OK };
}

export async function overrideOrgMember(
    ctx: Context,
    userSession: ContextUserData,
    teamId: string,
    formData: z.infer<typeof overrideOrgMemberFormSchema>,
) {
    const Team = await GetTeam(teamId);
    if (!Team) return notFoundResponseData();

    const TeamProject = Team.project?.id ? await GetProject_ListItem(undefined, Team.project.id) : null;
    if (!TeamProject?.id || !TeamProject.organisation?.id) return invalidReqestResponseData();

    const currMember = getCurrMember(userSession.id, Team?.members || [], TeamProject?.organisation?.team.members || []);
    const canEditMembers = doesMemberHaveAccess(
        ProjectPermission.EDIT_MEMBER,
        currMember?.permissions as ProjectPermission[],
        currMember?.isOwner,
        userSession.role,
    );
    if (!canEditMembers) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData("You don't have access to override members");
    }

    if (!hasRootAccess(currMember?.isOwner, userSession.role) && formData.permissions?.length)
        return unauthorizedReqResponseData("You don't have access to add permissions to a member");

    // Check if the user is a member of the organisation
    const orgMember = TeamProject.organisation.team.members.find((member) => member.userId === formData.userId);
    if (!orgMember) return notFoundResponseData("User is not a part of this project's organisation");
    if (!orgMember.accepted) return invalidReqestResponseData("User is still a pending member of the organization");

    // Check if the user is already a member of the project team
    const existingMember = Team.members.find((member) => member.userId === formData.userId);
    if (existingMember) return invalidReqestResponseData("User is already a member of this project's team");

    const targetUser = await GetUser_ByIdOrUsername(undefined, formData.userId);
    if (!targetUser) return notFoundResponseData("User not found");

    await CreateTeamMember({
        data: {
            id: generateDbId(),
            teamId: Team.id,
            userId: targetUser.id,
            role: formData.role,
            isOwner: false,
            permissions: orgMember.isOwner ? [] : formData.permissions,
            organisationPermissions: [],
            accepted: true,
            dateAccepted: new Date(),
        },
    });

    return { data: { success: true }, status: HTTP_STATUS.OK };
}

export async function removeProjectMember(ctx: Context, userSession: ContextUserData, targetMemberId: string, teamId: string) {
    const Team = await GetTeam(teamId);
    if (!Team) return notFoundResponseData();

    const TeamProject = Team.project?.id ? await GetProject_ListItem(undefined, Team.project.id) : null;

    const currMember = getCurrMember(userSession.id, Team.members || [], TeamProject?.organisation?.team.members || []);
    let canRemoveMembers = false;
    if (Team.organisation?.id) {
        canRemoveMembers = doesOrgMemberHaveAccess(
            OrganisationPermission.REMOVE_MEMBER,
            currMember?.organisationPermissions as OrganisationPermission[],
            currMember?.isOwner,
            userSession.role,
        );
    } else {
        canRemoveMembers = doesMemberHaveAccess(
            ProjectPermission.REMOVE_MEMBER,
            currMember?.permissions as ProjectPermission[],
            currMember?.isOwner,
            userSession.role,
        );
    }
    if (!canRemoveMembers) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData("You don't have access to remove members");
    }

    const targetMember = Team.members.find((member) => member.id === targetMemberId);
    if (!targetMember) {
        await addInvalidAuthAttempt(ctx);
        return invalidReqestResponseData("Member not found");
    }
    if (targetMember.isOwner === true) return invalidReqestResponseData("You can't remove the owner of the team");

    // Remove the member from the team
    await DeleteTeamMember({
        where: {
            id: targetMember.id,
        },
    });

    // If this is an organization team, remove the member from all the projects of the organization
    // For more info, check the comment in the leaveProjectTeam function
    if (Team.organisation?.id && targetMember.accepted === true) {
        await removeMemberFromAllOrgProjects(Team.organisation.id, targetMember.userId);
    }

    return { data: { success: true }, status: HTTP_STATUS.OK };
}

async function removeMemberFromAllOrgProjects(orgId: string, userId: string) {
    const Org = await GetOrganization_BySlugOrId(undefined, orgId);
    if (!Org?.id) return notFoundResponseData("Organization not found");

    const AllOrgProjects = await GetManyProjects_ListItem(Org.projects.map((project) => project.id));
    const IdsOfTeams_TheUserIsPartOf = [];
    for (const project of AllOrgProjects) {
        const isMember = project.team.members.some((member) => member.userId === userId);
        if (isMember) IdsOfTeams_TheUserIsPartOf.push(project.team.id);
    }

    await Delete_ManyTeamMembers(
        {
            where: {
                teamId: {
                    in: IdsOfTeams_TheUserIsPartOf,
                },
                userId: userId,
            },
        },
        IdsOfTeams_TheUserIsPartOf,
        [userId],
    );
}

import { DELETE_USER_ACCOUNT_EMAIL_VALIDITY_ms, SITE_NAME_SHORT } from "@app/utils/constants";
import { ConfirmationType } from "@app/utils/types";
import { DeleteManyCollections_ByUserId } from "~/db/collection_item";
import { DeleteManyOrganizations, GetManyOrganizations } from "~/db/organization_item";
import { GetManyProjects_ListItem, UpdateManyProjects } from "~/db/project_item";
import { CreateTeamMember, UpdateTeamMember } from "~/db/team-member_item";
import { DeleteUser, Get_UserProjects, GetUser_ByIdOrUsername } from "~/db/user_item";
import { DeleteUserConfirmation } from "~/db/userConfirmation_item";
import { hashString } from "~/routes/auth/helpers";
import { deleteCollectionDirectory, deleteUserDirectory } from "~/services/storage";
import { FILE_STORAGE_SERVICE } from "~/types";
import { isConfirmationCodeValid } from "~/utils";
import env from "~/utils/env";
import { HTTP_STATUS, invalidReqestResponseData, serverErrorResponseData } from "~/utils/http";
import { generateDbId } from "~/utils/str";

export async function confirmUserAccountDeletion(token: string) {
    const tokenHash = await hashString(token);
    // Deleting instead of Getting the code, because if it's valid
    // the operation is proceed normally otherwise the expired token will get deleted and the function will return;
    // No need to separately delete the confirmation token :P
    const confirmationEmail = await DeleteUserConfirmation({
        where: { accessCode: tokenHash, confirmationType: ConfirmationType.DELETE_USER_ACCOUNT },
    });

    if (
        !confirmationEmail?.id ||
        !isConfirmationCodeValid(confirmationEmail.dateCreated, DELETE_USER_ACCOUNT_EMAIL_VALIDITY_ms)
    ) {
        return invalidReqestResponseData("Expired or invalid code");
    }
    if (confirmationEmail.userId === env.ARCHIVE_USER_ID) {
        return invalidReqestResponseData("Cannot delete the archive user, set a different archiver account to delete this one.");
    }

    const user = await GetUser_ByIdOrUsername(undefined, confirmationEmail.userId);
    if (!user?.id) return serverErrorResponseData("Couldn't get the user data!");

    // Delete user owned organizations
    const userOrgs = await GetManyOrganizations({
        where: {
            team: {
                members: {
                    some: { userId: user.id, isOwner: true },
                },
            },
        },
        include: {
            projects: {
                select: { id: true },
            },
        },
    });

    // Move org projects to the archive user and delete the organizations
    if (userOrgs.length > 0) {
        const orgIds = [];
        const orgProjectIds = [];

        for (const org of userOrgs) {
            orgIds.push(org.id);
            orgProjectIds.push(...org.projects.map((project) => project.id));
        }

        await transferProjectsOwnership(orgProjectIds, env.ARCHIVE_USER_ID);
        await DeleteManyOrganizations(orgIds, {
            where: {
                id: { in: orgIds },
            },
        });
    }

    // Remove follows from the projects user was following
    await UpdateManyProjects(
        {
            where: {
                id: { in: user.followingProjects },
            },
            data: {
                followers: { decrement: 1 },
            },
        },
        user.followingProjects,
    );

    // Delete user collections
    const collectionIds = await DeleteManyCollections_ByUserId(user.id);
    await Promise.all(
        collectionIds.map((id) => {
            return deleteCollectionDirectory(FILE_STORAGE_SERVICE.LOCAL, id);
        }),
    );

    // Move user projects to the archive user
    const userProjects = await Get_UserProjects(user.id);
    if (userProjects.length > 0) {
        const userOwnedProjects = await GetManyProjects_ListItem(userProjects);
        const userOwnedProjects_Ids = [];
        for (const project of userOwnedProjects) {
            if (project.team.members.some((member) => member.userId === user.id && member.isOwner === true)) {
                userOwnedProjects_Ids.push(project.id);
            }
        }

        await transferProjectsOwnership(userOwnedProjects_Ids, env.ARCHIVE_USER_ID);
    }

    // ? User sessions, Auth accounts and Team Memberships are automatically deleted by the relation

    // Delete the actual user
    await DeleteUser({
        where: { id: user.id },
    });
    await deleteUserDirectory(FILE_STORAGE_SERVICE.LOCAL, user.id);

    return {
        data: {
            success: true,
            message: `Successfully deleted your ${SITE_NAME_SHORT} account`,
        },
        status: HTTP_STATUS.OK,
    };
}

// Transfers the ownership of the projects to a user,
// regardless of whether the user is a member of the project's team or not
async function transferProjectsOwnership(projectIds: string[], newOwnerUserId: string) {
    if (!projectIds.length) return;
    const projects = await GetManyProjects_ListItem(projectIds);

    for (const project of projects) {
        const currOwner = project.team.members.find((member) => member.isOwner);
        const existingMember = project.team.members.find((member) => member.userId === newOwnerUserId);

        // Remove the previous owner
        if (currOwner?.id) {
            await UpdateTeamMember({
                where: { id: currOwner.id },
                data: {
                    isOwner: false,
                    role: "Member",
                },
            });
        }

        // If the user is already a member, update their role
        if (existingMember) {
            await UpdateTeamMember({
                where: { id: existingMember.id },
                data: {
                    isOwner: true,
                    role: "Owner",
                },
            });
        } else {
            // Otherwise, create a new member
            await CreateTeamMember({
                data: {
                    id: generateDbId(),
                    teamId: project.teamId,
                    userId: newOwnerUserId,
                    isOwner: true,
                    role: "Owner",
                    dateAccepted: new Date(),
                    accepted: true,
                },
            });
        }
    }

    return;
}

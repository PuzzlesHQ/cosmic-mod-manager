import { getFileType } from "@app/utils/convertors";
import { doesOrgMemberHaveAccess, getCurrMember } from "@app/utils/project";
import type { orgSettingsFormSchema } from "@app/utils/schemas/organisation/settings/general";
import { ICON_WIDTH } from "@app/utils/src/constants";
import { hasFullItemAccess } from "@app/utils/src/constants/roles";
import { FileType, OrganisationPermission } from "@app/utils/types";
import type { Context } from "hono";
import type { z } from "zod/v4";
import { CreateFile, DeleteFile_ByID } from "~/db/file_item";
import {
    Delete_OrganizationCache_All,
    DeleteOrganization,
    GetOrganization_Data,
    UpdateOrganization,
} from "~/db/organization_item";
import { GetManyProjects_ListItem, GetProject_ListItem, UpdateManyProjects, UpdateProject } from "~/db/project_item";
import { Create_ManyTeamMembers, CreateTeamMember, Delete_ManyTeamMembers } from "~/db/team-member_item";
import { addInvalidAuthAttempt } from "~/middleware/rate-limit/invalid-auth-attempt";
import { UpdateProjects_SearchIndex } from "~/routes/search/search-db";
import { deleteOrgDirectory, deleteOrgFile, saveOrgFile } from "~/services/storage";
import { type ContextUserData, FILE_STORAGE_SERVICE } from "~/types";
import {
    HTTP_STATUS,
    invalidRequestResponseData,
    notFoundResponseData,
    serverErrorResponseData,
    unauthorizedReqResponseData,
} from "~/utils/http";
import { resizeImageToWebp } from "~/utils/images";
import { generateDbId } from "~/utils/str";

export async function updateOrg(
    ctx: Context,
    userSession: ContextUserData,
    orgId: string,
    formData: z.infer<typeof orgSettingsFormSchema>,
) {
    const org = await GetOrganization_Data(orgId);
    if (!org) return notFoundResponseData();

    // Permission check
    const currMember = org.team.members?.[0];
    const canEditOrg = doesOrgMemberHaveAccess(
        OrganisationPermission.EDIT_DETAILS,
        currMember?.organisationPermissions as OrganisationPermission[],
        currMember?.isOwner,
        userSession.role,
    );
    if (!canEditOrg) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData();
    }

    // Check slug validity if it's being updated
    if (formData.slug !== org.slug) {
        const existingOrg = await GetOrganization_Data(formData.slug, formData.slug);
        if (existingOrg?.id) return invalidRequestResponseData(`The slug "${formData.slug}" is already taken`);
    }

    let icon = org.iconFileId;
    if (!formData.icon && org.iconFileId) {
        const deletedDbFile = await DeleteFile_ByID(org.iconFileId);
        await deleteOrgFile(deletedDbFile.storageService as FILE_STORAGE_SERVICE, org.id, deletedDbFile.name);
        icon = null;
    }

    // Update the org icon
    if (formData.icon instanceof File) {
        const UpdateIconRes = await updateOrgIcon(ctx, userSession, orgId, formData.icon);
        if ("newIcon" in UpdateIconRes.data) {
            icon = UpdateIconRes.data.newIcon || null;
        }
    }

    const updatedOrg = await UpdateOrganization({
        where: {
            id: org.id,
        },
        data: {
            iconFileId: icon,
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
        },
    });

    // Update the index of org projects
    UpdateProjects_SearchIndex(org.projects.map((project) => project.id));

    return { data: { success: true, message: "Organization updated", slug: updatedOrg.slug }, status: HTTP_STATUS.OK };
}

export async function updateOrgIcon(
    ctx: Context,
    userSession: ContextUserData,
    orgId: string,
    icon: File,
    dontUpdateOrg = false,
) {
    const org = await GetOrganization_Data(orgId);
    if (!org) return notFoundResponseData("Organization not found");

    const currMember = org.team.members?.[0];
    const canUpdateIcon = doesOrgMemberHaveAccess(
        OrganisationPermission.EDIT_DETAILS,
        currMember?.organisationPermissions as OrganisationPermission[],
        currMember?.isOwner,
        userSession.role,
    );
    if (!canUpdateIcon) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData("You don't have the permission to update organization icon");
    }

    // Delete the previous icon if it exists
    if (org.iconFileId) {
        const deletedDbFile = await DeleteFile_ByID(org.iconFileId);
        await deleteOrgFile(deletedDbFile.storageService as FILE_STORAGE_SERVICE, org.id, deletedDbFile.name);
    }

    const UploadedImg_Type = await getFileType(icon);
    if (!UploadedImg_Type) return invalidRequestResponseData("Invalid file type");

    const savedImg_Type = FileType.WEBP;
    const orgIcon_Webp = await resizeImageToWebp(icon, UploadedImg_Type, {
        width: ICON_WIDTH,
        height: ICON_WIDTH,
        fit: "cover",
    });
    const iconImg_Id = `${generateDbId()}_${ICON_WIDTH}.${savedImg_Type}`;
    const icon_SaveUrl = await saveOrgFile(FILE_STORAGE_SERVICE.LOCAL, org.id, orgIcon_Webp, iconImg_Id);
    if (!icon_SaveUrl)
        return { data: { success: false, message: "Failed to save the icon" }, status: HTTP_STATUS.SERVER_ERROR };

    await CreateFile({
        data: {
            id: iconImg_Id,
            name: iconImg_Id,
            size: orgIcon_Webp.size,
            type: savedImg_Type,
            url: icon_SaveUrl,
            storageService: FILE_STORAGE_SERVICE.LOCAL,
        },
    });

    if (dontUpdateOrg === false) {
        await UpdateOrganization({
            where: {
                id: org.id,
            },
            data: {
                iconFileId: iconImg_Id,
            },
        });
    }

    return {
        data: { success: true, message: "Organization icon updated", newIcon: iconImg_Id },
        status: HTTP_STATUS.OK,
    };
}

export async function deleteOrgIcon(ctx: Context, userSession: ContextUserData, orgId: string) {
    const org = await GetOrganization_Data(orgId);
    if (!org) return notFoundResponseData("Organization not found");
    if (!org.iconFileId) return invalidRequestResponseData("Org does not have any icon");

    const currMember = org.team.members?.[0];
    const canDeleteIcon = doesOrgMemberHaveAccess(
        OrganisationPermission.EDIT_DETAILS,
        currMember?.organisationPermissions as OrganisationPermission[],
        currMember?.isOwner,
        userSession.role,
    );
    if (!canDeleteIcon) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData("You don't have the permission to delete organization icon");
    }

    const deletedDbFile = await DeleteFile_ByID(org.iconFileId);
    await deleteOrgFile(deletedDbFile.storageService as FILE_STORAGE_SERVICE, org.id, deletedDbFile.name);

    await UpdateOrganization({
        where: {
            id: org.id,
        },
        data: {
            iconFileId: null,
        },
    });

    return { data: { success: true, message: "Organization icon deleted" }, status: HTTP_STATUS.OK };
}

export async function deleteOrg(ctx: Context, userSession: ContextUserData, orgId: string) {
    const org = await GetOrganization_Data(orgId);
    if (!org?.id) return notFoundResponseData();

    // Check if the member has the required permission to delete the org
    const currMember = org.team.members?.find((member) => member.userId === userSession.id);
    const canDeleteOrg = doesOrgMemberHaveAccess(
        OrganisationPermission.DELETE_ORGANIZATION,
        currMember?.organisationPermissions as OrganisationPermission[],
        currMember?.isOwner,
        userSession.role,
    );
    if (!canDeleteOrg) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData();
    }
    const orgOwner = org.team.members.find((member) => member.isOwner);
    if (!orgOwner) return serverErrorResponseData();

    // Delete icon
    if (org.iconFileId) await DeleteFile_ByID(org.iconFileId);

    // Delete storate directory
    await deleteOrgDirectory(FILE_STORAGE_SERVICE.LOCAL, org.id);

    const OrgProjects = await GetManyProjects_ListItem(org.projects.map((project) => project.id));
    const orgProjectIds: string[] = [];
    const projectTeamIds: string[] = [];
    const memberUserIds: string[] = [];

    for (const _orgProject of OrgProjects) {
        if (!_orgProject) continue;
        orgProjectIds.push(_orgProject.id);
        projectTeamIds.push(_orgProject.teamId);

        for (const member of _orgProject.team.members) {
            memberUserIds.push(member.userId);
        }
    }

    await Promise.all([
        // Remove the organisation from all projects
        UpdateManyProjects(
            {
                where: {
                    id: { in: orgProjectIds },
                },
                data: { organisationId: null },
            },
            orgProjectIds,
        ),

        // Reset the team members from all projects
        Delete_ManyTeamMembers(
            {
                where: {
                    teamId: {
                        in: projectTeamIds,
                    },
                },
            },
            projectTeamIds,
            memberUserIds,
        ),

        // Make the org owner the owner of all projects
        Create_ManyTeamMembers(
            {
                data: projectTeamIds.map((teamId) => ({
                    id: generateDbId(),
                    teamId: teamId,
                    userId: orgOwner.userId,
                    role: "Inherited Owner",
                    isOwner: true,
                    permissions: [],
                    organisationPermissions: [],
                    accepted: true,
                    dateAccepted: new Date(),
                })),
            },
            projectTeamIds,
            memberUserIds,
        ),

        // Delete the org
        DeleteOrganization({
            where: {
                id: org.id,
            },
        }),

        // Update org projects search index
        UpdateProjects_SearchIndex(orgProjectIds),
    ]);

    return { data: { success: true, message: "Organization deleted" }, status: HTTP_STATUS.OK };
}

export async function addProjectToOrganisation(userSession: ContextUserData, orgId: string, projectId: string) {
    const org = await GetOrganization_Data(orgId);
    if (!org) return notFoundResponseData("Organization not found");

    const currMember = getCurrMember(userSession.id, [], org.team.members);
    const canAddProjects = doesOrgMemberHaveAccess(
        OrganisationPermission.ADD_PROJECT,
        currMember?.organisationPermissions as OrganisationPermission[],
        currMember?.isOwner,
        userSession.role,
    );
    if (!canAddProjects)
        return unauthorizedReqResponseData("You don't have the permission to add projects to the organization");

    const Project = await GetProject_ListItem(projectId);
    if (!Project) return notFoundResponseData("Project not found");
    if (Project.organisationId) return invalidRequestResponseData("Project is already part of an organization");

    const projectMembership = Project.team.members?.[0];
    if (!hasFullItemAccess(projectMembership?.isOwner, userSession.role))
        return unauthorizedReqResponseData("You are not the owner of the project");

    const memberUserIds = Project.team.members.map((member) => member.userId);

    await Promise.all([
        // Delete the team members from the project's current team
        Delete_ManyTeamMembers(
            {
                where: {
                    teamId: Project.teamId,
                },
            },
            [Project.teamId],
            memberUserIds,
        ),

        // Update the project
        UpdateProject({
            where: {
                id: Project.id,
            },
            data: {
                organisationId: org.id,
            },
        }),

        Delete_OrganizationCache_All(org.id, org.slug),
    ]);

    return { data: { success: true, message: "Project added to organization" }, status: HTTP_STATUS.OK };
}

export async function removeProjectFromOrg(
    ctx: Context,
    userSession: ContextUserData,
    orgId: string,
    projectId: string,
) {
    const org = await GetOrganization_Data(orgId);
    if (!org) return notFoundResponseData("Organization not found");

    const currMember = getCurrMember(userSession.id, [], org.team.members);
    const canRemoveProjects = doesOrgMemberHaveAccess(
        OrganisationPermission.REMOVE_PROJECT,
        currMember?.organisationPermissions as OrganisationPermission[],
        currMember?.isOwner,
        userSession.role,
    );
    if (!canRemoveProjects) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData("You don't have the permission to remove projects from the organization");
    }

    const _Org_projectId = org.projects.find((project) => project.id === projectId)?.id;
    if (!_Org_projectId) return notFoundResponseData("Project not found");

    const OrgProject = await GetProject_ListItem(_Org_projectId);
    if (!OrgProject || OrgProject.organisationId !== org.id) return notFoundResponseData("Project not found");

    const memberUserIds = OrgProject.team.members.map((member) => member.userId);

    await Promise.all([
        Delete_ManyTeamMembers(
            {
                where: {
                    teamId: OrgProject.teamId,
                },
            },
            [OrgProject.teamId],
            memberUserIds,
        ),

        CreateTeamMember({
            data: {
                id: generateDbId(),
                teamId: OrgProject.teamId,
                userId: userSession.id,
                role: "Inherited Owner",
                isOwner: true,
                permissions: [],
                organisationPermissions: [],
                accepted: true,
                dateAccepted: new Date(),
            },
        }),

        UpdateProject({
            where: {
                id: OrgProject.id,
            },
            data: {
                organisationId: null,
            },
        }),

        Delete_OrganizationCache_All(org.id, org.slug),
    ]);

    return { data: { success: true, message: "Project removed from organization" }, status: HTTP_STATUS.OK };
}

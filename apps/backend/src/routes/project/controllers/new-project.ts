import { GetProjectEnvironment } from "@app/utils/config/project";
import { doesOrgMemberHaveAccess } from "@app/utils/project";
import type { z } from "@app/utils/schemas";
import type { newProjectFormSchema } from "@app/utils/schemas/project";
import { OrganisationPermission, ProjectPublishingStatus } from "@app/utils/types";
import { ThreadType } from "@app/utils/types/api/thread";
import { GetOrganization_Data } from "~/db/organization_item";
import { CreateProject, GetProject_ListItem } from "~/db/project_item";
import { CreateTeamMember } from "~/db/team-member_item";
import prisma from "~/services/prisma";
import type { ContextUserData } from "~/types";
import { HTTP_STATUS, invalidReqestResponseData, unauthorizedReqResponseData } from "~/utils/http";
import { generateDbId } from "~/utils/str";

export async function createNewProject(userSession: ContextUserData, formData: z.infer<typeof newProjectFormSchema>) {
    const existingProjectWithSameUrl = await GetProject_ListItem(formData.slug, formData.slug);
    if (existingProjectWithSameUrl?.id) return invalidReqestResponseData("Url slug already taken");

    let orgId: string | null = null;
    if (formData.orgId) {
        const org = await GetOrganization_Data(formData.orgId);
        if (!org) return invalidReqestResponseData("Organisation not found");
        orgId = org.id;

        const currMember = org.team.members.find((member) => member.userId === userSession.id);
        const canAddProject = doesOrgMemberHaveAccess(
            OrganisationPermission.ADD_PROJECT,
            currMember?.organisationPermissions as OrganisationPermission[],
            currMember?.isOwner,
            userSession?.role,
        );
        if (!canAddProject) return unauthorizedReqResponseData("You do not have permission to add project to this organisation");
    }

    const newTeam = await prisma.team.create({
        data: {
            id: generateDbId(),
        },
    });

    // If this not an organisation project, add the user in project team as owner
    // else the org owner will be project owner
    if (!orgId) {
        await CreateTeamMember({
            data: {
                id: generateDbId(),
                teamId: newTeam.id,
                userId: userSession.id,
                role: "Owner",
                isOwner: true,
                permissions: [], // Owner does not need to have explicit permissions
                organisationPermissions: [],
                accepted: true,
                dateAccepted: new Date(),
            },
        });
    }

    const projectId = generateDbId();

    const thread = await prisma.thread.create({
        data: {
            id: generateDbId(),
            type: ThreadType.PROJECT,
            relatedEntity: projectId,
            members: [],
        },
    });

    const EnvSupport = GetProjectEnvironment(formData.type);
    const newProject = await CreateProject({
        data: {
            id: projectId,
            threadId: thread.id,
            teamId: newTeam.id,
            organisationId: orgId || null,
            name: formData.name,
            slug: formData.slug,
            type: formData.type,
            summary: formData.summary,
            visibility: formData.visibility,
            status: ProjectPublishingStatus.DRAFT,
            clientSide: EnvSupport.clientSide,
            serverSide: EnvSupport.serverSide,
        },
    });

    return {
        data: {
            success: true,
            message: "Successfully created new project",
            urlSlug: newProject.slug,
            type: newProject.type,
        },
        status: HTTP_STATUS.OK,
    };
}

import { doesMemberHaveAccess, getCurrMember } from "@app/utils/project";
import type { z } from "@app/utils/schemas";
import type { updateDescriptionFormSchema } from "@app/utils/schemas/project/settings/description";
import { ProjectPermission } from "@app/utils/types";
import { GetProject_ListItem, UpdateProject } from "~/db/project_item";
import type { ContextUserData } from "~/types";
import { HTTP_STATUS, notFoundResponseData, unauthorizedReqResponseData } from "~/utils/http";

export async function updateProjectDescription(
    projectId: string,
    userSession: ContextUserData,
    form: z.infer<typeof updateDescriptionFormSchema>,
) {
    const project = await GetProject_ListItem(projectId);
    if (!project?.id) return notFoundResponseData();

    const memberObj = getCurrMember(userSession.id, project.team?.members || [], project.organisation?.team.members || []);
    const hasEditAccess = doesMemberHaveAccess(
        ProjectPermission.EDIT_DESCRIPTION,
        memberObj?.permissions as ProjectPermission[],
        memberObj?.isOwner,
        userSession.role,
    );
    if (!hasEditAccess) return unauthorizedReqResponseData("You don't have the permission to update project description");

    await UpdateProject({
        where: { id: project.id },
        data: {
            description: form.description || "",
        },
    });

    return { data: { success: true, message: "Project description updated" }, status: HTTP_STATUS.OK };
}

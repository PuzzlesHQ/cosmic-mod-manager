import { isModerator } from "@app/utils/constants/roles";
import { getProjectOwner } from "@app/utils/project";
import { ProjectPublishingStatus, type ProjectVisibility } from "@app/utils/types";
import type { ModerationProjectItem } from "@app/utils/types/api/moderation";
import { NotificationType } from "@app/utils/types/api/notification";
import { type MessageBody, MessageType } from "@app/utils/types/api/thread";
import type { Prisma } from "@prisma-client";
import {
    GetManyProjects_ListItem,
    GetProject_Details,
    UpdateOrRemoveProject_FromSearchIndex,
    UpdateProject,
} from "~/db/project_item";
import { Log, Log_SubType } from "~/middleware/logger";
import { createNotification } from "~/routes/user/notification/controllers/helpers";
import prisma from "~/services/prisma";
import type { UserSessionData } from "~/types";
import { HTTP_STATUS, notFoundResponseData, serverErrorResponseData } from "~/utils/http";
import { generateDbId } from "~/utils/str";
import { orgIconUrl, projectIconUrl, userFileUrl } from "~/utils/urls";

export async function getModerationProjects() {
    const _ProjectIds = await prisma.project.findMany({
        where: {
            status: ProjectPublishingStatus.PROCESSING,
        },
        select: {
            id: true,
        },
        // A hard limit of 100 projects
        // TODO: Implement pagination
        take: 100,
    });
    if (!_ProjectIds) return { data: [], status: HTTP_STATUS.OK };

    const _ModerationProjects = await GetManyProjects_ListItem(_ProjectIds.map((p) => p.id));
    const projectsList: ModerationProjectItem[] = [];

    for (const project of _ModerationProjects) {
        if (!project) continue;

        let author: ModerationProjectItem["author"];
        if (project.organisation?.slug) {
            const org = project.organisation;

            author = {
                name: org.name,
                slug: org.slug,
                icon: orgIconUrl(org.id, org.iconFileId),
                isOrg: true,
            };
        } else {
            const owner = project.team.members[0].user;
            author = {
                name: owner.userName,
                slug: owner.userName,
                icon: userFileUrl(owner.id, owner.avatar),
                isOrg: false,
            };
        }

        projectsList.push({
            id: project.id,
            slug: project.slug,
            name: project.name,
            summary: project.summary,
            type: project.type,
            icon: projectIconUrl(project.id, project.iconFileId),
            downloads: project.downloads,
            followers: project.followers,
            dateQueued: project.dateQueued as Date,
            status: project.status as ProjectPublishingStatus,
            requestedStatus: project.requestedStatus as ProjectPublishingStatus,
            visibility: project.visibility as ProjectVisibility,
            author: author,
        });
    }

    return {
        data: projectsList,
        status: HTTP_STATUS.OK,
    };
}

export async function updateModerationProject(id: string, status: string, userSession: UserSessionData) {
    const project = await GetProject_Details(id);
    if (!project) return notFoundResponseData("Project not found");

    // let projectOwner
    const projectOwner = getProjectOwner(project.team.members, project.organisation?.team.members || []);
    if (!projectOwner?.id) return serverErrorResponseData("Couldn't find project owner, idk why :)");

    if (status === project?.status) {
        return {
            data: {
                success: false,
                message: `The project status is already '${status}'`,
            },
            status: HTTP_STATUS.OK,
        };
    }

    let updatedStatus = ProjectPublishingStatus.DRAFT;
    switch (status.toLowerCase()) {
        case ProjectPublishingStatus.APPROVED:
            updatedStatus = ProjectPublishingStatus.APPROVED;
            break;
        case ProjectPublishingStatus.REJECTED:
            updatedStatus = ProjectPublishingStatus.REJECTED;
            break;
        case ProjectPublishingStatus.WITHHELD:
            updatedStatus = ProjectPublishingStatus.WITHHELD;
            break;
    }

    const updateData: Prisma.ProjectUpdateInput = {};
    if (updatedStatus === ProjectPublishingStatus.APPROVED) {
        updateData.dateQueued = null;
        updateData.dateApproved = new Date();
        updateData.requestedStatus = null;
        updateData.status = updatedStatus;
    } else {
        updateData.status = updatedStatus;
        updateData.requestedStatus = null;
    }

    const UpdatedProject = await UpdateProject({
        where: { id: id },
        data: updateData,
    });

    // Update the search index
    await UpdateOrRemoveProject_FromSearchIndex(
        project.id,
        {
            visibility: project.visibility,
            status: project.status,
        },
        {
            visibility: UpdatedProject.visibility,
            status: UpdatedProject.status,
        },
    );

    Log(
        `Status of project ${id} updated to ${updatedStatus} from ${project.status} by ${userSession.id}`,
        undefined,
        Log_SubType.MODERATION,
    );

    // create a message in the project thread
    const msg_data: MessageBody = {
        type: MessageType.STATUS_CHANGE,
        body: {
            new_status: updatedStatus,
            prev_status: project.status as ProjectPublishingStatus,
        },
    };

    await prisma.threadMessage.create({
        data: {
            id: generateDbId(),
            threadId: project.threadId,
            authorId: userSession.id,
            type: msg_data.type,
            body: msg_data.body,
            authorHidden: isModerator(userSession.role),
        },
    });

    // Send a notification to the project owner
    await createNotification({
        id: generateDbId(),
        userId: projectOwner.userId,
        type: NotificationType.STATUS_CHANGE,
        body: {
            new_status: updatedStatus,
            prev_status: project.status as ProjectPublishingStatus,
            projectId: project.id,
        },
    });

    return {
        data: {
            success: true,
            message: `Project status updated to: ${updatedStatus}`,
        },
        status: HTTP_STATUS.OK,
    };
}

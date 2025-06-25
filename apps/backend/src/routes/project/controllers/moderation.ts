import { RejectedStatuses } from "@app/utils/config/project";
import { isModerator } from "@app/utils/constants/roles";
import { DateFromStr } from "@app/utils/date";
import { getCurrMember } from "@app/utils/project";
import { ProjectPublishingStatus } from "@app/utils/types";
import { NotificationType } from "@app/utils/types/api/notification";
import { type MessageBody, MessageType } from "@app/utils/types/api/thread";
import { GetProject_Details, UpdateProject } from "~/db/project_item";
import { Log, Log_SubType } from "~/middleware/logger";
import { createNotification } from "~/routes/user/notification/controllers/helpers";
import prisma from "~/services/prisma";
import type { ContextUserData } from "~/types";
import { HTTP_STATUS, invalidReqestResponseData } from "~/utils/http";
import { generateDbId } from "~/utils/str";

export async function QueueProjectForApproval(projectId: string, userSession: ContextUserData) {
    const project = await GetProject_Details(projectId);
    if (!project?.id) return invalidReqestResponseData("Project not found");

    const projectOwner = getCurrMember(userSession.id, project.team.members, project.organisation?.team?.members || []);
    if (!projectOwner?.isOwner) return invalidReqestResponseData("Only the owner can submit the project for review!");

    const currDate = new Date();

    // Don't allow resubmission before an interval of 3 hours from rejection
    if (RejectedStatuses.includes(project.status as ProjectPublishingStatus) && project.dateQueued) {
        const queuedOn = DateFromStr(project.dateQueued)?.getTime() || 0;
        const timeRemaining = 10800000 - (currDate.getTime() - queuedOn);
        if (timeRemaining > 0) {
            return invalidReqestResponseData(
                `Please wait for ${Math.round(timeRemaining / 60_000)} minutes before trying to resubmit again!`,
            );
        }
    }

    if (
        project.status !== ProjectPublishingStatus.DRAFT &&
        !RejectedStatuses.includes(project.status as ProjectPublishingStatus)
    ) {
        return invalidReqestResponseData("You cannot request for approval in project's current state!");
    }

    // Check if the project is eligible to be queued for approval
    // If project doesn't have any supported game versions, that means it hasn't uploaded any versions yet
    if (project.gameVersions.length <= 0)
        return invalidReqestResponseData("Project submitted for approval without any initial versions!");
    if (!project.description?.length) return invalidReqestResponseData("Project submitted for approval without a description!");
    if (!project.licenseId && !project.licenseName)
        return invalidReqestResponseData("Project submitted for approval without a license!");

    const newStatus = ProjectPublishingStatus.PROCESSING;

    await UpdateProject({
        where: { id: project.id },
        data: {
            status: newStatus,
            requestedStatus: ProjectPublishingStatus.APPROVED,
            dateQueued: currDate,
        },
    });

    Log(`Project ${project.id} queued for approval by ${userSession.id}`, undefined, Log_SubType.MODERATION);

    // create a message in the project thread
    const msg_data: MessageBody = {
        type: MessageType.STATUS_CHANGE,
        body: {
            new_status: newStatus,
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

    if (project.status !== ProjectPublishingStatus.DRAFT && newStatus !== ProjectPublishingStatus.PROCESSING) {
        // Send a notification to the project owner
        await createNotification({
            id: generateDbId(),
            userId: projectOwner.userId,
            type: NotificationType.STATUS_CHANGE,
            body: {
                new_status: newStatus,
                prev_status: project.status as ProjectPublishingStatus,
                projectId: project.id,
            },
        });
    }

    return {
        data: {
            success: true,
            message: "Project successfully queued for approval! Expect it to be done in 24-48 hours!",
        },
        status: HTTP_STATUS.OK,
    };
}

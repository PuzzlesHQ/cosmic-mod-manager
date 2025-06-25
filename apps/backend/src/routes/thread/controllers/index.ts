import { isModerator } from "@app/utils/constants/roles";
import type { z } from "@app/utils/schemas";
import type { createThreadMessage_Schema } from "@app/utils/schemas/thread";
import { GlobalUserRole } from "@app/utils/types";
import {
    type MessageBody,
    MessageType,
    type Thread,
    type ThreadMember,
    type ThreadMessage,
    ThreadType,
} from "@app/utils/types/api/thread";
import type { Thread as DB_Thread } from "@prisma/client";
import { GetProject_Details } from "~/db/project_item";
import { GetManyUsers_ByIds } from "~/db/user_item";
import prisma from "~/services/prisma";
import type { ContextUserData } from "~/types";
import { HTTP_STATUS, invalidReqestResponseData, unauthorizedReqResponseData } from "~/utils/http";
import { generateDbId } from "~/utils/str";
import { userIconUrl } from "~/utils/urls";

export async function GetThreadMessages(user: ContextUserData, threadId: string) {
    const thread = await prisma.thread.findUnique({
        where: {
            id: threadId,
        },
        include: {
            messages: true,
        },
    });
    if (!thread?.id) return invalidReqestResponseData("Invalid thread ID");
    if (!canUserAccessThread(user, thread)) return unauthorizedReqResponseData();

    const memberIds = new Set<string>();
    const threadMessages: ThreadMessage[] = [];

    for (const msg of thread.messages) {
        const showAuthorInfo = !msg.authorHidden || isModerator(user.role);

        const msg_fields: Omit<ThreadMessage, "type" | "body"> = {
            id: msg.id,
            authorId: showAuthorInfo ? msg.authorId : GlobalUserRole.MODERATOR,
            createdAt: msg.created,
            authorHidden: msg.authorHidden,
        };

        const msg_body = msg.body as ThreadMessage["body"];

        switch (msg.type as MessageType) {
            case MessageType.TEXT:
            case MessageType.DELETED:
                if (!msg_body || !("text" in msg_body)) continue;
                if (msg_body?.isPrivate === true && !isModerator(user.role)) continue;

                threadMessages.push({
                    ...msg_fields,
                    type: msg.type as MessageType.TEXT | MessageType.DELETED,
                    body: {
                        text: msg_body?.text,
                        replying_to: msg_body?.replying_to,
                        isPrivate: msg_body?.isPrivate === true,
                    },
                });
                break;

            case MessageType.STATUS_CHANGE:
                if (!msg_body || !("prev_status" in msg_body)) continue;
                threadMessages.push({
                    ...msg_fields,
                    type: MessageType.STATUS_CHANGE,
                    body: {
                        prev_status: msg_body?.prev_status,
                        new_status: msg_body?.new_status,
                    },
                });
                break;

            case MessageType.THREAD_CLOSURE:
            case MessageType.THREAD_REOPEN:
                threadMessages.push({
                    ...msg_fields,
                    type: msg.type as MessageType.THREAD_CLOSURE | MessageType.THREAD_REOPEN,
                    body: null,
                });
                break;
        }

        if (showAuthorInfo) memberIds.add(msg.authorId);
    }

    const users = await GetManyUsers_ByIds(Array.from(memberIds));
    const formattedMembers: ThreadMember[] = [
        {
            id: GlobalUserRole.MODERATOR,
            role: GlobalUserRole.MODERATOR,
            avatar: null,
            userName: GlobalUserRole.MODERATOR,
        },
    ];

    for (const user of users) {
        formattedMembers.push({
            id: user.id,
            userName: user.userName,
            avatar: userIconUrl(user.id, user.avatar),
            role: user.role as GlobalUserRole,
        });
    }

    const formatted_thread: Thread = {
        id: thread.id,
        type: thread.type as ThreadType,
        relatedEntity: thread.relatedEntity,
        members: formattedMembers,
        messages: threadMessages,
    };

    return {
        data: formatted_thread,
        status: HTTP_STATUS.OK,
    };
}

export async function CreateThreadMessage(
    user: ContextUserData,
    threadId: string,
    data: z.infer<typeof createThreadMessage_Schema>,
) {
    if (data.isPrivate && !isModerator(user.role)) return unauthorizedReqResponseData("You cannot send private messages!");

    const thread = await prisma.thread.findUnique({
        where: {
            id: threadId,
        },
    });
    if (!thread?.id) return invalidReqestResponseData("Invalid thread ID");
    if (!canUserAccessThread(user, thread)) return unauthorizedReqResponseData();

    const msg_body: ThreadMessage["body"] = { text: data.message };
    if (data.isPrivate) msg_body.isPrivate = true;
    if (data.replyingTo) msg_body.replying_to = data.replyingTo;

    await prisma.threadMessage.create({
        data: {
            id: generateDbId(),
            threadId: thread.id,
            authorId: user.id,
            authorHidden: isModerator(user.role),
            type: MessageType.TEXT,
            body: msg_body,
        },
    });

    return {
        data: {
            success: true,
        },
        status: HTTP_STATUS.OK,
    };
}

export async function DeleteThreadMessage(user: ContextUserData, messageId: string) {
    if (!isModerator(user.role)) return invalidReqestResponseData("You can't delete the message!");

    const message = await prisma.threadMessage.findUnique({
        where: {
            id: messageId,
        },
    });
    if (!message?.id) return invalidReqestResponseData(`No message found with id: ${messageId}`);
    if (message.type !== MessageType.TEXT) return invalidReqestResponseData();
    if (message.authorId !== user.id) return unauthorizedReqResponseData();

    const msg_data = {
        type: message.type,
        body: message.body,
    } as MessageBody;

    const msg_update_data: ThreadMessage["body"] = {
        text: "",
    };

    if (msg_data.type === MessageType.TEXT) {
        if (msg_data.body.isPrivate === true) msg_update_data.isPrivate = true;
        if (msg_data.body.replying_to) msg_update_data.replying_to = msg_data.body.replying_to;
    }

    await prisma.threadMessage.update({
        where: {
            id: message.id,
        },
        data: {
            type: MessageType.DELETED,
            body: msg_update_data,
        },
    });

    return {
        data: {
            success: true,
        },
        status: HTTP_STATUS.OK,
    };
}

async function canUserAccessThread(user: ContextUserData, thread: DB_Thread) {
    if (thread.members.includes(user.id)) return true;
    if (isModerator(user.role)) return true;

    switch (thread.type) {
        case ThreadType.PROJECT: {
            const project = await GetProject_Details(undefined, thread.relatedEntity);
            if (!project?.id) return false;
            if (project.team.members.some((m) => m.userId === user.id)) return true;

            return false;
        }

        default:
            return false;
    }
}

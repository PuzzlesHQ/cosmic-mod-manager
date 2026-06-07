import type { GlobalUserRole, ProjectPublishingStatus } from "~/types/index";

export enum ThreadType {
    REPORT = "report",
    PROJECT = "project",
    DIRECT_MESSAGE = "direct_message",
}

export interface Thread {
    id: string;
    type: ThreadType;
    relatedEntity: string;
    members: ThreadMember[];
    messages: ThreadMessage[];
}

export interface ThreadMember {
    id: string;
    userName: string;
    avatar: string | null;
    role: GlobalUserRole;
}

export enum MessageType {
    TEXT = "text",
    STATUS_CHANGE = "status_change",
    THREAD_CLOSURE = "thread_closure",
    THREAD_REOPEN = "thread_reopen",
    DELETED = "deleted",
}

export type ThreadMessage = {
    id: string;
    authorId: string | null;
    createdAt: Date;
    authorHidden: boolean;
} & MessageBody;

export type MessageBody =
    | {
          type: MessageType.TEXT | MessageType.DELETED;
          body: {
              text: string;
              replying_to?: string;
              isPrivate?: boolean;
          };
      }
    | {
          type: MessageType.STATUS_CHANGE;
          body: {
              prev_status: ProjectPublishingStatus;
              new_status: ProjectPublishingStatus;
          };
      }
    | {
          type: MessageType.THREAD_CLOSURE | MessageType.THREAD_REOPEN;
          body: null;
      };

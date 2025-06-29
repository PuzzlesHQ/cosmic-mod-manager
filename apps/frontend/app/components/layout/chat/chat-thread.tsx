import { BrandIcon, fallbackUserIcon } from "@app/components/icons";
import RefreshPage from "@app/components/misc/refresh-page";
import { Button } from "@app/components/ui/button";
import { FormErrorMessage } from "@app/components/ui/form-message";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@app/components/ui/popover";
import { toast } from "@app/components/ui/sonner";
import { SuspenseFallback } from "@app/components/ui/spinner";
import { TooltipProvider, TooltipTemplate } from "@app/components/ui/tooltip";
import { cn } from "@app/components/utils";
import { isRejected, isUnderReview } from "@app/utils/config/project";
import { isModerator } from "@app/utils/constants/roles";
import { DateFromStr, FormatDate_ToLocaleString } from "@app/utils/date";
import type { z } from "@app/utils/schemas";
import type { createThreadMessage_Schema } from "@app/utils/schemas/thread/index";
import { GlobalUserRole, ProjectPublishingStatus } from "@app/utils/types";
import { MessageType, type Thread, type ThreadMember, type ThreadMessage as ThreadMessageT } from "@app/utils/types/api/thread";
import {
    BanIcon,
    LockIcon,
    MoreHorizontalIcon,
    MoreVerticalIcon,
    ReplyIcon,
    ScaleIcon,
    SendIcon,
    Trash2Icon,
    XIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import ConfirmDialog from "~/components/confirm-dialog";
import MarkdownRenderBox from "~/components/md-renderer";
import { ImgWrapper } from "~/components/ui/avatar";
import { FormattedDate } from "~/components/ui/date";
import Link, { useNavigate } from "~/components/ui/link";
import { ProjectStatusBadge } from "~/components/ui/project-status-badge";
import { useProjectData } from "~/hooks/project";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import { submitForReview } from "~/pages/project/publishing-checklist";
import UpdateProjectStatusDialog from "~/pages/project/update-project-status";
import clientFetch from "~/utils/client-fetch";
import { UserProfilePath } from "~/utils/urls";

interface ChatThreadProps {
    threadId: string;
}

export function ChatThread(props: ChatThreadProps) {
    const { t } = useTranslation();
    const session = useSession();
    const ctx = useProjectData();
    const navigate = useNavigate();
    const location = useLocation();

    const [thread, setThread] = useState<Thread | null | undefined>(undefined);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [editorText, setEditorText] = useState("");
    const [sendingMsg, setSendingMsg] = useState(false);

    if (!session) return;

    async function FetchThreadMessages() {
        const res = await clientFetch(`/api/thread/${props.threadId}`);
        if (!res.ok) return setThread(null);

        const _thread = (await res.json()) as Thread;
        setThread(_thread);
    }

    async function PostThreadMessage(isPrivate?: boolean) {
        if (!thread || !editorText.trim()) return;
        if (sendingMsg) return;
        setSendingMsg(true);

        try {
            const res = await clientFetch(`/api/thread/${thread.id}`, {
                method: "POST",
                body: JSON.stringify({
                    message: editorText,
                    isPrivate: isPrivate === true,
                    replyingTo: replyingTo || undefined,
                } satisfies z.infer<typeof createThreadMessage_Schema>),
            });

            if (!res.ok) {
                toast.error("Error sending message!", {
                    description: (await res.json())?.error,
                });

                return;
            }

            setEditorText("");
            setReplyingTo(null);
            await FetchThreadMessages();
        } finally {
            setSendingMsg(false);
        }
    }

    useEffect(() => {
        FetchThreadMessages();
    }, [props.threadId]);

    const replyingTo_user = useMemo((): ThreadMember | null => {
        if (!replyingTo || !thread) return null;
        const replyingTo_msg = thread.messages.find((msg) => msg.id === replyingTo);

        if (replyingTo_msg?.authorHidden && !isModerator(session?.role)) {
            return {
                id: GlobalUserRole.MODERATOR,
                userName: t.user.moderator,
                avatar: null,
                role: GlobalUserRole.MODERATOR,
            };
        }

        return thread.members.find((m) => m.id === replyingTo_msg?.authorId) || null;
    }, [replyingTo]);

    if (thread === undefined) {
        return <SuspenseFallback />;
    }
    if (!thread) return <FormErrorMessage text={`Error loading thread ${props.threadId}!`} />;

    return (
        <TooltipProvider>
            <div className="w-full grid bg-background/50 dark:bg-background rounded-lg">
                <div className="grid py-card-surround">
                    {thread.messages.map((msg, i) => {
                        const createdAt = DateFromStr(msg.createdAt);
                        const inResponseTo_msg =
                            msg.type === MessageType.TEXT && !!msg.body.replying_to
                                ? thread.messages.find((m) => m.id === msg.body.replying_to)
                                : undefined;

                        const inResponseTo_user = inResponseTo_msg
                            ? thread.members.find((u) => u.id === inResponseTo_msg.authorId)
                            : undefined;

                        return (
                            <ThreadMessage
                                key={`${msg.authorId}-${createdAt?.getTime()}`}
                                message={msg}
                                prevMsg={thread.messages[i - 1]}
                                members={thread.members}
                                replyingTo={replyingTo}
                                setReplyingTo={setReplyingTo}
                                inResponseTo={
                                    inResponseTo_msg
                                        ? {
                                              user: inResponseTo_user,
                                              msg: inResponseTo_msg,
                                          }
                                        : null
                                }
                                fetchThreadMessages={FetchThreadMessages}
                            />
                        );
                    })}

                    {!thread.messages.length && (
                        <span className="py-8 text-center text-extra-muted-foreground">{t.chatThread.noMessages}</span>
                    )}
                </div>

                <div className="grid gap-3 p-card-surround rounded-t-lg bg-card-background">
                    {!!replyingTo && (
                        <div className="flex items-center justify-between border-b border-shallow-background pb-2 px-1">
                            <span className="text-muted-foreground leading-none text-sm">
                                {t.chatThread.replyingTo(
                                    <Button
                                        key="replying-to-user"
                                        onClick={() => {
                                            scrollMsgIntoView(replyingTo);
                                        }}
                                        variant="link"
                                        className="p-0 inline h-fit leading-none"
                                    >
                                        {replyingTo_user?.userName}
                                    </Button>,
                                )}
                            </span>

                            <Button
                                variant="secondary"
                                size="icon"
                                className="!p-0.5 aspect-square !w-fit !h-fit rounded-full"
                                onClick={() => setReplyingTo(null)}
                            >
                                <XIcon className="w-btn-icon-sm h-btn-icon-sm" />
                            </Button>
                        </div>
                    )}

                    <div className="grid grid-cols-[1fr_auto] gap-2">
                        <div className="autoresizing-textarea" data-editor-value={editorText}>
                            <textarea
                                className={cn(
                                    "resize-none rounded overflow-y-auto",
                                    "bg-background/50 dark:bg-shallow-background/50 focus-within:bg-background/10 dark:focus-within:bg-shallow-background/10",
                                    "focus-visible:outline-none focus-visible:ring-2 ring-shallow-background",
                                )}
                                rows={1}
                                placeholder={t.chatThread.messagePlaceholder}
                                value={editorText}
                                onChange={(e) => setEditorText(e.target.value)}
                            />
                        </div>

                        <Button
                            onClick={() => PostThreadMessage()}
                            disabled={sendingMsg || !editorText.trim().length}
                            variant="secondary"
                        >
                            <SendIcon className="w-btn-icon-md h-btn-icon-md" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        {isModerator(session.role) && (
                            <Button
                                variant="secondary"
                                onClick={() => PostThreadMessage(true)}
                                disabled={sendingMsg || !editorText.trim().length}
                                title="Private messages are only accessible to Moderators"
                            >
                                <ScaleIcon className="w-btn-icon h-btn-icon" />
                                {t.chatThread.addPrivateNote}
                            </Button>
                        )}

                        {ctx.currUsersMembership?.isOwner && isRejected(ctx.projectData.status) && (
                            <ConfirmDialog
                                title={t.project.publishingChecklist.resubmitForReview}
                                confirmText={t.project.publishingChecklist.resubmitForReview}
                                onConfirm={() => submitForReview(ctx.projectData.id, () => RefreshPage(navigate, location))}
                                description={
                                    <>
                                        <span className="block">{t.moderation.resubmitDesc._1(ctx.projectData.name)}</span>
                                        <span className="block">{t.moderation.resubmitDesc._2}</span>
                                        <span className="block text-danger-foreground font-medium">
                                            {t.moderation.resubmitDesc.warning}
                                        </span>
                                    </>
                                }
                                confirmIcon={<ScaleIcon className="w-btn-icon h-btn-icon" />}
                                variant="moderation-submit"
                            >
                                <Button variant="moderation-submit">
                                    <ScaleIcon className="w-btn-icon h-btn-icon" />
                                    {t.project.publishingChecklist.resubmitForReview}
                                </Button>
                            </ConfirmDialog>
                        )}

                        {isModerator(session.role) && isUnderReview(ctx.projectData.status) && (
                            <>
                                <UpdateProjectStatusDialog
                                    projectId={ctx.projectData.id}
                                    projectName={ctx.projectData.name}
                                    projectType={ctx.projectData.type[0]}
                                    prevStatus={ctx.projectData.status}
                                    newStatus={ProjectPublishingStatus.APPROVED}
                                    trigger={{
                                        text: t.moderation.approve,
                                        size: "default",
                                        className: "justify-start",
                                    }}
                                />

                                <UpdateProjectStatusDialog
                                    projectId={ctx.projectData.id}
                                    projectName={ctx.projectData.name}
                                    projectType={ctx.projectData.type[0]}
                                    prevStatus={ctx.projectData.status}
                                    newStatus={ProjectPublishingStatus.REJECTED}
                                    trigger={{
                                        text: t.moderation.reject,
                                        size: "default",
                                        variant: "secondary-destructive",
                                        className: "justify-start",
                                    }}
                                    dialogConfirmBtn={{ variant: "destructive" }}
                                />

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button size="icon" className="rounded-full" variant="outline">
                                            <MoreVerticalIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="min-w-0 w-fit p-1" align="end">
                                        <UpdateProjectStatusDialog
                                            projectId={ctx.projectData.id}
                                            projectName={ctx.projectData.name}
                                            projectType={ctx.projectData.type[0]}
                                            prevStatus={ctx.projectData.status}
                                            newStatus={ProjectPublishingStatus.WITHHELD}
                                            trigger={{
                                                text: t.moderation.withhold,
                                                variant: "ghost-destructive",
                                                className: "justify-start",
                                            }}
                                            dialogConfirmBtn={{ variant: "destructive" }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
}

interface ThreadMessageProps {
    message: ThreadMessageT;
    prevMsg: ThreadMessageT | undefined;
    members: ThreadMember[];
    replyingTo: string | null;
    setReplyingTo: (msgId: string) => void;
    inResponseTo: {
        user: ThreadMember | undefined;
        msg: ThreadMessageT | undefined;
    } | null;
    fetchThreadMessages: () => Promise<void>;
}

const msgHighlightTimeoutMap = new Map<string, number | undefined>();

function ThreadMessage(props: ThreadMessageProps) {
    const { t } = useTranslation();
    const session = useSession();

    const msg = props.message;
    const author = props.members.find((m) => m.id === msg.authorId);
    const msgAuthorHidden = msg.authorHidden && !isModerator(session?.role);
    const profileUrl = author?.id && !msgAuthorHidden ? UserProfilePath(author.userName) : null;

    const now = new Date();
    const createdAt = DateFromStr(props.message.createdAt);
    const prevMsgCreatedAt = DateFromStr(props.prevMsg?.createdAt);

    const isContinuationMessage =
        props.prevMsg &&
        props.prevMsg.authorId === props.message.authorId && // Is from the same user,
        (createdAt?.getTime() || 0) - (prevMsgCreatedAt?.getTime() || 0) < 1000 * 60 * 10 && // was sent within next 10 minutes
        createdAt?.getDate() === prevMsgCreatedAt?.getDate() && // and was sent on the same day
        !(props.message.type === MessageType.TEXT && props.message.body.replying_to);

    const authorUsername = author?.id && !msgAuthorHidden ? author.userName : t.user.moderator;

    let msgText: React.ReactNode = null;
    switch (msg.type) {
        case MessageType.TEXT:
            msgText = <MarkdownRenderBox text={msg.body.text} className="text-muted-foreground" />;
            break;

        case MessageType.DELETED:
            msgText = (
                <div className="text-danger-foreground text-sm gap-1">
                    <BanIcon className="inline mb-[0.25ch] w-btn-icon-sm h-btn-icon-sm" /> {t.chatThread.messageDeleted}
                </div>
            );
            break;

        case MessageType.STATUS_CHANGE: {
            if (msg.body.new_status === ProjectPublishingStatus.PROCESSING) {
                msgText = <p>{t.chatThread.projectSubmittedForReview}</p>;
            } else {
                msgText = (
                    <p className="flex items-center justify-start gap-space">
                        {t.chatThread.changedProjectStatus(
                            <ProjectStatusBadge key="prev-status" status={msg.body.prev_status} t={t} />,
                            <ProjectStatusBadge key="new-status" status={msg.body.new_status} t={t} />,
                        )}
                    </p>
                );
            }
            break;
        }

        // case MessageType.THREAD_CLOSURE:
        //     msgText = <p>closed the thread.</p>;
        //     break;

        // case MessageType.THREAD_REOPEN:
        //     msgText = <p>reopened the thread.</p>;
        //     break;
    }

    const showFullDate = now.getDate() !== createdAt?.getDate() && !isContinuationMessage;
    const fullDate = FormatDate_ToLocaleString(props.message.createdAt, { shortMonthNames: true });

    const timestamp_class = "text-muted-foreground text-xs leading-none cursor-default";
    const timestamp = showFullDate ? (
        <span className={timestamp_class}>{fullDate}</span>
    ) : (
        <TooltipTemplate content={FormattedDate({ date: props.message.createdAt })}>
            <span className={timestamp_class}>
                <FormattedDate date={props.message.createdAt} includeDay={false} includeMonth={false} includeYear={false} />
            </span>
        </TooltipTemplate>
    );

    const avatar =
        author?.id && !msgAuthorHidden ? (
            <ImgWrapper
                className="w-auto h-auto aspect-square rounded-full"
                src={author.avatar}
                alt={author.userName}
                fallback={fallbackUserIcon}
            />
        ) : (
            <ImgWrapper
                style={{ gridArea: "avatar" }}
                src={""}
                alt={msg.authorId || ""}
                fallback={<BrandIcon className="w-[65%] h-[65%]" />}
                className="w-auto h-auto aspect-square rounded-full"
            />
        );

    async function DeleteMessage() {
        const res = await clientFetch(`/api/thread/message/${msg.id}`, {
            method: "DELETE",
        });
        if (!res.ok) {
            return toast.error("Error deleting message");
        }

        await props.fetchThreadMessages();
    }

    const isReplyToAMsg = props.inResponseTo?.user?.id === session?.id && props.message.authorId !== session?.id;
    const isSelectedMsgForReply = props.replyingTo === msg.id;

    let specialNameColor = "";
    let senderTitle = author?.userName;

    if (author?.role) {
        switch (author.role) {
            case GlobalUserRole.MODERATOR:
                specialNameColor = "text-blue-500 dark:text-blue-400";
                senderTitle += ` (${t.user.moderator})`;
                break;
            case GlobalUserRole.ADMIN:
                specialNameColor = "text-purple-600 dark:text-purple-400";
                senderTitle += ` (${t.user.admin})`;
                break;
        }
    }

    return (
        <div
            className={cn(
                "w-full grid gap-x-panel-cards px-card-surround py-1.5 mt-3 first:mt-0 border-s-2 border-transparent relative group/chat-msg",
                !isReplyToAMsg && !isSelectedMsgForReply && "hover:bg-card-background dark:hover:bg-card-background/35",
                isContinuationMessage && "mt-0",
                isReplyToAMsg &&
                    !isSelectedMsgForReply &&
                    "border-orange-400 bg-orange-500/10 hover:bg-orange-500/5 dark:bg-orange-300/10 dark:hover:bg-orange-300/5",
                isSelectedMsgForReply && "border-blue-400 bg-blue-300/15",
            )}
            id={msgElemId(msg.id)}
            style={{
                gridTemplateAreas: props.inResponseTo
                    ? `"reply reply" "avatar info" "avatar body"`
                    : `"avatar info" "avatar body"`,
                gridTemplateColumns: "2.5rem 1fr",
                gridTemplateRows: props.inResponseTo ? "fit-content fit-content 1fr" : "fit-content 1fr",
            }}
        >
            {isContinuationMessage ? (
                <div className="invisible group-hover/chat-msg:visible" style={{ gridArea: "avatar" }}>
                    {timestamp}
                </div>
            ) : profileUrl ? (
                <Link to={profileUrl} tabIndex={-1} className="h-fit" style={{ gridArea: "avatar" }}>
                    {avatar}
                </Link>
            ) : (
                avatar
            )}

            {!!props.inResponseTo && props.inResponseTo.msg?.type === MessageType.TEXT && (
                <div
                    style={{ gridArea: "reply" }}
                    className="flex items-center justify-start gap-space text-xs text-extra-muted-foreground hover:text-muted-foreground cursor-pointer pb-2 group/replied-msg-preview"
                    onClick={() => {
                        const msgId = props.inResponseTo?.msg?.id;
                        if (!msgId) return;

                        scrollMsgIntoView(msgId);
                        highlightChatMessage(msgId, msgHighlightTimeoutMap);
                    }}
                >
                    <div style={{ gridArea: "reply-illustration" }} className="relative grid w-12 h-full shrink-0">
                        <div
                            className={cn(
                                "absolute start-[1.25rem] end-0 top-[50%] bottom-[-0.2rem] border-s-[0.1rem] border-t-[0.1rem] rounded-ss-sm",
                                "border-shallower-background group-hover/replied-msg-preview:border-extra-muted-foreground/75",
                            )}
                        />
                    </div>
                    <ImgWrapper
                        src={props.inResponseTo.user?.avatar}
                        alt=" "
                        fallback={fallbackUserIcon}
                        className="w-4 h-4 rounded-full"
                    />
                    <strong>
                        @
                        {props.inResponseTo.msg.authorHidden && !isModerator(session?.role)
                            ? t.user.moderator
                            : props.inResponseTo.user
                              ? props.inResponseTo.user.userName
                              : "deleted_user"}
                    </strong>{" "}
                    <div className="line-clamp-1">{props.inResponseTo.msg?.body?.text}</div>
                </div>
            )}

            {!isContinuationMessage && (
                <div className="flex items-center justify-start mb-1 gap-3" style={{ gridArea: "info" }}>
                    <div className="flex items-center justify-center gap-1.5">
                        {profileUrl ? (
                            <Link
                                to={profileUrl}
                                className={cn("w-fit text-base font-bold leading-none", specialNameColor)}
                                title={senderTitle}
                            >
                                {authorUsername}
                            </Link>
                        ) : (
                            <span className={cn("w-fit text-base font-bold leading-none", specialNameColor)}>
                                {authorUsername}
                            </span>
                        )}

                        {msg.type === MessageType.TEXT && msg.body.isPrivate === true && (
                            <span title="Only visible to moderators">
                                <LockIcon className="w-btn-icon-sm h-btn-icon-sm" />
                            </span>
                        )}
                    </div>

                    {timestamp}
                </div>
            )}

            <div style={{ gridArea: "body" }} className="text-muted-foreground">
                {msgText}
            </div>

            {props.message.type === MessageType.TEXT && (
                <Popover>
                    <PopoverTrigger className="ms-auto absolute top-0 end-0 translate-y-[-50%] bg-shallow-background px-1 py-0.5 rounded-md invisible group-hover/chat-msg:visible group-focus-within/chat-msg:visible">
                        <MoreHorizontalIcon className="w-btn-icon-lg h-btn-icon-lg" />
                    </PopoverTrigger>
                    <PopoverContent className="min-w-0 p-1" align="end">
                        <PopoverClose asChild>
                            <Button variant="ghost" size="sm" onClick={() => props.setReplyingTo(msg.id)}>
                                <ReplyIcon className="w-btn-icon-md h-btn-icon-md" />
                                {t.chatThread.reply}
                            </Button>
                        </PopoverClose>

                        {session?.id === props.message.authorId && isModerator(session.role) && (
                            <ConfirmDialog
                                title={t.chatThread.deleteMsg}
                                confirmText={t.form.delete}
                                onConfirm={DeleteMessage}
                                description={t.chatThread.sureToDeleteMsg}
                                variant="destructive"
                            >
                                <Button variant="ghost-destructive" size="sm">
                                    <Trash2Icon className="w-btn-icon h-btn-icon" />
                                    {t.form.delete}
                                </Button>
                            </ConfirmDialog>
                        )}
                    </PopoverContent>
                </Popover>
            )}
        </div>
    );
}

function scrollMsgIntoView(msgId: string) {
    document.querySelector(`#${msgElemId(msgId)}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
    });
}

function msgElemId(msgId: string) {
    return `msg-${msgId}`;
}

function highlightChatMessage(msgId: string, timeoutIdMap: Map<string, number | undefined>) {
    if (timeoutIdMap.has(msgId)) window.clearTimeout(timeoutIdMap.get(msgId));
    document.querySelector(`#${msgElemId(msgId)}`)?.classList.add("msg-highlight");

    const timeoutId = window.setTimeout(() => {
        document.querySelector(`#${msgElemId(msgId)}`)?.classList.remove("msg-highlight");
        timeoutIdMap.delete(msgId);
    }, 3500);
    timeoutIdMap.set(msgId, timeoutId);
}

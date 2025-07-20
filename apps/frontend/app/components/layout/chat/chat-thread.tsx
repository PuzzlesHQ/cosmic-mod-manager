import { isRejected, isUnderReview } from "@app/utils/config/project";
import { isModerator } from "@app/utils/constants/roles";
import { DateFromStr, FormatDate_ToLocaleString } from "@app/utils/date";
import { scrollElementIntoView } from "@app/utils/dom";
import type { z } from "@app/utils/schemas";
import type { createThreadMessage_Schema } from "@app/utils/schemas/thread/index";
import { GlobalUserRole, ProjectPublishingStatus } from "@app/utils/types";
import type { DetailedReport } from "@app/utils/types/api/report";
import { MessageType, type Thread, type ThreadMember, type ThreadMessage as ThreadMessageT } from "@app/utils/types/api/thread";
import {
    BanIcon,
    CheckCircleIcon,
    HashIcon,
    LockIcon,
    LockKeyholeIcon,
    MoreHorizontalIcon,
    MoreVerticalIcon,
    ReplyIcon,
    ScaleIcon,
    SendIcon,
    Trash2Icon,
    XIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router";
import ConfirmDialog from "~/components/confirm-dialog";
import { BrandIcon, fallbackUserIcon } from "~/components/icons";
import MarkdownRenderBox from "~/components/md-editor/md-renderer";
import RefreshPage from "~/components/misc/refresh-page";
import { ImgWrapper } from "~/components/ui/avatar";
import { Button, buttonVariants } from "~/components/ui/button";
import { FormattedDate } from "~/components/ui/date";
import { FormErrorMessage } from "~/components/ui/form-message";
import Link, { useNavigate } from "~/components/ui/link";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { ProjectStatusBadge } from "~/components/ui/project-status-badge";
import { Separator } from "~/components/ui/separator";
import { toast } from "~/components/ui/sonner";
import { SuspenseFallback } from "~/components/ui/spinner";
import { TooltipProvider, TooltipTemplate } from "~/components/ui/tooltip";
import { cn } from "~/components/utils";
import { type ProjectContextData, useProjectData } from "~/hooks/project";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import { submitForReview } from "~/pages/project/publishing-checklist";
import UpdateProjectStatusDialog from "~/pages/project/update-project-status";
import clientFetch from "~/utils/client-fetch";
import { resJson } from "~/utils/server-fetch";
import { UserProfilePath } from "~/utils/urls";

interface ChatThreadProps {
    threadId: string;
    report?: DetailedReport;
}

export function ChatThread(props: ChatThreadProps) {
    const { t } = useTranslation();
    const session = useSession();
    const ctx = useProjectData() as ProjectContextData | null;
    const navigate = useNavigate();
    const location = useLocation();

    const [thread, setThread] = useState<Thread | null | undefined>(undefined);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [editorText, setEditorText] = useState("");
    const [sendingMsg, setSendingMsg] = useState(false);
    const [updatingReportStatus, setUpdatingReportStatus] = useState(false);

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

    async function updateReportStatus(closed: boolean) {
        if (!props.report) return;
        if (updatingReportStatus) return;
        setUpdatingReportStatus(true);

        try {
            const res = await clientFetch(`/api/report/${props.report.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    closed: closed,
                }),
            });

            if (!res.ok) {
                const err = await resJson<{ message: string }>(res);
                toast.error(closed === true ? "Error closing thread!" : "Error reopening thread!", {
                    description: err?.message,
                });
            }

            RefreshPage(navigate, location);
            await FetchThreadMessages();
            toast.success(closed === true ? "Closed thread successfully!" : "Reopened thread successfully!");
        } finally {
            setUpdatingReportStatus(false);
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

    useEffect(() => {
        if (!thread) return;

        if (location.hash) {
            const elem = document.querySelector(location.hash);
            if (!elem) return;

            scrollElementIntoView(elem, { block: "center" });
            elem.classList.add("msg-highlight");

            window.setTimeout(() => {
                elem.classList.remove("msg-highlight");
            }, 5000);
        } else {
            scrollElementIntoView(document.querySelector("#thread-bottom"), {
                block: "end",
            });
        }
    }, [thread?.id]);

    if (!session) return null;
    if (thread === undefined) return <SuspenseFallback />;
    if (!thread) return <FormErrorMessage text={`Error loading thread ${props.threadId}!`} />;

    const isThreadOpen = !props.report || props.report.closed === false;

    const isReportOpen = !!props.report && props.report.closed === false;
    const isReportClosed = !!props.report && props.report.closed === true;

    return (
        <TooltipProvider>
            <div className="grid w-full rounded-lg bg-background/50 dark:bg-background">
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
                        <span className="py-8 text-center text-foreground-extra-muted">{t.chatThread.noMessages}</span>
                    )}
                </div>

                <div className="grid gap-3 rounded-t-lg bg-card-background p-card-surround">
                    {!!replyingTo && (
                        <div className="flex items-center justify-between border-border border-b px-1 pb-2">
                            <span className="text-foreground-muted text-sm leading-none">
                                {t.chatThread.replyingTo(
                                    <Button
                                        key="replying-to-user"
                                        onClick={() => {
                                            scrollMsgIntoView(replyingTo);
                                        }}
                                        variant="link"
                                        className="inline h-fit p-0 leading-none"
                                    >
                                        {replyingTo_user?.userName}
                                    </Button>,
                                )}
                            </span>

                            <Button
                                variant="secondary"
                                size="icon"
                                className="!p-0.5 !w-fit !h-fit aspect-square rounded-full"
                                onClick={() => setReplyingTo(null)}
                            >
                                <XIcon className="h-btn-icon-sm w-btn-icon-sm" />
                            </Button>
                        </div>
                    )}
                    {!isThreadOpen ? (
                        <p className="text-foreground-muted">{t.chatThread.threadClosedDesc}</p>
                    ) : (
                        <div className="grid grid-cols-[1fr_auto] gap-2">
                            <div className="autoresizing-textarea" data-editor-value={editorText}>
                                <textarea
                                    className={cn(
                                        "resize-none overflow-y-auto rounded",
                                        "bg-raised-background focus:bg-transparent",
                                        "ring-raised-background focus-visible:outline-none focus-visible:ring-2",
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
                                <SendIcon className="h-btn-icon-md w-btn-icon-md" />
                            </Button>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                        {isReportOpen && (
                            <Button
                                variant="destructive"
                                onClick={() => updateReportStatus(true)}
                                disabled={updatingReportStatus}
                            >
                                <LockKeyholeIcon aria-hidden="true" className="h-btn-icon-md w-btn-icon-md" strokeWidth={2.2} />
                                {t.chatThread.closeThread}
                            </Button>
                        )}

                        {isReportClosed && (
                            <Button onClick={() => updateReportStatus(false)} disabled={updatingReportStatus}>
                                <CheckCircleIcon aria-hidden="true" className="h-btn-icon-md w-btn-icon-md" strokeWidth={2.2} />
                                {t.chatThread.reopenThread}
                            </Button>
                        )}

                        {isThreadOpen && isModerator(session.role) && (
                            <Button
                                variant="secondary"
                                onClick={() => PostThreadMessage(true)}
                                disabled={sendingMsg || !editorText.trim().length}
                                title="Private messages are only accessible to Moderators"
                            >
                                <ScaleIcon className="h-btn-icon w-btn-icon" />
                                {t.chatThread.addPrivateNote}
                            </Button>
                        )}

                        {ctx?.projectData?.id ? (
                            <>
                                {ctx.currUsersMembership?.isOwner && isRejected(ctx.projectData.status) && (
                                    <ConfirmDialog
                                        title={t.project.publishingChecklist.resubmitForReview}
                                        confirmText={t.project.publishingChecklist.resubmitForReview}
                                        onConfirm={() =>
                                            submitForReview(ctx.projectData.id, () => RefreshPage(navigate, location))
                                        }
                                        description={
                                            <>
                                                <span className="block">
                                                    {t.moderation.resubmitDesc._1(ctx.projectData.name)}
                                                </span>
                                                <span className="block">{t.moderation.resubmitDesc._2}</span>
                                                <span className="block font-medium text-danger-fg">
                                                    {t.moderation.resubmitDesc.warning}
                                                </span>
                                            </>
                                        }
                                        confirmIcon={<ScaleIcon className="h-btn-icon w-btn-icon" />}
                                        variant="moderation"
                                    >
                                        <Button variant="moderation">
                                            <ScaleIcon className="h-btn-icon w-btn-icon" />
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
                                                    <MoreVerticalIcon aria-hidden className="h-btn-icon w-btn-icon" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-fit min-w-0 p-1" align="end">
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
                            </>
                        ) : null}
                    </div>

                    <div id="thread-bottom" />
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

function ThreadMessage(props: ThreadMessageProps) {
    const { t } = useTranslation();
    const session = useSession();
    const msgHighlightTimeoutMap = useRef(new Map<string, number | undefined>());

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
        !(props.message.type === MessageType.TEXT && props.message.body.replying_to) &&
        isSameMessageType(props.message.type, props.prevMsg.type);

    const authorUsername = author?.id && !msgAuthorHidden ? author.userName : t.user.moderator;

    let msgText: React.ReactNode = null;
    switch (msg.type) {
        case MessageType.TEXT:
            msgText = <MarkdownRenderBox text={msg.body.text} className="chat-msg text-foreground-muted" />;
            break;

        case MessageType.DELETED:
            msgText = (
                <div className="gap-1 text-danger-fg text-sm">
                    <BanIcon className="mb-[0.25ch] inline h-btn-icon-sm w-btn-icon-sm" /> {t.chatThread.messageDeleted}
                </div>
            );
            break;

        case MessageType.STATUS_CHANGE: {
            if (msg.body.new_status === ProjectPublishingStatus.PROCESSING) {
                msgText = <p>{t.chatThread.projectSubmittedForReview}</p>;
            } else {
                msgText = (
                    <p className="flex flex-wrap items-center justify-start gap-space">
                        {t.chatThread.changedProjectStatus(
                            <ProjectStatusBadge key="prev-status" status={msg.body.prev_status} t={t} />,
                            <ProjectStatusBadge key="new-status" status={msg.body.new_status} t={t} />,
                        )}
                    </p>
                );
            }
            break;
        }

        case MessageType.THREAD_CLOSURE:
            msgText = (
                <p className="text-foreground-extra-muted">
                    <LockIcon aria-hidden="true" className="inline h-4 w-4" /> {t.chatThread.closedTheThread}
                </p>
            );
            break;

        case MessageType.THREAD_REOPEN:
            msgText = (
                <p className="text-foreground-extra-muted ">
                    <CheckCircleIcon aria-hidden="true" className="inline h-4 w-4" /> {t.chatThread.reopenedTheThread}
                </p>
            );
            break;
    }

    const showFullDate = now.getDate() !== createdAt?.getDate() && !isContinuationMessage;
    const fullDate = FormatDate_ToLocaleString(props.message.createdAt, { shortMonthNames: true });

    const timestamp_class = "text-foreground-muted text-xs leading-none cursor-default whitespace-nowrap";
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
                className="aspect-square h-auto w-auto rounded-full bg-card-background"
                src={author.avatar}
                alt={author.userName}
                fallback={fallbackUserIcon}
            />
        ) : (
            <ImgWrapper
                style={{ gridArea: "avatar" }}
                src={""}
                alt={msg.authorId || ""}
                fallback={<BrandIcon className="h-[65%] w-[65%]" />}
                className="aspect-square h-auto w-auto rounded-full bg-card-background"
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

    let userNameColor = "";
    let senderTitle = author?.userName;

    if (author?.role) {
        switch (author.role) {
            case GlobalUserRole.MODERATOR:
                userNameColor = "text-role-moderator-fg";
                senderTitle += ` (${t.user.moderator})`;
                break;
            case GlobalUserRole.ADMIN:
                userNameColor = "text-role-admin-fg";
                senderTitle += ` (${t.user.admin})`;
                break;
            default:
                userNameColor = "text-foreground-muted";
        }
    }

    return (
        <div
            className={cn(
                "group/chat-msg relative mt-3 grid w-full gap-x-panel-cards border-transparent border-s-2 px-card-surround py-1.5 first:mt-0",
                !isReplyToAMsg && !isSelectedMsgForReply && "hover:bg-card-background",
                isContinuationMessage && "mt-0",
                isReplyToAMsg &&
                    !isSelectedMsgForReply &&
                    "border-orange-400 bg-orange-500/10 hover:bg-orange-500/5 dark:bg-orange-300/5 dark:hover:bg-orange-300/10",
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
                // biome-ignore lint/a11y/noStaticElementInteractions: --
                // biome-ignore lint/a11y/useKeyWithClickEvents: --
                <div
                    style={{ gridArea: "reply" }}
                    className="group/replied-msg-preview flex cursor-pointer items-center justify-start gap-space pb-2 text-foreground-extra-muted text-xs hover:text-foreground-muted"
                    onClick={() => {
                        const msgId = props.inResponseTo?.msg?.id;
                        if (!msgId) return;

                        scrollMsgIntoView(msgId);
                        highlightChatMessage(msgId, msgHighlightTimeoutMap.current);
                    }}
                >
                    <div style={{ gridArea: "reply-illustration" }} className="relative grid h-full w-12 shrink-0">
                        <div
                            className={cn(
                                "absolute start-[1.25rem] end-0 top-[50%] bottom-[-0.2rem] rounded-ss-sm border-s-[0.1rem] border-t-[0.1rem]",
                                "border-hover-background-strong group-hover/replied-msg-preview:border-foreground-extra-muted",
                            )}
                        />
                    </div>
                    <ImgWrapper
                        src={props.inResponseTo.user?.avatar}
                        alt=" "
                        fallback={fallbackUserIcon}
                        className="h-4 w-4 rounded-full"
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
                <div className="mb-1 flex flex-wrap items-center justify-start gap-3" style={{ gridArea: "info" }}>
                    <div className="flex items-center justify-center gap-1.5">
                        {profileUrl ? (
                            <Link
                                to={profileUrl}
                                className={cn("w-fit font-medium text-base leading-none", userNameColor)}
                                title={senderTitle}
                            >
                                {authorUsername}
                            </Link>
                        ) : (
                            <span className={cn("w-fit font-medium text-base leading-none", userNameColor)}>
                                {authorUsername}
                            </span>
                        )}

                        {msg.type === MessageType.TEXT && msg.body.isPrivate === true && (
                            <span title="Only visible to moderators">
                                <LockIcon className="h-btn-icon-sm w-btn-icon-sm" />
                            </span>
                        )}
                    </div>

                    {timestamp}
                </div>
            )}

            <div style={{ gridArea: "body" }} className="text-foreground-muted">
                {msgText}
            </div>

            {props.message.type === MessageType.TEXT && (
                <Popover>
                    <PopoverTrigger className="invisible absolute end-0 top-0 ms-auto translate-y-[-25%] rounded-md bg-raised-background px-1 py-0.5 group-focus-within/chat-msg:visible group-hover/chat-msg:visible">
                        <MoreHorizontalIcon className="h-btn-icon-lg w-btn-icon-lg" />
                    </PopoverTrigger>
                    <PopoverContent className="min-w-0 p-1" align="end">
                        <PopoverClose asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => props.setReplyingTo(msg.id)}
                                className="justify-start"
                            >
                                <ReplyIcon className="h-btn-icon-md w-btn-icon-md" />
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
                                <Button variant="ghost-destructive" size="sm" className="justify-start">
                                    <Trash2Icon className="h-btn-icon w-btn-icon" />
                                    {t.form.delete}
                                </Button>
                            </ConfirmDialog>
                        )}

                        <Separator />

                        <PopoverClose asChild>
                            <a
                                href={`#${msgElemId(msg.id)}`}
                                className={buttonVariants({ variant: "ghost", size: "sm", className: "justify-start" })}
                            >
                                <HashIcon className="h-btn-icon w-btn-icon text-foreground-extra-muted" />
                                {t.chatThread.permalink}
                            </a>
                        </PopoverClose>
                    </PopoverContent>
                </Popover>
            )}
        </div>
    );
}

function scrollMsgIntoView(msgId: string) {
    scrollElementIntoView(document.querySelector(`#${msgElemId(msgId)}`), {
        block: "center",
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

function isSameMessageType(type1: MessageType, type2: MessageType): boolean {
    return (
        type1 === type2 ||
        (type1 === MessageType.TEXT && type2 === MessageType.DELETED) ||
        (type1 === MessageType.DELETED && type2 === MessageType.TEXT) ||
        (type1 === MessageType.THREAD_CLOSURE && type2 === MessageType.THREAD_REOPEN) ||
        (type1 === MessageType.THREAD_REOPEN && type2 === MessageType.THREAD_CLOSURE)
    );
}

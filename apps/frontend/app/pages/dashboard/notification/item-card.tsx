import { fallbackProjectIcon, fallbackUserIcon } from "@app/components/icons";
import { Button } from "@app/components/ui/button";
import { toast } from "@app/components/ui/sonner";
import { LoadingSpinner } from "@app/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@app/components/ui/tooltip";
import type { ProjectListItem } from "@app/utils/types/api";
import type {
    OrganizationInviteNotification,
    ProjectInviteNotification,
    StatusChangeNotification,
} from "@app/utils/types/api/notification";
import { imageUrl } from "@app/utils/url";
import { CalendarIcon, CheckCheckIcon, CheckIcon, Trash2Icon, XIcon } from "lucide-react";
import { useState } from "react";
import { ImgWrapper } from "~/components/ui/avatar";
import { FormattedDate, TimePassedSince } from "~/components/ui/date";
import Link, { useNavigate } from "~/components/ui/link";
import { ProjectStatusBadge } from "~/components/ui/project-status-badge";
import { useTranslation } from "~/locales/provider";
import { acceptTeamInvite, leaveTeam } from "~/pages/project/settings/members/utils";
import { ProjectPagePath, UserProfilePath } from "~/utils/urls";

interface Props {
    notification: ProjectInviteNotification | OrganizationInviteNotification;
    markNotificationAsRead: (notificationId: string, refresh?: boolean) => Promise<void>;
    deleteNotification: (notificationId: string) => Promise<void>;
    markingAsRead: boolean;
    deletingNotification: boolean;
    concise?: boolean;
    showMarkAsReadButton?: boolean;
    showDeleteButton?: boolean;
    pageUrl: string;
    invitedBy: {
        userName: string;
        avatar: string | null;
    };
    title: string;
    icon: string | null;
    navigateTo?: string;
    fallbackIcon?: React.ReactNode;
}

export function TeamInviteNotification({
    notification,
    markNotificationAsRead,
    deleteNotification,
    markingAsRead,
    deletingNotification,
    concise = false,
    showMarkAsReadButton = true,
    showDeleteButton = false,
    navigateTo,
    invitedBy,
    pageUrl,
    title,
    icon,
    fallbackIcon,
}: Props) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean | "accept" | "decline">(false);

    async function acceptInvite() {
        if (isLoading) return;
        setIsLoading("accept");

        try {
            const teamId = notification.body?.teamId as string;
            const result = await acceptTeamInvite(teamId);
            markNotificationAsRead(notification.id, false);

            if (!result?.success) {
                return toast.error(result?.message || "Failed to accept team invite");
            }

            toast.success(result?.message || "");
            if (navigateTo) navigate(navigateTo);
        } finally {
            setIsLoading(false);
        }
    }

    async function declineInvite() {
        if (isLoading) return;
        setIsLoading("decline");

        try {
            const teamId = notification.body?.teamId as string;
            const result = await leaveTeam(teamId);
            markNotificationAsRead(notification.id);

            if (!result?.success) {
                return toast.error(result?.message || "Error");
            }

            toast.success(result?.message || "");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <li className="w-full flex flex-col gap-2 bg-background/75 rounded p-card-surround" aria-label="Team Invite">
            <div className="w-full flex flow-row items-center justify-between">
                <div className="grow flex flex-wrap items-center justify-start gap-1">
                    <Link to={pageUrl} className="me-1.5" aria-label={title}>
                        <ImgWrapper src={icon || ""} alt={title} fallback={fallbackIcon} className="w-11 h-11" />
                    </Link>
                    <div className="flex items-center justify-start gap-x-space flex-wrap text-muted-foreground">
                        {t.dashboard.invitedToJoin(
                            <Link
                                key="invited-by"
                                aria-label={invitedBy.userName || (notification.body?.invitedBy as string)}
                                to={UserProfilePath(invitedBy.userName)}
                                className="flex items-center justify-center gap-1 font-semibold hover:underline text-foreground"
                            >
                                <ImgWrapper
                                    src={invitedBy?.avatar || ""}
                                    alt={invitedBy.userName || (notification.body?.invitedBy as string)}
                                    fallback={fallbackUserIcon}
                                    className="w-6 h-6 rounded-full"
                                />

                                {invitedBy.userName || notification.body?.invitedBy}
                            </Link>,

                            <Link key="invited-to" to={pageUrl} className="font-semibold hover:underline text-foreground">
                                {title}
                            </Link>,
                        )}
                    </div>
                </div>

                <TooltipProvider>
                    <div className="flex items-center justify-center gap-2">
                        {notification.read === false && concise === true && (
                            <>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="ghost-inverted"
                                            className="text-success-foreground"
                                            disabled={!!isLoading}
                                            onClick={acceptInvite}
                                        >
                                            {isLoading === "accept" ? (
                                                <LoadingSpinner size="xs" />
                                            ) : (
                                                <CheckIcon
                                                    aria-hidden
                                                    strokeWidth={2.2}
                                                    className="w-btn-icon-md h-btn-icon-md"
                                                />
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>{t.common.accept}</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost-inverted"
                                            size="icon"
                                            className="text-danger-foreground"
                                            disabled={!!isLoading}
                                            onClick={declineInvite}
                                        >
                                            {isLoading === "decline" ? (
                                                <LoadingSpinner size="xs" />
                                            ) : (
                                                <XIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>{t.common.decline}</TooltipContent>
                                </Tooltip>
                            </>
                        )}
                        {showMarkAsReadButton && !notification.read && (
                            <MarkReadNotif
                                disabled={markingAsRead || deletingNotification}
                                deleteNotif_text={t.dashboard.markRead}
                                markNotificationAsRead={() => markNotificationAsRead(notification.id)}
                            />
                        )}
                        {showDeleteButton && (
                            <DeleteNotif
                                disabled={markingAsRead || deletingNotification}
                                deleteNotif_text={t.dashboard.deleteNotif}
                                deleteNotification={() => deleteNotification(notification.id)}
                            />
                        )}
                    </div>
                </TooltipProvider>
            </div>
            {notification.read === false && concise === false && (
                <div className="w-fit flex items-center justify-start gap-x-2 gap-y-1">
                    <Button size="sm" disabled={!!isLoading} onClick={acceptInvite}>
                        {isLoading === "accept" ? (
                            <LoadingSpinner size="xs" />
                        ) : (
                            <CheckIcon aria-hidden strokeWidth={2.2} className="w-btn-icon h-btn-icon" />
                        )}
                        {t.common.accept}
                    </Button>

                    <Button variant="secondary-destructive-inverted" size="sm" disabled={!!isLoading} onClick={declineInvite}>
                        {isLoading === "decline" ? (
                            <LoadingSpinner size="xs" />
                        ) : (
                            <XIcon aria-hidden className="w-btn-icon h-btn-icon" />
                        )}
                        {t.common.decline}
                    </Button>
                </div>
            )}

            <NotifReceivedDate received_text={t.dashboard.received} dateCreated={notification.dateCreated} />
        </li>
    );
}

interface StatusChangeNotif_ItemProps
    extends Pick<
        Props,
        | "markNotificationAsRead"
        | "deleteNotification"
        | "markingAsRead"
        | "deletingNotification"
        | "concise"
        | "showMarkAsReadButton"
        | "showDeleteButton"
    > {
    notification: StatusChangeNotification;
    project: ProjectListItem | undefined;
}

export function StatusChangeNotif_Item({ notification, project, ...props }: StatusChangeNotif_ItemProps) {
    const { t } = useTranslation();

    const projectName = project?.name || notification.body.projectId;
    const projectPageUrl = ProjectPagePath(project?.type?.[0] || "mod", project?.slug || notification.body.projectId);

    return (
        <li className="w-full flex flex-col gap-2 bg-background/75 rounded p-card-surround" aria-label="Team Invite">
            <div className="w-full flex flow-row items-center justify-between">
                <div className="grow flex flex-wrap items-center justify-start gap-1">
                    <Link to={projectPageUrl} className="me-1.5" aria-label={projectName}>
                        <ImgWrapper
                            src={imageUrl(project?.icon)}
                            alt={projectName}
                            fallback={fallbackProjectIcon}
                            className="w-11 h-11"
                        />
                    </Link>
                    <div className="flex items-center justify-start gap-x-1 flex-wrap text-muted-foreground">
                        {t.dashboard.projectStatusUpdated(
                            <Link key="project" to={projectPageUrl} className="font-semibold hover:underline text-foreground">
                                {projectName}
                            </Link>,

                            <ProjectStatusBadge key="prev-status" status={notification.body.prev_status} t={t} />,
                            <ProjectStatusBadge key="new-status" status={notification.body.new_status} t={t} />,
                        )}
                    </div>
                </div>

                <TooltipProvider>
                    <div className="flex items-center justify-center gap-2">
                        {props.showMarkAsReadButton && !notification.read && (
                            <MarkReadNotif
                                disabled={props.markingAsRead || props.deletingNotification}
                                deleteNotif_text={t.dashboard.markRead}
                                markNotificationAsRead={() => props.markNotificationAsRead(notification.id)}
                            />
                        )}
                        {props.showDeleteButton && (
                            <DeleteNotif
                                disabled={props.markingAsRead || props.deletingNotification}
                                deleteNotif_text={t.dashboard.deleteNotif}
                                deleteNotification={() => props.deleteNotification(notification.id)}
                            />
                        )}
                    </div>
                </TooltipProvider>
            </div>

            <NotifReceivedDate received_text={t.dashboard.received} dateCreated={notification.dateCreated} />
        </li>
    );
}

interface NotifReceivedDateProps {
    received_text: string;
    dateCreated: string | Date;
}

function NotifReceivedDate(props: NotifReceivedDateProps) {
    return (
        <div className="w-fit flex items-baseline-with-fallback justify-center gap-1.5 text-extra-muted-foreground">
            <CalendarIcon aria-hidden className="h-btn-icon-sm w-btn-icon-sm" />
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span>
                            {props.received_text} <TimePassedSince date={props.dateCreated} />
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <FormattedDate date={props.dateCreated} />
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}

interface MarkReadProps {
    disabled: boolean;
    markNotificationAsRead: () => Promise<void>;
    deleteNotif_text: string;
}

function MarkReadNotif(props: MarkReadProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost-inverted"
                    className="text-extra-muted-foreground"
                    disabled={props.disabled}
                    onClick={props.markNotificationAsRead}
                >
                    <CheckCheckIcon aria-hidden className="w-btn-icon h-btn-icon" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>{props.deleteNotif_text}</TooltipContent>
        </Tooltip>
    );
}

interface DeleteNotifProps {
    disabled: boolean;
    deleteNotification: () => Promise<void>;
    deleteNotif_text: string;
}

function DeleteNotif(props: DeleteNotifProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost-inverted"
                    className="text-danger-foreground"
                    disabled={props.disabled}
                    onClick={props.deleteNotification}
                >
                    <Trash2Icon aria-hidden className="w-btn-icon h-btn-icon" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>{props.deleteNotif_text}</TooltipContent>
        </Tooltip>
    );
}

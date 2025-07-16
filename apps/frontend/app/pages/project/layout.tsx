import { isRejected, isUnderReview, RejectedStatuses } from "@app/utils/config/project";
import type { LoaderNames } from "@app/utils/constants/loaders";
import { getLoadersFromNames } from "@app/utils/convertors";
import { parseFileSize } from "@app/utils/number";
import SPDX_LICENSE_LIST from "@app/utils/src/constants/license-list";
import { isModerator, MODERATOR_ROLES } from "@app/utils/src/constants/roles";
import { Capitalize, CapitalizeAndFormatString } from "@app/utils/string";
import { ProjectPublishingStatus, ProjectVisibility } from "@app/utils/types";
import type { ProjectDetailsData, TeamMember } from "@app/utils/types/api";
import { ReportItemType } from "@app/utils/types/api/report";
import { imageUrl } from "@app/utils/url";
import { formatVersionsForDisplay } from "@app/utils/version/format";
import {
    ArrowUpRightIcon,
    BookOpenIcon,
    BookTextIcon,
    BugIcon,
    CalendarIcon,
    ClipboardCopyIcon,
    CodeIcon,
    CrownIcon,
    DownloadIcon,
    GitCommitHorizontalIcon,
    HeartIcon,
    SettingsIcon,
    TagsIcon,
} from "lucide-react";
import type React from "react";
import { Suspense, useContext } from "react";
import { Outlet, useLocation } from "react-router";
import { DiscordIcon, fallbackOrgIcon, fallbackProjectIcon, fallbackUserIcon } from "~/components/icons";
import tagIcons from "~/components/icons/tag-icons";
import { itemType, MicrodataItemProps, MicrodataItemType } from "~/components/microdata";
import { FileDownloader } from "~/components/misc/file-downloader";
import { PageHeader } from "~/components/misc/page-header";
import RefreshPage from "~/components/misc/refresh-page";
import { TextSpacer } from "~/components/misc/text";
import { ImgWrapper } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import Chip from "~/components/ui/chip";
import { FormattedCount } from "~/components/ui/count";
import { FormattedDate, TimePassedSince } from "~/components/ui/date";
import Link, { ButtonLink, LinkPrefetchStrategy, TextLink, useNavigate, VariantButtonLink } from "~/components/ui/link";
import { PopoverClose } from "~/components/ui/popover";
import { ProjectStatusBadge } from "~/components/ui/project-status-badge";
import { ReleaseChannelBadge } from "~/components/ui/release-channel-pill";
import { Separator } from "~/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { cn } from "~/components/utils";
import { useProjectData } from "~/hooks/project";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import ReportButton from "~/pages/report/report-btn";
import { isCurrLinkActive, OrgPagePath, ProjectPagePath, UserProfilePath, VersionPagePath } from "~/utils/urls";
import { AddToCollection_Popup } from "../collection/add-to-collection";
import { FollowProject_Btn } from "../collection/follow-btn";
import InteractiveDownloadPopup from "./interactive-download";
import TeamInvitationBanner from "./join-project-banner";
import ModerationBanner from "./moderation-banner";
import { PublishingChecklist } from "./publishing-checklist";
import SecondaryNav from "./secondary-nav";
import { ProjectSupprotedEnvironments } from "./supported-env";
import UpdateProjectStatusDialog from "./update-project-status";

export default function ProjectPageLayout() {
    const { t } = useTranslation();
    const { downloadFile } = useContext(FileDownloader);

    const session = useSession();
    const ctx = useProjectData();
    const projectData = ctx.projectData;

    const navigate = useNavigate();
    const customNavigate = useNavigate();
    const location = useLocation();

    const isVersionDetailsPage = isCurrLinkActive(
        ProjectPagePath(ctx.projectType, projectData.slug, "version/"),
        location.pathname,
        false,
    );
    const projectEnvironments = ProjectSupprotedEnvironments({
        clientSide: projectData.clientSide,
        serverSide: projectData.serverSide,
    });

    const projectLicenseData = {
        id: projectData.licenseId,
        name: projectData.licenseName,
        url: projectData.licenseUrl,
        text: "",
    };

    for (const license of SPDX_LICENSE_LIST) {
        if (license.licenseId === projectData.licenseId) {
            projectLicenseData.name = license.name;
            projectLicenseData.text = license?.text || "";
            if (!projectLicenseData.url) {
                projectLicenseData.url = license.link;
            }
            break;
        }
    }

    const listedLoaders = getLoadersFromNames(projectData.loaders);
    const OrgMembers = projectData.organisation?.members || [];
    const ExclusiveProjectMembers = [];
    for (const member of projectData.members) {
        if (OrgMembers.some((m) => m.userId === member.userId)) continue;
        ExclusiveProjectMembers.push(member);
    }

    const licensed_str = t.project.licensed(projectLicenseData.id || projectLicenseData.name || "");

    return (
        <main
            className="header-content-sidebar-layout w-full max-w-full gap-panel-cards pb-12"
            itemScope
            itemType={itemType(MicrodataItemType.CreativeWork)}
        >
            <ProjectInfoHeader
                projectData={projectData}
                fetchProjectData={async () => RefreshPage(navigate, location)}
                projectType={ctx.projectType}
                currUsersMembership={ctx.currUsersMembership}
            />

            {/* SIDEBAR */}
            <div className="page-sidebar grid h-fit w-full grid-cols-1 gap-panel-cards lg:w-sidebar">
                {ctx.allProjectVersions.length > 0 ? (
                    <Card className="grid h-fit w-full grid-cols-1 gap-3 p-card-surround">
                        <h2 className="font-extrabold text-lg">{t.project.compatibility}</h2>
                        <section>
                            <h3 className="flex pb-1 font-bold text-foreground-muted">{t.search.gameVersions}</h3>
                            <div className="flex w-full flex-wrap gap-1">
                                {formatVersionsForDisplay(projectData.gameVersions).map((version) => (
                                    <Chip key={version} className="text-foreground-muted">
                                        {version}
                                    </Chip>
                                ))}
                            </div>
                        </section>

                        {listedLoaders.length ? (
                            <section>
                                <h3 className="flex pb-1 font-bold text-foreground-muted">{t.search.loaders}</h3>
                                <div className="flex w-full flex-wrap gap-1">
                                    {listedLoaders.map((loader) => {
                                        const loaderIcon: React.ReactNode = tagIcons[loader.name as LoaderNames];

                                        return (
                                            <Chip
                                                key={loader.name}
                                                style={{
                                                    color: `hsla(var(--loader-fg-${loader.name}, --foreground-muted))`,
                                                }}
                                            >
                                                {loaderIcon ? loaderIcon : null}
                                                {CapitalizeAndFormatString(loader.name)}
                                            </Chip>
                                        );
                                    })}
                                </div>
                            </section>
                        ) : null}

                        {projectEnvironments?.length ? (
                            <section className="flex flex-wrap items-start justify-start gap-1">
                                <h3
                                    className="block w-full font-bold text-foreground-muted"
                                    title="Environment(s) the mod is made for"
                                >
                                    {t.project.environments}
                                </h3>
                                {projectEnvironments.map((item, i) => {
                                    // biome-ignore lint/suspicious/noArrayIndexKey: --
                                    return <Chip key={i}>{item}</Chip>;
                                })}
                            </section>
                        ) : null}
                    </Card>
                ) : null}

                {projectData?.issueTrackerUrl ||
                projectData?.projectSourceUrl ||
                projectData?.projectWikiUrl ||
                projectData?.discordInviteUrl ? (
                    <Card className="grid grid-cols-1 gap-1 p-card-surround">
                        <h2 className="pb-2 font-bold text-lg">{t.projectSettings.links}</h2>
                        {projectData?.issueTrackerUrl ? (
                            <ExternalLink
                                url={projectData?.issueTrackerUrl}
                                label={t.project.reportIssues}
                                icon={<BugIcon aria-hidden className="h-btn-icon w-btn-icon" />}
                            />
                        ) : null}

                        {projectData?.projectSourceUrl ? (
                            <ExternalLink
                                url={projectData?.projectSourceUrl}
                                label={t.project.viewSource}
                                icon={<CodeIcon aria-hidden className="h-btn-icon w-btn-icon" />}
                            />
                        ) : null}

                        {projectData?.projectWikiUrl ? (
                            <ExternalLink
                                url={projectData?.projectWikiUrl}
                                label={t.project.visitWiki}
                                icon={<BookOpenIcon aria-hidden className="h-btn-icon w-btn-icon" />}
                            />
                        ) : null}

                        {projectData?.discordInviteUrl ? (
                            <ExternalLink
                                url={projectData?.discordInviteUrl}
                                label={t.project.joinDiscord}
                                icon={
                                    <DiscordIcon aria-hidden className="h-btn-icon w-btn-icon fill-current dark:fill-current" />
                                }
                            />
                        ) : null}
                    </Card>
                ) : null}

                {(ctx.featuredProjectVersions?.length || 0) > 0 ? (
                    <Card className="grid grid-cols-1 gap-1 p-card-surround">
                        <h2 className="pb-2 font-bold text-lg">{t.project.featuredVersions}</h2>
                        <TooltipProvider>
                            {ctx.featuredProjectVersions?.map((version) => (
                                // biome-ignore lint/a11y/useKeyWithClickEvents: --
                                // biome-ignore lint/a11y/noStaticElementInteractions: --
                                <div
                                    key={version.id}
                                    className="bg_hover_stagger group/card flex w-full cursor-pointer items-start justify-start gap-2 rounded p-2 pb-2.5 text-foreground-muted hover:bg-background/75"
                                    onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                                        if (
                                            // @ts-expect-error
                                            !e.target.closest(".noClickRedirect")
                                        ) {
                                            const link = VersionPagePath(ctx.projectType, projectData.slug, version.slug);
                                            if (window.location.pathname !== link) {
                                                customNavigate(link);
                                            }
                                        }
                                    }}
                                >
                                    <div className="relative flex min-w-10 items-center justify-center">
                                        <ReleaseChannelBadge
                                            releaseChannel={version.releaseChannel}
                                            className=" group-focus-within/card:hidden group-hover/card:hidden"
                                        />
                                        <Tooltip>
                                            <TooltipTrigger
                                                asChild
                                                className="hidden group-focus-within/card:flex group-hover/card:flex"
                                            >
                                                <Button
                                                    className="noClickRedirect !w-10 !h-10 flex-shrink-0 rounded-full"
                                                    variant={isVersionDetailsPage ? "secondary" : "default"}
                                                    size="icon"
                                                    aria-label={t.project.downloadItem(version.primaryFile?.name || "")}
                                                    onClick={() => downloadFile(version.primaryFile?.url)}
                                                >
                                                    <DownloadIcon
                                                        aria-hidden
                                                        className="h-[1.07rem] w-[1.07rem]"
                                                        strokeWidth={2.2}
                                                    />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent className="hidden group-focus-within/card:flex group-hover/card:flex">
                                                {version?.primaryFile?.name} ({parseFileSize(version.primaryFile?.size || 0)})
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                    <div className="flex h-full w-fit grow select-text flex-col">
                                        <Link
                                            prefetch={LinkPrefetchStrategy.Render}
                                            to={VersionPagePath(ctx.projectType, projectData.slug, version.slug)}
                                            className="noClickRedirect w-fit"
                                        >
                                            <p className="font-bold leading-tight">{version.title}</p>
                                        </Link>
                                        <p className="text-pretty leading-tight">
                                            {version.loaders.map((loader) => CapitalizeAndFormatString(loader)).join(", ")}{" "}
                                            {formatVersionsForDisplay(version.gameVersions).join(", ")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </TooltipProvider>
                    </Card>
                ) : null}

                <Card className="grid grid-cols-1 gap-1 p-card-surround">
                    <h2 className="pb-1 font-bold text-lg">{t.project.creators}</h2>
                    {projectData.organisation?.id ? (
                        <>
                            <TeamMember_Card
                                vtId={projectData.organisation.id}
                                url={OrgPagePath(projectData.organisation.slug)}
                                userName={projectData.organisation.name}
                                isOwner={false}
                                roleName={t.project.organization}
                                avatarImageUrl={imageUrl(projectData.organisation.icon)}
                                avatarClassName="rounded"
                                fallbackIcon={fallbackOrgIcon}
                            />

                            {ExclusiveProjectMembers.length > 0 ? <Separator className="my-1" /> : null}
                        </>
                    ) : null}

                    {ExclusiveProjectMembers.map((member) => {
                        if (member.accepted !== true) return null;

                        return (
                            <TeamMember_Card
                                vtId={member.userId}
                                key={member.userId}
                                userName={member.userName}
                                isOwner={member.isOwner}
                                roleName={member.role || ""}
                                avatarImageUrl={imageUrl(member.avatar)}
                            />
                        );
                    })}
                </Card>

                <Card className="grid grid-cols-1 items-start justify-start gap-1 p-card-surround">
                    <h2 className="pb-2 font-bold text-lg">{t.project.details}</h2>

                    {projectLicenseData?.id || projectLicenseData?.name ? (
                        <div className="flex items-center justify-start gap-2 text-foreground-muted">
                            <BookTextIcon aria-hidden className="h-btn-icon w-btn-icon shrink-0" />
                            <p>
                                <TextSpacer text={licensed_str[0]} />
                                {projectLicenseData.url ? (
                                    <TextLink
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        to={projectLicenseData.url}
                                        className="font-bold"
                                        title={projectLicenseData.url}
                                    >
                                        {licensed_str[1]}
                                    </TextLink>
                                ) : (
                                    <span className="font-bold" title={projectLicenseData.text}>
                                        {licensed_str[1]}
                                    </span>
                                )}
                                <TextSpacer text={licensed_str[2]} spacing="before" />
                            </p>
                        </div>
                    ) : null}

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild className="cursor-text">
                                <p className="flex w-fit max-w-full items-center justify-start gap-2 text-foreground-muted">
                                    <CalendarIcon aria-hidden className="h-btn-icon w-btn-icon" />
                                    {t.settings.created(TimePassedSince({ date: projectData.datePublished }))}
                                </p>
                            </TooltipTrigger>
                            <TooltipContent>
                                <FormattedDate date={projectData.datePublished} />
                            </TooltipContent>
                        </Tooltip>

                        {ctx.allProjectVersions.length > 0 ? (
                            <Tooltip>
                                <TooltipTrigger asChild className="cursor-text">
                                    <p className="flex w-fit max-w-full items-center justify-start gap-2 text-foreground-muted">
                                        <GitCommitHorizontalIcon aria-hidden className="h-btn-icon w-btn-icon" />
                                        {t.project.updatedAt(TimePassedSince({ date: projectData.dateUpdated }))}
                                    </p>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <FormattedDate date={projectData.dateUpdated} />
                                </TooltipContent>
                            </Tooltip>
                        ) : null}
                    </TooltipProvider>
                </Card>
            </div>

            <div className="page-content grid h-fit grid-cols-1 gap-panel-cards overflow-auto">
                <SecondaryNav
                    urlBase={`/${ctx.projectType}/${projectData?.slug || ""}`}
                    className="h-fit rounded-lg bg-card-background px-3 py-2"
                    links={[
                        {
                            label: t.form.description,
                            href: "",
                        },
                        {
                            label: t.project.gallery,
                            href: "/gallery",
                            isShown: projectData.gallery.length > 0 || !!ctx.currUsersMembership,
                        },
                        {
                            label: t.project.changelog,
                            href: "/changelog",
                            isShown: Boolean(ctx.allProjectVersions.length),
                        },
                        {
                            label: t.project.versions,
                            href: "/versions",
                            isShown: !!ctx.allProjectVersions?.length || !!ctx.currUsersMembership,
                        },
                        {
                            label: t.moderation.moderation,
                            href: "/moderation",
                            isShown:
                                (!!ctx.currUsersMembership &&
                                    (isRejected(projectData.status) || isUnderReview(projectData.status))) ||
                                isModerator(session?.role),
                        },
                    ]}
                />

                <Outlet />
            </div>
        </main>
    );
}

interface HeaderProps {
    projectData: ProjectDetailsData;
    projectType: string;
    currUsersMembership: TeamMember | null;
    fetchProjectData: () => Promise<void>;
}

function ProjectInfoHeader({ projectData, projectType, currUsersMembership, fetchProjectData }: HeaderProps) {
    const { t } = useTranslation();
    const session = useSession();
    const isMod = session?.id && MODERATOR_ROLES.includes(session.role);
    let invitedMember = null;

    if (currUsersMembership?.accepted !== true) {
        for (const member of projectData.members) {
            if (member.userId === session?.id && member.accepted === false) {
                invitedMember = member;
                break;
            }
        }
    }

    return (
        <div className="page-header flex w-full flex-col gap-panel-cards">
            <PageHeader
                vtId={projectData.id}
                icon={imageUrl(projectData.icon)}
                iconClassName="rounded"
                fallbackIcon={fallbackProjectIcon}
                title={projectData.name}
                description={projectData.summary}
                titleBadge={
                    [
                        ProjectPublishingStatus.REJECTED,
                        ProjectPublishingStatus.PROCESSING,
                        ProjectPublishingStatus.WITHHELD,
                    ].includes(projectData.status) ? (
                        <ProjectStatusBadge status={projectData.status} t={t} />
                    ) : null
                }
                actionBtns={
                    <>
                        <InteractiveDownloadPopup />

                        <FollowProject_Btn projectId={projectData.id} />
                        <AddToCollection_Popup projectId={projectData.id} />

                        {currUsersMembership?.id || isModerator(session?.role) ? (
                            <VariantButtonLink
                                to={ProjectPagePath(projectType, projectData.slug, "settings")}
                                variant="secondary"
                                className="h-11 w-11 rounded-full p-0"
                                label="project settings"
                                prefetch={LinkPrefetchStrategy.Render}
                            >
                                <SettingsIcon aria-hidden className="h-btn-icon-lg w-btn-icon-lg" />
                            </VariantButtonLink>
                        ) : null}
                    </>
                }
                threeDotMenu={
                    <>
                        <ReportButton
                            itemType={ReportItemType.PROJECT}
                            itemId={projectData.id}
                            btnVariant="ghost-destructive"
                            btnSize="sm"
                            className="w-full justify-start"
                        />

                        <PopoverClose asChild>
                            <Button
                                className="w-full justify-start"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    navigator.clipboard.writeText(projectData.id);
                                }}
                            >
                                <ClipboardCopyIcon aria-hidden className="h-btn-icon w-btn-icon" />
                                {t.common.copyId}
                            </Button>
                        </PopoverClose>

                        {isMod && !RejectedStatuses.includes(projectData.status) && !projectData.requestedStatus ? (
                            <>
                                <Separator />

                                {projectData.status !== ProjectPublishingStatus.DRAFT && (
                                    <UpdateProjectStatusDialog
                                        projectId={projectData.id}
                                        projectName={projectData.name}
                                        projectType={projectData.type[0]}
                                        prevStatus={projectData.status}
                                        newStatus={ProjectPublishingStatus.DRAFT}
                                        trigger={{
                                            text: t.moderation.draft,
                                            variant: "ghost",
                                            className: "w-full justify-start",
                                        }}
                                        dialogConfirmBtn={{ variant: "destructive" }}
                                    />
                                )}

                                <UpdateProjectStatusDialog
                                    projectId={projectData.id}
                                    projectName={projectData.name}
                                    projectType={projectData.type[0]}
                                    prevStatus={projectData.status}
                                    newStatus={ProjectPublishingStatus.WITHHELD}
                                    trigger={{
                                        text: t.moderation.withhold,
                                        variant: "ghost-destructive",
                                        className: "w-full justify-start",
                                    }}
                                    dialogConfirmBtn={{ variant: "destructive" }}
                                />
                            </>
                        ) : null}
                    </>
                }
            >
                <div className="flex items-center gap-3">
                    <DownloadIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                    <span className="font-semibold">
                        <FormattedCount count={projectData.downloads} />
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <HeartIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                    <span className="font-semibold">
                        <FormattedCount count={projectData.followers} />
                    </span>
                </div>

                {(projectData.featuredCategories?.length || 0) > 0 ? (
                    <div className="hidden items-center gap-3 md:flex">
                        <TagsIcon aria-hidden className="h-btn-icon-lg w-btn-icon-lg" />
                        <div className="flex items-center gap-2">
                            {projectData.featuredCategories.map((category) => (
                                <Chip key={category} className="bg-card-background">
                                    {/* @ts-ignore */}
                                    {t.search.tags[category] || Capitalize(category)}
                                </Chip>
                            ))}
                        </div>
                    </div>
                ) : null}
            </PageHeader>

            {projectData.visibility === ProjectVisibility.ARCHIVED ? (
                <div className="rounded-lg rounded-l-none border-warning-fg border-s-2 bg-warning-bg px-5 py-3 font-medium text-warning-fg">
                    {t.project.archivedMessage(projectData.name)}
                </div>
            ) : null}

            {invitedMember && (
                <Suspense>
                    <TeamInvitationBanner refreshData={fetchProjectData} role={invitedMember.role} teamId={projectData.teamId} />
                </Suspense>
            )}

            <PublishingChecklist />
            <ModerationBanner />
        </div>
    );
}

interface TeamMember_CardProps {
    vtId?: string;
    userName: string;
    isOwner: boolean;
    roleName: string;
    avatarImageUrl: string;
    className?: string;
    url?: string;
    avatarClassName?: string;
    fallbackIcon?: React.ReactNode;
}

export function TeamMember_Card({
    vtId,
    userName,
    isOwner,
    roleName,
    avatarImageUrl,
    className,
    url,
    avatarClassName,
    fallbackIcon,
}: TeamMember_CardProps) {
    const isOrg = roleName.toLowerCase() === "organization" && url !== undefined;

    return (
        <ButtonLink
            itemScope
            itemType={itemType(isOrg ? MicrodataItemType.Organization : MicrodataItemType.Person)}
            itemProp={MicrodataItemProps.member}
            aria-label={userName}
            url={url || UserProfilePath(userName)}
            className={cn("h-fit items-start gap-3 px-2 py-1.5 font-normal hover:bg-background/75", className)}
        >
            <link itemProp={MicrodataItemProps.url} href={url || UserProfilePath(userName)} />

            <ImgWrapper
                itemProp={MicrodataItemProps.image}
                vtId={vtId}
                src={imageUrl(avatarImageUrl)}
                alt={`Profile picture of ${userName}`}
                className={cn("h-10 w-10 rounded-full", avatarClassName)}
                fallback={fallbackIcon || fallbackUserIcon}
                loading="eager"
            />
            <div className="flex w-full flex-col items-start justify-start overflow-hidden">
                <div className="flex items-center justify-center gap-1">
                    <span itemProp={MicrodataItemProps.name} className="font-semibold leading-tight" title={userName}>
                        {userName}
                    </span>
                    {isOwner === true && (
                        <CrownIcon
                            aria-hidden
                            className="h-btn-icon-sm w-btn-icon-sm shrink-0 text-orange-500 dark:text-orange-400"
                        />
                    )}
                </div>
                <span className="font-medium text-foreground-muted/75 text-sm leading-tight">{roleName}</span>
            </div>
        </ButtonLink>
    );
}

function ExternalLink({ url, label, icon }: { url: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            to={url}
            className="flex w-fit items-center justify-start gap-2 p-0 text-foreground-muted hover:underline"
            target="_blank"
            rel="noopener noreferrer"
        >
            {icon}
            <span>
                {label}
                <ArrowUpRightIcon aria-hidden className="ms-1 inline h-4 w-4 text-foreground-extra-muted" />
            </span>
        </Link>
    );
}

import { DiscordIcon, fallbackOrgIcon, fallbackProjectIcon, fallbackUserIcon } from "@app/components/icons";
import tagIcons from "@app/components/icons/tag-icons";
import { MicrodataItemProps, MicrodataItemType, itemType } from "@app/components/microdata";
import { DownloadAnimationContext } from "@app/components/misc/download-animation";
import RefreshPage from "@app/components/misc/refresh-page";
import { TextSpacer } from "@app/components/misc/text";
import { Button, buttonVariants } from "@app/components/ui/button";
import { Card } from "@app/components/ui/card";
import Chip from "@app/components/ui/chip";
import { Prefetch } from "@app/components/ui/link";
import { PopoverClose } from "@app/components/ui/popover";
import { ReleaseChannelBadge } from "@app/components/ui/release-channel-pill";
import { Separator } from "@app/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@app/components/ui/tooltip";
import { cn } from "@app/components/utils";
import { RejectedStatuses, isRejected, isUnderReview } from "@app/utils/config/project";
import { getLoadersFromNames } from "@app/utils/convertors";
import { parseFileSize } from "@app/utils/number";
import SPDX_LICENSE_LIST from "@app/utils/src/constants/license-list";
import { MODERATOR_ROLES, isModerator } from "@app/utils/src/constants/roles";
import { Capitalize, CapitalizeAndFormatString } from "@app/utils/string";
import { ProjectPublishingStatus, ProjectVisibility } from "@app/utils/types";
import type { ProjectDetailsData, TeamMember } from "@app/utils/types/api";
import { imageUrl } from "@app/utils/url";
import { formatVersionsForDisplay, getVersionsToDisplay } from "@app/utils/version/format";
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
    FlagIcon,
    GitCommitHorizontalIcon,
    HeartIcon,
    SettingsIcon,
    TagsIcon,
} from "lucide-react";
import type React from "react";
import { Suspense, useContext } from "react";
import { Outlet, useLocation } from "react-router";
import { PageHeader } from "~/components/page-header";
import { ImgWrapper } from "~/components/ui/avatar";
import { FormattedCount } from "~/components/ui/count";
import { FormattedDate, TimePassedSince } from "~/components/ui/date";
import Link, { ButtonLink, VariantButtonLink, useNavigate } from "~/components/ui/link";
import { ProjectStatusBadge } from "~/components/ui/project-status-badge";
import { useProjectData } from "~/hooks/project";
import { useSession } from "~/hooks/session";
import useTheme from "~/hooks/theme";
import { useTranslation } from "~/locales/provider";
import { OrgPagePath, ProjectPagePath, UserProfilePath, VersionPagePath, isCurrLinkActive } from "~/utils/urls";
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
    const { theme } = useTheme();
    const { show: showDownloadAnimation } = useContext(DownloadAnimationContext);

    const session = useSession();
    const ctx = useProjectData();
    const projectData = ctx.projectData;

    const navigate = useNavigate();
    const customNavigate = useNavigate();
    const location = useLocation();

    if (!projectData) return null;

    const isVersionDetailsPage = isCurrLinkActive(ProjectPagePath(ctx.projectType, projectData.slug, "version/"), location.pathname, false);
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
            className="header-content-sidebar-layout w-full max-w-full pb-12 gap-panel-cards"
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
            <div className="w-full lg:w-sidebar grid h-fit grid-cols-1 gap-panel-cards page-sidebar">
                {ctx.allProjectVersions.length > 0 ? (
                    <Card className="w-full h-fit grid grid-cols-1 p-card-surround gap-3">
                        <h2 className="text-lg font-extrabold">{t.project.compatibility}</h2>
                        <section>
                            <h3 className="flex font-bold text-muted-foreground pb-1">{t.search.gameVersions}</h3>
                            <div className="w-full flex flex-wrap gap-1">
                                {getVersionsToDisplay(projectData).map((version) => (
                                    <Chip key={version} className="text-muted-foreground">
                                        {version}
                                    </Chip>
                                ))}
                            </div>
                        </section>

                        {listedLoaders.length ? (
                            <section>
                                <h3 className="flex font-bold text-muted-foreground pb-1">{t.search.loaders}</h3>
                                <div className="w-full flex flex-wrap gap-1">
                                    {listedLoaders.map((loader) => {
                                        const accentForeground = loader?.metadata?.foreground;
                                        // @ts-ignore
                                        const loaderIcon: React.ReactNode = tagIcons[loader.name];

                                        return (
                                            <Chip
                                                key={loader.name}
                                                style={{
                                                    color: accentForeground
                                                        ? theme === "dark"
                                                            ? accentForeground?.dark
                                                            : accentForeground?.light
                                                        : "hsla(var(--muted-foreground))",
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
                                <h3 className="block w-full font-bold text-muted-foreground" title="Environment(s) the mod is made for">
                                    {t.project.environments}
                                </h3>
                                {projectEnvironments.map((item, i) => {
                                    return (
                                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                        <Chip key={i}>{item}</Chip>
                                    );
                                })}
                            </section>
                        ) : null}
                    </Card>
                ) : null}

                {projectData?.issueTrackerUrl ||
                projectData?.projectSourceUrl ||
                projectData?.projectWikiUrl ||
                projectData?.discordInviteUrl ? (
                    <Card className="p-card-surround grid grid-cols-1 gap-1">
                        <h2 className="text-lg font-bold pb-2">{t.projectSettings.links}</h2>
                        {projectData?.issueTrackerUrl ? (
                            <ExternalLink
                                url={projectData?.issueTrackerUrl}
                                label={t.project.reportIssues}
                                icon={<BugIcon aria-hidden className="w-btn-icon h-btn-icon" />}
                            />
                        ) : null}

                        {projectData?.projectSourceUrl ? (
                            <ExternalLink
                                url={projectData?.projectSourceUrl}
                                label={t.project.viewSource}
                                icon={<CodeIcon aria-hidden className="w-btn-icon h-btn-icon" />}
                            />
                        ) : null}

                        {projectData?.projectWikiUrl ? (
                            <ExternalLink
                                url={projectData?.projectWikiUrl}
                                label={t.project.visitWiki}
                                icon={<BookOpenIcon aria-hidden className="w-btn-icon h-btn-icon" />}
                            />
                        ) : null}

                        {projectData?.discordInviteUrl ? (
                            <ExternalLink
                                url={projectData?.discordInviteUrl}
                                label={t.project.joinDiscord}
                                icon={<DiscordIcon aria-hidden className="w-btn-icon h-btn-icon fill-current dark:fill-current" />}
                            />
                        ) : null}
                    </Card>
                ) : null}

                {(ctx.featuredProjectVersions?.length || 0) > 0 ? (
                    <Card className="p-card-surround grid grid-cols-1 gap-1">
                        <h2 className="text-lg font-bold pb-2">{t.project.featuredVersions}</h2>
                        <TooltipProvider>
                            {ctx.featuredProjectVersions?.map((version) => (
                                // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                                <div
                                    key={version.id}
                                    className="w-full flex items-start justify-start p-2 pb-2.5 rounded cursor-pointer text-muted-foreground hover:bg-background/75 bg_hover_stagger gap-2 group/card"
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
                                    <div className="relative flex items-center justify-center min-w-10">
                                        <ReleaseChannelBadge
                                            releaseChannel={version.releaseChannel}
                                            className=" group-hover/card:hidden group-focus-within/card:hidden"
                                        />
                                        <Tooltip>
                                            <TooltipTrigger asChild className="hidden group-hover/card:flex group-focus-within/card:flex">
                                                <a
                                                    href={version.primaryFile?.url}
                                                    className={cn(
                                                        "noClickRedirect flex-shrink-0",
                                                        isVersionDetailsPage
                                                            ? buttonVariants({
                                                                  variant: "secondary-inverted",
                                                                  size: "icon",
                                                              })
                                                            : buttonVariants({ variant: "default", size: "icon" }),
                                                        "!w-10 !h-10 rounded-full",
                                                    )}
                                                    aria-label={`download ${version.title}`}
                                                    download={version.primaryFile?.name}
                                                    onClick={showDownloadAnimation}
                                                    rel="nofollow noindex"
                                                >
                                                    <DownloadIcon aria-hidden className="w-[1.07rem] h-[1.07rem]" strokeWidth={2.2} />
                                                </a>
                                            </TooltipTrigger>
                                            <TooltipContent className="hidden group-hover/card:flex group-focus-within/card:flex">
                                                {version?.primaryFile?.name} ({parseFileSize(version.primaryFile?.size || 0)})
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                    <div className="flex w-fit h-full grow flex-col select-text">
                                        <Link
                                            prefetch={Prefetch.Render}
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

                <Card className="p-card-surround grid grid-cols-1 gap-1">
                    <h2 className="text-lg font-bold pb-1">{t.project.creators}</h2>
                    {projectData.organisation?.id ? (
                        <>
                            <ProjectMember
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
                            <ProjectMember
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

                <Card className="items-start justify-start p-card-surround grid grid-cols-1 gap-1">
                    <h2 className="text-lg font-bold pb-2">{t.project.details}</h2>

                    {projectLicenseData?.id || projectLicenseData?.name ? (
                        <div className="flex items-center justify-start gap-2 text-muted-foreground">
                            <BookTextIcon aria-hidden className="w-btn-icon h-btn-icon shrink-0" />
                            <p>
                                <TextSpacer text={licensed_str[0]} />
                                {projectLicenseData.url ? (
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={projectLicenseData.url}
                                        className="font-bold link_blue hover:underline"
                                        title={projectLicenseData.url}
                                    >
                                        {licensed_str[1]}
                                    </a>
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
                                <p className="w-fit max-w-full flex gap-2 items-center justify-start text-muted-foreground">
                                    <CalendarIcon aria-hidden className="w-btn-icon h-btn-icon" />
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
                                    <p className="w-fit max-w-full flex gap-2 items-center justify-start text-muted-foreground">
                                        <GitCommitHorizontalIcon aria-hidden className="w-btn-icon h-btn-icon" />
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

            <div className="h-fit overflow-auto grid grid-cols-1 gap-panel-cards page-content">
                <SecondaryNav
                    urlBase={`/${ctx.projectType}/${projectData?.slug || ""}`}
                    className="h-fit bg-card-background rounded-lg px-3 py-2"
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
                                (!!ctx.currUsersMembership && (isRejected(projectData.status) || isUnderReview(projectData.status))) ||
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
        <div className="w-full flex flex-col page-header gap-panel-cards">
            <PageHeader
                vtId={projectData.id}
                icon={imageUrl(projectData.icon)}
                iconClassName="rounded"
                fallbackIcon={fallbackProjectIcon}
                title={projectData.name}
                description={projectData.summary}
                titleBadge={
                    [ProjectPublishingStatus.REJECTED, ProjectPublishingStatus.PROCESSING, ProjectPublishingStatus.WITHHELD].includes(
                        projectData.status,
                    ) ? (
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
                                url={ProjectPagePath(projectType, projectData.slug, "settings")}
                                variant="secondary-inverted"
                                className="rounded-full w-11 h-11 p-0"
                                label="project settings"
                                prefetch={Prefetch.Render}
                            >
                                <SettingsIcon aria-hidden className="h-btn-icon-lg w-btn-icon-lg" />
                            </VariantButtonLink>
                        ) : null}
                    </>
                }
                threeDotMenu={
                    <>
                        <Button variant="ghost-destructive" className="w-full justify-start" size="sm">
                            <FlagIcon aria-hidden className="w-btn-icon h-btn-icon" />
                            {t.common.report}
                        </Button>

                        <PopoverClose asChild>
                            <Button
                                className="w-full justify-start"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    navigator.clipboard.writeText(projectData.id);
                                }}
                            >
                                <ClipboardCopyIcon aria-hidden className="w-btn-icon h-btn-icon" />
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
                <div className="flex items-center gap-3 border-0 border-e border-card-background dark:border-shallow-background pe-4">
                    <DownloadIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                    <span className="font-semibold">
                        <FormattedCount count={projectData.downloads} />
                    </span>
                </div>
                <div
                    className={cn(
                        "flex items-center gap-3 border-0 dark:border-shallow-background pe-4",
                        !!projectData.featuredCategories?.length && "border-e border-card-background",
                    )}
                >
                    <HeartIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                    <span className="font-semibold">
                        <FormattedCount count={projectData.followers} />
                    </span>
                </div>

                {(projectData.featuredCategories?.length || 0) > 0 ? (
                    <div className="hidden md:flex items-center gap-3 pe-4">
                        <TagsIcon aria-hidden className="w-btn-icon-lg h-btn-icon-lg" />
                        <div className="flex items-center gap-2">
                            {projectData.featuredCategories.map((category) => (
                                <Chip key={category} className="bg-card-background dark:bg-shallow-background/75">
                                    {/* @ts-ignore */}
                                    {t.search.tags[category] || Capitalize(category)}
                                </Chip>
                            ))}
                        </div>
                    </div>
                ) : null}
            </PageHeader>

            {projectData.visibility === ProjectVisibility.ARCHIVED ? (
                <div className="text-warning-foreground bg-card-background dark:bg-warning-background/15 px-5 py-3 rounded-lg font-medium border-warning-background border-s-2 rounded-l-none">
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

interface ProjectMemberProps {
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

export function ProjectMember({
    vtId,
    userName,
    isOwner,
    roleName,
    avatarImageUrl,
    className,
    url,
    avatarClassName,
    fallbackIcon,
}: ProjectMemberProps) {
    const isOrg = roleName.toLowerCase() === "organization" && url !== undefined;

    return (
        <ButtonLink
            itemScope
            itemType={itemType(isOrg ? MicrodataItemType.Organization : MicrodataItemType.Person)}
            itemProp={MicrodataItemProps.member}
            aria-label={userName}
            url={url || UserProfilePath(userName)}
            className={cn("py-1.5 px-2 h-fit items-start gap-3 font-normal hover:bg-background/75", className)}
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
            <div className="w-full flex flex-col items-start justify-start overflow-hidden">
                <div className="flex items-baseline-with-fallback justify-center gap-1">
                    <span itemProp={MicrodataItemProps.name} className="font-semibold leading-tight" title={userName}>
                        {userName}
                    </span>
                    {isOwner === true && (
                        <CrownIcon aria-hidden className="w-btn-icon-sm h-btn-icon-sm shrink-0 text-orange-500 dark:text-orange-400" />
                    )}
                </div>
                <span className="text-sm font-medium leading-tight text-muted-foreground/75">{roleName}</span>
            </div>
        </ButtonLink>
    );
}

function ExternalLink({ url, label, icon }: { url: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            to={url}
            className="w-fit flex items-center justify-start p-0 gap-2 text-muted-foreground hover:underline"
            target="_blank"
            rel="noopener noreferrer"
        >
            {icon}
            <span>
                {label}
                <ArrowUpRightIcon aria-hidden className="w-4 h-4 text-extra-muted-foreground inline ms-1" />
            </span>
        </Link>
    );
}

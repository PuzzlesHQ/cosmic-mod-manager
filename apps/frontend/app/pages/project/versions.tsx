import { getLoaderFromString } from "@app/utils/convertors";
import { parseFileSize } from "@app/utils/number";
import { doesMemberHaveAccess } from "@app/utils/project";
import { CapitalizeAndFormatString } from "@app/utils/string";
import { ProjectPermission } from "@app/utils/types";
import type { ProjectDetailsData, ProjectVersionData } from "@app/utils/types/api";
import { formatVersionsForDisplay } from "@app/utils/version/format";
import {
    CalendarIcon,
    DownloadIcon,
    EditIcon,
    InfoIcon,
    LinkIcon,
    MoreVerticalIcon,
    SquareArrowOutUpRightIcon,
    Trash2Icon,
    UploadIcon,
} from "lucide-react";
import { use, useState } from "react";
import { useSearchParams } from "react-router";
import loaderIcons from "~/components/icons/tag-icons";
import { FileDownloader } from "~/components/misc/file-downloader";
import PaginatedNavigation from "~/components/misc/pagination-nav";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import Chip from "~/components/ui/chip";
import { copyTextToClipboard } from "~/components/ui/copy-btn";
import { FormattedCount } from "~/components/ui/count";
import { FormattedDate, TimePassedSince } from "~/components/ui/date";
import Link, { LinkPrefetchStrategy, useNavigate, VariantButtonLink } from "~/components/ui/link";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { ReleaseChannelBadge } from "~/components/ui/release-channel-pill";
import { Separator } from "~/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTemplate, TooltipTrigger } from "~/components/ui/tooltip";
import { cn } from "~/components/utils";
import { useProjectData } from "~/hooks/project";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import Config from "~/utils/config";
import { joinPaths, ProjectPagePath, VersionPagePath } from "~/utils/urls";
import VersionFilters from "./version-filters";
import DeleteVersionDialog from "./version/delete-version";

export default function ProjectVersionsPage() {
    const session = useSession();

    const ctx = useProjectData();
    const projectData = ctx.projectData;

    const versionFilterRes = VersionFilters({
        allProjectVersions: ctx.allProjectVersions,
        supportedGameVersions: projectData.gameVersions,
        showDevVersions_Default: false,
    });

    const canUploadVersion = doesMemberHaveAccess(
        ProjectPermission.UPLOAD_VERSION,
        ctx.currUsersMembership?.permissions,
        ctx.currUsersMembership?.isOwner,
        session?.role,
    );

    return (
        <>
            {canUploadVersion ? (
                <UploadVersionLinkCard uploadPageUrl={VersionPagePath(ctx.projectType, projectData.slug, "new")} />
            ) : null}

            {versionFilterRes.FilterComponent}

            <ProjectVersionsListTable
                projectType={ctx.projectType}
                projectData={projectData}
                allProjectVersions={versionFilterRes.filteredItems}
                canEditVersion={doesMemberHaveAccess(
                    ProjectPermission.UPLOAD_VERSION,
                    ctx.currUsersMembership?.permissions || [],
                    ctx.currUsersMembership?.isOwner === true,
                    session?.role,
                )}
                canDeleteVersion={doesMemberHaveAccess(
                    ProjectPermission.DELETE_VERSION,
                    ctx.currUsersMembership?.permissions || [],
                    ctx.currUsersMembership?.isOwner === true,
                    session?.role,
                )}
                anyFilterEnabled={versionFilterRes.anyFilterEnabled}
            />
        </>
    );
}

function UploadVersionLinkCard({ uploadPageUrl }: { uploadPageUrl: string }) {
    const { t } = useTranslation();

    return (
        <Card className="flex flex-row flex-wrap items-center justify-start gap-x-4 gap-y-2 p-card-surround">
            <VariantButtonLink to={uploadPageUrl} variant="default" prefetch={LinkPrefetchStrategy.Render}>
                <UploadIcon aria-hidden className="h-btn-icon w-btn-icon" />
                {t.project.uploadVersion}
            </VariantButtonLink>

            <div className="flex items-center justify-center gap-2 text-foreground-muted">
                <InfoIcon aria-hidden className="h-btn-icon w-btn-icon" />
                {t.project.uploadNewVersion}
            </div>
        </Card>
    );
}

interface VersionsTableProps {
    projectType: string;
    projectData: ProjectDetailsData;
    allProjectVersions: ProjectVersionData[];
    canEditVersion: boolean;
    canDeleteVersion: boolean;
    anyFilterEnabled: boolean;
}

function ProjectVersionsListTable({
    projectType,
    projectData,
    allProjectVersions,
    canEditVersion,
    canDeleteVersion,
    anyFilterEnabled,
}: VersionsTableProps) {
    const { t } = useTranslation();
    const pageSearchParamKey = "page";
    const [urlSearchParams] = useSearchParams();

    const ITEMS_PER_PAGE = 15;
    const page = urlSearchParams.get(pageSearchParamKey) || "1";
    const pagesCount = Math.ceil((allProjectVersions?.length || 0) / ITEMS_PER_PAGE);
    const activePage = Number.parseInt(page, 10) <= pagesCount ? Number.parseInt(page, 10) : 1;

    const navigate = useNavigate();
    const { downloadFile } = use(FileDownloader);

    function versionPagePathname(versionSlug: string) {
        return VersionPagePath(projectType, projectData.slug, versionSlug);
    }

    const Pagination =
        (allProjectVersions?.length || 0) > ITEMS_PER_PAGE ? (
            <PaginatedNavigation pagesCount={pagesCount} activePage={activePage} searchParamKey={pageSearchParamKey} />
        ) : null;

    if (!allProjectVersions.length) {
        return (
            <div className="flex items-center justify-center py-6">
                <span className="text-foreground-extra-muted text-lg italic">{t.project.noProjectVersions}</span>
            </div>
        );
    }

    return (
        <>
            <TooltipProvider>
                <div
                    className={cn(
                        "grid max-w-full overflow-x-auto rounded-lg bg-card-background",
                        "grid-cols-[min-content_2fr_2fr_1fr_min-content]",
                    )}
                >
                    <Row className="hidden sm:grid">
                        <span> </span>
                        <span className="font-bold">{t.form.name}</span>
                        <span className="font-bold">{t.project.compatibility}</span>
                        <span className="justify-self-stretch font-bold">{t.project.stats}</span>
                        <span> </span>
                    </Row>

                    {allProjectVersions
                        .slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE)
                        .map((version) => (
                            <Row
                                key={version.id}
                                className="cursor-pointer"
                                onClick={(e) => {
                                    //@ts-expect-error
                                    if (!e.target.closest(".noClickRedirect") && e.target.closest(".table_row")) {
                                        navigate(versionPagePathname(version.slug));
                                    }
                                }}
                            >
                                <ReleaseChannelBadge releaseChannel={version.releaseChannel} />

                                <VersionName
                                    title={version.title}
                                    number={version.versionNumber}
                                    url={versionPagePathname(version.slug)}
                                />

                                <div className="flex flex-wrap items-start justify-start gap-1.5">
                                    <GameVersions gameVersions={version.gameVersions} verbose={anyFilterEnabled} />
                                    <ProjectLoaders versionLoaders={version.loaders} />
                                </div>

                                <div className="grid w-fit min-w-max gap-1.5 leading-none">
                                    <DownloadsCount downloads={version.downloads} />
                                    <DatePublished dateStr={version.datePublished} />
                                </div>

                                <div className="flex items-center justify-end gap-1">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="noClickRedirect !w-10 !h-10 shrink-0 rounded-full"
                                                aria-label={t.project.downloadItem(version.primaryFile?.name || "")}
                                                onClick={() => downloadFile(version.primaryFile?.url)}
                                            >
                                                <DownloadIcon
                                                    aria-hidden
                                                    className="h-btn-icon w-btn-icon"
                                                    strokeWidth={2.2}
                                                />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {version.primaryFile?.name} ({parseFileSize(version.primaryFile?.size || 0)}
                                            )
                                        </TooltipContent>
                                    </Tooltip>

                                    <ThreeDotMenu
                                        canEditVersion={canEditVersion}
                                        canDeleteVersion={canDeleteVersion}
                                        versionDetailsPage={versionPagePathname(version.slug)}
                                        versionsPageUrl={ProjectPagePath(projectType, projectData.slug, "versions")}
                                        projectId={version.projectId}
                                        versionId={version.id}
                                    />
                                </div>
                            </Row>
                        ))}
                </div>
            </TooltipProvider>

            {Pagination ? <div className="flex items-center justify-center">{Pagination}</div> : null}
        </>
    );
}

function Row({ children, className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "table_row col-[1/-1] grid grid-cols-subgrid items-center gap-x-4 border-background border-b px-4 py-4 last:border-none first-of-type:pt-5 hover:bg-background/25 md:px-8",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}

function VersionName({ title, number, url }: { title: string; number: string; url: string }) {
    return (
        <div className="flex min-w-[16ch] max-w-[24ch] flex-col items-start justify-center overflow-hidden lg:max-w-[32ch]">
            <Link
                prefetch={LinkPrefetchStrategy.Render}
                to={url}
                className="noClickRedirect font-bold text-foreground leading-tight"
            >
                {number}
            </Link>
            <span className="font-medium text-[0.77rem] text-foreground-muted/85 leading-snug">{title}</span>
        </div>
    );
}

function GameVersions({ gameVersions, verbose }: { gameVersions: string[]; verbose: boolean }) {
    if (verbose) {
        return formatVersionsForDisplay(gameVersions).map((version) => (
            <Chip key={version} className="text-foreground-muted">
                {version}
            </Chip>
        ));
    }

    return formatVersionsForDisplay(gameVersions).map((version) => (
        <Chip key={version} className="text-foreground-muted">
            {version}
        </Chip>
    ));
}

function ProjectLoaders({ versionLoaders }: { versionLoaders: string[] }) {
    return (
        <>
            {versionLoaders.map((loader) => {
                const loaderData = getLoaderFromString(loader);
                if (!loaderData) return null;
                // @ts-expect-error
                const loaderIcon: ReactNode = loaderIcons[loaderData.name];

                return (
                    <Chip
                        key={loaderData.name}
                        style={{
                            color: `hsla(var(--loader-fg-${loaderData.name}, --foreground-muted))`,
                        }}
                    >
                        {loaderIcon ? loaderIcon : null}
                        <span className="trim-both">{CapitalizeAndFormatString(loaderData.name)}</span>
                    </Chip>
                );
            })}
        </>
    );
}

function DatePublished({ dateStr, iconVisible = true }: { dateStr: string | Date; iconVisible?: boolean }) {
    return (
        <TooltipTemplate content={<FormattedDate date={dateStr} />}>
            <span className="flex cursor-help items-center justify-start gap-1.5 font-medium text-foreground-extra-muted text-sm">
                {iconVisible === true ? <CalendarIcon aria-hidden className="h-3.5 w-3.5" /> : null}
                <span className="trim-both">
                    <TimePassedSince date={dateStr} capitalize />
                </span>
            </span>
        </TooltipTemplate>
    );
}

function DownloadsCount({ downloads }: { downloads: number }) {
    const { t } = useTranslation();

    return (
        <span className="flex items-center justify-start gap-1.5 font-medium text-foreground-extra-muted text-sm">
            <DownloadIcon aria-hidden className="h-3.5 w-3.5" strokeWidth={2.5} />
            <span className="text-foreground-muted">
                {t.count.downloads(
                    downloads,
                    <em className="font-extrabold text-base not-italic" key="downloads">
                        <FormattedCount count={downloads} />
                    </em>,
                )}
            </span>
        </span>
    );
}

interface ThreeDotMenuProps {
    versionDetailsPage: string;
    versionsPageUrl: string;
    canEditVersion: boolean;
    canDeleteVersion: boolean;
    projectId: string;
    versionId: string;
}

function ThreeDotMenu(props: ThreeDotMenuProps) {
    const { t } = useTranslation();
    const [popoverOpen, setPopoverOpen] = useState(false);

    const actions: React.ReactNode[] = [];
    if (props.canEditVersion) {
        actions.push(
            <VariantButtonLink
                key="edit-version"
                to={joinPaths(props.versionDetailsPage, "edit")}
                variant="ghost"
                className="justify-start"
                size="sm"
                prefetch={LinkPrefetchStrategy.Render}
                onClick={() => {
                    setPopoverOpen(false);
                }}
            >
                <EditIcon aria-hidden className="h-btn-icon w-btn-icon text-foreground-muted" />
                {t.form.edit}
            </VariantButtonLink>,
        );
    }

    if (props.canDeleteVersion) {
        actions.push(
            <DeleteVersionDialog
                key="delete-version"
                projectId={props.projectId}
                versionId={props.versionId}
                versionsPageUrl={props.versionsPageUrl}
            >
                <Button variant="ghost-destructive" size="sm" className="justify-start">
                    <Trash2Icon aria-hidden className="h-btn-icon w-btn-icon" />
                    {t.form.delete}
                </Button>
            </DeleteVersionDialog>,
        );
    }

    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="noClickRedirect !w-10 !h-10 shrink-0 rounded-full"
                    aria-label="more options"
                >
                    <MoreVerticalIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="min-w-fit gap-1 p-1">
                <VariantButtonLink
                    className="justify-start"
                    to={props.versionDetailsPage}
                    variant="ghost"
                    size="sm"
                    target="_blank"
                    onClick={() => {
                        setPopoverOpen(false);
                    }}
                >
                    <SquareArrowOutUpRightIcon aria-hidden className="h-btn-icon w-btn-icon text-foreground-muted" />
                    {t.project.openInNewTab}
                </VariantButtonLink>

                <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    onClick={() => {
                        copyTextToClipboard(`${Config.FRONTEND_URL}${props.versionDetailsPage}`);
                        setPopoverOpen(false);
                    }}
                >
                    <LinkIcon aria-hidden className="h-btn-icon w-btn-icon text-foreground-muted" />
                    {t.project.copyLink}
                </Button>

                {actions.length > 0 ? (
                    <>
                        <Separator />
                        {actions}
                    </>
                ) : null}
            </PopoverContent>
        </Popover>
    );
}

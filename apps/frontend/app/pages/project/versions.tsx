import { getLoaderFromString } from "@app/utils/convertors";
import { parseFileSize } from "@app/utils/number";
import { doesMemberHaveAccess } from "@app/utils/project";
import { CapitalizeAndFormatString } from "@app/utils/string";
import { ProjectPermission } from "@app/utils/types";
import type { ProjectDetailsData, ProjectVersionData } from "@app/utils/types/api";
import { formatVersionsForDisplay } from "@app/utils/version/format";
import { formatVersionsForDisplay_noOmit } from "@app/utils/version/format-verbose";
import {
    CalendarIcon,
    DownloadIcon,
    EditIcon,
    InfoIcon,
    LinkIcon,
    MoreVerticalIcon,
    SquareArrowOutUpRightIcon,
    UploadIcon,
} from "lucide-react";
import { useContext, useState } from "react";
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
import { usePreferences } from "~/hooks/preferences";
import { useProjectData } from "~/hooks/project";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import Config from "~/utils/config";
import { VersionPagePath } from "~/utils/urls";
import VersionFilters from "./version-filters";

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

            {versionFilterRes.component}

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

            <div className="flex items-center justify-center gap-2 text-muted-foreground">
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
    anyFilterEnabled: boolean;
}

function ProjectVersionsListTable({
    projectType,
    projectData,
    allProjectVersions,
    canEditVersion,
    anyFilterEnabled,
}: VersionsTableProps) {
    const { t } = useTranslation();
    const pageSearchParamKey = "page";
    const [urlSearchParams] = useSearchParams();

    const ITEMS_PER_PAGE = 15;
    const page = urlSearchParams.get(pageSearchParamKey) || "1";
    const pagesCount = Math.ceil((allProjectVersions?.length || 0) / ITEMS_PER_PAGE);
    const activePage = Number.parseInt(page) <= pagesCount ? Number.parseInt(page) : 1;

    const customNavigate = useNavigate();
    const { downloadFile } = useContext(FileDownloader);

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
                <span className="text-extra-muted-foreground text-lg italic">{t.project.noProjectVersions}</span>
            </div>
        );
    }

    function Row({ children, className, ...props }: React.ComponentProps<"div">) {
        return (
            <div
                className={cn(
                    "col-[1/-1] grid grid-cols-subgrid items-center gap-x-4 border-background border-b px-4 py-4 last:border-none first-of-type:pt-5 hover:bg-background/25 md:px-8",
                    className,
                )}
                {...props}
            >
                {children}
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

                    {allProjectVersions.slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE).map((version) => (
                        <Row
                            key={version.id}
                            className="cursor-pointer"
                            onClick={(e) => {
                                //@ts-expect-error
                                if (!e.target.closest(".noClickRedirect")) {
                                    customNavigate(versionPagePathname(version.slug));
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
                                            <DownloadIcon aria-hidden className="h-btn-icon w-btn-icon" strokeWidth={2.2} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {version.primaryFile?.name} ({parseFileSize(version.primaryFile?.size || 0)})
                                    </TooltipContent>
                                </Tooltip>

                                <ThreeDotMenu
                                    canEditVersion={canEditVersion}
                                    versionPageUrl={versionPagePathname(version.slug)}
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
            <span className="font-medium text-[0.77rem] text-muted-foreground/85 leading-snug">{title}</span>
        </div>
    );
}

function GameVersions({ gameVersions, verbose }: { gameVersions: string[]; verbose: boolean }) {
    if (verbose) {
        return formatVersionsForDisplay_noOmit(gameVersions).map((version) => (
            <Chip key={version} className="text-muted-foreground">
                {version}
            </Chip>
        ));
    }

    return formatVersionsForDisplay(gameVersions).map((version) => (
        <Chip key={version} className="text-muted-foreground">
            {version}
        </Chip>
    ));
}

function ProjectLoaders({ versionLoaders }: { versionLoaders: string[] }) {
    const { isActiveThemeDark } = usePreferences();

    return (
        <>
            {versionLoaders.map((loader) => {
                const loaderData = getLoaderFromString(loader);
                if (!loaderData) return null;
                const accentForeground = loaderData?.metadata?.foreground;
                // @ts-ignore
                const loaderIcon: ReactNode = loaderIcons[loaderData.name];

                return (
                    <Chip
                        key={loaderData.name}
                        style={{
                            color: accentForeground
                                ? isActiveThemeDark
                                    ? accentForeground?.dark
                                    : accentForeground?.light
                                : "hsla(var(--muted-foreground))",
                        }}
                    >
                        {loaderIcon ? loaderIcon : null}
                        {CapitalizeAndFormatString(loaderData.name)}
                    </Chip>
                );
            })}
        </>
    );
}

function DatePublished({ dateStr, iconVisible = true }: { dateStr: string | Date; iconVisible?: boolean }) {
    return (
        <TooltipTemplate content={<FormattedDate date={dateStr} />}>
            <span className="flex cursor-help items-center justify-start gap-1.5 font-medium text-extra-muted-foreground text-sm">
                {iconVisible === true ? <CalendarIcon aria-hidden className="h-3 w-3" /> : null}
                <TimePassedSince date={dateStr} capitalize />
            </span>
        </TooltipTemplate>
    );
}

function DownloadsCount({ downloads }: { downloads: number }) {
    const { t } = useTranslation();

    return (
        <span className="flex items-center justify-start gap-1.5 font-medium text-muted-foreground text-sm">
            <DownloadIcon aria-hidden className="h-3 w-3" strokeWidth={2.5} />
            <span>
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

function ThreeDotMenu({ versionPageUrl, canEditVersion }: { versionPageUrl: string; canEditVersion: boolean }) {
    const { t } = useTranslation();
    const [popoverOpen, setPopoverOpen] = useState(false);

    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost-no-shadow"
                    size="icon"
                    className="noClickRedirect !w-10 !h-10 shrink-0 rounded-full"
                    aria-label="more options"
                >
                    <MoreVerticalIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="noClickRedirect min-w-fit gap-1 p-1">
                <VariantButtonLink
                    className="justify-start"
                    to={versionPageUrl}
                    variant="ghost-no-shadow"
                    size="sm"
                    target="_blank"
                    onClick={() => {
                        setPopoverOpen(false);
                    }}
                >
                    <SquareArrowOutUpRightIcon aria-hidden className="h-btn-icon w-btn-icon text-muted-foreground" />
                    {t.project.openInNewTab}
                </VariantButtonLink>

                <Button
                    variant="ghost-no-shadow"
                    size="sm"
                    className="justify-start"
                    onClick={() => {
                        copyTextToClipboard(`${Config.FRONTEND_URL}${versionPageUrl}`);
                        setPopoverOpen(false);
                    }}
                >
                    <LinkIcon aria-hidden className="h-btn-icon w-btn-icon text-muted-foreground" />
                    {t.project.copyLink}
                </Button>

                {canEditVersion ? (
                    <>
                        <Separator />
                        <VariantButtonLink
                            to={`${versionPageUrl}/edit`}
                            variant="ghost-no-shadow"
                            className="justify-start"
                            size="sm"
                            onClick={() => {
                                setPopoverOpen(false);
                            }}
                        >
                            <EditIcon aria-hidden className="h-btn-icon w-btn-icon text-muted-foreground" />
                            {t.form.edit}
                        </VariantButtonLink>
                    </>
                ) : null}
            </PopoverContent>
        </Popover>
    );
}

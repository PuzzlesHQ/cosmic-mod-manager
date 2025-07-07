import loaderIcons from "@app/components/icons/tag-icons";
import { DownloadAnimationContext } from "@app/components/misc/download-animation";
import PaginatedNavigation from "@app/components/misc/pagination-nav";
import { Button } from "@app/components/ui/button";
import { Card } from "@app/components/ui/card";
import Chip from "@app/components/ui/chip";
import { copyTextToClipboard } from "@app/components/ui/copy-btn";
import { Prefetch } from "@app/components/ui/link";
import { Popover, PopoverContent, PopoverTrigger } from "@app/components/ui/popover";
import { ReleaseChannelBadge } from "@app/components/ui/release-channel-pill";
import { Separator } from "@app/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@app/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTemplate, TooltipTrigger } from "@app/components/ui/tooltip";
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
import { FormattedCount } from "~/components/ui/count";
import { FormattedDate, TimePassedSince } from "~/components/ui/date";
import Link, { useNavigate, VariantButtonLink } from "~/components/ui/link";
import { useProjectData } from "~/hooks/project";
import { useSession } from "~/hooks/session";
import useTheme from "~/hooks/theme";
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
            <VariantButtonLink url={uploadPageUrl} variant="default" prefetch={Prefetch.Render}>
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
    const { show: showDownloadAnimation } = useContext(DownloadAnimationContext);

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

    return (
        <>
            {allProjectVersions?.length ? (
                <TooltipProvider>
                    <Card className="overflow-hidden">
                        <Table>
                            <TableHeader className="hidden md:table-header-group">
                                <TableRow className="h-16 hover:bg-transparent dark:hover:bg-transparent">
                                    {/* MOBILE ONLY */}
                                    <TableHead className="w-full grow ps-table-side-pad-sm md:hidden"> </TableHead>
                                    {/* MOBILE ONLY */}
                                    <TableHead className="pe-table-side-pad-sm md:hidden"> </TableHead>

                                    {/* MID WIDTH AND ABOVE */}
                                    <TableHead className="hidden w-10 ps-table-side-pad md:table-cell"> </TableHead>
                                    {/* MID WIDTH AND ABOVE */}
                                    <TableHead className="hidden md:table-cell">{t.form.name}</TableHead>
                                    {/* MID WIDTH AND ABOVE */}
                                    <TableHead className="hidden md:table-cell">{t.project.compatibility}</TableHead>

                                    {/* MID WIDTH AND BELOW XL*/}
                                    <TableHead className="hidden md:table-cell xl:hidden">{t.project.stats}</TableHead>

                                    {/* XL WIDTH AND ABOVE */}
                                    <TableHead className="hidden md:hidden xl:table-cell">{t.project.published}</TableHead>
                                    {/* XL WIDTH AND ABOVE */}
                                    <TableHead className="hidden md:hidden xl:table-cell">{t.project.downloads}</TableHead>

                                    {/* MID WIDTH AND ABOVE */}
                                    <TableHead className="hidden pe-table-side-pad md:table-cell"> </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allProjectVersions
                                    .slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE)
                                    .map((version) => (
                                        <TableRow
                                            key={version.id}
                                            className="cursor-pointer"
                                            onClick={(e) => {
                                                //@ts-expect-error
                                                if (!e.target.closest(".noClickRedirect")) {
                                                    customNavigate(versionPagePathname(version.slug));
                                                }
                                            }}
                                        >
                                            <TableCell className="ps-table-side-pad-sm md:hidden">
                                                {/* MOBILE ONLY */}
                                                <div className="flex w-full flex-col items-start justify-start gap-1.5">
                                                    <div
                                                        className="flex w-full items-center justify-start gap-2.5"
                                                        title={version.title}
                                                    >
                                                        <ReleaseChannelBadge releaseChannel={version.releaseChannel} />
                                                        <VersionName
                                                            title={version.title}
                                                            number={version.versionNumber}
                                                            url={versionPagePathname(version.slug)}
                                                        />
                                                    </div>
                                                    <div className="flex w-full flex-wrap items-center justify-start gap-1.5">
                                                        <GameVersions
                                                            gameVersions={version.gameVersions}
                                                            verbose={anyFilterEnabled}
                                                        />
                                                        <ProjectLoaders versionLoaders={version.loaders} />
                                                    </div>
                                                    <div className="flex flex-wrap items-start justify-start gap-3">
                                                        <DatePublished dateStr={version.datePublished} />
                                                        <DownloadsCount downloads={version.downloads} />
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* MID WIDTH AND ABOVE */}
                                            <TableCell className="hidden ps-table-side-pad pe-2 md:table-cell">
                                                <ReleaseChannelBadge releaseChannel={version.releaseChannel} />
                                            </TableCell>

                                            {/* MID WIDTH AND ABOVE */}
                                            <TableCell className="hidden md:table-cell" title={version.title}>
                                                <VersionName
                                                    title={version.title}
                                                    number={version.versionNumber}
                                                    url={versionPagePathname(version.slug)}
                                                />
                                            </TableCell>

                                            {/* MID WIDTH AND ABOVE */}
                                            <TableCell className="hidden md:table-cell">
                                                <div className="flex w-full flex-wrap items-start justify-start gap-1.5">
                                                    <GameVersions
                                                        gameVersions={version.gameVersions}
                                                        verbose={anyFilterEnabled}
                                                    />
                                                    <ProjectLoaders versionLoaders={version.loaders} />
                                                </div>
                                            </TableCell>

                                            {/* MID WIDTH AND BELOW XL*/}
                                            <TableCell className="hidden md:table-cell xl:hidden">
                                                <div className="lex min-w-max flex-wrap items-start justify-start gap-3">
                                                    <DatePublished dateStr={version.datePublished} />
                                                    <DownloadsCount downloads={version.downloads} />
                                                </div>
                                            </TableCell>

                                            {/* XL WIDTH AND ABOVE */}
                                            <TableCell className="hidden md:hidden xl:table-cell">
                                                <DatePublished dateStr={version.datePublished} iconVisible={false} />
                                            </TableCell>

                                            {/* XL WIDTH AND ABOVE */}
                                            <TableCell className="hidden md:hidden xl:table-cell">
                                                <DownloadsCount downloads={version.downloads} iconVisible={false} />
                                            </TableCell>

                                            {/* ALWAYS THE SAME */}
                                            <TableCell className="pe-table-side-pad-sm md:pe-table-side-pad">
                                                <div className="flex w-full items-center justify-end gap-1">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <VariantButtonLink
                                                                url={version.primaryFile?.url || ""}
                                                                variant="outline"
                                                                size="icon"
                                                                className="noClickRedirect !w-10 !h-10 shrink-0 rounded-full"
                                                                aria-label={`Download ${version.title}`}
                                                                onClick={showDownloadAnimation}
                                                                rel="nofollow noindex"
                                                            >
                                                                <DownloadIcon
                                                                    aria-hidden
                                                                    className="h-btn-icon w-btn-icon"
                                                                    strokeWidth={2.2}
                                                                />
                                                            </VariantButtonLink>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            {version.primaryFile?.name} (
                                                            {parseFileSize(version.primaryFile?.size || 0)})
                                                        </TooltipContent>
                                                    </Tooltip>

                                                    <ThreeDotMenu
                                                        canEditVersion={canEditVersion}
                                                        versionPageUrl={versionPagePathname(version.slug)}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TooltipProvider>
            ) : null}

            {Pagination ? <div className="flex items-center justify-center">{Pagination}</div> : null}
        </>
    );
}

function VersionName({ title, number, url }: { title: string; number: string; url: string }) {
    return (
        <div className="flex max-w-[24ch] flex-col items-start justify-center overflow-hidden lg:max-w-[32ch]">
            <Link
                prefetch={Prefetch.Render}
                to={url}
                className="noClickRedirect font-bold text-foreground leading-tight md:whitespace-nowrap"
            >
                {number}
            </Link>
            <span className="font-medium text-[0.77rem] text-muted-foreground/85 leading-snug md:whitespace-nowrap">{title}</span>
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
    const { theme } = useTheme();

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
                                ? theme === "dark"
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
            <span className="flex cursor-help items-center justify-start gap-1.5 whitespace-nowrap font-medium text-muted-foreground">
                {iconVisible === true ? <CalendarIcon aria-hidden className="h-3.5 w-3.5" /> : null}
                <TimePassedSince date={dateStr} capitalize />
            </span>
        </TooltipTemplate>
    );
}

function DownloadsCount({ downloads, iconVisible = true }: { downloads: number; iconVisible?: boolean }) {
    return (
        <span className="flex items-center justify-start gap-1.5 font-medium text-muted-foreground">
            {iconVisible === true ? <DownloadIcon aria-hidden className="h-3.5 w-3.5" /> : null}
            <FormattedCount count={downloads} />
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
                    url={versionPageUrl}
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
                            url={`${versionPageUrl}/edit`}
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

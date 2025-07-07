import { ParseInt } from "@app/utils/string";
import { VersionReleaseChannel } from "@app/utils/types";
import { DownloadIcon, FlaskConicalIcon } from "lucide-react";
import { useContext } from "react";
import { useSearchParams } from "react-router";
import MarkdownRenderBox from "~/components/md-editor/md-renderer";
import { DownloadAnimationContext } from "~/components/misc/download-animation";
import PaginatedNavigation from "~/components/misc/pagination-nav";
import { buttonVariants } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { FormattedDate } from "~/components/ui/date";
import Link from "~/components/ui/link";
import { TooltipProvider, TooltipTemplate } from "~/components/ui/tooltip";
import { cn } from "~/components/utils";
import { useProjectData } from "~/hooks/project";
import { useTranslation } from "~/locales/provider";
import { UserProfilePath, VersionPagePath } from "~/utils/urls";
import VersionFilters from "./version-filters";

const ITEMS_PER_PAGE = 15;

export default function VersionChangelogs() {
    const ctx = useProjectData();
    const { t } = useTranslation();
    const pageSearchParamKey = "page";
    const [urlSearchParams] = useSearchParams();
    const page = urlSearchParams.get(pageSearchParamKey) || "1";
    const pagesCount = Math.ceil((ctx.allProjectVersions?.length || 0) / ITEMS_PER_PAGE);
    const activePage = ParseInt(page) <= pagesCount ? ParseInt(page) : 1;

    const { show: showDownloadAnimation } = useContext(DownloadAnimationContext);

    const filter = VersionFilters({
        allProjectVersions: ctx.allProjectVersions,
        supportedGameVersions: ctx.projectData.gameVersions,
        showDevVersions_Default: true,
    });

    const Pagination =
        (filter.filteredItems.length || 0) > ITEMS_PER_PAGE ? (
            <PaginatedNavigation pagesCount={pagesCount} activePage={activePage} searchParamKey={pageSearchParamKey} />
        ) : null;

    const visibleVersionItems = filter.filteredItems.slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE);

    return (
        <>
            {filter.component}

            <Card className="flex w-full flex-col items-start justify-start p-5">
                {visibleVersionItems.map((version, index) => {
                    const nextVersion = visibleVersionItems[index + 1];
                    const isDuplicate =
                        nextVersion?.changelog &&
                        nextVersion.changelog.length > 0 &&
                        nextVersion?.changelog === version.changelog &&
                        version.releaseChannel === nextVersion.releaseChannel;

                    return (
                        <div key={version.id} className="relative mb-4 w-full ps-7 dark:text-muted-foreground">
                            <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-1">
                                <div className="flex flex-wrap items-baseline justify-start gap-x-1.5">
                                    <ChangelogBar releaseChannel={version.releaseChannel} isDuplicate={isDuplicate === true} />

                                    {version.releaseChannel === VersionReleaseChannel.DEV ? (
                                        <TooltipProvider>
                                            <TooltipTemplate content="Dev release!" className="font-normal">
                                                <FlaskConicalIcon
                                                    aria-hidden
                                                    className="h-btn-icon-md w-btn-icon-md cursor-help text-danger-foreground"
                                                />
                                            </TooltipTemplate>
                                        </TooltipProvider>
                                    ) : null}

                                    {t.version.publishedBy(
                                        <h2 key="version-title" className="leading-tight">
                                            <Link
                                                to={VersionPagePath(ctx.projectType, ctx.projectData.slug, version.slug)}
                                                className="flex items-baseline gap-2 font-bold text-[1.25rem]"
                                            >
                                                {version.title}
                                            </Link>
                                        </h2>,

                                        <Link
                                            key="version-author"
                                            to={UserProfilePath(version.author.userName)}
                                            className="link_blue hover:underline"
                                        >
                                            {version.author.userName}
                                        </Link>,

                                        <FormattedDate
                                            key="date-published"
                                            date={version.datePublished}
                                            includeTime={false}
                                            shortMonthNames={true}
                                        />,
                                    )}
                                </div>

                                {version.primaryFile?.url ? (
                                    <a
                                        href={version.primaryFile.url}
                                        className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
                                        onClick={showDownloadAnimation}
                                        rel="nofollow noindex"
                                    >
                                        <DownloadIcon aria-hidden className="h-btn-icon w-btn-icon" />
                                        {t.common.download}
                                    </a>
                                ) : null}
                            </div>

                            {version.changelog && !isDuplicate ? (
                                <MarkdownRenderBox addIdToHeadings={false} text={version.changelog} className="me-2" />
                            ) : null}
                        </div>
                    );
                })}
            </Card>

            {Pagination}
        </>
    );
}

function ChangelogBar({ releaseChannel, isDuplicate }: { releaseChannel: VersionReleaseChannel; isDuplicate: boolean }) {
    return (
        <div
            className={cn(
                "changelog-bar absolute start-2 top-2.5 h-full w-1 rounded-full",
                releaseChannel === VersionReleaseChannel.RELEASE
                    ? "text-blue-500 dark:text-blue-400"
                    : releaseChannel === VersionReleaseChannel.BETA
                      ? "text-orange-500 dark:text-orange-400"
                      : releaseChannel === VersionReleaseChannel.ALPHA || releaseChannel === VersionReleaseChannel.DEV
                        ? "text-danger-background"
                        : "",

                isDuplicate && "duplicate",
            )}
        >
            <span className="absolute top-0 left-[-0.5rem] h-4 w-4 translate-x-[0.125rem] rounded-full bg-current" />
        </div>
    );
}

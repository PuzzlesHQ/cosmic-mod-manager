import { projectTypes } from "@app/utils/config/project";
import {
    defaultSearchLimit,
    defaultSortBy,
    MAX_SEARCH_LIMIT,
    searchLimitParamNamespace,
    searchQueryParamNamespace,
    sortByParamNamespace,
} from "@app/utils/config/search";
import { type ProjectType, SearchResultSortMethod } from "@app/utils/types";
import { FilterIcon, ImageIcon, LayoutListIcon, SearchIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useSpinnerCtx } from "~/components/global-spinner";
import { ListViewType } from "~/components/misc/search-list-item";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { TooltipProvider, TooltipTemplate } from "~/components/ui/tooltip";
import { VisuallyHidden } from "~/components/ui/visually-hidden";
import { cn } from "~/components/utils";
import { usePreferences } from "~/hooks/preferences";
import { useTranslation } from "~/locales/provider";
import { removePageOffsetSearchParam, updateSearchParam, useSearchContext } from "./provider";
import { SearchResults } from "./search_results";
import SearchFilters from "./sidebar";

export default function SearchPage() {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const searchInput = useRef<HTMLInputElement>(null);
    const [filtersDialogOpen, setFiltersDialogOpen] = useState(false);

    const {
        searchTerm,
        setSearchTerm,
        sortBy,
        numProjectsLimit_Param,

        projectType,
        projectType_Coerced,
    } = useSearchContext();
    const { viewPrefs } = usePreferences();
    const viewType = viewPrefs[projectType_Coerced];

    // Search box focus
    function handleSearchInputFocus(e: KeyboardEvent) {
        if (e.ctrlKey || e.altKey || e.metaKey) return;

        if (e.key === "/") {
            e.stopPropagation();
            e.preventDefault();
            if (searchInput.current) searchInput.current.focus();
        }
    }

    useEffect(() => {
        document.addEventListener("keyup", handleSearchInputFocus);
        return () => document.removeEventListener("keyup", handleSearchInputFocus);
    }, []);

    const searchLabel = t.search[projectType];

    const filtersComponent = useCallback(
        (defaultOpen?: boolean) => (
            <SearchFilters
                type={projectType_Coerced === projectType ? [projectType_Coerced] : projectTypes}
                searchParams={searchParams}
                sectionsDefaultOpen={defaultOpen}
            />
        ),
        [searchParams, projectType],
    );

    return (
        <div className="search-page-grid-layout grid w-full gap-panel-cards pb-16">
            <aside className="page-sidebar relative hidden h-fit gap-panel-cards rounded-lg bg-card-background p-card-surround lg:grid">
                {filtersComponent()}
            </aside>

            <main id="main" className="page-content grid h-fit grid-cols-1 gap-panel-cards">
                <Card className="flex h-fit flex-wrap items-center justify-start gap-2 p-card-surround">
                    <form
                        method="get"
                        className="flex min-w-full grow items-center justify-center sm:min-w-[32ch]"
                        // If JS is enabled, prevent the form from submitting
                        // and instead use the search input value to update the URL
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <label htmlFor="search-input" className="relative flex w-full items-center justify-center">
                            <SearchBarIcon />
                            <Input
                                ref={searchInput}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value || "")}
                                placeholder={`${searchLabel}...`}
                                className="!ps-9 font-medium text-md focus:[&>kbd]:invisible"
                                id="search-input"
                                name={searchQueryParamNamespace}
                                aria-label={searchLabel}
                            />

                            <kbd className="-translate-y-1/2 absolute end-3 top-1/2 rounded-[0.3rem] border border-hover-background bg-raised-background px-1">
                                /
                            </kbd>
                        </label>
                    </form>

                    <Select
                        value={sortBy || defaultSortBy}
                        onValueChange={(val) => {
                            setSearchParams(
                                (prev) => {
                                    updateSearchParam({
                                        searchParams: prev,
                                        key: sortByParamNamespace,
                                        value: val,
                                        deleteIfEqualsThis: defaultSortBy,
                                        newParamsInsertionMode: "replace",
                                    });

                                    removePageOffsetSearchParam(prev);
                                    return prev;
                                },
                                { preventScrollReset: true },
                            );
                        }}
                        name="sort-by"
                    >
                        <SelectTrigger className="w-48 lg:min-w-58 dark:text-foreground-muted" title={t.search.sortBy}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel className="font-bold text-foreground-extra-muted">
                                    {t.search.sortBy}
                                </SelectLabel>
                                {[
                                    SearchResultSortMethod.RELEVANCE,
                                    SearchResultSortMethod.TRENDING,
                                    SearchResultSortMethod.DOWNLOADS,
                                    SearchResultSortMethod.FOLLOW_COUNT,
                                    SearchResultSortMethod.RECENTLY_UPDATED,
                                    SearchResultSortMethod.RECENTLY_PUBLISHED,
                                ].map((option) => {
                                    return (
                                        <SelectItem key={option} value={option}>
                                            {t.search[option]}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select
                        value={numProjectsLimit_Param.toString()}
                        onValueChange={(val) => {
                            setSearchParams(
                                (prev) => {
                                    updateSearchParam({
                                        searchParams: prev,
                                        key: searchLimitParamNamespace,
                                        value: val,
                                        deleteIfEqualsThis: `${defaultSearchLimit}`,
                                        newParamsInsertionMode: "replace",
                                    });
                                    removePageOffsetSearchParam(prev);

                                    return prev;
                                },
                                { preventScrollReset: true },
                            );
                        }}
                        name="Show per page"
                    >
                        <SelectTrigger className="w-fit dark:text-foreground-muted" title={t.search.showPerPage}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel className="font-bold text-foreground">{t.search.showPerPage}</SelectLabel>
                                {[10, defaultSearchLimit, 50, MAX_SEARCH_LIMIT].map((option) => {
                                    const optionStr = option.toString();
                                    return (
                                        <SelectItem key={option} value={optionStr}>
                                            {optionStr}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Dialog open={filtersDialogOpen} onOpenChange={setFiltersDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex lg:hidden" variant="secondary">
                                <FilterIcon aria-hidden className="h-btn-icon w-btn-icon" />
                                {t.search.filters}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{t.search.filters}</DialogTitle>
                                <VisuallyHidden>
                                    <DialogDescription>{t.search.filters}</DialogDescription>
                                </VisuallyHidden>
                            </DialogHeader>

                            <DialogBody className="grid gap-panel-cards">{filtersComponent(false)}</DialogBody>
                        </DialogContent>
                    </Dialog>

                    <ViewTypeToggle projectType={projectType_Coerced} viewType={viewType} />
                </Card>

                <SearchResults viewType={viewType} />
            </main>
        </div>
    );
}

function SearchBarIcon() {
    const { showSpinner } = useSpinnerCtx();

    return (
        <span className="absolute start-2.5 top-[50%] grid translate-y-[-50%] grid-cols-1 grid-rows-1">
            <Spinner className={cn("col-span-full row-span-full opacity-0", showSpinner && "opacity-100")} />
            <SearchIcon
                aria-hidden
                className={cn(
                    "col-span-full row-span-full h-btn-icon-md w-btn-icon-md text-foreground-extra-muted opacity-100 transition-opacity duration-500",
                    showSpinner && "opacity-0",
                )}
            />
        </span>
    );
}

function Spinner({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "h-[1.17rem] w-[1.17rem] animate-spin rounded-full border-[0.17rem] border-accent-bg border-t-transparent transition-opacity duration-500",
                className,
            )}
        />
    );
}

function ViewTypeToggle({ projectType, viewType }: { projectType: ProjectType; viewType: ListViewType }) {
    const { viewPrefs, updatePreferences } = usePreferences();
    const { t } = useTranslation();

    function toggleViewType() {
        let newDisplayType = viewType;
        if (viewType === ListViewType.LIST) {
            newDisplayType = ListViewType.GALLERY;
        } else if (viewType === ListViewType.GALLERY) {
            newDisplayType = ListViewType.LIST;
        }

        updatePreferences({
            viewPrefs: {
                ...viewPrefs,
                [projectType]: newDisplayType,
            },
        });
    }

    return (
        <TooltipProvider>
            <TooltipTemplate content={t.search.view[viewType]}>
                <Button
                    variant="secondary"
                    size="icon"
                    onClick={toggleViewType}
                    aria-label="Toggle View Type"
                    className="h-nav-item w-nav-item"
                >
                    {viewType === ListViewType.GALLERY ? (
                        <ImageIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                    ) : (
                        <LayoutListIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                    )}
                </Button>
            </TooltipTemplate>
        </TooltipProvider>
    );
}

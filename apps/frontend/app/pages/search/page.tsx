import { ViewType } from "@app/components/misc/search-list-item";
import { Button } from "@app/components/ui/button";
import { Card } from "@app/components/ui/card";
import { Input } from "@app/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@app/components/ui/select";
import { TooltipProvider, TooltipTemplate } from "@app/components/ui/tooltip";
import { cn } from "@app/components/utils";
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
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useSpinnerCtx } from "~/components/global-spinner";
import { setUserConfig, type UserConfig, useUserConfig } from "~/hooks/user-config";
import { useTranslation } from "~/locales/provider";
import { removePageOffsetSearchParam, updateSearchParam, useSearchContext } from "./provider";
import { SearchResults } from "./search_results";
import FilterSidebar from "./sidebar";

export default function SearchPage() {
    const { t } = useTranslation();
    const [__, setSearchParams] = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);
    const searchInput = useRef<HTMLInputElement>(null);

    const {
        params: searchParams,
        searchTerm,
        setSearchTerm,
        sortBy,
        projectsPerPage,

        projectType,
        projectType_Coerced,
    } = useSearchContext();

    const viewType = getSearchDisplayPreference(projectType_Coerced);
    const [_, reRender] = useState("0");

    // Search box focus
    function handleSearchInputFocus(e: KeyboardEvent) {
        if (e.ctrlKey || e.altKey || e.metaKey) return;

        if (e.key === "/") {
            e.stopPropagation();
            if (searchInput.current) searchInput.current.focus();
        }
    }

    useEffect(() => {
        document.addEventListener("keyup", handleSearchInputFocus);
        return () => document.removeEventListener("keyup", handleSearchInputFocus);
    }, []);

    const searchLabel = t.search[projectType];

    return (
        <div className="search-page-grid-layout w-full grid gap-panel-cards pb-16">
            {useMemo(() => {
                return (
                    <FilterSidebar
                        type={projectType_Coerced === projectType ? [projectType_Coerced] : projectTypes}
                        showFilters={showFilters}
                        searchParams={searchParams}
                    />
                );
            }, [projectType, showFilters, searchParams.toString()])}

            <main id="main" className="h-fit grid grid-cols-1 gap-panel-cards page-content">
                <Card className="h-fit p-card-surround flex flex-wrap items-center justify-start gap-2">
                    <form
                        method="get"
                        className="grow flex items-center justify-center min-w-full sm:min-w-[32ch]"
                        // If JS is enabled, prevent the form from submitting
                        // and instead use the search input value to update the URL
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <label htmlFor="search-input" className="w-full relative flex items-center justify-center">
                            <SearchBarIcon />
                            <Input
                                ref={searchInput}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value || "")}
                                placeholder={`${searchLabel}...`}
                                className="text-md font-medium !ps-9 focus:[&>kbd]:invisible"
                                id="search-input"
                                name={searchQueryParamNamespace}
                                aria-label={searchLabel}
                            />

                            <kbd className="absolute end-3 top-1/2 -translate-y-1/2 px-1 rounded-[0.3rem] bg-shallower-background/50 border border-shallower-background/85">
                                /
                            </kbd>
                        </label>
                    </form>

                    <Select
                        value={sortBy || defaultSortBy}
                        onValueChange={(val) => {
                            const updatedParams = updateSearchParam({
                                key: sortByParamNamespace,
                                value: val,
                                deleteIfEqualsThis: defaultSortBy,
                                newParamsInsertionMode: "replace",
                            });

                            setSearchParams(removePageOffsetSearchParam(updatedParams), { preventScrollReset: true });
                        }}
                        name="sort-by"
                    >
                        <SelectTrigger className="w-48 lg:min-w-58 dark:text-foreground-muted" title={t.search.sortBy}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel className="text-foreground font-bold">{t.search.sortBy}</SelectLabel>
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
                        value={projectsPerPage.toString()}
                        onValueChange={(val) => {
                            const updatedParams = updateSearchParam({
                                key: searchLimitParamNamespace,
                                value: val,
                                deleteIfEqualsThis: `${defaultSearchLimit}`,
                                newParamsInsertionMode: "replace",
                            });
                            setSearchParams(removePageOffsetSearchParam(updatedParams), { preventScrollReset: true });
                        }}
                        name="Show per page"
                    >
                        <SelectTrigger className="w-fit dark:text-foreground-muted" title={t.search.showPerPage}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel className="text-foreground font-bold">{t.search.showPerPage}</SelectLabel>
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

                    <Button
                        className={cn("flex lg:hidden", showFilters && "!ring-[0.13rem] ring-accent-background/75")}
                        variant="secondary"
                        onClick={() => setShowFilters((prev) => !prev)}
                    >
                        <FilterIcon aria-hidden className="w-btn-icon h-btn-icon" />
                        {t.search.filters}
                    </Button>

                    <ViewTypeToggle projectType={projectType_Coerced} viewType={viewType} reRender={reRender} />
                </Card>

                <SearchResults viewType={viewType} />
            </main>
        </div>
    );
}

function SearchBarIcon() {
    const { showSpinner } = useSpinnerCtx();

    return (
        <span className="absolute start-2.5 top-[50%] translate-y-[-50%] grid grid-cols-1 grid-rows-1">
            <Spinner className={cn("col-span-full row-span-full opacity-0", showSpinner && "opacity-100")} />
            <SearchIcon
                aria-hidden
                className={cn(
                    "w-btn-icon-md h-btn-icon-md text-extra-muted-foreground col-span-full row-span-full opacity-100 transition-opacity duration-500",
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
                "w-[1.17rem] h-[1.17rem] border-[0.17rem] rounded-full border-accent-background border-t-transparent transition-opacity animate-spin duration-500",
                className,
            )}
        />
    );
}

function ViewTypeToggle({
    projectType,
    viewType,
    reRender,
}: {
    projectType: ProjectType;
    viewType: ViewType;
    reRender: (str: string) => void;
}) {
    const userConfig = useUserConfig();
    const { t } = useTranslation();

    function toggleViewType() {
        let newDisplayType = viewType;
        if (viewType === ViewType.LIST) {
            newDisplayType = ViewType.GALLERY;
        } else if (viewType === ViewType.GALLERY) {
            newDisplayType = ViewType.LIST;
        }

        reRender(Math.random().toString());
        saveSearchDisplayPreference(projectType, newDisplayType, userConfig);
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
                    {viewType === ViewType.GALLERY ? (
                        <ImageIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                    ) : (
                        <LayoutListIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                    )}
                </Button>
            </TooltipTemplate>
        </TooltipProvider>
    );
}

function saveSearchDisplayPreference(projectType: ProjectType, viewType: ViewType, userConfig: UserConfig) {
    userConfig.viewPrefs[projectType] = viewType;
    setUserConfig(userConfig);
}

function getSearchDisplayPreference(projectType: ProjectType) {
    return useUserConfig().viewPrefs[projectType];
}

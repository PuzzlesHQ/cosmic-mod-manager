import {
    categoryFilterParamNamespace,
    environmentFilterParamNamespace,
    gameVersionFilterParamNamespace,
    licenseFilterParamNamespace,
    loaderFilterParamNamespace,
} from "@app/utils/config/search";
import { getALlLoaderFilters, getValidProjectCategories } from "@app/utils/project";
import GAME_VERSIONS, { isExperimentalGameVersion } from "@app/utils/src/constants/game-versions";
import { CapitalizeAndFormatString } from "@app/utils/string";
import { ProjectType, TagType } from "@app/utils/types";
import { ChevronDownIcon, ChevronUpIcon, FilterXIcon } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { TagIcon } from "~/components/icons/tag-icons";
import { Button } from "~/components/ui/button";
import { LabelledCheckbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { SkipNav } from "~/components/ui/skip-nav";
import { LabelledTernaryCheckbox, TernaryStates } from "~/components/ui/ternary-checkbox";
import { cn } from "~/components/utils";
import { useTranslation } from "~/locales/provider";
import { NOT, removePageOffsetSearchParam, updateSearchParam, updateTernaryState_SearchParam } from "./provider";

const SHOW_ENV_FILTER_FOR_TYPES = [ProjectType.MOD, ProjectType.MODPACK /*, ProjectType.DATAMOD */];

interface Props {
    type: ProjectType[];
    searchParams: URLSearchParams;
}

function matchesSearch(strings: string[], query: string) {
    const queryLower = query.toLowerCase();
    for (const str of strings) {
        const strLower = str.toLowerCase();

        if (strLower.includes(queryLower) || queryLower.includes(strLower)) {
            return true;
        }
    }
    return false;
}

const filtersKeyList = [
    loaderFilterParamNamespace,
    gameVersionFilterParamNamespace,
    environmentFilterParamNamespace,
    categoryFilterParamNamespace,
    licenseFilterParamNamespace,
];

function SearchFilters({ type, searchParams }: Props) {
    const { t } = useTranslation();
    const [, setSearchParams] = useSearchParams();
    const [showAllVersions, setShowAllVersions] = useState(false);
    const [query, setQuery] = useState("");

    // Labels
    const loadersFilterLabel = t.search.loaders;
    const gameVersionsFilterLabel = t.search.gameVersions;
    const environmentFilterLabel = t.search.environment;
    const categoryFilterLabel = t.search.category;
    const featureFilterLabel = t.search.feature;
    const resolutionFilterLabel = t.search.resolution;
    const performanceFilterLabel = t.search.performance_impact;
    const licenseFilterLabel = t.search.license;

    // Filters list
    const loaderFilters = getALlLoaderFilters(type);
    // Project Loader filters
    const loaderFilterOptions = loaderFilters
        .map((loader) => loader.name)
        .filter((loader) => matchesSearch([loader, loadersFilterLabel], query));

    // Game version filters
    const gameVersionFilterOptions = GAME_VERSIONS.filter((version) => {
        if (!showAllVersions && isExperimentalGameVersion(version.releaseType)) return false;
        return true;
    })
        .map((version) => ({ value: version.value, label: version.label }))
        .filter((version) => {
            if (!version) return false;
            return matchesSearch([version.label, version.value, gameVersionsFilterLabel], query);
        });

    // Environment filters
    const environmentFilterOptions = ["client", "server"].filter((env) => matchesSearch([env, environmentFilterLabel], query));

    // Category filters
    const categoryFilterOptions = getValidProjectCategories(type, TagType.CATEGORY)
        .map((c) => c.name)
        .filter((category) => matchesSearch([category, categoryFilterLabel], query));

    // Feature filters
    const featureFilterOptions = getValidProjectCategories(type, TagType.FEATURE)
        .map((f) => f.name)
        .filter((feature) => matchesSearch([feature, featureFilterLabel], query));

    // Resolution filters
    const resolutionFilterOptions = getValidProjectCategories(type, TagType.RESOLUTION)
        .map((r) => r.name)
        .filter((resolution) => matchesSearch([resolution, resolutionFilterLabel], query));

    // Performance impact filters
    const performanceFilterOptions = getValidProjectCategories(type, TagType.PERFORMANCE_IMPACT)
        .map((p) => p.name)
        .filter((performance) => matchesSearch([performance, performanceFilterLabel], query));

    // License filters
    const licenseFilterOptions = [{ value: "oss", label: t.search.openSourceOnly }].filter((license) =>
        matchesSearch([license.label, license.value, licenseFilterLabel], query),
    );

    const isUniversalSearchPage = type.length > 1;
    const defaultOpenAdditionalFilters = !isUniversalSearchPage;

    function clearFilters() {
        setSearchParams((prev) => {
            for (const key of filtersKeyList) {
                prev.delete(key);
            }

            return prev;
        });
    }

    return (
        <>
            <SkipNav />

            <div className="flex items-center justify-center gap-2">
                <Input
                    placeholder={t.search.searchFilters}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                    }}
                />

                <Button
                    onClick={clearFilters}
                    variant="secondary"
                    className="!w-10 !h-10 shrink-0"
                    title={t.search.clearFilters}
                    size="icon"
                >
                    <FilterXIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                </Button>
            </div>

            <FilterCategory
                items={loaderFilterOptions}
                selectedItems={searchParams.getAll(loaderFilterParamNamespace)}
                label={loadersFilterLabel}
                filterToggledUrl={(loaderName) => {
                    const params = new URLSearchParams(searchParams);

                    return updateTernaryState_SearchParam({
                        searchParams: params,
                        key: loaderFilterParamNamespace,
                        value: loaderName,
                        searchParamModifier: removePageOffsetSearchParam,
                    });
                }}
            />

            <FilterCategory
                items={gameVersionFilterOptions}
                selectedItems={searchParams.getAll(gameVersionFilterParamNamespace)}
                label={gameVersionsFilterLabel}
                listWrapperClassName="max-h-[15rem] overflow-y-auto px-0.5"
                formatLabel={false}
                filterToggledUrl={(version) => {
                    const params = new URLSearchParams(searchParams);

                    return updateTernaryState_SearchParam({
                        searchParams: params,
                        key: gameVersionFilterParamNamespace,
                        value: version,
                        searchParamModifier: removePageOffsetSearchParam,
                    });
                }}
                footerItem={
                    <LabelledCheckbox
                        checked={showAllVersions}
                        onCheckedChange={(checked) => {
                            setShowAllVersions(checked === true);
                        }}
                        className="ms-0.5 mt-3 text-foreground-extra-muted"
                    >
                        {t.form.showAllVersions}
                    </LabelledCheckbox>
                }
            />

            {SHOW_ENV_FILTER_FOR_TYPES.some((t) => type.includes(t)) && (
                <FilterCategory
                    items={environmentFilterOptions}
                    selectedItems={searchParams.getAll(environmentFilterParamNamespace)}
                    label={environmentFilterLabel}
                    filterToggledUrl={(env) => {
                        const params = new URLSearchParams(searchParams);

                        return removePageOffsetSearchParam(
                            updateSearchParam({
                                searchParams: params,
                                key: environmentFilterParamNamespace,
                                value: env,
                                deleteIfExists: true,
                                deleteParamsWithMatchingValueOnly: true,
                            }),
                        );
                    }}
                    defaultOpen={defaultOpenAdditionalFilters}
                />
            )}

            <FilterCategory
                items={categoryFilterOptions}
                selectedItems={searchParams.getAll(categoryFilterParamNamespace)}
                label={categoryFilterLabel}
                filterToggledUrl={(category) => {
                    const params = new URLSearchParams(searchParams);

                    return updateTernaryState_SearchParam({
                        searchParams: params,
                        key: categoryFilterParamNamespace,
                        value: category,
                        searchParamModifier: removePageOffsetSearchParam,
                    });
                }}
                defaultOpen={defaultOpenAdditionalFilters}
            />

            <FilterCategory
                items={featureFilterOptions}
                selectedItems={searchParams.getAll(categoryFilterParamNamespace)}
                label={featureFilterLabel}
                filterToggledUrl={(feature) => {
                    const params = new URLSearchParams(searchParams);

                    return updateTernaryState_SearchParam({
                        searchParams: params,
                        key: categoryFilterParamNamespace,
                        value: feature,
                        searchParamModifier: removePageOffsetSearchParam,
                    });
                }}
                defaultOpen={defaultOpenAdditionalFilters}
            />

            <FilterCategory
                items={resolutionFilterOptions}
                selectedItems={searchParams.getAll(categoryFilterParamNamespace)}
                label={resolutionFilterLabel}
                filterToggledUrl={(resolution) => {
                    const params = new URLSearchParams(searchParams);

                    return updateTernaryState_SearchParam({
                        searchParams: params,
                        key: categoryFilterParamNamespace,
                        value: resolution,
                        searchParamModifier: removePageOffsetSearchParam,
                    });
                }}
                defaultOpen={defaultOpenAdditionalFilters}
            />

            <FilterCategory
                items={performanceFilterOptions}
                selectedItems={searchParams.getAll(categoryFilterParamNamespace)}
                label={performanceFilterLabel}
                filterToggledUrl={(performance) => {
                    const params = new URLSearchParams(searchParams);

                    return updateTernaryState_SearchParam({
                        searchParams: params,
                        key: categoryFilterParamNamespace,
                        value: performance,
                        searchParamModifier: removePageOffsetSearchParam,
                    });
                }}
                defaultOpen={defaultOpenAdditionalFilters}
            />

            <FilterCategory
                items={licenseFilterOptions}
                selectedItems={searchParams.getAll(licenseFilterParamNamespace)}
                label={licenseFilterLabel}
                filterToggledUrl={(license) => {
                    const params = new URLSearchParams(searchParams);

                    return updateTernaryState_SearchParam({
                        searchParams: params,
                        key: licenseFilterParamNamespace,
                        value: license,
                        searchParamModifier: removePageOffsetSearchParam,
                    });
                }}
                defaultOpen={defaultOpenAdditionalFilters}
            />
        </>
    );
}

export default SearchFilters;

interface FilterItem {
    value: string;
    label: string;
}

interface FilterCategoryProps {
    items: FilterItem[] | string[];
    selectedItems: string[];
    label: string;
    // The function is expected to return the search params after toggling the filter
    filterToggledUrl: (prevVal: string) => URLSearchParams;
    listWrapperClassName?: string;
    className?: string;
    formatLabel?: boolean;
    footerItem?: React.ReactNode;
    collapsible?: boolean;
    defaultOpen?: boolean;
}

function FilterCategory({
    items,
    selectedItems,
    label,
    filterToggledUrl,
    className,
    listWrapperClassName,
    formatLabel = true,
    footerItem,
    collapsible = true,
    defaultOpen = true,
}: FilterCategoryProps) {
    const { t } = useTranslation();
    const [_, setSearchParams] = useSearchParams();
    const [isOpen, setIsOpen] = useState(defaultOpen);
    if (!items.length) return null;

    function toggleVisibility(e?: React.MouseEvent) {
        e?.stopPropagation();
        setIsOpen((prev) => !prev);
    }

    return (
        <section className={cn("filterCategory grid grid-cols-1", className)}>
            {/** biome-ignore lint/a11y/noStaticElementInteractions: -- */}
            <div
                className={cn("flex items-center justify-between gap-x-2 p-0.5", collapsible && "cursor-pointer")}
                onClick={toggleVisibility}
                onKeyDown={(e) => {
                    if (e.code === "Enter") toggleVisibility();
                }}
            >
                <h3 className="font-bold text-base">{label}</h3>
                {collapsible && (
                    <button
                        type="button"
                        onClick={toggleVisibility}
                        className="text-foreground-extra-muted"
                        aria-label="Toggle visibility"
                    >
                        {isOpen ? (
                            <ChevronUpIcon aria-hidden className="h-5 w-5" />
                        ) : (
                            <ChevronDownIcon aria-hidden className="h-5 w-5" />
                        )}
                    </button>
                )}
            </div>
            <div className={cn("flex w-full flex-col", !isOpen && collapsible && "hidden", listWrapperClassName)}>
                {items.map((item) => {
                    const itemValue = typeof item === "string" ? item : item.value;
                    let _itemLabel = typeof item === "string" ? item : item.label;

                    // @ts-ignore
                    const tagTranslation = t.search.tags[itemValue];
                    if (tagTranslation) {
                        _itemLabel = tagTranslation;
                    }

                    const itemLabel = formatLabel ? CapitalizeAndFormatString(_itemLabel) || "" : _itemLabel;
                    const state = selectedItems.includes(itemValue)
                        ? TernaryStates.INCLUDED
                        : selectedItems.includes(NOT(itemValue))
                          ? TernaryStates.EXCLUDED
                          : TernaryStates.UNCHECKED;

                    return (
                        <LabelledTernaryCheckbox
                            state={state}
                            onCheckedChange={() => {
                                const params = filterToggledUrl(itemValue);
                                setSearchParams(params, { preventScrollReset: true });
                            }}
                            key={itemValue}
                        >
                            <span className="flex items-center justify-center gap-1">
                                <TagIcon name={itemValue} />
                                {itemLabel}
                            </span>
                        </LabelledTernaryCheckbox>
                    );
                })}
            </div>
            {!isOpen && collapsible ? null : footerItem}
        </section>
    );
}

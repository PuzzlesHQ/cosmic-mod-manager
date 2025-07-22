import { getLoaderFromString } from "@app/utils/convertors";
import { sortVersionsWithReference } from "@app/utils/project";
import {
    type GameVersion,
    gameVersionsList,
    getGameVersionsFromValues,
    isExperimentalGameVersion,
} from "@app/utils/src/constants/game-versions";
import { BoolFromStr, CapitalizeAndFormatString } from "@app/utils/string";
import { VersionReleaseChannel } from "@app/utils/types";
import type { ProjectVersionData } from "@app/utils/types/api";
import { ChevronDownIcon, FilterIcon, FlaskConicalIcon, XIcon } from "lucide-react";
import { type CSSProperties, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";
import { LabelledCheckbox } from "~/components/ui/checkbox";
import { ChipButton } from "~/components/ui/chip";
import { CommandSeparator } from "~/components/ui/command";
import { MultiSelect } from "~/components/ui/multi-select";
import { releaseChannelTextColor } from "~/components/ui/release-channel-pill";
import { cn } from "~/components/utils";
import { useTranslation } from "~/locales/provider";

const LOADER_KEY = "l";
const GAME_VERSION_KEY = "v";
const RELEASE_CHANNEL_KEY = "channel";
const SHOW_DEV_VERSIONS_KEY = "showDev";

interface FilterItems {
    loaders: string[];
    gameVersions: string[];
    releaseChannels: string[];
}

interface VersionFiltersProps {
    showDevVersions_Default?: boolean;
    allProjectVersions: ProjectVersionData[];
    supportedGameVersions: string[];
}

export default function VersionFilters(props: VersionFiltersProps) {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [showExperimentalGameVersions, setShowExperimentalGameVersions] = useState(false);
    const filters = getFiltersList(searchParams);

    function updateSearchParams(newParams: URLSearchParams) {
        setSearchParams(newParams, { preventScrollReset: true });
    }

    const showDevVersions = searchParams.get(SHOW_DEV_VERSIONS_KEY)
        ? BoolFromStr(searchParams.get(SHOW_DEV_VERSIONS_KEY))
        : Boolean(props.showDevVersions_Default);
    function setShowDevVersions(value: boolean) {
        searchParams.set(SHOW_DEV_VERSIONS_KEY, value === true ? "true" : "false");
        updateSearchParams(searchParams);
    }

    function setFilters(newFilters: FilterItems) {
        updateSearchParams(updateFiltersList(searchParams, newFilters));
    }

    const formattedOptions = formatFilterOptions(props.allProjectVersions, showDevVersions, showExperimentalGameVersions);
    const anyFilterEnabled = filters.loaders.length + filters.gameVersions.length + filters.releaseChannels.length > 0;

    const filteredItems = useMemo(() => {
        return filterVersionItems(props.allProjectVersions, filters, showDevVersions);
    }, [filters, props.allProjectVersions, showDevVersions]);

    const hasSnapshotVersion = getGameVersionsFromValues(props.supportedGameVersions).some((ver) =>
        isExperimentalGameVersion(ver.releaseType),
    );
    const hasDevVersions = props.allProjectVersions.some((ver) => ver.releaseChannel === VersionReleaseChannel.DEV);

    const DownArrowIcon = (
        <ChevronDownIcon aria-hidden className="indicator h-btn-icon-md w-btn-icon-md text-foreground-extra-muted" />
    );

    const filterComponent = (
        <>
            {formattedOptions.anyFilterVisible || hasDevVersions ? (
                <div className="flex flex-wrap items-center justify-start gap-2">
                    {formattedOptions.loadersFilterVisible ? (
                        <MultiSelect
                            selectedValues={filters.loaders}
                            options={formattedOptions.loaderFilters.map((loader) => ({
                                label: CapitalizeAndFormatString(loader) || "",
                                value: loader,
                            }))}
                            onValueChange={(values) => {
                                setFilters({ ...filters, loaders: values });
                            }}
                            searchBox={false}
                            defaultMinWidth={false}
                            customTrigger={
                                <Button variant="secondary">
                                    <FilterIcon aria-hidden className="h-btn-icon w-btn-icon" />
                                    Loaders
                                    {DownArrowIcon}
                                </Button>
                            }
                            noResultsElement={t.common.noResults}
                            inputPlaceholder={t.common.search}
                        />
                    ) : null}

                    {formattedOptions.gameVersionsFilterVisible ? (
                        <MultiSelect
                            searchBox={props.supportedGameVersions.length > 5}
                            selectedValues={filters.gameVersions}
                            options={formattedOptions.gameVersionFilters.map((ver) => ({ label: ver.label, value: ver.value }))}
                            onValueChange={(values) => {
                                setFilters({ ...filters, gameVersions: values });
                            }}
                            defaultMinWidth={false}
                            customTrigger={
                                <Button variant="secondary">
                                    <FilterIcon aria-hidden className="h-btn-icon w-btn-icon" />
                                    {t.search.gameVersions}
                                    {DownArrowIcon}
                                </Button>
                            }
                            fixedFooter={
                                hasSnapshotVersion ? (
                                    <>
                                        <CommandSeparator />
                                        <LabelledCheckbox
                                            checked={showExperimentalGameVersions}
                                            onCheckedChange={(checked) => setShowExperimentalGameVersions(checked === true)}
                                            className="my-1 ps-3.5 pe-2 text-foreground-extra-muted"
                                        >
                                            {t.form.showAllVersions}
                                        </LabelledCheckbox>
                                    </>
                                ) : null
                            }
                            noResultsElement={t.common.noResults}
                            inputPlaceholder={t.common.search}
                        />
                    ) : null}

                    {formattedOptions.releaseChannelsFilterVisible ? (
                        <MultiSelect
                            searchBox={false}
                            defaultMinWidth={false}
                            selectedValues={[...filters.releaseChannels]}
                            options={formattedOptions.releaseChannelFilters.map((channel) => ({
                                label: CapitalizeAndFormatString(channel) || "",
                                value: channel,
                            }))}
                            onValueChange={(values) => {
                                setFilters({ ...filters, releaseChannels: values });
                            }}
                            customTrigger={
                                <Button variant="secondary">
                                    <FilterIcon aria-hidden className="h-btn-icon w-btn-icon" />
                                    {t.search.channels}
                                    {DownArrowIcon}
                                </Button>
                            }
                            noResultsElement={t.common.noResults}
                            inputPlaceholder={t.common.search}
                        />
                    ) : null}

                    {hasDevVersions ? (
                        <LabelledCheckbox
                            className="mx-2 sm:ms-auto"
                            checked={showDevVersions}
                            onCheckedChange={(checked) => setShowDevVersions(checked === true)}
                        >
                            <span className="flex items-center justify-center gap-1">
                                <FlaskConicalIcon aria-hidden className="h-btn-icon w-btn-icon" />
                                {t.project.showDevVersions}
                            </span>
                        </LabelledCheckbox>
                    ) : null}
                </div>
            ) : null}

            {filters.loaders.length + filters.gameVersions.length + filters.releaseChannels.length > 0 ? (
                <div className="flex w-full flex-wrap items-center justify-start gap-x-2 gap-y-1">
                    {filters.loaders.length + filters.gameVersions.length + filters.releaseChannels.length > 1 ? (
                        <FilterItemChip
                            label={t.search.clearFilters}
                            onClick={() => updateSearchParams(resetFilters(searchParams))}
                        />
                    ) : null}

                    {filters.releaseChannels.map((channel) => (
                        <FilterItemChip
                            key={channel}
                            label={CapitalizeAndFormatString(channel)}
                            className={releaseChannelTextColor(channel as VersionReleaseChannel)}
                            onClick={() => {
                                setFilters({
                                    ...filters,
                                    releaseChannels: filters.releaseChannels.filter((c) => c !== channel),
                                });
                            }}
                        />
                    ))}

                    {getGameVersionsFromValues(filters.gameVersions).map((version) => (
                        <FilterItemChip
                            key={version.label}
                            label={version.label}
                            onClick={() => {
                                setFilters({
                                    ...filters,
                                    gameVersions: filters.gameVersions.filter((v) => v !== version.value),
                                });
                            }}
                        />
                    ))}

                    {filters.loaders.map((loader) => {
                        const loaderData = getLoaderFromString(loader);
                        if (!loaderData) return null;

                        return (
                            <FilterItemChip
                                key={loader}
                                label={CapitalizeAndFormatString(loader)}
                                style={{
                                    color: `hsla(var(--loader-fg-${loaderData.name}, --foreground-muted))`,
                                }}
                                onClick={() => {
                                    setFilters({
                                        ...filters,
                                        loaders: filters.loaders.filter((l) => l !== loader),
                                    });
                                }}
                            />
                        );
                    })}
                </div>
            ) : null}
        </>
    );

    return {
        component: filterComponent,
        anyFilterEnabled: anyFilterEnabled,
        filteredItems: filteredItems,
        showDevVersions: showDevVersions,
    };
}

function FilterItemChip(props: { label: string; onClick: () => void; className?: string; style?: CSSProperties }) {
    return (
        <ChipButton onClick={props.onClick} style={props.style} className={cn("gap-1 pe-1.5 hover:underline", props.className)}>
            {props.label}
            <XIcon aria-hidden className="h-btn-icon-sm w-btn-icon-sm" />
        </ChipButton>
    );
}

export function filterVersionItems(allProjectVersions: ProjectVersionData[], filters: FilterItems, showDevVersions = false) {
    const filteredItems: ProjectVersionData[] = [];

    for (const version of allProjectVersions || []) {
        // Check for dev version
        if (version.releaseChannel === VersionReleaseChannel.DEV && !showDevVersions) continue;

        if (filters.loaders.length) {
            let loaderMatch = false;
            for (const loaderFilter of filters.loaders) {
                if (version.loaders.includes(loaderFilter)) {
                    loaderMatch = true;
                    break;
                }
            }

            if (!loaderMatch) continue;
        }

        if (filters.gameVersions.length) {
            let versionMatch = false;
            for (const versionFilter of filters.gameVersions) {
                if (version.gameVersions.includes(versionFilter)) {
                    versionMatch = true;
                    break;
                }
            }

            if (!versionMatch) continue;
        }

        if (filters.releaseChannels.length) {
            if (!filters.releaseChannels.includes(version.releaseChannel)) continue;
        }

        filteredItems.push(version);
    }

    return filteredItems;
}

function formatFilterOptions(
    allProjectVersions: ProjectVersionData[],
    showDevVersions: boolean,
    showExperimentalGameVersions: boolean,
) {
    // Filters list
    // Loaders
    const loaderFilters: string[] = [];
    for (const version of allProjectVersions) {
        if (version.releaseChannel === VersionReleaseChannel.DEV && !showDevVersions) continue;

        for (const loader of version.loaders) {
            if (!loaderFilters.includes(loader)) {
                loaderFilters.push(loader);
            }
        }
    }

    // Game versions
    let gameVersionFilters: GameVersion[] = [];
    for (const version of allProjectVersions) {
        if (version.releaseChannel === VersionReleaseChannel.DEV && !showDevVersions) continue;

        for (const gameVersion of getGameVersionsFromValues(version.gameVersions)) {
            if (!showExperimentalGameVersions && isExperimentalGameVersion(gameVersion.releaseType)) continue;

            if (gameVersionFilters.some((ver) => ver.value === gameVersion.value)) continue;
            gameVersionFilters.push(gameVersion);
        }
    }
    // Sort game versions
    gameVersionFilters = getGameVersionsFromValues(
        sortVersionsWithReference(
            gameVersionFilters.map((ver) => ver.value),
            gameVersionsList,
        ),
    );

    // Release channels
    const releaseChannelFilters: string[] = [];
    for (const version of allProjectVersions) {
        const channel = version.releaseChannel;

        if (channel === VersionReleaseChannel.DEV && !showDevVersions) continue;
        if (!releaseChannelFilters.includes(channel)) {
            releaseChannelFilters.push(channel);
        }
    }

    const loadersFilterVisible = loaderFilters.length > 1;
    const gameVersionsFilterVisible = gameVersionFilters.length > 1;
    const releaseChannelsFilterVisible = releaseChannelFilters.length > 1;

    return {
        loaderFilters: loaderFilters,
        gameVersionFilters: gameVersionFilters,
        releaseChannelFilters: releaseChannelFilters,

        loadersFilterVisible: loadersFilterVisible,
        gameVersionsFilterVisible: gameVersionsFilterVisible,
        releaseChannelsFilterVisible: releaseChannelsFilterVisible,
        anyFilterVisible: loadersFilterVisible || gameVersionsFilterVisible || releaseChannelsFilterVisible,
    };
}

function getFiltersList(searchParams: URLSearchParams): FilterItems {
    const gameVersions = searchParams.getAll(GAME_VERSION_KEY);
    const loaders = searchParams.getAll(LOADER_KEY);
    const releaseChannels = searchParams.getAll(RELEASE_CHANNEL_KEY);

    return {
        gameVersions: gameVersions,
        loaders: loaders,
        releaseChannels: releaseChannels,
    };
}

function updateFiltersList(searchParams: URLSearchParams, newFilters: FilterItems): URLSearchParams {
    resetFilters(searchParams);

    for (const ver of newFilters.gameVersions) {
        searchParams.append(GAME_VERSION_KEY, ver);
    }

    for (const loader of newFilters.loaders) {
        searchParams.append(LOADER_KEY, loader);
    }

    for (const channel of newFilters.releaseChannels) {
        searchParams.append(RELEASE_CHANNEL_KEY, channel);
    }

    return searchParams;
}

function resetFilters(searchParams: URLSearchParams) {
    searchParams.delete(LOADER_KEY);
    searchParams.delete(GAME_VERSION_KEY);
    searchParams.delete(RELEASE_CHANNEL_KEY);

    return searchParams;
}

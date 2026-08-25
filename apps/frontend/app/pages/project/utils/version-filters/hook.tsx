import { sortVersionsWithReference } from "@app/utils/project";
import {
    type GameVersion,
    gameVersionsList,
    getGameVersionsFromValues,
    isExperimentalGameVersion,
} from "@app/utils/src/constants/game-versions";
import { BoolFromStr } from "@app/utils/string";
import { VersionReleaseChannel } from "@app/utils/types";
import type { ProjectVersionData } from "@app/utils/types/api";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";

const LOADER_KEY = "l";
const GAME_VERSION_KEY = "v";
const RELEASE_CHANNEL_KEY = "channel";
const SHOW_DEV_VERSIONS_KEY = "showDev";

interface FilterItems {
    loaders: string[];
    gameVersions: string[];
    releaseChannels: string[];
}

interface UseVersionFiltersProps {
    showDevVersions_Default?: boolean;
    allProjectVersions: ProjectVersionData[];
    supportedGameVersions: string[];
}

export default function useVersionFilters(props: UseVersionFiltersProps) {
    const [searchParams, _setSp] = useSearchParams();
    function setSearchParams(newParams: URLSearchParams) {
        _setSp(newParams, { preventScrollReset: true });
    }

    const [showExperimentalGameVersions, setShowExperimentalGameVersions] = useState(false);
    const activeFilters = getActiveFilters(searchParams);
    function setActiveFilters(newFilters: FilterItems) {
        setSearchParams(updateFiltersList(searchParams, newFilters));
    }

    const showDevVersions = searchParams.get(SHOW_DEV_VERSIONS_KEY)
        ? BoolFromStr(searchParams.get(SHOW_DEV_VERSIONS_KEY))
        : Boolean(props.showDevVersions_Default);

    function setShowDevVersions(value: boolean) {
        searchParams.set(SHOW_DEV_VERSIONS_KEY, value === true ? "true" : "false");
        setSearchParams(searchParams);
    }

    const availableFilterOptions = getAvailableFilterOptions(
        props.allProjectVersions,
        showDevVersions,
        showExperimentalGameVersions,
    );

    const filteredResults = useMemo(() => {
        return filterVersionItems(props.allProjectVersions, activeFilters, showDevVersions);
    }, [activeFilters, props.allProjectVersions, showDevVersions]);

    const hasExperimentalVersion = getGameVersionsFromValues(props.supportedGameVersions).some((ver) =>
        isExperimentalGameVersion(ver.releaseType),
    );
    const hasDevVersion = props.allProjectVersions.some((ver) => ver.releaseChannel === VersionReleaseChannel.DEV);
    const activeFiltersCount =
        activeFilters.loaders.length + activeFilters.gameVersions.length + activeFilters.releaseChannels.length;

    function resetActiveFilters() {
        setSearchParams(removeFiltersFromSearchParams(searchParams));
    }

    return {
        filteredResults,
        availableFilterOptions,
        hasDevVersion,

        activeFilters,
        setActiveFilters,
        activeFiltersCount,

        showDevVersions,
        setShowDevVersions,

        hasExperimentalVersion,
        showExperimentalGameVersions,
        setShowExperimentalGameVersions,

        resetActiveFilters,
    };
}

export function filterVersionItems(
    allProjectVersions: ProjectVersionData[],
    filters: FilterItems,
    showDevVersions = false,
) {
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

function getAvailableFilterOptions(
    allProjectVersions: ProjectVersionData[],
    showDevVersions: boolean,
    showExperimentalGameVersions: boolean,
) {
    // Filters list
    // Loaders
    const loaders: string[] = [];
    for (const version of allProjectVersions) {
        if (version.releaseChannel === VersionReleaseChannel.DEV && !showDevVersions) continue;

        for (const loader of version.loaders) {
            if (!loaders.includes(loader)) {
                loaders.push(loader);
            }
        }
    }

    // Game versions
    let gameVersions: GameVersion[] = [];
    for (const version of allProjectVersions) {
        if (version.releaseChannel === VersionReleaseChannel.DEV && !showDevVersions) continue;

        for (const gameVersion of getGameVersionsFromValues(version.gameVersions)) {
            if (!showExperimentalGameVersions && isExperimentalGameVersion(gameVersion.releaseType)) continue;

            if (gameVersions.some((ver) => ver.value === gameVersion.value)) continue;
            gameVersions.push(gameVersion);
        }
    }
    // Sort game versions
    gameVersions = getGameVersionsFromValues(
        sortVersionsWithReference(
            gameVersions.map((ver) => ver.value),
            gameVersionsList,
        ),
    );

    // Release channels
    const releaseChannels: string[] = [];
    for (const version of allProjectVersions) {
        const channel = version.releaseChannel;

        if (channel === VersionReleaseChannel.DEV && !showDevVersions) continue;
        if (!releaseChannels.includes(channel)) {
            releaseChannels.push(channel);
        }
    }

    const anyFilterVisible = loaders.length + gameVersions.length + releaseChannels.length > 0;

    return {
        loaders: loaders,
        gameVersions: gameVersions,
        releaseChannels: releaseChannels,
        anyFilterVisible: anyFilterVisible,
    };
}

function getActiveFilters(searchParams: URLSearchParams): FilterItems {
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
    removeFiltersFromSearchParams(searchParams);

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

function removeFiltersFromSearchParams(searchParams: URLSearchParams) {
    searchParams.delete(LOADER_KEY);
    searchParams.delete(GAME_VERSION_KEY);
    searchParams.delete(RELEASE_CHANNEL_KEY);

    return searchParams;
}

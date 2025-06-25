import { projectTypes } from "@app/utils/config/project";
import {
    defaultSearchLimit,
    pageOffsetParamNamespace,
    searchLimitParamNamespace,
    searchQueryParamNamespace,
    sortByParamNamespace,
} from "@app/utils/config/search";
import { getProjectTypeFromName } from "@app/utils/convertors";
import { isNumber } from "@app/utils/number";
import type { ProjectType, SearchResultSortMethod } from "@app/utils/types";
import type { SearchResult } from "@app/utils/types/api";
import { createContext, use, useEffect, useState } from "react";
import { useNavigation, useSearchParams } from "react-router";
import { useSpinnerCtx } from "~/components/global-spinner";
import { useProjectType } from "~/hooks/project";
import { getCurrLocation, getHintLocale } from "~/utils/urls";
import { getSearchResults } from "./loader";

interface SearchContext {
    searchTerm: string | undefined;
    setSearchTerm: (searchTerm: string) => void;

    params: URLSearchParams;
    projectType: ProjectType | "project";
    projectType_Coerced: ProjectType;
    sortBy: SearchResultSortMethod | undefined;

    projectsPerPage: number;
    pageOffset: number;
    pagesCount: number;

    isLoading: boolean;
    isFetching: boolean;
    result: SearchResult;
}

const SearchContext = createContext<SearchContext>(null as unknown as SearchContext);

interface SearchProviderProps {
    children: React.ReactNode;
    initialSearchResult: SearchResult | null;
}

let updateSearchParam_timeoutRef: number | undefined;

export function SearchProvider(props: SearchProviderProps) {
    const { setShowSpinner } = useSpinnerCtx();
    const navigation = useNavigation();
    const [searchParams, setSearchParams] = useSearchParams();
    const localePrefix = getHintLocale(searchParams);

    // Params
    const searchQueryParam = searchParams.get(searchQueryParamNamespace) || "";
    const [searchTerm_state, setSearchTerm_state] = useState(searchQueryParam);
    const pageSize = searchParams.get(searchLimitParamNamespace);
    const sortBy = searchParams.get(sortByParamNamespace);

    const projectType = useProjectType();
    const projectType_Coerced = getProjectTypeFromName(projectType);

    const navigated_ProjectType = useProjectType(navigation?.location?.pathname || "");
    const nextPathname_WithoutLocalePrefix = (navigation?.location?.pathname || "").replace(localePrefix, "").replaceAll("/", "");
    const isNavigatedPage_SearchPage = ["project", ...projectTypes]
        .map((t) => `${t}s`)
        .includes(nextPathname_WithoutLocalePrefix);

    const [query, setQuery] = useState({
        isLoading: false,
        isFetching: false,
        data: props.initialSearchResult,
    });

    async function fetchQuery() {
        setQuery({
            isLoading: !!query.data,
            isFetching: true,
            data: query.data || null,
        });

        const res = await getSearchResults(
            searchParams.toString(),
            projectType_Coerced === projectType ? projectType_Coerced : undefined,
        );
        setQuery({ isLoading: false, isFetching: false, data: res });
    }

    const searchResults = query.data;
    const projectsPerPage = Number.parseInt(pageSize || "0") || defaultSearchLimit;

    const pagesCount = Math.ceil((searchResults?.estimatedTotalHits || 0) / projectsPerPage);
    const pageOffsetParamValue = searchParams.get(pageOffsetParamNamespace);
    let activePage = pageOffsetParamValue ? Number.parseInt(pageOffsetParamValue || "1") : 1;
    if (!isNumber(activePage)) activePage = 1;

    function updateSearchTerm_Param(q: string) {
        const newSearchParams = updateSearchParam({
            key: searchQueryParamNamespace,
            value: q,
            deleteIfFalsyValue: true,
            newParamsInsertionMode: "replace",
        });
        setSearchParams(removePageOffsetSearchParam(newSearchParams), { preventScrollReset: true });
    }

    useEffect(() => {
        fetchQuery();
    }, [searchParams.toString(), projectType]);

    useEffect(() => {
        if (updateSearchParam_timeoutRef) window.clearTimeout(updateSearchParam_timeoutRef);
        if (searchQueryParam === searchTerm_state) return;
        if (navigation.location && !isNavigatedPage_SearchPage) return;

        updateSearchParam_timeoutRef = window.setTimeout(() => {
            if (navigation.location && !isNavigatedPage_SearchPage) return;
            updateSearchTerm_Param(searchTerm_state);
        }, 250);
    }, [searchTerm_state]);

    // Reset search term and query data when navigating away from curr page
    useEffect(() => {
        if (!navigation.location?.pathname) return;
        setSearchTerm_state("");

        // If the user navigates to a different project type search page, reset the query data
        if (query.data?.projectType !== navigated_ProjectType && isNavigatedPage_SearchPage === true) {
            setQuery({
                isLoading: false,
                isFetching: true,
                data: null,
            });
        }
    }, [navigation.location?.pathname]);

    // Handle showing and hiding loading spinner
    useEffect(() => {
        setShowSpinner(query.isFetching);
    }, [query.isFetching]);

    return (
        <SearchContext
            value={{
                searchTerm: searchTerm_state,
                setSearchTerm: setSearchTerm_state,
                params: searchParams,
                projectType: projectType,
                projectType_Coerced: projectType_Coerced,
                sortBy: sortBy as SearchResultSortMethod,
                projectsPerPage: projectsPerPage,
                pageOffset: activePage,
                pagesCount: pagesCount,
                isLoading: query.isLoading,
                isFetching: query.isFetching,
                result: searchResults || ({} as SearchResult),
            }}
        >
            {props.children}
        </SearchContext>
    );
}

export function useSearchContext() {
    return use(SearchContext);
}

interface UpdateSearchParamProps {
    key: string;
    value: string;
    newParamsInsertionMode?: "replace" | "append";
    deleteIfEqualsThis?: string;
    deleteIfExists?: boolean;
    deleteIfFalsyValue?: boolean;
    deleteParamsWithMatchingValueOnly?: boolean;
}

export function updateSearchParam({
    key,
    value,
    deleteIfEqualsThis,
    deleteIfFalsyValue,
    deleteIfExists,
    deleteParamsWithMatchingValueOnly = false,
    newParamsInsertionMode = "append",
}: UpdateSearchParamProps) {
    const url = getCurrLocation();

    if (
        // If deleteIfExists is true and the key already exists
        (deleteIfExists === true && url.searchParams.has(key, value)) ||
        // If deleteIfFalsyValue is true and value is falsy
        (deleteIfFalsyValue === true && !value) ||
        // deleteIfEqualsThis is provided and equals the curr value
        (deleteIfEqualsThis !== undefined && deleteIfEqualsThis === value)
    ) {
        if (deleteParamsWithMatchingValueOnly === true) url.searchParams.delete(key, value);
        else url.searchParams.delete(key);
    }
    //
    else {
        if (newParamsInsertionMode === "replace") url.searchParams.set(key, value);
        else url.searchParams.append(key, value);
    }

    return url.searchParams;
}

export function updateTernaryState_SearchParam(props: {
    key: string;
    value: string;
    searchParamModifier?: (searchParams: URLSearchParams) => URLSearchParams;
}) {
    const searchParams = getCurrLocation().searchParams;
    const allVals = searchParams.getAll(props.key);

    if (allVals.includes(props.value)) {
        searchParams.delete(props.key, props.value);
        searchParams.append(props.key, NOT(props.value));
    } else if (allVals.includes(NOT(props.value))) {
        searchParams.delete(props.key, NOT(props.value));
    } else {
        searchParams.append(props.key, props.value);
    }

    return props.searchParamModifier ? props.searchParamModifier(searchParams) : searchParams;
}

export function NOT(value: string) {
    if (value.startsWith("!")) return value.slice(1);
    return `!${value}`;
}

export function removePageOffsetSearchParam(sp: URLSearchParams) {
    sp.delete(pageOffsetParamNamespace);
    return sp;
}

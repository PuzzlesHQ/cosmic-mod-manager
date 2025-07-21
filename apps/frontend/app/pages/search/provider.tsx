import {
    defaultSearchLimit,
    pageOffsetParamNamespace,
    searchLimitParamNamespace,
    searchQueryParamNamespace,
    sortByParamNamespace,
} from "@app/utils/config/search";
import { getProjectTypeFromName } from "@app/utils/convertors";
import type { ProjectType, SearchResultSortMethod } from "@app/utils/types";
import type { SearchResult } from "@app/utils/types/api";
import { createContext, use, useEffect, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router";
import { useSpinnerCtx } from "~/components/global-spinner";
import { useProjectType } from "~/hooks/project";
import { getSearchResults } from "./loader";

interface SearchContext {
    searchTerm: string | undefined;
    setSearchTerm: (searchTerm: string) => void;

    params: URLSearchParams;
    projectType: ProjectType | "project";
    projectType_Coerced: ProjectType;
    sortBy: SearchResultSortMethod | undefined;
    numProjectsLimit_Param: number;

    isLoading: boolean;
    isFetching: boolean;
    result: SearchResult;
}

const SearchContext = createContext<SearchContext>(null as unknown as SearchContext);

interface SearchProviderProps {
    children: React.ReactNode;
    initialSearchResult: SearchResult | null;
}

export function SearchProvider(props: SearchProviderProps) {
    const timeoutRef = useRef<number | undefined>(undefined);
    const abortControllerRef = useRef<AbortController>(new AbortController());

    const location = useLocation();
    const { setShowSpinner } = useSpinnerCtx();
    const [searchParams, setSearchParams] = useSearchParams();

    // Params
    const searchQueryParam = searchParams.get(searchQueryParamNamespace) || "";
    const [searchTerm_state, setSearchTerm_state] = useState(searchQueryParam);
    const pageSize = searchParams.get(searchLimitParamNamespace);
    const sortBy = searchParams.get(sortByParamNamespace);

    const projectType = useProjectType();
    const projectType_Coerced = getProjectTypeFromName(projectType);

    const [query, setQuery] = useState({
        isLoading: false,
        isFetching: false,
        data: props.initialSearchResult,
    });

    async function fetchQuery() {
        if (!abortControllerRef.current.signal.aborted) abortControllerRef.current.abort("Aborted due to new request");
        abortControllerRef.current = new AbortController();

        setQuery({
            isLoading: !!query.data,
            isFetching: true,
            data: query.data || null,
        });

        const res = await getSearchResults(
            searchParams.toString(),
            projectType_Coerced === projectType ? projectType_Coerced : undefined,
            abortControllerRef.current,
        );
        setQuery({ isLoading: false, isFetching: false, data: res });
    }

    const searchResult = query.data;
    const numProjectsLimit_Param = Number.parseInt(pageSize || "0") || defaultSearchLimit;

    function updateSearchTerm_Param(q: string) {
        setSearchParams(
            (prev) => {
                updateSearchParam({
                    searchParams: prev,
                    key: searchQueryParamNamespace,
                    value: q,
                    deleteIfFalsyValue: true,
                    newParamsInsertionMode: "replace",
                });
                removePageOffsetSearchParam(prev);
                return prev;
            },
            { preventScrollReset: true },
        );
    }

    useEffect(() => {
        fetchQuery();
    }, [searchParams.toString(), projectType]);

    useEffect(() => {
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        if (searchQueryParam === searchTerm_state) return;

        timeoutRef.current = window.setTimeout(() => {
            updateSearchTerm_Param(searchTerm_state);
        }, 250);
    }, [searchTerm_state]);

    // Reset search term and query data when navigating away from curr page
    useEffect(() => {
        if (!location.pathname) return;
        setSearchTerm_state("");

        // If the user navigates to a different project type search page, reset the query data
        if (query.data?.projectType !== projectType) {
            setQuery({
                isLoading: false,
                isFetching: true,
                data: null,
            });
        }
    }, [location.pathname]);

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
                numProjectsLimit_Param: numProjectsLimit_Param,

                isLoading: query.isLoading,
                isFetching: query.isFetching,
                result: searchResult || ({} as SearchResult),
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
    searchParams: URLSearchParams;
    newParamsInsertionMode?: "replace" | "append";
    deleteIfEqualsThis?: string;
    deleteIfExists?: boolean;
    deleteIfFalsyValue?: boolean;
    deleteParamsWithMatchingValueOnly?: boolean;
}

export function updateSearchParam({
    key,
    value,
    searchParams,
    deleteIfEqualsThis,
    deleteIfFalsyValue,
    deleteIfExists,
    deleteParamsWithMatchingValueOnly = false,
    newParamsInsertionMode = "append",
}: UpdateSearchParamProps) {
    if (
        // If deleteIfExists is true and the key already exists
        (deleteIfExists === true && searchParams.has(key, value)) ||
        // If deleteIfFalsyValue is true and value is falsy
        (deleteIfFalsyValue === true && !value) ||
        // deleteIfEqualsThis is provided and equals the curr value
        (deleteIfEqualsThis !== undefined && deleteIfEqualsThis === value)
    ) {
        if (deleteParamsWithMatchingValueOnly === true) searchParams.delete(key, value);
        else searchParams.delete(key);
    }
    //
    else {
        if (newParamsInsertionMode === "replace") searchParams.set(key, value);
        else searchParams.append(key, value);
    }

    return searchParams;
}

export function updateTernaryState_SearchParam(props: {
    key: string;
    value: string;
    searchParams: URLSearchParams;
    searchParamModifier?: (searchParams: URLSearchParams) => URLSearchParams;
}) {
    const searchParams = props.searchParams;
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

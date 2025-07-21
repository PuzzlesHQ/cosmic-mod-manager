import type { ProjectType } from "@app/utils/types";
import type { SearchResult } from "@app/utils/types/api";
import clientFetch from "~/utils/client-fetch";
import { resJson } from "~/utils/server-fetch";

export async function getSearchResults(params: string, type: ProjectType | undefined, abortController?: AbortController) {
    let queryParams = `${params ? "?" : ""}${params}`;
    if (type) queryParams += `${params ? "&" : "?"}type=${type}`;

    const res = await clientFetch(`/api/search${queryParams}`, {
        signal: abortController?.signal,
    });
    const data = await resJson<SearchResult>(res);
    if (!data) return null;

    data.projectType = type || "project";
    return data;
}

export type SearchResultData = Awaited<ReturnType<typeof getSearchResults>>;

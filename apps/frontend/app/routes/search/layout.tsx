import type { SearchResult } from "@app/utils/types/api";
import { Outlet, useLoaderData } from "react-router";
import { SpinnerCtxProvider } from "~/components/global-spinner";
import type { SearchResultData } from "~/pages/search/loader";
import { SearchProvider } from "~/pages/search/provider";
import { resJson, serverFetch } from "~/utils/server-fetch";
import type { Route } from "./+types/page";

export default function () {
    const initialData = useLoaderData<typeof loader>();

    return (
        <SpinnerCtxProvider>
            <SearchProvider initialSearchResult={initialData}>
                <Outlet />
            </SearchProvider>
        </SpinnerCtxProvider>
    );
}

export async function loader(props: Route.LoaderArgs): Promise<SearchResultData> {
    const reqUrl = new URL(props.request.url);
    const pathFrags = reqUrl.pathname.split("?")[0].split("/").filter(Boolean);
    const type = (pathFrags.at(-1) || "")?.slice(0, -1);

    let queryParams = reqUrl.search.length > 0 ? reqUrl.search : "";
    if (type !== "project") queryParams += `${reqUrl.search.length > 0 ? "&" : "?"}type=${type}`;

    const res = await serverFetch(props.request, `/api/search${queryParams}`);
    const data = await resJson<SearchResult>(res);

    if (!data) return null;
    data.projectType = type;

    return data;
}

export function shouldRevalidate() {
    return false;
}

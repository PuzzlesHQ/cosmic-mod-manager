import { EnvironmentSupport, type ProjectType, SearchResultSortMethod } from "@app/utils/types";
import type { ProjectListItem } from "@app/utils/types/api";
import meilisearch from "~/services/meilisearch";
import { HTTP_STATUS, invalidReqestResponseData } from "~/utils/http";
import { mapSearchProjectToListItem } from "../_helpers";
import { MEILISEARCH_PROJECT_INDEX, type ProjectSearchDocument } from "../sync-utils";

interface Props {
    query: string;
    loaders: string[];
    gameVersions: string[];
    categories: string[];
    environments: string[];
    openSourceOnly: string | null;
    sortBy: SearchResultSortMethod;
    offset: number;
    limit: number;
    type: ProjectType | null;
}

export async function searchProjects(props: Props) {
    // Validate the filters
    if (props.query?.length > 64) return invalidReqestResponseData(`Query string too long: '${props.query}'`);

    const Items = [props.type, ...props.loaders, ...props.gameVersions, ...props.categories];
    for (let i = 0; i < Items.length; i++) {
        const item = Items[i];
        if (!item) continue;

        if (item?.length > 32) return invalidReqestResponseData(`Filter string too long: ${item}`);
        if (isValidFilterStr(item) === false) return invalidReqestResponseData(`Invalid filter string: ${item}`);
    }

    let sortBy = null;
    switch (props.sortBy) {
        case SearchResultSortMethod.RELEVANCE:
            sortBy = props.query ? null : "recentDownloads:desc";
            break;
        case SearchResultSortMethod.TRENDING:
            sortBy = "recentDownloads:desc";
            break;
        case SearchResultSortMethod.RECENTLY_PUBLISHED:
            sortBy = "datePublished:desc";
            break;
        case SearchResultSortMethod.DOWNLOADS:
            sortBy = "downloads:desc";
            break;
        case SearchResultSortMethod.FOLLOW_COUNT:
            sortBy = "followers:desc";
            break;
        case SearchResultSortMethod.RECENTLY_UPDATED:
            sortBy = "dateUpdated:desc";
            break;
    }

    let envFilter = "";
    // If both client and server are selected, only include projects that require both environments
    if (props.environments.includes("client") && props.environments.includes("server")) {
        envFilter = `clientSide = ${EnvironmentSupport.REQUIRED} AND serverSide = ${EnvironmentSupport.REQUIRED}`;
    }
    // If only client is selected, include projects that require only client and optionally server
    else if (props.environments.includes("client")) {
        envFilter = `clientSide = ${EnvironmentSupport.REQUIRED} AND serverSide != ${EnvironmentSupport.REQUIRED}`;
    }
    // If only server is selected, include projects that require only server and optionally client
    else if (props.environments.includes("server")) {
        envFilter = `serverSide = ${EnvironmentSupport.REQUIRED} AND clientSide != ${EnvironmentSupport.REQUIRED}`;
    }

    const filters = [
        formatFilterItems("loaders", props.loaders, " AND "),
        formatFilterItems("gameVersions", props.gameVersions, " OR "),
        formatFilterItems("categories", props.categories, " AND "),
        envFilter,
    ];

    if (props.type) filters.push(formatFilterItems("type", [props.type], " OR "));
    if (props.openSourceOnly) filters.push(formatFilterItems("openSource", [props.openSourceOnly], " AND "));

    const index = meilisearch.index(MEILISEARCH_PROJECT_INDEX);
    const result = await index.search(props.query, {
        sort: sortBy ? [sortBy] : [],
        limit: props.limit,
        offset: props.offset,
        filter: filters,
    });

    const projects: ProjectListItem[] = [];
    const hits = result.hits as ProjectSearchDocument[];

    for (const project of hits) {
        projects.push(mapSearchProjectToListItem(project));
    }

    result.hits = projects;

    return { data: result, status: HTTP_STATUS.OK };
}

function formatFilterItems(name: string, values: string[], join: string) {
    return values
        .map((val) => {
            if (val.startsWith("!")) return `${name} != ${val.slice(1)}`;
            return `${name} = ${val}`;
        })
        .join(join);
}

function isValidFilterStr(str: string) {
    const regex = /^[a-zA-Z0-9-_.!]+$/;
    return regex.test(str);
}

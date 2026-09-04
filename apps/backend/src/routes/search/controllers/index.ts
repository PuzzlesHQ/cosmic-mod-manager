import { EnvironmentSupport, type ProjectType, SearchResultSortMethod } from "@app/utils/types";
import type { ProjectListItem } from "@app/utils/types/api";
import meilisearch from "~/services/meilisearch";
import { HTTP_STATUS, invalidRequestResponseData } from "~/utils/http";
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
    if (props.query?.length > 64) return invalidRequestResponseData(`Query string too long: '${props.query}'`);

    const Items = [props.type, ...props.loaders, ...props.gameVersions, ...props.categories];
    for (let i = 0; i < Items.length; i++) {
        const item = Items[i];
        if (!item) continue;

        if (item?.length > 32) return invalidRequestResponseData(`Filter string too long: ${item}`);
        if (isValidFilterStr(item) === false) return invalidRequestResponseData(`Invalid filter string: ${item}`);
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

    const envFilter: string[] = [];
    const envs = props.environments;

    if (envs.includes("client")) {
        envFilter.push(`clientSide != ${EnvironmentSupport.UNSUPPORTED}`);
    } else if (envs.includes("!client")) {
        envFilter.push(`clientSide = ${EnvironmentSupport.UNSUPPORTED}`);
    }

    if (envs.includes("server")) {
        envFilter.push(`serverSide != ${EnvironmentSupport.UNSUPPORTED}`);
    } else if (envs.includes("!server")) {
        envFilter.push(`serverSide = ${EnvironmentSupport.UNSUPPORTED}`);
    }

    const filters = [
        formatFilterItems("loaders", props.loaders, " AND "),
        formatFilterItems("gameVersions", props.gameVersions, " OR "),
        formatFilterItems("categories", props.categories, " AND "),
        envFilter.join(" AND "),
    ];

    if (props.type) filters.push(formatFilterItems("type", [props.type], " OR "));
    if (props.openSourceOnly) filters.push(formatFilterItems("openSource", [props.openSourceOnly], " AND "));

    const index = meilisearch.index<ProjectSearchDocument>(MEILISEARCH_PROJECT_INDEX);
    const result = await index.search(props.query, {
        sort: sortBy ? [sortBy] : [],
        limit: props.limit,
        offset: props.offset,
        filter: filters,
    });

    const projects: ProjectListItem[] = [];

    for (const project of result.hits) {
        projects.push(mapSearchProjectToListItem(project));
    }

    return {
        data: {
            hits: projects,
            query: result.query,
            limit: result.limit,
            offset: result.offset,
            estimatedTotalHits: result.estimatedTotalHits,
            processingTimeMs: result.processingTimeMs,
        },
        status: HTTP_STATUS.OK,
    } as const;
}

function formatFilterItems(name: string, values: string[], join: string) {
    const result = values.map((val) => {
        if (val.startsWith("!")) return `${name} != ${val.slice(1)}`;
        return `${name} = ${val}`;
    });

    return result.join(join);
}

function isValidFilterStr(str: string) {
    const regex = /^[a-zA-Z0-9-_.!]+$/;
    return regex.test(str);
}

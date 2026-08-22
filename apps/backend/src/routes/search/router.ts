import {
    categoryFilterParamNamespace,
    defaultSearchLimit,
    defaultSortBy,
    gameVersionFilterParamNamespace,
    licenseFilterParamNamespace,
    loaderFilterParamNamespace,
    MAX_SEARCH_LIMIT,
    pageOffsetParamNamespace,
    searchLimitParamNamespace,
    sortByParamNamespace,
} from "@app/utils/config/search";
import { getProjectTypeFromName } from "@app/utils/convertors";
import { isNumber } from "@app/utils/number";
import { getAllLoaderCategories, getValidProjectCategories } from "@app/utils/project";
import GAME_VERSIONS from "@app/utils/src/constants/game-versions";
import { SearchResultSortMethod, TagType } from "@app/utils/types";
import { type Context, Hono } from "hono";
import { applyCacheHeaders } from "~/middleware/cache";
import { searchReqRateLimiter } from "~/middleware/rate-limiter";
import { HTTP_STATUS, invalidRequestResponse } from "~/utils/http";
import { respondJson } from "~/utils/jsonRes";
import { searchProjects } from "./controllers";

const searchRouter = new Hono()
    .use(searchReqRateLimiter)

    // shorter TTL for search results
    .get("/", applyCacheHeaders({ browserTTL_s: 3600, cdnTTL_s: 7200 }), search_get)

    // longer TTL for things that aren't likely to change often
    .use(applyCacheHeaders({ browserTTL_s: 24 * 3600, cdnTTL_s: 24 * 3600 }))
    .get("/filters/sort-by", sortByFilters_get)
    .get("/filters/loaders", loaders_get)
    .get("/filters/game-versions", gameVersions_get)
    .get("/filters/categories", categories_get)
    .get("/filters/features", features_get)
    .get("/filters/resolutions", resolutions_get)
    .get("/filters/performance-impact", performanceImpacts_get)
    .get("/filters/license", licenses_get);

async function search_get(ctx: Context) {
    const query = ctx.req.query("q") || "";
    const categories = ctx.req.queries(categoryFilterParamNamespace) || [];
    const loaders = ctx.req.queries(loaderFilterParamNamespace) || [];
    const gameVersions = ctx.req.queries(gameVersionFilterParamNamespace) || [];
    const pageStr = ctx.req.query(pageOffsetParamNamespace) || "";
    const offsetStr = ctx.req.query("offset") || "";
    const limitStr = ctx.req.query(searchLimitParamNamespace) || `${defaultSearchLimit}`;
    const environments = ctx.req.queries("e") || [];
    const sortBy = ctx.req.query(sortByParamNamespace) || defaultSortBy;
    const typeStr = ctx.req.query("type");
    const type = typeStr ? getProjectTypeFromName(typeStr) : null;

    const openSourceOnly =
        ctx.req.query(licenseFilterParamNamespace) === "oss"
            ? "true"
            : ctx.req.query(licenseFilterParamNamespace) === "!oss"
              ? "!true"
              : null;

    let limit = Number.parseInt(limitStr, 10);
    if (!isNumber(limit)) limit = defaultSearchLimit;
    else if (limit > MAX_SEARCH_LIMIT) limit = MAX_SEARCH_LIMIT;
    else if (limit <= 0) limit = 1;

    const page = Number.parseInt(pageStr, 10);

    let offset = Number.parseInt(offsetStr, 10);
    if (!isNumber(offset)) {
        if (isNumber(page)) offset = (page - 1) * limit;
        else offset = 0;
    }

    const res = await searchProjects({
        query,
        loaders,
        gameVersions,
        categories,
        environments,
        openSourceOnly,
        sortBy: sortBy as SearchResultSortMethod,
        offset: offset,
        limit: limit,
        type: type,
    });
    return respondJson(ctx, res);
}

async function sortByFilters_get(ctx: Context) {
    const list = [
        SearchResultSortMethod.RELEVANCE,
        SearchResultSortMethod.DOWNLOADS,
        SearchResultSortMethod.FOLLOW_COUNT,
        SearchResultSortMethod.RECENTLY_UPDATED,
        SearchResultSortMethod.RECENTLY_PUBLISHED,
    ];
    return respondJson(ctx, {
        data: {
            success: true,
            queryKey: sortByParamNamespace,
            default: defaultSortBy,
            list: list,
        },
        status: HTTP_STATUS.OK,
    });
}

async function loaders_get(ctx: Context) {
    const projectType = getProjectTypeFromName(ctx.req.query("type") || "");
    if (!projectType) {
        return invalidRequestResponse(ctx, "Invalid project type");
    }

    const loaderFilters = getAllLoaderCategories(projectType);
    return respondJson(ctx, {
        data: { success: true, queryKey: loaderFilterParamNamespace, list: loaderFilters },
        status: HTTP_STATUS.OK,
    });
}

async function gameVersions_get(ctx: Context) {
    return respondJson(ctx, {
        data: { success: true, queryKey: gameVersionFilterParamNamespace, list: GAME_VERSIONS },
        status: HTTP_STATUS.OK,
    });
}

async function categories_get(ctx: Context) {
    const projectType = getProjectTypeFromName(ctx.req.query("type") || "");
    if (!projectType) {
        return invalidRequestResponse(ctx, "Invalid project type");
    }

    const categories = getValidProjectCategories([projectType], TagType.CATEGORY).map((category) => category.name);
    return respondJson(ctx, {
        data: { success: true, queryKey: categoryFilterParamNamespace, list: categories },
        status: HTTP_STATUS.OK,
    });
}

async function features_get(ctx: Context) {
    const projectType = getProjectTypeFromName(ctx.req.query("type") || "");
    if (!projectType) {
        return invalidRequestResponse(ctx, "Invalid project type");
    }

    const categories = getValidProjectCategories([projectType], TagType.FEATURE).map((category) => category.name);
    return respondJson(ctx, {
        data: { success: true, queryKey: categoryFilterParamNamespace, list: categories },
        status: HTTP_STATUS.OK,
    });
}

async function resolutions_get(ctx: Context) {
    const projectType = getProjectTypeFromName(ctx.req.query("type") || "");
    if (!projectType) {
        return invalidRequestResponse(ctx, "Invalid project type");
    }

    const categories = getValidProjectCategories([projectType], TagType.RESOLUTION).map((category) => category.name);
    return respondJson(ctx, {
        data: { success: true, queryKey: categoryFilterParamNamespace, list: categories },
        status: HTTP_STATUS.OK,
    });
}

async function performanceImpacts_get(ctx: Context) {
    const projectType = getProjectTypeFromName(ctx.req.query("type") || "");
    if (!projectType) {
        return invalidRequestResponse(ctx, "Invalid project type");
    }

    const categories = getValidProjectCategories([projectType], TagType.PERFORMANCE_IMPACT).map(
        (category) => category.name,
    );
    return respondJson(ctx, {
        data: { success: true, queryKey: categoryFilterParamNamespace, list: categories },
        status: HTTP_STATUS.OK,
    });
}

async function licenses_get(ctx: Context) {
    return respondJson(ctx, {
        data: { success: true, queryKey: licenseFilterParamNamespace, list: ["oss"] },
        status: HTTP_STATUS.OK,
    });
}

export default searchRouter;

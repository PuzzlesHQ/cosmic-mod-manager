import { projectTypes } from "@app/utils/config/project";
import { API_SCOPE } from "@app/utils/pats";
import { getAllLoaderCategories, getValidProjectCategories } from "@app/utils/project";
import GAME_VERSIONS from "@app/utils/src/constants/game-versions";
import SPDX_LICENSE_LIST, { FEATURED_LICENSE_OPTIONS } from "@app/utils/src/constants/license-list";
import type { ProjectType } from "@app/utils/types";
import { type Context, Hono } from "hono";
import { applyCacheHeaders } from "~/middleware/cache";
import { searchReqRateLimiter } from "~/middleware/rate-limiter";
import { HTTP_STATUS, notFoundResponse } from "~/utils/http";
import { respondJson } from "~/utils/jsonRes";

const tagsRouter = new Hono()
    .use(searchReqRateLimiter)
    .use(applyCacheHeaders({ browserTTL_s: 24 * 3600, cdnTTL_s: 24 * 3600 }))

    .get("/categories", categories_get)
    .get("/game-versions", gameVersions_get)
    .get("/loaders", loaders_get)
    .get("/licenses", licenses_get)
    .get("/licenses/featured", featuredLicenses_get)
    .get("/licenses/:id", licenses_get)
    .get("/project-types", projectTypes_get)
    .get("/api-scopes", apiScopes_get);

async function categories_get(ctx: Context) {
    const projectType = (ctx.req.query("type")?.toLowerCase() as ProjectType) || undefined;
    const namesOnly = ctx.req.query("namesOnly") === "true";

    const categories = getValidProjectCategories(projectType ? [projectType] : []);
    if (namesOnly) {
        const names = categories.map((category) => category.name);
        return respondJson(ctx, { data: names, status: HTTP_STATUS.OK });
    }

    return respondJson(ctx, { data: categories, status: HTTP_STATUS.OK });
}

async function gameVersions_get(ctx: Context) {
    return respondJson(ctx, { data: GAME_VERSIONS, status: HTTP_STATUS.OK });
}

async function loaders_get(ctx: Context) {
    const projectType = (ctx.req.query("type")?.toLowerCase() as ProjectType) || undefined;
    const loaders = getAllLoaderCategories(projectType);
    return respondJson(ctx, { data: loaders, status: HTTP_STATUS.OK });
}

async function featuredLicenses_get(ctx: Context) {
    return respondJson(ctx, { data: FEATURED_LICENSE_OPTIONS.slice(1), status: HTTP_STATUS.OK });
}

async function licenses_get(ctx: Context) {
    const licenseId = ctx.req.param("id")?.toLowerCase();
    if (licenseId) {
        const license = SPDX_LICENSE_LIST.find((l) => l.licenseId.toLowerCase() === licenseId);
        if (!license) notFoundResponse(ctx, "License not found");

        return respondJson(ctx, { data: license, status: HTTP_STATUS.OK });
    }

    return respondJson(ctx, { data: SPDX_LICENSE_LIST, status: HTTP_STATUS.OK });
}

async function projectTypes_get(ctx: Context) {
    return respondJson(ctx, { data: projectTypes, status: HTTP_STATUS.OK });
}

async function apiScopes_get(ctx: Context) {
    return respondJson(ctx, { data: Object.values(API_SCOPE), status: HTTP_STATUS.OK });
}

export default tagsRouter;

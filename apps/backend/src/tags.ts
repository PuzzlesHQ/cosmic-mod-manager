import { projectTypes } from "@app/utils/config/project";
import { getAllLoaderCategories, getValidProjectCategories } from "@app/utils/project";
import GAME_VERSIONS from "@app/utils/src/constants/game-versions";
import SPDX_LICENSE_LIST, { FEATURED_LICENSE_OPTIONS } from "@app/utils/src/constants/license-list";
import type { ProjectType, TagType } from "@app/utils/types";
import { type Context, Hono } from "hono";
import { applyCacheHeaders } from "~/middleware/cache";
import { searchReqRateLimiter } from "~/middleware/rate-limit/get-req";
import { HTTP_STATUS, serverErrorResponse } from "~/utils/http";

const tagsRouter = new Hono()
    .use(searchReqRateLimiter)
    .use(
        applyCacheHeaders({
            maxAge_s: 7200,
            sMaxAge_s: 7200,
        }),
    )

    .get("/categories", categories_get)
    .get("/game-versions", gameVersions_get)
    .get("/loaders", loaders_get)
    .get("/licenses", licenses_get)
    .get("/licenses/featured", featuredLicenses_get)
    .get("/licenses/:id", licenses_get)
    .get("/project-types", projectTypes_get);

function getCategories({ projectType, headerType, namesOnly }: { projectType?: ProjectType; headerType?: TagType; namesOnly?: boolean }) {
    const list = getValidProjectCategories(projectType ? [projectType] : [], headerType);

    if (namesOnly) {
        return list.map((category) => category.name);
    }
    return list;
}

async function categories_get(ctx: Context) {
    try {
        const projectType = (ctx.req.query("type")?.toLowerCase() as ProjectType) || undefined;
        const namesOnly = ctx.req.query("namesOnly") === "true";

        const categories = await getCategories({ namesOnly, projectType: projectType });
        return ctx.json(categories, HTTP_STATUS.OK);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function gameVersions_get(ctx: Context) {
    try {
        return ctx.json(GAME_VERSIONS, HTTP_STATUS.OK);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function loaders_get(ctx: Context) {
    try {
        const projectType = (ctx.req.query("type")?.toLowerCase() as ProjectType) || undefined;
        const loaders = getAllLoaderCategories(projectType);
        return ctx.json(loaders, HTTP_STATUS.OK);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function featuredLicenses_get(ctx: Context) {
    try {
        return ctx.json(FEATURED_LICENSE_OPTIONS.slice(1), HTTP_STATUS.OK);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function licenses_get(ctx: Context) {
    try {
        const licenseId = ctx.req.param("id")?.toLowerCase();
        if (licenseId) {
            const license = SPDX_LICENSE_LIST.find((l) => l.licenseId.toLowerCase() === licenseId);
            if (!license) {
                return ctx.json({ success: false, message: "License not found" }, HTTP_STATUS.NOT_FOUND);
            }
            return ctx.json(license, HTTP_STATUS.OK);
        }

        return ctx.json(SPDX_LICENSE_LIST, HTTP_STATUS.OK);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function projectTypes_get(ctx: Context) {
    try {
        return ctx.json(projectTypes, HTTP_STATUS.OK);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

export default tagsRouter;

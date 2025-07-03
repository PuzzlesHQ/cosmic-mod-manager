import { type Context, Hono } from "hono";
import { cors } from "hono/cors";
import { isbot } from "isbot";
import { AuthenticationMiddleware } from "~/middleware/auth";
import { cdnAssetRateLimiter, cdnLargeFileRateLimiter } from "~/middleware/rate-limit/cdn";
import { invalidAuthAttemptLimiter } from "~/middleware/rate-limit/invalid-auth-attempt";
import { getSitemap } from "~/services/sitemap-gen";
import env from "~/utils/env";
import { invalidReqestResponse, notFoundResponse, serverErrorResponse } from "~/utils/http";
import { getUserFromCtx } from "~/utils/router";
import {
    serveCollectionIcon,
    serveOrgIconFile,
    serveProjectGalleryImage,
    serveProjectIconFile,
    serveUserAvatar,
    serveVersionFile,
} from "./controller";

const cdnRouter = new Hono()
    .use(
        cors({
            origin: "*",
            credentials: true,
        }),
    )

    // TODO: Remove these three later and just ust the /project prefix
    .get("/data/:projectId/:file", cdnAssetRateLimiter, projectFile_get)
    .get("/data/:projectId/gallery/:image", cdnAssetRateLimiter, galleryImage_get)
    .get(
        "/data/:projectId/version/:versionId/:fileName",
        invalidAuthAttemptLimiter,
        cdnLargeFileRateLimiter,
        AuthenticationMiddleware,
        versionFile_get,
    )

    .get("/data/project/:projectId/:file", cdnAssetRateLimiter, projectFile_get)
    .get("/data/project/:projectId/gallery/:image", cdnAssetRateLimiter, galleryImage_get)
    .get(
        "/data/project/:projectId/version/:versionId/:fileName",
        invalidAuthAttemptLimiter,
        cdnLargeFileRateLimiter,
        AuthenticationMiddleware,
        versionFile_get,
    )

    .get("/data/organization/:orgId/:file", cdnAssetRateLimiter, orgFile_get)
    .get("/data/user/:userId/:file", cdnAssetRateLimiter, userFile_get)
    .get("/data/collection/:collectionId/:icon", cdnAssetRateLimiter, collectionIcon_get)

    // Sitemaps
    .get("/sitemap/:name", cdnAssetRateLimiter, sitemap_get);

async function projectFile_get(ctx: Context) {
    try {
        const { projectId } = ctx.req.param();
        if (!projectId) {
            return invalidReqestResponse(ctx);
        }

        return await serveProjectIconFile(ctx, projectId, IsCdnRequest(ctx));
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function galleryImage_get(ctx: Context) {
    try {
        const { projectId, image } = ctx.req.param();
        if (!projectId || !image) {
            return invalidReqestResponse(ctx);
        }

        return await serveProjectGalleryImage(ctx, projectId, image, IsCdnRequest(ctx));
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

const ALLOWED_EXTERNAL_USER_AGENTS = ["CRLauncher/"];
async function versionFile_get(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        const { projectId, versionId, fileName } = ctx.req.param();
        if (!projectId || !versionId || !fileName) return invalidReqestResponse(ctx);

        const userAgent = ctx.req.header("User-Agent");
        if (!userAgent) return invalidReqestResponse(ctx, "User-Agent header is missing");
        const isABot = isbot(userAgent);
        let isExplicitlyAllowed = false;

        for (let i = 0; i < ALLOWED_EXTERNAL_USER_AGENTS.length; i++) {
            if (userAgent.startsWith(ALLOWED_EXTERNAL_USER_AGENTS[i])) {
                isExplicitlyAllowed = true;
                break;
            }
        }

        if (isABot && !isExplicitlyAllowed) {
            return invalidReqestResponse(ctx, `Error: Possibly bot activity;\nUser-Agent: '${userAgent};`);
        }

        return await serveVersionFile(ctx, projectId, versionId, fileName, userSession, IsCdnRequest(ctx));
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function orgFile_get(ctx: Context) {
    try {
        const orgId = ctx.req.param("orgId");
        if (!orgId) {
            return invalidReqestResponse(ctx);
        }

        return await serveOrgIconFile(ctx, orgId, IsCdnRequest(ctx));
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function userFile_get(ctx: Context) {
    try {
        const userId = ctx.req.param("userId");
        if (!userId) {
            return invalidReqestResponse(ctx);
        }

        return await serveUserAvatar(ctx, userId, IsCdnRequest(ctx));
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function collectionIcon_get(ctx: Context) {
    try {
        const collectionId = ctx.req.param("collectionId");
        if (!collectionId) return invalidReqestResponse(ctx);

        return await serveCollectionIcon(ctx, collectionId, IsCdnRequest(ctx));
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function sitemap_get(ctx: Context) {
    try {
        const { name } = ctx.req.param();
        if (!name) {
            return invalidReqestResponse(ctx);
        }

        const sitemap = await getSitemap(name);
        if (!sitemap) return invalidReqestResponse(ctx);
        if (!(await sitemap.exists())) return notFoundResponse(ctx, "Sitemap not found");

        return new Response(sitemap, {
            headers: {
                "Content-Type": "application/xml",
            },
        });
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

function IsCdnRequest(ctx: Context) {
    if (env.NODE_ENV === "development") return true;
    return ctx.req.header("CDN-Secret") === env.CDN_SECRET;
}

export default cdnRouter;

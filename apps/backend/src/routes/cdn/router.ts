import { API_SCOPE } from "@app/utils/pats";
import { type Context, Hono } from "hono";
import { cors } from "hono/cors";
import { isbot } from "isbot";
import { AuthenticationMiddleware } from "~/middleware/auth";
import { cdnAssetRateLimiter, cdnLargeFileRateLimiter } from "~/middleware/rate-limit/cdn";
import { invalidAuthAttemptLimiter } from "~/middleware/rate-limit/invalid-auth-attempt";
import { getSitemap } from "~/services/sitemap-gen";
import { getCollectionFile, getOrgFile, getProjectFile, getProjectGalleryFile, getUserFile } from "~/services/storage";
import env from "~/utils/env";
import { invalidRequestResponse, notFoundResponse, serverErrorResponse } from "~/utils/http";
import { getUserFromCtx } from "~/utils/router";
import { collectionIconUrl, orgIconUrl, projectGalleryFileUrl, projectIconUrl, userFileUrl } from "~/utils/urls";
import { serveImageFile, serveVersionFile } from "./controller";

const cdnRouter = new Hono()
    .use(
        cors({
            origin: "*",
            credentials: true,
        }),
    )

    .get("/data/project/:projectId/:file", cdnAssetRateLimiter, projectFile_get)
    .get("/data/project/:projectId/gallery/:file", cdnAssetRateLimiter, galleryImage_get)
    .get(
        "/data/project/:projectId/version/:versionId/:fileName",
        invalidAuthAttemptLimiter,
        cdnLargeFileRateLimiter,
        AuthenticationMiddleware,
        versionFile_get,
    )

    .get("/data/organization/:orgId/:file", cdnAssetRateLimiter, orgFile_get)
    .get("/data/user/:userId/:file", cdnAssetRateLimiter, userFile_get)
    .get("/data/collection/:collectionId/:file", cdnAssetRateLimiter, collectionIcon_get)

    // Sitemaps
    .get("/sitemap/:name", cdnAssetRateLimiter, sitemap_get);

async function projectFile_get(ctx: Context) {
    try {
        const projectId = ctx.req.param("projectId");
        const fileId = ctx.req.param("file");
        if (!projectId) return invalidRequestResponse(ctx);

        return await serveImageFile({
            ctx: ctx,
            isCdnRequest: IsCdnRequest(ctx),
            fileId: fileId,
            entityId: projectId,
            cdnUrlOfFile: `${projectIconUrl(projectId, fileId)}`,
            getFile: getProjectFile,
        });
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function galleryImage_get(ctx: Context) {
    try {
        const projectId = ctx.req.param("projectId");
        const fileId = ctx.req.param("file");
        if (!projectId || !fileId) {
            return invalidRequestResponse(ctx);
        }

        return await serveImageFile({
            ctx: ctx,
            isCdnRequest: IsCdnRequest(ctx),
            fileId: fileId,
            entityId: projectId,
            cdnUrlOfFile: `${projectGalleryFileUrl(projectId, fileId)}`,
            getFile: getProjectGalleryFile,
        });
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

const ALLOWED_EXTERNAL_USER_AGENTS = ["CRLauncher/"];
async function versionFile_get(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx, API_SCOPE.PROJECT_READ, API_SCOPE.VERSION_READ);
        const { projectId, versionId, fileName } = ctx.req.param();
        if (!projectId || !versionId || !fileName) return invalidRequestResponse(ctx);

        const userAgent = ctx.req.header("User-Agent");
        if (!userAgent) return invalidRequestResponse(ctx, "User-Agent header is missing");
        const isABot = isbot(userAgent);
        let isExplicitlyAllowed = false;

        for (let i = 0; i < ALLOWED_EXTERNAL_USER_AGENTS.length; i++) {
            if (userAgent.startsWith(ALLOWED_EXTERNAL_USER_AGENTS[i])) {
                isExplicitlyAllowed = true;
                break;
            }
        }

        if (isABot && !isExplicitlyAllowed) {
            return invalidRequestResponse(ctx, `Error: Possibly bot activity;\nUser-Agent: '${userAgent};`);
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
        const fileId = ctx.req.param("file");
        if (!orgId || !fileId) return invalidRequestResponse(ctx);

        return await serveImageFile({
            ctx: ctx,
            isCdnRequest: IsCdnRequest(ctx),
            fileId: fileId,
            entityId: orgId,
            cdnUrlOfFile: `${orgIconUrl(orgId, fileId)}`,
            getFile: getOrgFile,
        });
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function userFile_get(ctx: Context) {
    try {
        const userId = ctx.req.param("userId");
        const fileId = ctx.req.param("file");
        if (!userId || !fileId) return invalidRequestResponse(ctx);

        return await serveImageFile({
            ctx: ctx,
            isCdnRequest: IsCdnRequest(ctx),
            fileId: fileId,
            entityId: userId,
            cdnUrlOfFile: `${userFileUrl(userId, fileId)}`,
            getFile: getUserFile,
        });
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function collectionIcon_get(ctx: Context) {
    try {
        const collectionId = ctx.req.param("collectionId");
        const iconId = ctx.req.param("file");
        if (!collectionId || !iconId) return invalidRequestResponse(ctx);

        return await serveImageFile({
            ctx: ctx,
            isCdnRequest: IsCdnRequest(ctx),
            fileId: iconId,
            entityId: collectionId,
            cdnUrlOfFile: `${collectionIconUrl(collectionId, iconId)}`,
            getFile: getCollectionFile,
        });
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function sitemap_get(ctx: Context) {
    try {
        const name = ctx.req.param("name");
        if (!name) return invalidRequestResponse(ctx);

        const sitemap = await getSitemap(name);
        if (!sitemap) return invalidRequestResponse(ctx);
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

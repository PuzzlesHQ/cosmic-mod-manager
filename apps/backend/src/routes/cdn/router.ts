import { API_SCOPE } from "@app/utils/pats";
import { type Context, Hono } from "hono";
import { cors } from "hono/cors";
import { isbot } from "isbot";
import { AuthenticationMiddleware } from "~/middleware/auth";
import { applyCacheHeaders, IMMUTABLE_TTL } from "~/middleware/cache";
import { cdnImgRateLimiter, cdnVersionFileRateLimiter, invalidAuthAttemptLimiter } from "~/middleware/rate-limiter";
import { getSitemap } from "~/services/sitemap-gen";
import { getCollectionFile, getOrgFile, getProjectFile, getProjectGalleryFile, getUserFile } from "~/services/storage";
import env from "~/utils/env";
import { invalidRequestResponse, notFoundResponse, unauthorizedReqResponse } from "~/utils/http";
import { getSessionUser } from "~/utils/router";
import { collectionIconUrl, orgIconUrl, projectGalleryFileUrl, projectIconUrl, userFileUrl } from "~/utils/urls";
import { serveImageFile, serveVersionFile } from "./controller";

const cdnRouter = new Hono()
	.use(
		cors({ origin: "*", credentials: true }),
		// files can't be changed once uploaded so there can't be stale content
		applyCacheHeaders({ browserTTL_s: IMMUTABLE_TTL, cdnTTL_s: IMMUTABLE_TTL }),
	)

	.get("/data/project/:projectId/:file", cdnImgRateLimiter, projectFile_get)
	.get("/data/project/:projectId/gallery/:file", cdnImgRateLimiter, galleryImage_get)
	.get(
		"/data/project/:projectId/version/:versionId/:fileName",
		invalidAuthAttemptLimiter,
		cdnVersionFileRateLimiter,
		AuthenticationMiddleware,
		versionFile_get,
	)

	.get("/data/organization/:orgId/:file", cdnImgRateLimiter, orgFile_get)
	.get("/data/user/:userId/:file", cdnImgRateLimiter, userFile_get)
	.get("/data/collection/:collectionId/:file", cdnImgRateLimiter, collectionIcon_get)

	.get("/sitemap/:name", cdnImgRateLimiter, sitemap_get);

async function projectFile_get(ctx: Context) {
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
}

async function galleryImage_get(ctx: Context) {
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
}

const ALLOWED_EXTERNAL_USER_AGENTS = ["CRLauncher/"];
async function versionFile_get(ctx: Context) {
	const sessionUser = getSessionUser(ctx, API_SCOPE.PROJECT_READ, API_SCOPE.VERSION_READ);
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
		return unauthorizedReqResponse(
			ctx,
			"You're not allowed to access this resource. If you think this is a mistake, please contact us.",
		);
	}

	return await serveVersionFile(ctx, projectId, versionId, fileName, sessionUser, IsCdnRequest(ctx));
}

async function orgFile_get(ctx: Context) {
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
}

async function userFile_get(ctx: Context) {
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
}

async function collectionIcon_get(ctx: Context) {
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
}

async function sitemap_get(ctx: Context) {
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
}

function IsCdnRequest(ctx: Context) {
	if (env.NODE_ENV === "development") return true;
	return ctx.req.header("CDN-Secret") === env.CDN_SECRET;
}

export default cdnRouter;

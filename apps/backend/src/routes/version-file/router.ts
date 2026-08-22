import { type Context, Hono } from "hono";
import { AuthenticationMiddleware } from "~/middleware/auth";
import { getReqRateLimiter, invalidAuthAttemptLimiter, strictGetReqRateLimiter } from "~/middleware/rate-limiter";
import { HashAlgorithms } from "~/types";
import { REQ_BODY_NAMESPACE } from "~/types/namespaces";
import { HTTP_STATUS, invalidRequestResponse, notFoundResponse } from "~/utils/http";
import { respondJson } from "~/utils/jsonRes";
import { GetReleaseChannelFilter } from "~/utils/project";
import { getSessionUser } from "~/utils/router";
import { versionFileUrl } from "~/utils/urls";
import {
    GetLatestProjectVersionFromHash,
    GetLatestProjectVersionsFromHashes,
    GetVersionFromFileHash,
    GetVersionsFromFileHashes,
} from "./controllers/file";

const versionFileRouter = new Hono()
    .use(invalidAuthAttemptLimiter)
    .use(AuthenticationMiddleware)

    .get("/:fileHash", getReqRateLimiter, (ctx) => versionFromHash_get(ctx))
    .get("/:fileHash/download", getReqRateLimiter, (ctx) => versionFromHash_get(ctx, true))
    .post("/:fileHash/update", strictGetReqRateLimiter, versionFromHashUpdate_get);

async function versionFromHash_get(ctx: Context, download = false) {
    const hash = ctx.req.param("fileHash");
    if (!hash) return invalidRequestResponse(ctx);

    let hashAlgorithm = HashAlgorithms.SHA512;
    if (ctx.req.query("algorithm") === HashAlgorithms.SHA1) {
        hashAlgorithm = HashAlgorithms.SHA1;
    }

    const sessionUser = getSessionUser(ctx);
    const res = await GetVersionFromFileHash(hash, hashAlgorithm, sessionUser);
    if (res.status !== HTTP_STATUS.OK) return respondJson(ctx, res);

    if (download) {
        const version = res.data;
        if (!version.primaryFile) return notFoundResponse(ctx, "Couldn't find the version's primary file!");

        return ctx.redirect(
            versionFileUrl(version.projectId, version.id, version.primaryFile.name) as string,
            HTTP_STATUS.TEMPORARY_REDIRECT,
        );
    }

    return respondJson(ctx, res);
}

async function versionFromHashUpdate_get(ctx: Context) {
    const hash = ctx.req.param("fileHash");
    if (!hash) return invalidRequestResponse(ctx);

    let body = ctx.get(REQ_BODY_NAMESPACE);
    if (!body) body = {};

    let hashAlgorithm = HashAlgorithms.SHA512;
    if (body?.algorithm === HashAlgorithms.SHA1) {
        hashAlgorithm = HashAlgorithms.SHA1;
    }

    let gameVersions = body?.gameVersions;
    if (!gameVersions || !Array.isArray(gameVersions)) {
        gameVersions = undefined;
    }

    let loader = body?.loader;
    if (!loader?.length || typeof loader !== "string") {
        loader = undefined;
    }

    let releaseChannel = body.releaseChannel;
    if (!releaseChannel?.length || typeof releaseChannel !== "string") {
        // unset it if it's wrong type
        releaseChannel = undefined;
    }

    const sessionUser = getSessionUser(ctx);
    const res = await GetLatestProjectVersionFromHash(
        hash,
        hashAlgorithm,
        {
            gameVersions: gameVersions,
            loader: loader,
            releaseChannel: releaseChannel,
        },
        sessionUser,
    );
    return respondJson(ctx, res);
}

const versionFiles_Router = new Hono()
    .use(invalidAuthAttemptLimiter)
    .use(AuthenticationMiddleware)

    .post("/", strictGetReqRateLimiter, versionFiles_post)
    .post("/update", strictGetReqRateLimiter, versionUpdatesFromHashes_post);

async function versionFiles_post(ctx: Context) {
    const body = ctx.get(REQ_BODY_NAMESPACE);
    if (!body) return invalidRequestResponse(ctx, "Input body not provided!");

    const hashes = body?.hashes || [];
    if (!hashes.length) return invalidRequestResponse(ctx, "Empty hash list provided");

    let hashAlgorithm = HashAlgorithms.SHA512;
    if (body?.algorithm === HashAlgorithms.SHA1) {
        hashAlgorithm = HashAlgorithms.SHA1;
    }

    const sessionUser = getSessionUser(ctx);
    const res = await GetVersionsFromFileHashes(hashes, hashAlgorithm, sessionUser);
    return respondJson(ctx, res);
}

async function versionUpdatesFromHashes_post(ctx: Context) {
    const body = ctx.get(REQ_BODY_NAMESPACE);
    if (!body) return invalidRequestResponse(ctx, "Input body not provided!");

    const hashes = body?.hashes || [];
    if (!hashes.length) return invalidRequestResponse(ctx, "Empty hash list provided");

    let hashAlgorithm = HashAlgorithms.SHA512;
    if (body?.algorithm === HashAlgorithms.SHA1) {
        hashAlgorithm = HashAlgorithms.SHA1;
    }

    let gameVersions = body?.gameVersions;
    if (!gameVersions || !Array.isArray(gameVersions)) {
        gameVersions = [];
    }
    for (const version of gameVersions) {
        if (typeof version !== "string") return invalidRequestResponse(ctx, "Invalid game version");
    }

    let loader = body?.loader;
    if (!loader?.length || typeof loader !== "string") {
        loader = undefined;
    }

    let releaseChannel = body.releaseChannel;
    if (!releaseChannel?.length || typeof releaseChannel !== "string") {
        releaseChannel = GetReleaseChannelFilter();
    }

    const sessionUser = getSessionUser(ctx);
    const res = await GetLatestProjectVersionsFromHashes(
        hashes,
        hashAlgorithm,
        {
            gameVersions: gameVersions,
            loader: loader,
            releaseChannel: releaseChannel,
        },
        sessionUser,
    );
    return respondJson(ctx, res);
}

export { versionFileRouter, versionFiles_Router };

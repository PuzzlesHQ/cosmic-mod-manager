import { API_SCOPE } from "@app/utils/pats";
import { decodeStringArray } from "@app/utils/string";
import { type Context, Hono } from "hono";
import { AuthenticationMiddleware } from "~/middleware/auth";
import { invalidAuthAttemptLimiter, strictGetReqRateLimiter } from "~/middleware/rate-limiter";
import { invalidRequestResponse } from "~/utils/http";
import { respondJson } from "~/utils/jsonRes";
import { getSessionUser } from "~/utils/router";
import { getBulkProjectVersions } from "./controllers/many-versions";
import type { ProjectVersionFilters } from "./controllers/utils";

const bulkVersionsRouter = new Hono()
    .use(invalidAuthAttemptLimiter)
    .use(AuthenticationMiddleware)

    .get("/", strictGetReqRateLimiter, versions_get);

async function versions_get(ctx: Context) {
    const projectIds = ctx.req.query("ids");
    const userSession = getSessionUser(ctx, API_SCOPE.PROJECT_READ, API_SCOPE.VERSION_READ);
    if (!projectIds) return invalidRequestResponse(ctx);

    const idsArray = decodeStringArray(projectIds);
    if (idsArray.length > 100) {
        return invalidRequestResponse(ctx, "Maximum of 100 projects can be fetched at once");
    }

    let limit = Number.parseInt(ctx.req.query("limit") ?? "15", 10);
    if (!limit || Number.isNaN(limit)) {
        limit = 15;
    }

    const filters: ProjectVersionFilters = {
        loader: ctx.req.query("loader"),
        releaseChannel: ctx.req.query("releaseChannel"),
        gameVersion: ctx.req.query("gameVersion"),
    };

    const res = await getBulkProjectVersions(userSession, idsArray, {
        ...filters,
        limit: limit,
    });

    return respondJson(ctx, res);
}

export default bulkVersionsRouter;

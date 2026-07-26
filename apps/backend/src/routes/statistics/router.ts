import { isAdmin } from "@app/utils/constants/roles";
import { type Context, Hono } from "hono";
import { AuthenticationMiddleware, LoginProtectedRoute } from "~/middleware/auth";
import { applyCacheHeaders } from "~/middleware/cache";
import { invalidAuthAttemptLimiter } from "~/middleware/rate-limiter";
import { HTTP_STATUS, unauthorizedReqResponse } from "~/utils/http";
import { getSessionUser } from "~/utils/router";
import { getStatistics, getStorageUsage } from "./controllers";

const statsRouter = new Hono()
    .get("/", applyCacheHeaders({ browserTTL_s: 600, cdnTTL_s: 12 * 3600 }), statsGet)
    .get("/storage", invalidAuthAttemptLimiter, AuthenticationMiddleware, LoginProtectedRoute, storageStatGet);

async function statsGet(ctx: Context) {
    return ctx.json(await getStatistics(), HTTP_STATUS.OK);
}

async function storageStatGet(ctx: Context) {
    const sessionUser = getSessionUser(ctx);
    if (!isAdmin(sessionUser?.role)) return unauthorizedReqResponse(ctx);

    return ctx.json(await getStorageUsage(), HTTP_STATUS.OK);
}

export default statsRouter;

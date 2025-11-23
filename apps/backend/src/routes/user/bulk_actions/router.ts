import { decodeStringArray } from "@app/utils/string";
import { type Context, Hono } from "hono";
import { AuthenticationMiddleware } from "~/middleware/auth";
import { strictGetReqRateLimiter } from "~/middleware/rate-limit/get-req";
import { invalidAuthAttemptLimiter } from "~/middleware/rate-limit/invalid-auth-attempt";
import { invalidRequestResponse, serverErrorResponse } from "~/utils/http";
import { getManyUsers } from "./controller";

const bulkUserActionsRouter = new Hono()
    .use(invalidAuthAttemptLimiter)
    .use(AuthenticationMiddleware)

    .get("/", strictGetReqRateLimiter, users_get);

async function users_get(ctx: Context) {
    try {
        const userIds = ctx.req.query("ids");
        if (!userIds) return invalidRequestResponse(ctx);

        const idsArray = decodeStringArray(userIds);
        if (idsArray.length > 100) {
            return invalidRequestResponse(ctx, "Maximum 100 users can be fetched at once");
        }

        const res = await getManyUsers(idsArray);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

export default bulkUserActionsRouter;

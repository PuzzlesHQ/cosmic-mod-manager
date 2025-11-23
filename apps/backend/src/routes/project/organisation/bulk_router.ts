import { decodeStringArray } from "@app/utils/string";
import { type Context, Hono } from "hono";
import { strictGetReqRateLimiter } from "~/middleware/rate-limit/get-req";
import { invalidRequestResponse, serverErrorResponse } from "~/utils/http";
import { getManyOrgs } from "./controllers/get-many";

const bulkOrgsRouter = new Hono().get("/", strictGetReqRateLimiter, orgs_get);

async function orgs_get(ctx: Context) {
    try {
        const orgIds = ctx.req.query("ids");
        if (!orgIds) return invalidRequestResponse(ctx);

        const idsArray = decodeStringArray(orgIds);
        if (idsArray.length > 100) {
            return invalidRequestResponse(ctx, "Maximum of 100 organizations can be fetched at once");
        }

        const res = await getManyOrgs(idsArray);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

export default bulkOrgsRouter;

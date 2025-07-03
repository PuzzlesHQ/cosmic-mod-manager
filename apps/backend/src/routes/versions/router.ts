import { type Context, Hono } from "hono";
import { invalidReqestResponse, serverErrorResponse } from "~/utils/http";
import { getVersionById, getVersionsData } from "./handler";

const versionsRouter = new Hono().get("/", versions_get).get("/:versionId", version_get);

async function versions_get(ctx: Context) {
    try {
        const url = new URL(ctx.req.url);
        const ids = url.searchParams.get("ids");
        if (!ids) {
            return invalidReqestResponse(ctx, "'ids' search param not provided!");
        }

        const versionIds: string[] = [];
        for (const id of ids.split(",")) {
            if (!id?.trim()) continue;
            versionIds.push(id);
        }

        const res = await getVersionsData(versionIds);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function version_get(ctx: Context) {
    try {
        const versionId = ctx.req.param("versionId");
        if (!versionId) return invalidReqestResponse(ctx, "No version id provided!");

        const res = await getVersionById(versionId);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

export default versionsRouter;

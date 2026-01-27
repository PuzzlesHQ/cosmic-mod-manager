import { API_SCOPE } from "@app/utils/pats";
import { createPAT_FormSchema } from "@app/utils/schemas/pat";
import { zodParse } from "@app/utils/schemas/utils";
import { type Context, Hono } from "hono";
import { AuthenticationMiddleware } from "~/middleware/auth";
import { invalidAuthAttemptLimiter } from "~/middleware/rate-limit/invalid-auth-attempt";
import { REQ_BODY_NAMESPACE } from "~/types/namespaces";
import { invalidRequestResponse, serverErrorResponse } from "~/utils/http";
import { getSessionUser } from "~/utils/router";
import {
    createPersonalAccessToken,
    deletePersonalAccessToken,
    editPersonalAccessToken,
    getAllUserPATs,
} from "./controller";

const patRouter = new Hono()
    .use(AuthenticationMiddleware, invalidAuthAttemptLimiter)
    .get("/", pat_get)
    .post("/", pat_post)
    .patch("/:patId", pat_patch)
    .delete("/:patId", pat_delete);

async function pat_get(ctx: Context) {
    try {
        const sessionUser = getSessionUser(ctx, API_SCOPE.PAT_READ);
        if (!sessionUser) return invalidRequestResponse(ctx);

        const res = await getAllUserPATs(sessionUser);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function pat_post(ctx: Context) {
    try {
        const sessionUser = getSessionUser(ctx, API_SCOPE.PAT_CREATE);
        if (!sessionUser) return invalidRequestResponse(ctx);

        const body = ctx.get(REQ_BODY_NAMESPACE);
        const { data, error } = await zodParse(createPAT_FormSchema, body);
        if (error || !data) return invalidRequestResponse(ctx, error);

        const res = await createPersonalAccessToken(sessionUser, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function pat_patch(ctx: Context) {
    try {
        const sessionUser = getSessionUser(ctx, API_SCOPE.PAT_WRITE);
        if (!sessionUser) return invalidRequestResponse(ctx);

        const patId = ctx.req.param("patId");
        if (!patId) return invalidRequestResponse(ctx, "PAT ID is required");

        const body = ctx.get(REQ_BODY_NAMESPACE);
        const { data, error } = await zodParse(createPAT_FormSchema, body);
        if (error || !data) return invalidRequestResponse(ctx, error);

        const res = await editPersonalAccessToken(sessionUser, patId, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function pat_delete(ctx: Context) {
    try {
        const sessionUser = getSessionUser(ctx, API_SCOPE.PAT_DELETE);
        if (!sessionUser) return invalidRequestResponse(ctx);

        const patId = ctx.req.param("patId");
        if (!patId) return invalidRequestResponse(ctx, "PAT ID is required");

        const res = await deletePersonalAccessToken(sessionUser, patId);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

export default patRouter;

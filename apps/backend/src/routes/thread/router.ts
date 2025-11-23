import { createThreadMessage_Schema } from "@app/utils/schemas/thread";
import { zodParse } from "@app/utils/schemas/utils";
import { type Context, Hono } from "hono";
import { AuthenticationMiddleware, LoginProtectedRoute } from "~/middleware/auth";
import { invalidAuthAttemptLimiter } from "~/middleware/rate-limit/invalid-auth-attempt";
import { REQ_BODY_NAMESPACE } from "~/types/namespaces";
import { invalidRequestResponse, serverErrorResponse, unauthenticatedReqResponse } from "~/utils/http";
import { getUserFromCtx } from "~/utils/router";
import { CreateThreadMessage, DeleteThreadMessage, GetThreadMessages } from "./controllers";

const threadRouter = new Hono()
    .use(invalidAuthAttemptLimiter)
    .use(AuthenticationMiddleware)
    .use(LoginProtectedRoute)

    .get("/:threadId", thread_get)
    .post("/:threadId", thread_post)
    .delete("/message/:messageId", threadMessage_delete);

async function thread_get(ctx: Context) {
    try {
        const threadId = ctx.req.param("threadId");
        if (!threadId) return invalidRequestResponse(ctx);

        const user = getUserFromCtx(ctx);
        if (!user) return unauthenticatedReqResponse(ctx);

        const res = await GetThreadMessages(user, threadId);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function thread_post(ctx: Context) {
    try {
        const user = getUserFromCtx(ctx);
        if (!user) return unauthenticatedReqResponse(ctx);

        const threadId = ctx.req.param("threadId");
        if (!threadId) return invalidRequestResponse(ctx);

        const { data, error } = await zodParse(createThreadMessage_Schema, ctx.get(REQ_BODY_NAMESPACE));
        if (!data || error) return invalidRequestResponse(ctx, error);

        const res = await CreateThreadMessage(user, threadId, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function threadMessage_delete(ctx: Context) {
    try {
        const user = getUserFromCtx(ctx);
        if (!user) return unauthenticatedReqResponse(ctx);

        const messageId = ctx.req.param("messageId");
        if (!messageId) return invalidRequestResponse(ctx);

        const res = await DeleteThreadMessage(user, messageId);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

export default threadRouter;

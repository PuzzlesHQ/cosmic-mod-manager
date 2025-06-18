import { createThreadMessage_Schema } from "@app/utils/schemas/thread";
import { parseInput } from "@app/utils/schemas/utils";
import { type Context, Hono } from "hono";
import { AuthenticationMiddleware, LoginProtectedRoute } from "~/middleware/auth";
import { invalidAuthAttemptLimiter } from "~/middleware/rate-limit/invalid-auth-attempt";
import { REQ_BODY_NAMESPACE } from "~/types/namespaces";
import { invalidReqestResponse, serverErrorResponse, unauthenticatedReqResponse } from "~/utils/http";
import { getUserFromCtx } from "../auth/helpers/session";
import { CreateThreadMessage, DeleteThreadMessage, GetThreadMessages } from "./controllers";

const threadRouter = new Hono();

threadRouter
    .use(invalidAuthAttemptLimiter)
    .use(AuthenticationMiddleware)
    .use(LoginProtectedRoute)

    .get("/:threadId", thread_get)
    .post("/:threadId", thread_post)
    .delete("/message/:messageId", threadMessage_delete);

async function thread_get(ctx: Context) {
    try {
        const threadId = ctx.req.param("threadId");
        if (!threadId) return invalidReqestResponse(ctx);

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
        if (!threadId) return invalidReqestResponse(ctx);

        const { data, error } = await parseInput(createThreadMessage_Schema, ctx.get(REQ_BODY_NAMESPACE));
        if (!data || error) return invalidReqestResponse(ctx, error);

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
        if (!messageId) return invalidReqestResponse(ctx);

        const res = await DeleteThreadMessage(user, messageId);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

export default threadRouter;

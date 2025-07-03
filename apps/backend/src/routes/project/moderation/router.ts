import { MODERATOR_ROLES } from "@app/utils/src/constants/roles";
import { type Context, Hono } from "hono";
import { AuthenticationMiddleware } from "~/middleware/auth";
import { addInvalidAuthAttempt, invalidAuthAttemptLimiter } from "~/middleware/rate-limit/invalid-auth-attempt";
import { critModifyReqRateLimiter } from "~/middleware/rate-limit/modify-req";
import { REQ_BODY_NAMESPACE } from "~/types/namespaces";
import { serverErrorResponse, unauthorizedReqResponse } from "~/utils/http";
import { getUserFromCtx } from "~/utils/router";
import { getModerationProjects, updateModerationProject } from "./controller";

const moderationRouter = new Hono()
    .use(invalidAuthAttemptLimiter)
    .use(AuthenticationMiddleware)

    .get("/projects", critModifyReqRateLimiter, moderationProjects_get)
    .post("/project/:id", critModifyReqRateLimiter, moderationProject_post);

async function moderationProjects_get(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        if (!userSession?.id || !MODERATOR_ROLES.includes(userSession.role)) {
            await addInvalidAuthAttempt(ctx);
            return unauthorizedReqResponse(ctx);
        }

        const res = await getModerationProjects();
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function moderationProject_post(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        if (!userSession?.id || !MODERATOR_ROLES.includes(userSession.role)) {
            await addInvalidAuthAttempt(ctx);
            return unauthorizedReqResponse(ctx);
        }
        const id = ctx.req.param("id");
        const body = ctx.get(REQ_BODY_NAMESPACE);
        const newStatus = body.status;

        const res = await updateModerationProject(id, newStatus, userSession);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

export default moderationRouter;

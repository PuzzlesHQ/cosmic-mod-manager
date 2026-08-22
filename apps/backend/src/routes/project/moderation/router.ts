import { API_SCOPE } from "@app/utils/pats";
import { isModerator } from "@app/utils/src/constants/roles";
import { type Context, Hono } from "hono";
import { AuthenticationMiddleware } from "~/middleware/auth";
import {
    addInvalidAuthAttempt,
    critModifyReqRateLimiter,
    invalidAuthAttemptLimiter,
    strictGetReqRateLimiter,
} from "~/middleware/rate-limiter";
import { REQ_BODY_NAMESPACE } from "~/types/namespaces";
import { invalidRequestResponse, unauthorizedReqResponse } from "~/utils/http";
import { respondJson } from "~/utils/jsonRes";
import { getSessionUser } from "~/utils/router";
import { getModerationProjects, updateModerationProject } from "./controller";

const moderationRouter = new Hono()
    .use(invalidAuthAttemptLimiter)
    .use(AuthenticationMiddleware)

    .get("/projects", strictGetReqRateLimiter, moderationProjects_get)
    .post("/project/:id", critModifyReqRateLimiter, moderationProject_post);

async function moderationProjects_get(ctx: Context) {
    const sessionUser = getSessionUser(ctx, API_SCOPE.PROJECT_READ);
    if (!sessionUser?.id || !isModerator(sessionUser.role)) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponse(ctx);
    }

    const res = await getModerationProjects();
    return respondJson(ctx, res);
}

async function moderationProject_post(ctx: Context) {
    const sessionUser = getSessionUser(ctx, API_SCOPE.PROJECT_WRITE);
    if (!sessionUser?.id || !isModerator(sessionUser.role)) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponse(ctx);
    }

    const id = ctx.req.param("id");
    const body = ctx.get(REQ_BODY_NAMESPACE);
    if (!id || !body) return invalidRequestResponse(ctx);

    const newStatus = body.status;

    const res = await updateModerationProject(id, newStatus, sessionUser);
    return respondJson(ctx, res);
}

export default moderationRouter;

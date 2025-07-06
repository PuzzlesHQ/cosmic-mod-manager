import { decodeStringArray } from "@app/utils/string";
import { type Context, Hono } from "hono";
import { AuthenticationMiddleware } from "~/middleware/auth";
import { getReqRateLimiter, strictGetReqRateLimiter } from "~/middleware/rate-limit/get-req";
import { invalidAuthAttemptLimiter } from "~/middleware/rate-limit/invalid-auth-attempt";
import { invalidReqestResponse, serverErrorResponse } from "~/utils/http";
import { getUserFromCtx } from "~/utils/router";
import { getHomePageCarouselProjects, getManyProjects, getRandomProjects } from "./controllers";

const bulkProjectsRouter = new Hono()
    .use(invalidAuthAttemptLimiter)
    .use(AuthenticationMiddleware)

    .get("/", strictGetReqRateLimiter, projects_get)
    .get("/random", strictGetReqRateLimiter, projectsRandom_get)
    .get("/home-page-carousel", getReqRateLimiter, homePageCarousel_get);

async function projects_get(ctx: Context) {
    try {
        const projectIds = ctx.req.query("ids");
        const userSession = getUserFromCtx(ctx);
        if (!projectIds) return invalidReqestResponse(ctx);

        const idsArray = decodeStringArray(projectIds);
        if (idsArray.length > 100) {
            return invalidReqestResponse(ctx, "Maximum of 100 projects can be fetched at once");
        }

        const res = await getManyProjects(userSession, idsArray);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function projectsRandom_get(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        const count = Number.parseInt(ctx.req.query("count") || "");

        const res = await getRandomProjects(userSession, count);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function homePageCarousel_get(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        const res = await getHomePageCarouselProjects(userSession);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

export default bulkProjectsRouter;

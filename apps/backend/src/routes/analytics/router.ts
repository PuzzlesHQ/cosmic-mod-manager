import { DateFromStr } from "@app/utils/date";
import { TimelineOptions } from "@app/utils/types";
import { type Context, Hono } from "hono";
import { AuthenticationMiddleware, LoginProtectedRoute } from "~/middleware/auth";
import { applyCacheHeaders } from "~/middleware/cache";
import { strictGetReqRateLimiter } from "~/middleware/rate-limit/get-req";
import { invalidAuthAttemptLimiter } from "~/middleware/rate-limit/invalid-auth-attempt";
import { invalidReqestResponse, serverErrorResponse, unauthorizedReqResponse } from "~/utils/http";
import { getUserFromCtx } from "~/utils/router";
import { parseJson } from "~/utils/str";
import { getAllProjects_DownloadsAnalyticsData, getDownloadsAnalyticsData } from "./controllers";

const AnalyticsRouter = new Hono()
    .use(strictGetReqRateLimiter)
    .use(invalidAuthAttemptLimiter)
    .use(AuthenticationMiddleware)
    .use(
        // cache analytics responses for 6 hours on CDN but not on browser
        applyCacheHeaders({
            maxAge_s: 0,
            sMaxAge_s: 21600,
        }),
    )

    .get("/downloads", LoginProtectedRoute, downloadsAnalytics_get)
    .get("/downloads/all", LoginProtectedRoute, allProjectsDownloadsAnalytics_get);

async function downloadsAnalytics_get(ctx: Context) {
    try {
        const user = getUserFromCtx(ctx);
        if (!user) return unauthorizedReqResponse(ctx);

        const startDate_query = ctx.req.query("startDate");
        const endDate_query = ctx.req.query("endDate");
        const timeline_query = ctx.req.query("timeline");
        const projectIds_query = ctx.req.query("projectIds");

        if (!projectIds_query) return invalidReqestResponse(ctx, "projectIds query param is required");
        if (!timeline_query && (!startDate_query || !endDate_query))
            return invalidReqestResponse(
                ctx,
                "Either startDate and endDate (YYYY-MM-DD) or timeline query param must be provided",
            );

        const projectIds = await parseJson(projectIds_query);
        if (!projectIds || !Array.isArray(projectIds))
            return invalidReqestResponse(ctx, "projectIds query param is not valid JSON");

        const startDate = DateFromStr(startDate_query);
        const endDate = DateFromStr(endDate_query);
        let timeline: TimelineOptions | undefined = undefined;
        if (timeline_query) {
            if (Object.values(TimelineOptions).includes(timeline_query as TimelineOptions)) {
                timeline = timeline_query as TimelineOptions;
            } else {
                return invalidReqestResponse(ctx, "timeline query param is not valid");
            }
        }

        const res = await getDownloadsAnalyticsData(user, {
            projectIds: projectIds as string[],
            startDate: startDate,
            endDate: endDate,
            timeline: timeline,
        });

        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function allProjectsDownloadsAnalytics_get(ctx: Context) {
    try {
        const user = getUserFromCtx(ctx);
        if (!user) return unauthorizedReqResponse(ctx);

        const startDate_query = ctx.req.query("startDate");
        const endDate_query = ctx.req.query("endDate");
        const timeline_query = ctx.req.query("timeline");

        if (!timeline_query && (!startDate_query || !endDate_query))
            return invalidReqestResponse(
                ctx,
                "Either startDate and endDate (YYYY-MM-DD) or timeline query param must be provided",
            );

        const startDate = DateFromStr(startDate_query);
        const endDate = DateFromStr(endDate_query);
        let timeline: TimelineOptions | undefined = undefined;
        if (timeline_query) {
            if (Object.values(TimelineOptions).includes(timeline_query as TimelineOptions)) {
                timeline = timeline_query as TimelineOptions;
            } else {
                return invalidReqestResponse(ctx, "timeline query param is not valid");
            }
        }

        const res = await getAllProjects_DownloadsAnalyticsData(user, {
            projectIds: [],
            startDate: startDate,
            endDate: endDate,
            timeline: timeline,
        });

        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

export default AnalyticsRouter;

import { type Context, Hono } from "hono";
import { cors } from "hono/cors";
import bodyParserMiddleware from "~/middleware/body-parser";
import { applyCacheHeaders } from "~/middleware/cache";
import { logger } from "~/middleware/http-logger";
import { ddosProtectionRateLimiter } from "~/middleware/rate-limit/ddos";
import authRouter from "~/routes/auth/router";
import { queueDownloadsCounterQueueProcessing } from "~/routes/cdn/downloads-counter";
import cdnRouter from "~/routes/cdn/router";
import bulkProjectsRouter from "~/routes/project/bulk_router";
import moderationRouter from "~/routes/project/moderation/router";
import bulkOrgsRouter from "~/routes/project/organisation/bulk_router";
import orgRouter from "~/routes/project/organisation/router";
import projectRouter from "~/routes/project/router";
import teamRouter from "~/routes/project/team/router";
import searchRouter from "~/routes/search/router";
import { QueueSearchIndexUpdate } from "~/routes/search/search-db";
import bulkUserActionsRouter from "~/routes/user/bulk_actions/router";
import notificationRouter from "~/routes/user/notification/router";
import userRouter from "~/routes/user/router";
import { versionFileRouter, versionFiles_Router } from "~/routes/version-file/router";
import { startSitemapGenerator } from "~/services/sitemap-gen";
import { getStatistics } from "~/statistics";
import tagsRouter from "~/tags";
import env from "~/utils/env";
import { HTTP_STATUS, serverErrorResponse } from "~/utils/http";
import AnalyticsRouter from "./routes/analytics/router";
import collectionsRouter from "./routes/collections/router";
import reportRouter from "./routes/report/router";
import threadRouter from "./routes/thread/router";
import versionsRouter from "./routes/versions/router";

const corsAllowedOrigins = env.CORS_ALLOWED_URLS.split(" ");

const app = new Hono()
    .use(ddosProtectionRateLimiter)
    .use(logger())
    .use(
        cors({
            origin: (origin, ctx) => {
                // Allow all requests from allowed origins
                for (const allowedOrigin of corsAllowedOrigins) {
                    if (origin?.endsWith(allowedOrigin)) {
                        return origin;
                    }
                }

                // Allow GET requests from all origins
                if (ctx.req.method === "GET") {
                    return ctx.req.header("Origin") || "*";
                }

                return corsAllowedOrigins[0];
            },
            credentials: true,
        }),
    )
    .use(bodyParserMiddleware)

    // Routes
    .route("/api/auth", authRouter)
    .route("/api/search", searchRouter)
    .route("/api/tags", tagsRouter)

    .route("/api/user", userRouter)
    .route("/api/users", bulkUserActionsRouter)

    .route("/api/notifications", notificationRouter) // Uses the userSession's userId instead of getting it from the URL
    .route("/api/user/:userId/notifications", notificationRouter)

    .route("/api/project", projectRouter)
    .route("/api/version", versionsRouter)
    .route("/api/version-file", versionFileRouter)
    .route("/api/version-files", versionFiles_Router)
    .route("/api/projects", bulkProjectsRouter)
    .route("/api/moderation", moderationRouter)

    .route("/api/team", teamRouter)
    .route("/api/organization", orgRouter) // Uses the userSession's userId instead of getting it from the URL
    .route("/api/user/:userId/organization", orgRouter)
    .route("/api/organizations", bulkOrgsRouter)

    .route("/api/thread", threadRouter)
    .route("/api/report", reportRouter)

    .route("/api/collections", collectionsRouter)
    .route("/api/analytics", AnalyticsRouter)

    .route("/cdn", cdnRouter)

    // Some inlined routes
    .get("/favicon.ico", async (ctx: Context) => {
        return ctx.redirect("https://crmm.tech/favicon.ico");
    })

    .get("/", apiDetails)
    .get("/api", apiDetails)
    .get("/api/statistics", applyCacheHeaders({ maxAge_s: 600, sMaxAge_s: 7200 }), async (ctx: Context) => {
        try {
            const stats = await getStatistics();
            return ctx.json(stats, HTTP_STATUS.OK);
        } catch {
            return serverErrorResponse(ctx);
        }
    });

async function apiDetails(ctx: Context) {
    return ctx.json(
        {
            message: "Hello visitor! Welcome to the CRMM API.",
            website: "https://crmm.tech",
            docs: "https://docs.crmm.tech",
            status: "https://status.crmm.tech",
            cdn: env.CACHE_CDN_URL,
        },
        HTTP_STATUS.OK,
    );
}

// Initialize the queues
await queueDownloadsCounterQueueProcessing();
await QueueSearchIndexUpdate();
await startSitemapGenerator();

Bun.serve({
    port: 5500,
    fetch(req, server) {
        return app.fetch(req, { ip: server.requestIP(req) });
    },
});

export { app };

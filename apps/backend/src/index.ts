import { type Context, Hono } from "hono";
import { cors } from "hono/cors";
import env from "~/utils/env";
import { HTTP_STATUS, serverErrorResponse } from "~/utils/http";

// __

import { queueDownloadsCounterQueueProcessing } from "~/routes/cdn/downloads-counter";
import { queueSearchIndexUpdate } from "~/routes/search/search-db";

// Middlewares

import bodyParserMiddleware from "~/middleware/body-parser";
import { applyCacheHeaders } from "~/middleware/cache";
import { logger } from "~/middleware/http-logger";
import { ddosProtectionRateLimiter } from "~/middleware/rate-limit/ddos";
import { startSitemapGenerator } from "~/services/sitemap-gen";

// Routes

import analyticsRouter from "~/routes/analytics/router";
import authRouter from "~/routes/auth/router";
import cdnRouter from "~/routes/cdn/router";
import collectionsRouter from "~/routes/collections/router";
import patRouter from "~/routes/pat/router";
import bulkProjectsRouter from "~/routes/project/bulk_router";
import moderationRouter from "~/routes/project/moderation/router";
import bulkOrgsRouter from "~/routes/project/organisation/bulk_router";
import orgRouter from "~/routes/project/organisation/router";
import projectRouter from "~/routes/project/router";
import teamRouter from "~/routes/project/team/router";
import reportRouter from "~/routes/report/router";
import searchRouter from "~/routes/search/router";
import { getStatistics } from "~/routes/statistics";
import tagsRouter from "~/routes/tags";
import threadRouter from "~/routes/thread/router";
import bulkUserActionsRouter from "~/routes/user/bulk_actions/router";
import notificationRouter from "~/routes/user/notification/router";
import userRouter from "~/routes/user/router";
import { versionFileRouter, versionFiles_Router } from "~/routes/version-file/router";
import versionsRouter from "~/routes/versions/router";

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

    .route("/api/auth", authRouter)
    .route("/api/search", searchRouter)
    .route("/api/tags", tagsRouter)

    .route("/api/user", userRouter)
    .route("/api/users", bulkUserActionsRouter)

    .route("/api/pat", patRouter)

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
    .route("/api/analytics", analyticsRouter)

    .route("/cdn", cdnRouter)

    // Some inlined routes
    .get("/favicon.ico", async (ctx: Context) => {
        return ctx.redirect("https://crmm.tech/favicon.ico");
    })

    .get("/", apiDetails)
    .get("/api", apiDetails)
    .get("/api/statistics", applyCacheHeaders({ browserTTL_s: 600, cdnTTL_s: 12 * 3600 }), async (ctx: Context) => {
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

try {
    // Initialize the queues
    await queueDownloadsCounterQueueProcessing();
    await startSitemapGenerator();
    await queueSearchIndexUpdate();
} catch {}

Bun.serve({
    port: 5500,
    fetch(req, server) {
        return app.fetch(req, { ip: server.requestIP(req) });
    },
});

import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { getReqRateLimiter } from "~/middleware/rate-limiter";

const openapiData = await import("~/../openapi/openapi.json.txt", { with: { type: "text" } });

const docsRouter = new Hono()
    .use(getReqRateLimiter)
    .get(
        "/",
        Scalar({
            title: "API Reference Docs",
            url: "/api/docs/open-api",
            theme: "deepSpace",
            layout: "modern",
            defaultHttpClient: { targetKey: "js", clientKey: "fetch" },
            mcp: {
                disabled: true,
            },
            agent: {
                disabled: true,
            },

            telemetry: false,
            hideModels: true,
            hideClientButton: true,
        }),
    )
    .get("/open-api", async (c) => {
        return c.text(openapiData.default);
    });

export default docsRouter;

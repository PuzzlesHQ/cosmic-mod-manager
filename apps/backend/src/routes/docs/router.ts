import fs from "node:fs/promises";
import path from "node:path";
import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { getReqRateLimiter } from "~/middleware/rate-limiter";

const docsRouter = new Hono()
    .use(getReqRateLimiter)
    .get(
        "/",
        Scalar({
            url: "/api/docs/open-api",
            theme: "kepler",
            layout: "modern",
            defaultHttpClient: { targetKey: "js", clientKey: "fetch" },
            mcp: {
                disabled: true
            },
            agent: {
                disabled: true
            },
            
            telemetry: false,
            hideModels: true
        }),
    )
    .get("/open-api", async (c) => {
        const raw = await fs.readFile(path.join(process.cwd(), "./openapi/openapi.json"), "utf-8");
        return c.json(JSON.parse(raw));
    });

export default docsRouter;

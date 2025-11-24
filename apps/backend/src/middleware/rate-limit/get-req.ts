import type { Context, Next } from "hono";
import { getUserIpAddress } from "~/routes/auth/helpers";
import { tooManyRequestsResponse } from "~/utils/http";
import { TokenBucket } from "./bucket";
import rateLimits from "./limits";
import { setRateLimitHeaders } from "./utils";

const getReqLimiter = rateLimits.global.GET;
const getReqLimiterBucket = new TokenBucket(
    getReqLimiter.namespace,
    getReqLimiter.max,
    getReqLimiter.timeWindow_seconds,
);

// Regular get request rate limiter
export async function getReqRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return ctx.json(
            {
                message: "Cannot get request's IP Address. Although this should never happen, but if it does, idk :)",
            },
            500,
        );
    }

    const res = await getReqLimiterBucket.consume(ipAddr);

    setRateLimitHeaders(ctx, res);
    if (res.rateLimited === true) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

const strictGetReqLimit = rateLimits.global.STRICT_GET;
const strictGetReqLimiterBucket = new TokenBucket(
    strictGetReqLimit.namespace,
    strictGetReqLimit.max,
    strictGetReqLimit.timeWindow_seconds,
);

// Restricted get request rate limiter
export async function strictGetReqRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return ctx.json(
            {
                message: "Cannot get request's IP Address. Although this should never happen, but if it does, idk :)",
            },
            500,
        );
    }

    const res = await strictGetReqLimiterBucket.consume(ipAddr);

    setRateLimitHeaders(ctx, res);
    if (res.rateLimited === true) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

const searchReqLimiter = rateLimits.SEARCH;
const searchReqLimiterBucket = new TokenBucket(
    searchReqLimiter.namespace,
    searchReqLimiter.max,
    searchReqLimiter.timeWindow_seconds,
);

// Separate rate limiter for search api endpoint
export async function searchReqRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return ctx.json(
            {
                message: "Cannot get request's IP Address. Although this should never happen, but if it does, idk :)",
            },
            500,
        );
    }

    const res = await searchReqLimiterBucket.consume(ipAddr);

    setRateLimitHeaders(ctx, res);
    if (res.rateLimited === true) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

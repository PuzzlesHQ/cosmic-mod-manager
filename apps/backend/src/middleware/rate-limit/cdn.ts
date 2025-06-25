import type { Context, Next } from "hono";
import { getUserIpAddress } from "~/routes/auth/helpers";
import { serverErrorResponse, tooManyRequestsResponse } from "~/utils/http";
import { TokenBucket } from "./bucket";
import rateLimits from "./limits";
import { setRateLimitHeaders } from "./utils";

const cdnAssetLimit = rateLimits.global.DDOS_PROTECTION;
const cdnAssetLimiterBucket = new TokenBucket(cdnAssetLimit.namespace, cdnAssetLimit.max, cdnAssetLimit.timeWindow_seconds);

export async function cdnAssetRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(ctx);
    }

    const res = await cdnAssetLimiterBucket.consume(ipAddr);
    setRateLimitHeaders(ctx, res);
    if (res.rateLimited === true) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

const cdnLargeFileLimit = rateLimits.global.DDOS_PROTECTION;
const cdnLargeFileLimiterBucket = new TokenBucket(
    cdnLargeFileLimit.namespace,
    cdnLargeFileLimit.max,
    cdnLargeFileLimit.timeWindow_seconds,
);

export async function cdnLargeFileRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(ctx);
    }

    const res = await cdnLargeFileLimiterBucket.consume(ipAddr);
    setRateLimitHeaders(ctx, res);
    if (res.rateLimited === true) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

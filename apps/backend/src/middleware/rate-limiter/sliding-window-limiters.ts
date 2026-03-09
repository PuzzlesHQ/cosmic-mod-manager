import type { Context, Next } from "hono";
import { getUserIpAddress } from "~/routes/auth/helpers";
import { serverErrorResponse, tooManyRequestsResponse } from "~/utils/http";
import { universalRateLimiterBucket } from "./bucket";

const limits = {
    GET: 100,
    STRICT_GET: 35,
    MODIFY: 20,
    CRIT_MODIFY: 10,
};

// --
//

export async function getReqRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(ctx);
    }

    const res = await universalRateLimiterBucket.consume(ipAddr, limits.GET);
    if (res.allowed === false) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

// Restricted get request rate limiter
export async function strictGetReqRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(ctx);
    }

    const res = await universalRateLimiterBucket.consume(ipAddr, limits.STRICT_GET);
    if (res.allowed === false) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

// --
//

// Limiter for requests that modify some data
export async function modifyReqRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(ctx);
    }

    const res = await universalRateLimiterBucket.consume(ipAddr, limits.MODIFY);
    if (res.allowed === false) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

export async function critModifyReqRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(ctx);
    }

    const res = await universalRateLimiterBucket.consume(ipAddr, limits.CRIT_MODIFY);
    if (res.allowed === false) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

// --
//
export async function cdnAssetRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(ctx);
    }

    const res = await universalRateLimiterBucket.consume(ipAddr, limits.GET);
    if (res.allowed === false) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

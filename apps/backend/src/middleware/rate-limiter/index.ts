import type { Context, Next } from "hono";
import { getUserIpAddress } from "~/routes/auth/helpers";
import { serverErrorResponse, tooManyRequestsResponse } from "~/utils/http";
import { SlidingWindowCounter } from "./bucket";
import { Limits } from "./limits";

const getReqLimiter = new SlidingWindowCounter(Limits.GET.namespace, Limits.GET.max, Limits.GET.timeWindow_s);
export async function getReqRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(ctx);
    }

    const res = await getReqLimiter.consume(ipAddr);
    if (res.allowed === false) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

const searchReqLimiter = new SlidingWindowCounter(
    Limits.SEARCH.namespace,
    Limits.SEARCH.max,
    Limits.SEARCH.timeWindow_s,
);
export async function searchReqRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(ctx);
    }

    const res = await searchReqLimiter.consume(ipAddr);
    if (res.allowed === false) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

// Restricted get request rate limiter
const strictGetReqLimiter = new SlidingWindowCounter(
    Limits.STRICT_GET.namespace,
    Limits.STRICT_GET.max,
    Limits.STRICT_GET.timeWindow_s,
);
export async function strictGetReqRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(ctx);
    }

    const res = await strictGetReqLimiter.consume(ipAddr);
    if (res.allowed === false) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

// Limiter for requests that modify some data
const modifyReqLimiterBucket = new SlidingWindowCounter(
    Limits.MODIFY.namespace,
    Limits.MODIFY.max,
    Limits.MODIFY.timeWindow_s,
);
export async function modifyReqRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(ctx);
    }

    const res = await modifyReqLimiterBucket.consume(ipAddr);
    if (res.allowed === false) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

const critModifyReqLimiterBucket = new SlidingWindowCounter(
    Limits.CRIT_MODIFY.namespace,
    Limits.CRIT_MODIFY.max,
    Limits.CRIT_MODIFY.timeWindow_s,
);
export async function critModifyReqRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(ctx);
    }

    const res = await critModifyReqLimiterBucket.consume(ipAddr);
    if (res.allowed === false) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

export async function cdnAssetRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(ctx);
    }

    const res = await strictGetReqLimiter.consume(ipAddr);
    if (res.allowed === false) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

const ddosRateLimiterBucket = new SlidingWindowCounter(
    Limits.DDOS_PROTECTION.namespace,
    Limits.DDOS_PROTECTION.max,
    Limits.DDOS_PROTECTION.timeWindow_s,
);

export async function ddosProtectionRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(ctx);
    }

    const res = await ddosRateLimiterBucket.consume(ipAddr);
    if (res.allowed === false) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

const sendEmailLimiterBucket = new SlidingWindowCounter(
    Limits.EMAIL.namespace,
    Limits.EMAIL.max,
    Limits.EMAIL.timeWindow_s,
);

export async function sendEmailRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(ctx);
    }

    const res = await sendEmailLimiterBucket.consume(ipAddr);
    if (res.allowed === false) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

const invalidAuthAttemptsBucket = new SlidingWindowCounter(
    Limits.INVALID_AUTH_ATTEMPT.namespace,
    Limits.INVALID_AUTH_ATTEMPT.max,
    Limits.INVALID_AUTH_ATTEMPT.timeWindow_s,
);

export async function invalidAuthAttemptLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(ctx);
    }

    // This is just to read the data, so cost is 0
    const res = await invalidAuthAttemptsBucket.consume(ipAddr, 0);
    if (res.allowed === false) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

export async function addInvalidAuthAttempt(ctx: Context) {
    const ipAddr = getUserIpAddress(ctx);
    if (ipAddr) {
        await invalidAuthAttemptsBucket.consume(ipAddr);
    }
}

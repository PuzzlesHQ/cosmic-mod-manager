import type { Context, Next } from "hono";
import { getUserIpAddress } from "~/routes/auth/helpers";
import { serverErrorResponse, tooManyRequestsResponse } from "~/utils/http";
import { SlidingWindowCounter } from "./bucket";
import { Limits } from "./limits";

const getReqLimit = new SlidingWindowCounter(Limits.GET);
export async function getReqRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(ctx);
    }

    const res = await getReqLimit.consume(ipAddr);
    if (res.allowed === false) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

const searchReqLimit = new SlidingWindowCounter(Limits.SEARCH);
export async function searchReqRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(ctx);
    }

    const res = await searchReqLimit.consume(ipAddr);
    if (res.allowed === false) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

// Restricted get request rate limiter
const strictGetReqLimit = new SlidingWindowCounter(Limits.STRICT_GET);
export async function strictGetReqRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(ctx);
    }

    const res = await strictGetReqLimit.consume(ipAddr);
    if (res.allowed === false) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

// Limiter for requests that modify some data
const modifyReqLimit = new SlidingWindowCounter(Limits.MODIFY);
export async function modifyReqRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(ctx);
    }

    const res = await modifyReqLimit.consume(ipAddr);
    if (res.allowed === false) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

const critModifyReqLimit = new SlidingWindowCounter(Limits.CRIT_MODIFY);
export async function critModifyReqRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(ctx);
    }

    const res = await critModifyReqLimit.consume(ipAddr);
    if (res.allowed === false) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

const imgReqLimit = new SlidingWindowCounter(Limits.CDN_IMG);
export async function cdnImgRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(ctx);
    }

    const res = await imgReqLimit.consume(ipAddr);
    if (res.allowed === false) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

const versionFileReqLimit = new SlidingWindowCounter(Limits.CDN_VERSION_FILE);
export async function cdnVersionFileRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(ctx);
    }

    const res = await versionFileReqLimit.consume(ipAddr);
    if (res.allowed === false) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

const ddosRateLimit = new SlidingWindowCounter(Limits.DDOS_PROTECTION);
export async function ddosProtectionRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(ctx);
    }

    const res = await ddosRateLimit.consume(ipAddr);
    if (res.allowed === false) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

const sendEmailLimit = new SlidingWindowCounter(Limits.EMAIL);
export async function sendEmailRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(ctx);
    }

    const res = await sendEmailLimit.consume(ipAddr);
    if (res.allowed === false) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

const invalidAuthAttemptsLimit = new SlidingWindowCounter(Limits.INVALID_AUTH_ATTEMPT);
export async function invalidAuthAttemptLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(ctx);
    }

    // This is just to read the data, so cost is 0
    const res = await invalidAuthAttemptsLimit.consume(ipAddr, 0);
    if (res.allowed === false) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

export async function addInvalidAuthAttempt(ctx: Context) {
    const ipAddr = getUserIpAddress(ctx);
    if (ipAddr) {
        await invalidAuthAttemptsLimit.consume(ipAddr);
    }
}

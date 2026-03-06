import type { Context, Next } from "hono";
import { getUserIpAddress } from "~/routes/auth/helpers";
import { serverErrorResponse, tooManyRequestsResponse } from "~/utils/http";
import { FixedWindowBucket } from "./bucket";

const limits = {
    EMAIL: {
        max: 10,
        timeWindow_seconds: 7200,
        namespace: "global_EMAIL",
    },
    INVALID_AUTH_ATTEMPT: {
        max: 5,
        timeWindow_seconds: 7200,
        namespace: "global_INVALID_AUTH_ATTEMPT",
    },
    DDOS_PROTECTION: {
        max: 30,
        timeWindow_seconds: 5,
        namespace: "global_DDOS_PROTECTION",
    },
};

// --
const ddosProtectionLimit = limits.DDOS_PROTECTION;
const ddosRateLimiterBucket = new FixedWindowBucket(
    ddosProtectionLimit.namespace,
    ddosProtectionLimit.max,
    ddosProtectionLimit.timeWindow_seconds,
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

// --

const sendEmailLimit = limits.EMAIL;
const sendEmailLimiterBucket = new FixedWindowBucket(
    sendEmailLimit.namespace,
    sendEmailLimit.max,
    sendEmailLimit.timeWindow_seconds,
);

// Limiter for requests that modify some data
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

// --
//

const limitObj = limits.INVALID_AUTH_ATTEMPT;
const invalidAuthAttemptsBucket = new FixedWindowBucket(limitObj.namespace, limitObj.max, limitObj.timeWindow_seconds);

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
    if (!ipAddr) {
        return null;
    }

    await invalidAuthAttemptsBucket.consume(ipAddr);
}

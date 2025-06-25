import type { Context, Next } from "hono";
import { getUserIpAddress } from "~/routes/auth/helpers";
import { serverErrorResponse, tooManyRequestsResponse } from "~/utils/http";
import { TokenBucket } from "./bucket";
import rateLimits from "./limits";
import { setRateLimitHeaders } from "./utils";

const limitObj = rateLimits.global.INVALID_AUTH_ATTEMPT;
const invalidAuthAttemptsBucket = new TokenBucket(limitObj.namespace, limitObj.max, limitObj.timeWindow_seconds);

export async function invalidAuthAttemptLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return serverErrorResponse(
            ctx,
            "Cannot get request's IP Address. Although this should never happen, but if it did, idk :)",
        );
    }

    // This is just to read the data, so cost is 0
    const res = await invalidAuthAttemptsBucket.consume(ipAddr, 0);

    if (res.rateLimited === true) {
        setRateLimitHeaders(ctx, res);
        return tooManyRequestsResponse(ctx, "Too many failed auth attempts. Please try again later.");
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

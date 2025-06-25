import type { Context, Next } from "hono";
import { getUserIpAddress } from "~/routes/auth/helpers";
import { tooManyRequestsResponse } from "~/utils/http";
import { TokenBucket } from "./bucket";
import rateLimits from "./limits";
import { setRateLimitHeaders } from "./utils";

const modifyLimit = rateLimits.global.MODIFY;
const modifyLimiter = new TokenBucket(modifyLimit.namespace, modifyLimit.max, modifyLimit.timeWindow_seconds);

// Limiter for requests that modify some data
export async function modifyReqRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return ctx.json(
            { message: "Cannot get request's IP Address. Although this should never happen, but if it does, idk :)" },
            500,
        );
    }

    const res = await modifyLimiter.consume(ipAddr);

    setRateLimitHeaders(ctx, res);
    if (res.rateLimited === true) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

// Limiter for requests that modify critical data
const critModifyLimit = rateLimits.global.MODIFY;
const critModifyLimiter = new TokenBucket(critModifyLimit.namespace, critModifyLimit.max, critModifyLimit.timeWindow_seconds);

export async function critModifyReqRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return ctx.json(
            { message: "Cannot get request's IP Address. Although this should never happen, but if it does, idk :)" },
            500,
        );
    }

    const res = await critModifyLimiter.consume(ipAddr);

    setRateLimitHeaders(ctx, res);
    if (res.rateLimited === true) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

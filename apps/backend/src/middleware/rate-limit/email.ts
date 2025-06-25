import type { Context, Next } from "hono";
import { getUserIpAddress } from "~/routes/auth/helpers";
import { tooManyRequestsResponse } from "~/utils/http";
import { TokenBucket } from "./bucket";
import rateLimits from "./limits";
import { setRateLimitHeaders } from "./utils";

const sendEmailLimit = rateLimits.global.EMAIL;
const sendEmailLimiterBucket = new TokenBucket(sendEmailLimit.namespace, sendEmailLimit.max, sendEmailLimit.timeWindow_seconds);

// Limiter for requests that modify some data
export async function sendEmailRateLimiter(ctx: Context, next: Next) {
    const ipAddr = getUserIpAddress(ctx);
    if (!ipAddr) {
        return ctx.json(
            { message: "Cannot get request's IP Address. Although this should never happen, but if it does, idk :)" },
            500,
        );
    }

    const res = await sendEmailLimiterBucket.consume(ipAddr);

    setRateLimitHeaders(ctx, res);
    if (res.rateLimited === true) {
        return tooManyRequestsResponse(ctx);
    }

    await next();
}

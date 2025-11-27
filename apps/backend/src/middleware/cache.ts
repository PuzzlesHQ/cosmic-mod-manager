import type { Context, Next } from "hono";

export const IMMUTABLE_TTL = 31536000; // 1 year

interface CacheHeadersOptions {
    browserTTL_s: number;
    cdnTTL_s: number;
}

export function applyCacheHeaders(props: CacheHeadersOptions) {
    return async (ctx: Context, next: Next) => {
        ctx.res.headers.set("Cache-Control", `public, max-age=${props.browserTTL_s}, s-maxage=${props.cdnTTL_s}`);

        await next();
    };
}

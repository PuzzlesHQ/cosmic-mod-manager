import type { Context, Next } from "hono";
import { REQ_BODY_NAMESPACE } from "~/types/namespaces";

export default async function bodyParserMiddleware(ctx: Context, next: Next) {
    try {
        const contentType = ctx.req.header()?.["content-type"];
        let body: unknown;

        if (contentType.includes("text/plain") || contentType.includes("application/json")) {
            body = await ctx.req.json();
        } else if (contentType.includes("multipart/form-data")) {
            body = await ctx.req.formData();
        } else {
            body = await ctx.req.text();
        }

        ctx.set(REQ_BODY_NAMESPACE, body || null);
    } catch {}

    await next();
}

import { GUEST_SESSION_ID_VALIDITY } from "@app/utils/constants";
import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { getUserIpAddress } from "~/routes/auth/helpers";
import { validateContextSession } from "~/routes/auth/helpers/session";
import { CTX_USER_NAMESPACE } from "~/types/namespaces";
import env from "~/utils/env";
import { deleteCookie, HTTP_STATUS, serverErrorResponse, setCookie } from "~/utils/http";
import { getUserFromCtx } from "~/utils/router";
import { generateRandomId } from "~/utils/str";

export async function AuthenticationMiddleware(ctx: Context, next: Next) {
    const user = await validateContextSession(ctx);
    const ipAddr = getUserIpAddress(ctx);
    const isCdnReq = IsCdnRequest(ctx);

    // do not set cookie for CDN requests
    if (!user && !isCdnReq) {
        // Set a guest session cookie
        if (!getCookie(ctx, "guest-session")) {
            const randomId = generateRandomId(32);
            setCookie(ctx, "guest-session", randomId, { maxAge: GUEST_SESSION_ID_VALIDITY });
            ctx.set("guest-session", randomId);
        } else {
            ctx.set("guest-session", getCookie(ctx, "guest-session"));
        }
    } else if (!isCdnReq && getCookie(ctx, "guest-session")) {
        deleteCookie(ctx, "guest-session");
    }

    ctx.set(CTX_USER_NAMESPACE, user);
    ctx.set("ip", ipAddr);
    await next();
}

export async function LoginProtectedRoute(ctx: Context, next: Next) {
    try {
        const session = getUserFromCtx(ctx);
        if (!session?.id) {
            return ctx.json({ success: false, message: "You're not logged in" }, HTTP_STATUS.UNAUTHENTICATED);
        }

        await next();
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

function IsCdnRequest(ctx: Context) {
    if (env.NODE_ENV === "development") return false;
    return ctx.req.header("CDN-Secret") === env.CDN_SECRET;
}

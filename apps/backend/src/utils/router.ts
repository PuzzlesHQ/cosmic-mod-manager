import type { Context } from "hono";
import type { ContextUserData } from "~/types";
import { CTX_USER_NAMESPACE } from "~/types/namespaces";

export function getUserFromCtx(ctx: Context) {
    return ctx.get(CTX_USER_NAMESPACE) as ContextUserData | null;
}

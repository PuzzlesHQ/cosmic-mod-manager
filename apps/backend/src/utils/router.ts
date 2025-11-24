import { type API_SCOPE, hasScopes } from "@app/utils/pats";
import type { Context } from "hono";
import type { ContextUserData } from "~/types";
import { CTX_USER_NAMESPACE } from "~/types/namespaces";

export function getUserFromCtx(ctx: Context, ...requiredScopes: API_SCOPE[]) {
    const user = ctx.get(CTX_USER_NAMESPACE) as ContextUserData | null;
    if (!user) return null;

    if (requiredScopes.length > 0 && !hasScopes(user.apiScopes, requiredScopes)) {
        return null;
    }

    return user;
}

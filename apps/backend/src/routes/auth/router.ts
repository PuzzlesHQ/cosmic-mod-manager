import { authProvidersList } from "@app/utils/config/project";
import { getAuthProviderFromString, getUserRoleFromString } from "@app/utils/convertors";
import { LoginFormSchema } from "@app/utils/schemas/auth";
import { zodParse } from "@app/utils/schemas/utils";
import { AuthActionIntent, type AuthProvider, type LoggedInUserData } from "@app/utils/types";
import { type Context, Hono } from "hono";
import { AuthenticationMiddleware, LoginProtectedRoute } from "~/middleware/auth";
import { getReqRateLimiter, strictGetReqRateLimiter } from "~/middleware/rate-limit/get-req";
import { invalidAuthAttemptLimiter } from "~/middleware/rate-limit/invalid-auth-attempt";
import { critModifyReqRateLimiter } from "~/middleware/rate-limit/modify-req";
import { REQ_BODY_NAMESPACE } from "~/types/namespaces";
import { HTTP_STATUS, invalidReqestResponse, serverErrorResponse } from "~/utils/http";
import { getUserFromCtx } from "~/utils/router";
import { userFileUrl } from "~/utils/urls";
import { getLinkedAuthProviders, linkAuthProviderHandler, unlinkAuthProvider } from "./controllers/link-provider";
import { deleteUserSession, getUserSessions, revokeSessionFromAccessCode } from "./controllers/session";
import { oAuthSignInHandler } from "./controllers/signin";
import credentialSignIn from "./controllers/signin/credential";
import { oAuthSignUpHandler } from "./controllers/signup";
import { getOAuthUrl } from "./helpers";

const authRouter = new Hono()

    // Middlewares
    .use(invalidAuthAttemptLimiter)
    .use(AuthenticationMiddleware)

    // Route Definitions
    .get("/me", getReqRateLimiter, currSession_get)

    // Routes to get OAuth URL
    .get("/signin/:authProvider", strictGetReqRateLimiter, async (ctx: Context) => oAuthUrl_get(ctx, AuthActionIntent.SIGN_IN))
    .get("/signup/:authProvider", strictGetReqRateLimiter, async (ctx: Context) => oAuthUrl_get(ctx, AuthActionIntent.SIGN_UP))
    .get("/link/:authProvider", strictGetReqRateLimiter, LoginProtectedRoute, async (ctx: Context) =>
        oAuthUrl_get(ctx, AuthActionIntent.LINK),
    )

    .post("/signin/credential", critModifyReqRateLimiter, credentialSignin_post) // Sign in with credentials
    .post("/signin/:authProvider", critModifyReqRateLimiter, oAuthSignIn_post)
    .post("/signup/:authProvider", critModifyReqRateLimiter, oAuthSignUp_post)
    .post("/link/:authProvider", critModifyReqRateLimiter, LoginProtectedRoute, oAuthLinkProvider_post)
    .delete("/link/:authProvider", critModifyReqRateLimiter, LoginProtectedRoute, oAuthLinkProvider_delete)
    .get("/sessions", strictGetReqRateLimiter, LoginProtectedRoute, sessions_get)
    .get("/linked-providers", strictGetReqRateLimiter, LoginProtectedRoute, linkedProviders_get)
    .delete("/sessions", critModifyReqRateLimiter, LoginProtectedRoute, session_delete)
    .delete("/sessions/:revokeCode", critModifyReqRateLimiter, revokeSession_delete);

async function currSession_get(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        if (!userSession) return ctx.json({ success: false, message: "You're not logged in!" }, HTTP_STATUS.OK);

        const formattedObject = {
            id: userSession.id,
            email: userSession.email,
            userName: userSession.userName,
            name: userSession.name,
            role: getUserRoleFromString(userSession.role),
            hasAPassword: !!userSession.password,
            avatar: userFileUrl(userSession.id, userSession.avatar),
            sessionId: userSession.sessionId,
            bio: userSession.bio,
            profilePageBg: userFileUrl(userSession.id, userSession.profilePageBg),
        } satisfies LoggedInUserData;

        return ctx.json(formattedObject, HTTP_STATUS.OK);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function oAuthUrl_get(ctx: Context, intent: AuthActionIntent) {
    try {
        const userSession = getUserFromCtx(ctx);
        if (userSession?.id && intent !== AuthActionIntent.LINK) return invalidReqestResponse(ctx, "You are already logged in!");

        const authProvider = ctx.req.param("authProvider");
        if (!authProvider) return invalidReqestResponse(ctx, "Invalid auth provider");

        const redirect = ctx.req.query("redirect") === "true";
        const url = getOAuthUrl(ctx, authProvider, intent);

        if (redirect) {
            return ctx.redirect(url);
        }

        return ctx.json({ success: true, url }, HTTP_STATUS.OK);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function credentialSignin_post(ctx: Context) {
    try {
        const { data, error } = await zodParse(LoginFormSchema, ctx.get(REQ_BODY_NAMESPACE));
        if (error || !data) return invalidReqestResponse(ctx, error);

        const result = await credentialSignIn(ctx, data);
        return ctx.json(result.data, result.status);
    } catch (err) {
        console.error(err);
        return serverErrorResponse(ctx);
    }
}

async function oAuthSignIn_post(ctx: Context) {
    try {
        if (getUserFromCtx(ctx)?.id) {
            return invalidReqestResponse(ctx);
        }

        const authProvider = ctx.req.param("authProvider");
        const code = ctx.get(REQ_BODY_NAMESPACE)?.code;

        if (!authProvidersList.includes(authProvider.toLowerCase() as AuthProvider) || !code) {
            return invalidReqestResponse(ctx);
        }

        const result = await oAuthSignInHandler(ctx, authProvider, code);
        return ctx.json(result.data, result.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function oAuthSignUp_post(ctx: Context) {
    try {
        if (getUserFromCtx(ctx)?.id) {
            return invalidReqestResponse(ctx);
        }

        const authProvider = ctx.req.param("authProvider");
        const code = ctx.get(REQ_BODY_NAMESPACE)?.code;
        if (!authProvidersList.includes(authProvider.toLowerCase() as AuthProvider) || !code) {
            return invalidReqestResponse(ctx);
        }

        const result = await oAuthSignUpHandler(ctx, authProvider, code);
        return ctx.json(result.data, result.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function oAuthLinkProvider_post(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        if (!userSession?.id) {
            return invalidReqestResponse(ctx);
        }

        const authProvider = ctx.req.param("authProvider");
        const code = ctx.get(REQ_BODY_NAMESPACE)?.code;
        if (!authProvidersList.includes(getAuthProviderFromString(authProvider)) || !code) {
            return invalidReqestResponse(ctx);
        }

        const result = await linkAuthProviderHandler(ctx, userSession, authProvider, code);
        return ctx.json(result.data, result.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function oAuthLinkProvider_delete(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        if (!userSession?.id) {
            return invalidReqestResponse(ctx);
        }

        const authProvider = ctx.req.param("authProvider");
        const result = await unlinkAuthProvider(ctx, userSession, authProvider);
        return ctx.json(result.data, result.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function sessions_get(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        if (!userSession) return ctx.json([], HTTP_STATUS.OK);

        const result = await getUserSessions(userSession);
        return ctx.json(result.data, result.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function linkedProviders_get(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        if (!userSession?.id) return invalidReqestResponse(ctx);

        const result = await getLinkedAuthProviders(userSession);
        return ctx.json(result.data, result.status);
    } catch (err) {
        console.error(err);
        return serverErrorResponse(ctx);
    }
}

async function session_delete(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        const targetSessionId = ctx.get(REQ_BODY_NAMESPACE)?.sessionId || userSession?.sessionId;
        if (!userSession?.id || !targetSessionId) {
            return invalidReqestResponse(ctx, "Session id is required");
        }

        const result = await deleteUserSession(ctx, userSession, targetSessionId);
        return ctx.json(result.data, result.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function revokeSession_delete(ctx: Context) {
    try {
        const code = ctx.req.param("revokeCode");
        if (!code) return invalidReqestResponse(ctx);

        const result = await revokeSessionFromAccessCode(ctx, code);
        return ctx.json(result.data, result.status);
    } catch (err) {
        console.error(err);
        return serverErrorResponse(ctx);
    }
}

export default authRouter;

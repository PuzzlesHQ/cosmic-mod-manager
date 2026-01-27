import { authProvidersList } from "@app/utils/config/project";
import { getAuthProviderFromString, getUserRoleFromString } from "@app/utils/convertors";
import { API_SCOPE, hasScope } from "@app/utils/pats";
import { loginFormSchema } from "@app/utils/schemas/auth";
import { zodParse } from "@app/utils/schemas/utils";
import { AuthActionIntent, type AuthProvider, type LoggedInUserData } from "@app/utils/types";
import { type Context, Hono } from "hono";
import { AuthenticationMiddleware, LoginProtectedRoute } from "~/middleware/auth";
import { getReqRateLimiter, strictGetReqRateLimiter } from "~/middleware/rate-limit/get-req";
import { invalidAuthAttemptLimiter } from "~/middleware/rate-limit/invalid-auth-attempt";
import { critModifyReqRateLimiter } from "~/middleware/rate-limit/modify-req";
import { REQ_BODY_NAMESPACE } from "~/types/namespaces";
import { HTTP_STATUS, invalidRequestResponse, serverErrorResponse, unauthenticatedReqResponse } from "~/utils/http";
import { getSessionUser } from "~/utils/router";
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
    .get("/signin/:authProvider", strictGetReqRateLimiter, async (ctx: Context) =>
        oAuthUrl_get(ctx, AuthActionIntent.SIGN_IN),
    )
    .get("/signup/:authProvider", strictGetReqRateLimiter, async (ctx: Context) =>
        oAuthUrl_get(ctx, AuthActionIntent.SIGN_UP),
    )
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
        const sessionUser = getSessionUser(ctx, API_SCOPE.USER_READ);
        if (!sessionUser) return unauthenticatedReqResponse(ctx, "You're not logged in!");

        const formattedObject = {
            id: sessionUser.id,
            email: sessionUser.email,
            userName: sessionUser.userName,
            name: sessionUser.name,
            role: getUserRoleFromString(sessionUser.role),
            hasAPassword: !!sessionUser.password,
            avatar: userFileUrl(sessionUser.id, sessionUser.avatar),
            bio: sessionUser.bio,
            profilePageBg: userFileUrl(sessionUser.id, sessionUser.profilePageBg),
            sessionId: sessionUser.sessionId,
            patId: sessionUser.patID,
        } satisfies LoggedInUserData;

        if (!hasScope(sessionUser.apiScopes, API_SCOPE.USER_READ_EMAIL)) {
            formattedObject.email = "";
            Object.defineProperty(formattedObject, "email", { enumerable: false });
        }

        return ctx.json(formattedObject, HTTP_STATUS.OK);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function oAuthUrl_get(ctx: Context, intent: AuthActionIntent) {
    try {
        const sessionUser = getSessionUser(ctx);
        if (sessionUser?.id && intent !== AuthActionIntent.LINK)
            return invalidRequestResponse(ctx, "You are already logged in!");

        const authProvider = ctx.req.param("authProvider");
        if (!authProvider) return invalidRequestResponse(ctx, "Invalid auth provider");

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
        const { data, error } = await zodParse(loginFormSchema, ctx.get(REQ_BODY_NAMESPACE));
        if (error || !data) return invalidRequestResponse(ctx, error);

        const result = await credentialSignIn(ctx, data);
        return ctx.json(result.data, result.status);
    } catch (err) {
        console.error(err);
        return serverErrorResponse(ctx);
    }
}

async function oAuthSignIn_post(ctx: Context) {
    try {
        if (getSessionUser(ctx)?.id) {
            return invalidRequestResponse(ctx);
        }

        const authProvider = ctx.req.param("authProvider");
        const code = ctx.get(REQ_BODY_NAMESPACE)?.code;

        if (!authProvidersList.includes(authProvider.toLowerCase() as AuthProvider) || !code) {
            return invalidRequestResponse(ctx);
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
        if (getSessionUser(ctx)?.id) {
            return invalidRequestResponse(ctx);
        }

        const authProvider = ctx.req.param("authProvider");
        const code = ctx.get(REQ_BODY_NAMESPACE)?.code;
        if (!authProvidersList.includes(authProvider.toLowerCase() as AuthProvider) || !code) {
            return invalidRequestResponse(ctx);
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
        const sessionUser = getSessionUser(ctx);
        if (!sessionUser?.id) {
            return invalidRequestResponse(ctx);
        }

        const authProvider = ctx.req.param("authProvider");
        const code = ctx.get(REQ_BODY_NAMESPACE)?.code;
        if (!authProvidersList.includes(getAuthProviderFromString(authProvider)) || !code) {
            return invalidRequestResponse(ctx);
        }

        const result = await linkAuthProviderHandler(ctx, sessionUser, authProvider, code);
        return ctx.json(result.data, result.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function oAuthLinkProvider_delete(ctx: Context) {
    try {
        const sessionUser = getSessionUser(ctx, API_SCOPE.USER_AUTH_WRITE);
        if (!sessionUser?.id) {
            return invalidRequestResponse(ctx);
        }

        const authProvider = ctx.req.param("authProvider");
        const result = await unlinkAuthProvider(ctx, sessionUser, authProvider);
        return ctx.json(result.data, result.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function sessions_get(ctx: Context) {
    try {
        const sessionUser = getSessionUser(ctx, API_SCOPE.USER_SESSION_READ);
        if (!sessionUser) return unauthenticatedReqResponse(ctx);

        const result = await getUserSessions(sessionUser);
        return ctx.json(result.data, result.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function linkedProviders_get(ctx: Context) {
    try {
        const sessionUser = getSessionUser(ctx, API_SCOPE.USER_READ, API_SCOPE.USER_READ_EMAIL);
        if (!sessionUser?.id) return invalidRequestResponse(ctx);

        const result = await getLinkedAuthProviders(sessionUser);
        return ctx.json(result.data, result.status);
    } catch (err) {
        console.error(err);
        return serverErrorResponse(ctx);
    }
}

async function session_delete(ctx: Context) {
    try {
        const sessionUser = getSessionUser(ctx, API_SCOPE.USER_SESSION_DELETE);
        if (!sessionUser) return unauthenticatedReqResponse(ctx);

        const targetSessionId = ctx.get(REQ_BODY_NAMESPACE)?.sessionId || sessionUser?.sessionId;
        if (!targetSessionId) return invalidRequestResponse(ctx, "Session id is required");

        const result = await deleteUserSession(ctx, sessionUser, targetSessionId);
        return ctx.json(result.data, result.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function revokeSession_delete(ctx: Context) {
    try {
        const code = ctx.req.param("revokeCode");
        if (!code) return invalidRequestResponse(ctx);

        const result = await revokeSessionFromAccessCode(ctx, code);
        return ctx.json(result.data, result.status);
    } catch (err) {
        console.error(err);
        return serverErrorResponse(ctx);
    }
}

export default authRouter;

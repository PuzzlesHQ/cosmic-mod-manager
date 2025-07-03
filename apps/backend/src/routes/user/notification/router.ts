import { decodeStringArray } from "@app/utils/string";
import { type Context, Hono } from "hono";
import { AuthenticationMiddleware, LoginProtectedRoute } from "~/middleware/auth";
import { getReqRateLimiter } from "~/middleware/rate-limit/get-req";
import { invalidAuthAttemptLimiter } from "~/middleware/rate-limit/invalid-auth-attempt";
import { modifyReqRateLimiter } from "~/middleware/rate-limit/modify-req";
import {
    deleteNotifications,
    getNotificationById,
    getUserNotifications,
    markNotificationAsRead as markNotificationsAsRead,
} from "~/routes/user/notification/controllers";
import { invalidReqestResponse, serverErrorResponse } from "~/utils/http";
import { getUserFromCtx } from "~/utils/router";

const notificationRouter = new Hono()
    .use(invalidAuthAttemptLimiter)
    .use(AuthenticationMiddleware)
    .use(LoginProtectedRoute)

    .get("/", getReqRateLimiter, userNotifications_get)
    .patch("/", modifyReqRateLimiter, bulkNotifications_patch)
    .delete("/", modifyReqRateLimiter, bulkNotifications_delete)
    .get("/:notifId", getReqRateLimiter, notification_get)
    .patch("/:notifId", modifyReqRateLimiter, notification_patch)
    .delete("/:notifId", modifyReqRateLimiter, notification_delete);

async function userNotifications_get(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        const userSlug = ctx.req.param("userId") || userSession?.id;
        if (!userSession || !userSlug) {
            return invalidReqestResponse(ctx, "User session not found");
        }

        const res = await getUserNotifications(ctx, userSession, userSlug);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function notification_get(ctx: Context) {
    try {
        const notifId = ctx.req.param("notifId");
        const userSession = getUserFromCtx(ctx);

        if (!userSession || !notifId) {
            return invalidReqestResponse(ctx);
        }

        const res = await getNotificationById(ctx, userSession, notifId);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function notification_patch(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        const userSlug = ctx.req.param("userId") || userSession?.id;
        const notificationId = ctx.req.param("notifId");

        if (!userSession || !userSlug || !notificationId) {
            return invalidReqestResponse(ctx);
        }

        const res = await markNotificationsAsRead(ctx, userSession, [notificationId], userSlug);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function bulkNotifications_patch(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        const userSlug = ctx.req.param("userId") || userSession?.id;
        const notificationIds = decodeStringArray(ctx.req.query("ids"));

        if (!userSession || !userSlug || !notificationIds.length) {
            return invalidReqestResponse(ctx);
        }

        const res = await markNotificationsAsRead(ctx, userSession, notificationIds, userSlug);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function notification_delete(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        const userSlug = ctx.req.param("userId") || userSession?.id;
        const notifId = ctx.req.param("notifId");

        if (!userSession || !userSlug || !notifId) {
            return invalidReqestResponse(ctx);
        }

        const res = await deleteNotifications(ctx, userSession, userSlug, [notifId]);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function bulkNotifications_delete(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        const userSlug = ctx.req.param("userId") || userSession?.id;
        const notificationIds = decodeStringArray(ctx.req.query("ids"));

        if (!userSession || !userSlug || !notificationIds.length) {
            return invalidReqestResponse(ctx);
        }

        const res = await deleteNotifications(ctx, userSession, userSlug, notificationIds);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

export default notificationRouter;

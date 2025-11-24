import { API_SCOPE } from "@app/utils/pats";
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
import { invalidRequestResponse, serverErrorResponse, unauthenticatedReqResponse } from "~/utils/http";
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
        const user = getUserFromCtx(ctx, API_SCOPE.USER_READ, API_SCOPE.NOTIFICATION_READ);
        if (!user) return unauthenticatedReqResponse(ctx);

        const userSlug = ctx.req.param("userId") || user?.id;
        if (!userSlug) return invalidRequestResponse(ctx, "User session not found");

        const res = await getUserNotifications(ctx, user, userSlug);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function notification_get(ctx: Context) {
    try {
        const user = getUserFromCtx(ctx, API_SCOPE.NOTIFICATION_READ);
        if (!user) return unauthenticatedReqResponse(ctx);

        const notifId = ctx.req.param("notifId");
        if (!notifId) return invalidRequestResponse(ctx);

        const res = await getNotificationById(ctx, user, notifId);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function notification_patch(ctx: Context) {
    try {
        const user = getUserFromCtx(ctx, API_SCOPE.NOTIFICATION_WRITE);
        if (!user) return unauthenticatedReqResponse(ctx);

        const userSlug = ctx.req.param("userId") || user?.id;
        const notificationId = ctx.req.param("notifId");

        if (!userSlug || !notificationId) {
            return invalidRequestResponse(ctx);
        }

        const res = await markNotificationsAsRead(ctx, user, [notificationId], userSlug);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function bulkNotifications_patch(ctx: Context) {
    try {
        const user = getUserFromCtx(ctx, API_SCOPE.NOTIFICATION_WRITE);
        if (!user) return unauthenticatedReqResponse(ctx);

        const userSlug = ctx.req.param("userId") || user?.id;
        const notificationIds = decodeStringArray(ctx.req.query("ids"));
        if (!userSlug || !notificationIds.length) return invalidRequestResponse(ctx);

        const res = await markNotificationsAsRead(ctx, user, notificationIds, userSlug);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function notification_delete(ctx: Context) {
    try {
        const user = getUserFromCtx(ctx, API_SCOPE.NOTIFICATION_DELETE);
        if (!user) return unauthenticatedReqResponse(ctx);

        const userSlug = ctx.req.param("userId") || user?.id;
        const notifId = ctx.req.param("notifId");
        if (!userSlug || !notifId) return invalidRequestResponse(ctx);

        const res = await deleteNotifications(ctx, user, userSlug, [notifId]);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function bulkNotifications_delete(ctx: Context) {
    try {
        const user = getUserFromCtx(ctx, API_SCOPE.NOTIFICATION_DELETE);
        if (!user) return unauthenticatedReqResponse(ctx);

        const userSlug = ctx.req.param("userId") || user?.id;
        const notificationIds = decodeStringArray(ctx.req.query("ids"));
        if (!userSlug || !notificationIds.length) return invalidRequestResponse(ctx);

        const res = await deleteNotifications(ctx, user, userSlug, notificationIds);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

export default notificationRouter;

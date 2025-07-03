import { isModerator } from "@app/utils/constants/roles";
import { newReportFormSchema } from "@app/utils/schemas/report";
import { parseInput } from "@app/utils/schemas/utils";
import type { ReportItemType } from "@app/utils/types/api/report";
import { type Context, Hono } from "hono";
import { AuthenticationMiddleware, LoginProtectedRoute } from "~/middleware/auth";
import { invalidAuthAttemptLimiter } from "~/middleware/rate-limit/invalid-auth-attempt";
import { REQ_BODY_NAMESPACE } from "~/types/namespaces";
import { invalidReqestResponse, serverErrorResponse, unauthorizedReqResponse } from "~/utils/http";
import { getUserFromCtx } from "~/utils/router";
import { createReport, getExistingReport, getAllUserReports as getManyReports, getReportData, patchReport } from "./controllers";

const reportRouter = new Hono()
    .use(invalidAuthAttemptLimiter)
    .use(AuthenticationMiddleware)
    .use(LoginProtectedRoute)
    .post("/", report_post)
    .get("/", userReports_get)
    .get("/getAll", getAllReports)
    .get("/existingReport", existingReport_get)
    .get("/:reportId", report_get)
    .patch("/:reportId", report_patch);

async function report_post(ctx: Context) {
    try {
        const user = getUserFromCtx(ctx);
        if (!user?.id) return unauthorizedReqResponse(ctx);

        const { error, data } = await parseInput(newReportFormSchema, ctx.get(REQ_BODY_NAMESPACE));
        if (error || !data) {
            return invalidReqestResponse(ctx, error);
        }

        const res = await createReport(data, user);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function userReports_get(ctx: Context) {
    try {
        const url = new URL(ctx.req.url);
        const userId = url.searchParams.get("userId");

        const user = getUserFromCtx(ctx);
        if (!user?.id) return unauthorizedReqResponse(ctx);

        const res = await getManyReports(user, userId || user.id);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function getAllReports(ctx: Context) {
    try {
        const user = getUserFromCtx(ctx);
        if (!user?.id || !isModerator(user.role)) return unauthorizedReqResponse(ctx);

        const res = await getManyReports(user);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function existingReport_get(ctx: Context) {
    try {
        const reqUrl = new URL(ctx.req.url);
        const itemType = reqUrl.searchParams.get("itemType");
        const itemId = reqUrl.searchParams.get("itemId");
        if (!itemType || !itemId) return invalidReqestResponse(ctx, "Item type and item ID are required.");

        const user = getUserFromCtx(ctx);
        if (!user?.id) return unauthorizedReqResponse(ctx);

        const res = await getExistingReport(itemType as ReportItemType, itemId, user);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function report_get(ctx: Context) {
    try {
        const reportId = ctx.req.param("reportId");
        if (!reportId) return invalidReqestResponse(ctx, "Report ID is required.");

        const user = getUserFromCtx(ctx);
        if (!user?.id) return unauthorizedReqResponse(ctx);

        const res = await getReportData(reportId, user);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function report_patch(ctx: Context) {
    try {
        const reportId = ctx.req.param("reportId");
        if (!reportId) return invalidReqestResponse(ctx, "Report ID is required.");

        const user = getUserFromCtx(ctx);
        if (!user?.id) return unauthorizedReqResponse(ctx);

        const res = await patchReport(reportId, ctx.get(REQ_BODY_NAMESPACE).closed === true, user);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

export default reportRouter;

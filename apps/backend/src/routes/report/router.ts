import { isModerator } from "@app/utils/constants/roles";
import { API_SCOPE } from "@app/utils/pats";
import { newReportFormSchema } from "@app/utils/schemas/report";
import { zodParse } from "@app/utils/schemas/utils";
import { decodeStringArray } from "@app/utils/string";
import { type ReportItemType, reportFilters_defaults } from "@app/utils/types/api/report";
import { type Context, Hono } from "hono";
import { AuthenticationMiddleware, LoginProtectedRoute } from "~/middleware/auth";
import { invalidAuthAttemptLimiter } from "~/middleware/rate-limit/invalid-auth-attempt";
import { REQ_BODY_NAMESPACE } from "~/types/namespaces";
import {
    invalidRequestResponse,
    serverErrorResponse,
    unauthenticatedReqResponse,
    unauthorizedReqResponse,
} from "~/utils/http";
import { getUserFromCtx } from "~/utils/router";
import {
    createReport,
    getExistingReport,
    getAllUserReports as getManyReports,
    getReportData,
    patchReport,
} from "./controllers";

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
        const user = getUserFromCtx(ctx, API_SCOPE.REPORT_CREATE);
        if (!user) return unauthenticatedReqResponse(ctx);

        const { error, data } = await zodParse(newReportFormSchema, ctx.get(REQ_BODY_NAMESPACE));
        if (error || !data) {
            return invalidRequestResponse(ctx, error);
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
        const user = getUserFromCtx(ctx, API_SCOPE.REPORT_READ);
        if (!user?.id) return unauthenticatedReqResponse(ctx);

        const url = new URL(ctx.req.url);
        const userId = url.searchParams.get("userId");

        const res = await getManyReports(user, userId || user.id);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function getAllReports(ctx: Context) {
    try {
        const user = getUserFromCtx(ctx, API_SCOPE.REPORT_READ);
        if (!user?.id || !isModerator(user.role)) return unauthorizedReqResponse(ctx);

        const filters = { ...reportFilters_defaults };
        const reqUrl = new URL(ctx.req.url);

        for (const key of Object.keys(filters) as (keyof typeof reportFilters_defaults)[]) {
            const value = reqUrl.searchParams.get(key);
            if (!value?.length) continue;

            const defaultValue = reportFilters_defaults[key];

            if (Array.isArray(defaultValue)) {
                // @ts-expect-error - TypeScript doesn't know that value is of the correct type
                filters[key] = decodeStringArray(value);
            } else if (value !== defaultValue) {
                // @ts-expect-error - TypeScript doesn't know that value is of the correct type
                filters[key] = value;
            }
        }

        const res = await getManyReports(user, undefined, filters);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function existingReport_get(ctx: Context) {
    try {
        const user = getUserFromCtx(ctx, API_SCOPE.REPORT_READ);
        if (!user) return unauthenticatedReqResponse(ctx);

        const reqUrl = new URL(ctx.req.url);
        const itemType = reqUrl.searchParams.get("itemType");
        const itemId = reqUrl.searchParams.get("itemId");
        if (!itemType || !itemId) return invalidRequestResponse(ctx, "Item type and item ID are required.");

        const res = await getExistingReport(itemType as ReportItemType, itemId, user);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function report_get(ctx: Context) {
    try {
        const user = getUserFromCtx(ctx, API_SCOPE.REPORT_READ);
        if (!user) return unauthenticatedReqResponse(ctx);

        const reportId = ctx.req.param("reportId");
        if (!reportId) return invalidRequestResponse(ctx, "Report ID is required.");

        const res = await getReportData(reportId, user);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function report_patch(ctx: Context) {
    try {
        const user = getUserFromCtx(ctx, API_SCOPE.REPORT_WRITE);
        if (!user) return unauthenticatedReqResponse(ctx);

        const reportId = ctx.req.param("reportId");
        if (!reportId) return invalidRequestResponse(ctx, "Report ID is required.");

        const res = await patchReport(reportId, ctx.get(REQ_BODY_NAMESPACE).closed === true, user);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

export default reportRouter;

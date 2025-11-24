import { API_SCOPE } from "@app/utils/pats";
import { overrideOrgMemberFormSchema, updateTeamMemberFormSchema } from "@app/utils/schemas/project/settings/members";
import { zodParse } from "@app/utils/schemas/utils";
import { type Context, Hono } from "hono";
import { AuthenticationMiddleware, LoginProtectedRoute } from "~/middleware/auth";
import { invalidAuthAttemptLimiter } from "~/middleware/rate-limit/invalid-auth-attempt";
import { critModifyReqRateLimiter } from "~/middleware/rate-limit/modify-req";
import { REQ_BODY_NAMESPACE } from "~/types/namespaces";
import { invalidRequestResponse, serverErrorResponse, unauthenticatedReqResponse } from "~/utils/http";
import { getUserFromCtx } from "~/utils/router";
import {
    acceptProjectTeamInvite,
    editProjectMember,
    inviteMember,
    leaveProjectTeam,
    overrideOrgMember,
    removeProjectMember,
} from "./controllers";
import { changeTeamOwner } from "./controllers/change-owners";

const teamRouter = new Hono()
    .use(invalidAuthAttemptLimiter)
    .use(AuthenticationMiddleware)

    // ? Planned
    // teamRouter.get("/:teamId/owner", teamOwner_get)
    // teamRouter.get("/:teamId/members", teamMembers_get)
    // teamRouter.get(":teamId/members/:memberSlug", teamMember_get)

    .post("/:teamId/invite", critModifyReqRateLimiter, LoginProtectedRoute, teamInvite_post)
    .patch("/:teamId/invite", critModifyReqRateLimiter, LoginProtectedRoute, teamInvite_patch)
    .post("/:teamId/leave", critModifyReqRateLimiter, LoginProtectedRoute, teamLeave_post)

    .patch("/:teamId/owner", critModifyReqRateLimiter, LoginProtectedRoute, teamOwner_patch)
    .post(":teamId/members", critModifyReqRateLimiter, LoginProtectedRoute, teamMembers_post)
    .patch("/:teamId/member/:memberId", critModifyReqRateLimiter, LoginProtectedRoute, teamMember_patch)
    .delete("/:teamId/member/:memberId", critModifyReqRateLimiter, LoginProtectedRoute, teamMember_delete);

async function teamInvite_post(ctx: Context) {
    try {
        // a team can either be a project team or an organization team
        // so need to check for both scopes
        const user = getUserFromCtx(ctx, API_SCOPE.PROJECT_WRITE, API_SCOPE.ORGANIZATION_WRITE);
        if (!user) return unauthenticatedReqResponse(ctx);

        const teamId = ctx.req.param("teamId");
        const userName = ctx.get(REQ_BODY_NAMESPACE)?.userName;
        if (!userName || !teamId) return invalidRequestResponse(ctx);

        const res = await inviteMember(ctx, user, userName, teamId);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function teamInvite_patch(ctx: Context) {
    try {
        const user = getUserFromCtx(ctx, API_SCOPE.USER_WRITE);
        if (!user) return unauthenticatedReqResponse(ctx);

        const teamId = ctx.req.param("teamId");
        if (!teamId) return invalidRequestResponse(ctx);

        const res = await acceptProjectTeamInvite(ctx, user, teamId);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function teamLeave_post(ctx: Context) {
    try {
        const user = getUserFromCtx(ctx, API_SCOPE.USER_WRITE);
        if (!user) return unauthenticatedReqResponse(ctx);

        const teamId = ctx.req.param("teamId");
        if (!teamId) return invalidRequestResponse(ctx);

        const res = await leaveProjectTeam(ctx, user, teamId);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function teamOwner_patch(ctx: Context) {
    try {
        const user = getUserFromCtx(ctx, API_SCOPE.PROJECT_WRITE, API_SCOPE.ORGANIZATION_WRITE);
        if (!user) return unauthenticatedReqResponse(ctx);

        const { teamId } = ctx.req.param();
        const newOwner = ctx.get(REQ_BODY_NAMESPACE)?.userId;
        if (!teamId || !newOwner) return invalidRequestResponse(ctx);

        const res = await changeTeamOwner(ctx, user, teamId, newOwner);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function teamMembers_post(ctx: Context) {
    try {
        const user = getUserFromCtx(ctx, API_SCOPE.PROJECT_WRITE, API_SCOPE.ORGANIZATION_WRITE);
        if (!user) return unauthenticatedReqResponse(ctx);

        const { teamId } = ctx.req.param();
        if (!teamId) return invalidRequestResponse(ctx);

        const { data, error } = await zodParse(overrideOrgMemberFormSchema, ctx.get(REQ_BODY_NAMESPACE));
        if (error || !data) return invalidRequestResponse(ctx, error);

        const res = await overrideOrgMember(ctx, user, teamId, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function teamMember_patch(ctx: Context) {
    try {
        const user = getUserFromCtx(ctx, API_SCOPE.PROJECT_WRITE, API_SCOPE.ORGANIZATION_WRITE);
        if (!user) return unauthenticatedReqResponse(ctx);

        const { teamId, memberId } = ctx.req.param();
        if (!memberId || !teamId) return invalidRequestResponse(ctx);

        const { data, error } = await zodParse(updateTeamMemberFormSchema, ctx.get(REQ_BODY_NAMESPACE));
        if (error || !data) return invalidRequestResponse(ctx, error);

        const res = await editProjectMember(ctx, user, memberId, teamId, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function teamMember_delete(ctx: Context) {
    try {
        const user = getUserFromCtx(ctx, API_SCOPE.PROJECT_WRITE, API_SCOPE.ORGANIZATION_WRITE);
        if (!user) return unauthenticatedReqResponse(ctx);

        const { teamId, memberId } = ctx.req.param();
        if (!memberId || !teamId) return invalidRequestResponse(ctx);

        const res = await removeProjectMember(ctx, user, memberId, teamId);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

export default teamRouter;

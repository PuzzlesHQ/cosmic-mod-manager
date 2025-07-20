import { iconFieldSchema } from "@app/utils/schemas";
import { createOrganisationFormSchema } from "@app/utils/schemas/organisation";
import { orgSettingsFormSchema } from "@app/utils/schemas/organisation/settings/general";
import { zodParse } from "@app/utils/schemas/utils";
import { type Context, Hono } from "hono";
import type { z } from "zod/v4";
import { AuthenticationMiddleware, LoginProtectedRoute } from "~/middleware/auth";
import { strictGetReqRateLimiter } from "~/middleware/rate-limit/get-req";
import { invalidAuthAttemptLimiter } from "~/middleware/rate-limit/invalid-auth-attempt";
import { critModifyReqRateLimiter } from "~/middleware/rate-limit/modify-req";
import { REQ_BODY_NAMESPACE } from "~/types/namespaces";
import { invalidReqestResponse, serverErrorResponse, unauthorizedReqResponse } from "~/utils/http";
import { getUserFromCtx } from "~/utils/router";
import { createOrganisation, getOrganisationById, getOrganisationProjects, getUserOrganisations } from "./controllers";
import {
    addProjectToOrganisation,
    deleteOrg,
    deleteOrgIcon,
    removeProjectFromOrg,
    updateOrg,
    updateOrgIcon,
} from "./controllers/modify-org";

const orgRouter = new Hono()
    .use(invalidAuthAttemptLimiter)
    .use(AuthenticationMiddleware)

    .get("/", strictGetReqRateLimiter, userOrganisations_get)
    .post("/", critModifyReqRateLimiter, LoginProtectedRoute, organisation_post)
    .get("/:orgId", strictGetReqRateLimiter, organisation_get)
    .get("/:orgId/projects", strictGetReqRateLimiter, organisationProjects_get)

    .patch("/:orgId", critModifyReqRateLimiter, LoginProtectedRoute, organisation_patch)
    .delete("/:orgId", critModifyReqRateLimiter, LoginProtectedRoute, organisation_delete)
    .patch("/:orgId/icon", critModifyReqRateLimiter, LoginProtectedRoute, organisationIcon_patch)
    .delete("/:orgId/icon", critModifyReqRateLimiter, LoginProtectedRoute, organisationIcon_delete)
    .post("/:orgId/projects", critModifyReqRateLimiter, LoginProtectedRoute, organisationProjects_post)

    .delete("/:orgId/project/:projectId", critModifyReqRateLimiter, LoginProtectedRoute, organisationProjects_delete);

async function userOrganisations_get(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        const userId = ctx.req.param("userId") || userSession?.id;
        if (!userId) {
            return invalidReqestResponse(ctx);
        }

        const res = await getUserOrganisations(userSession, userId);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function organisation_post(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        if (!userSession) {
            return unauthorizedReqResponse(ctx);
        }

        const body = ctx.get(REQ_BODY_NAMESPACE);
        const { data, error } = await zodParse(createOrganisationFormSchema, body);
        if (!data || error) return invalidReqestResponse(ctx, error);

        const res = await createOrganisation(userSession, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function organisation_get(ctx: Context) {
    try {
        const orgId = ctx.req.param("orgId");
        const userSession = getUserFromCtx(ctx);
        if (!orgId) {
            return invalidReqestResponse(ctx);
        }

        const res = await getOrganisationById(userSession, orgId);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function organisation_delete(ctx: Context) {
    try {
        const orgId = ctx.req.param("orgId");
        const userSession = getUserFromCtx(ctx);
        if (!orgId || !userSession) {
            return invalidReqestResponse(ctx);
        }

        const res = await deleteOrg(ctx, userSession, orgId);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function organisation_patch(ctx: Context) {
    try {
        const orgId = ctx.req.param("orgId");
        const userSession = getUserFromCtx(ctx);
        if (!orgId || !userSession) {
            return invalidReqestResponse(ctx);
        }

        const formData = ctx.get(REQ_BODY_NAMESPACE);
        const obj = {
            icon: formData.get("icon"),
            name: formData.get("name"),
            slug: formData.get("slug"),
            description: formData.get("description"),
        } satisfies z.infer<typeof orgSettingsFormSchema>;

        const { data, error } = await zodParse(orgSettingsFormSchema, obj);
        if (error || !data) return invalidReqestResponse(ctx, error);

        const res = await updateOrg(ctx, userSession, orgId, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function organisationProjects_get(ctx: Context) {
    try {
        const listedOnly = ctx.req.query("listedOnly") === "true";
        const orgId = ctx.req.param("orgId");
        const userSession = getUserFromCtx(ctx);
        if (!orgId) {
            return invalidReqestResponse(ctx);
        }

        const res = await getOrganisationProjects(userSession, orgId, listedOnly);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function organisationIcon_patch(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        const orgId = ctx.req.param("orgId");

        const formData = ctx.get(REQ_BODY_NAMESPACE);
        const icon = formData.get("icon");

        if (!userSession || !orgId || !icon || !(icon instanceof File)) return invalidReqestResponse(ctx, "Invalid data");

        const { data, error } = await zodParse(iconFieldSchema, icon);
        if (error || !data) return invalidReqestResponse(ctx, error);

        const res = await updateOrgIcon(ctx, userSession, orgId, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function organisationIcon_delete(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        const orgId = ctx.req.param("orgId");

        if (!userSession || !orgId) return invalidReqestResponse(ctx, "Invalid data");
        const res = await deleteOrgIcon(ctx, userSession, orgId);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function organisationProjects_post(ctx: Context) {
    try {
        const orgId = ctx.req.param("orgId");
        const userSession = getUserFromCtx(ctx);
        if (!orgId || !userSession) {
            return invalidReqestResponse(ctx);
        }

        const projectId = ctx.get(REQ_BODY_NAMESPACE)?.projectId;
        if (!projectId || typeof projectId !== "string") {
            return invalidReqestResponse(ctx, "Invalid data");
        }

        const res = await addProjectToOrganisation(userSession, orgId, projectId);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function organisationProjects_delete(ctx: Context) {
    try {
        const projectId = ctx.req.param("projectId");
        const orgId = ctx.req.param("orgId");
        const userSession = getUserFromCtx(ctx);

        if (!orgId || !projectId || !userSession) {
            return invalidReqestResponse(ctx);
        }

        const res = await removeProjectFromOrg(ctx, userSession, orgId, projectId);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

export default orgRouter;

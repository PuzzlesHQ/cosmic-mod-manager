import { createCollectionFormSchema, updateCollectionFormSchema } from "@app/utils/schemas/collections";
import { zodParse } from "@app/utils/schemas/utils";
import { type Context, Hono } from "hono";
import { AuthenticationMiddleware, LoginProtectedRoute } from "~/middleware/auth";
import { getReqRateLimiter } from "~/middleware/rate-limit/get-req";
import { invalidAuthAttemptLimiter } from "~/middleware/rate-limit/invalid-auth-attempt";
import { critModifyReqRateLimiter } from "~/middleware/rate-limit/modify-req";
import { REQ_BODY_NAMESPACE } from "~/types/namespaces";
import { invalidReqestResponse, serverErrorResponse, unauthenticatedReqResponse } from "~/utils/http";
import { getUserFromCtx } from "~/utils/router";
import {
    AddProjectsToCollection,
    CreateNewCollection,
    DeleteProjectsFromCollection,
    deleteUserCollection,
    editUserCollectionDetails,
    GetCollectionOwner,
    GetCollectionProjects,
    GetUserCollection_ByCollectionId,
    GetUserCollections,
} from "./controllers";

const collectionsRouter = new Hono()
    .use(invalidAuthAttemptLimiter)
    .use(AuthenticationMiddleware)

    .get("/", getReqRateLimiter, collections_get)
    .get("/:collectionId/owner", getReqRateLimiter, collectionOwner_get)
    .post("/", critModifyReqRateLimiter, LoginProtectedRoute, collection_post)

    .get("/:collectionId", getReqRateLimiter, collection_byID_get)
    .patch("/:collectionId", critModifyReqRateLimiter, LoginProtectedRoute, collection_byID_patch)
    .delete("/:collectionId", critModifyReqRateLimiter, LoginProtectedRoute, collection_byID_delete)

    .get("/:collectionId/projects", getReqRateLimiter, collectionProjects_get)
    .patch("/:collectionId/projects", critModifyReqRateLimiter, LoginProtectedRoute, collectionProjects_patch)
    .delete("/:collectionId/projects", critModifyReqRateLimiter, LoginProtectedRoute, collectionProjects_delete);

async function collections_get(ctx: Context) {
    try {
        const user = getUserFromCtx(ctx);
        if (!user?.id) return unauthenticatedReqResponse(ctx);

        const res = await GetUserCollections(user.id, user);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function collection_post(ctx: Context) {
    try {
        const user = getUserFromCtx(ctx);
        if (!user?.id) return invalidReqestResponse(ctx);

        const { data, error } = await zodParse(createCollectionFormSchema, ctx.get(REQ_BODY_NAMESPACE));
        if (!data || error) return invalidReqestResponse(ctx, error);

        const res = await CreateNewCollection(data, user);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function collection_byID_get(ctx: Context) {
    try {
        const collectionId = ctx.req.param("collectionId");
        if (!collectionId) return invalidReqestResponse(ctx);

        const user = getUserFromCtx(ctx);

        const res = await GetUserCollection_ByCollectionId(collectionId, user);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function collection_byID_patch(ctx: Context) {
    try {
        const collectionId = ctx.req.param("collectionId");
        const user = getUserFromCtx(ctx);
        if (!collectionId || !user?.id) return invalidReqestResponse(ctx);

        const formData = ctx.get(REQ_BODY_NAMESPACE);
        if (!formData) return invalidReqestResponse(ctx);

        const obj = {
            name: formData.get("name"),
            description: formData.get("description"),
            visibility: formData.get("visibility"),
            icon: formData.get("icon"),
        };
        const { data, error } = await zodParse(updateCollectionFormSchema, obj);
        if (!data || error) return invalidReqestResponse(ctx, error);

        const res = await editUserCollectionDetails(data, collectionId, user);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function collection_byID_delete(ctx: Context) {
    try {
        const collectionId = ctx.req.param("collectionId");
        const user = getUserFromCtx(ctx);
        if (!collectionId || !user?.id) return invalidReqestResponse(ctx);

        const res = await deleteUserCollection(collectionId, user);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function collectionProjects_get(ctx: Context) {
    try {
        const collectionId = ctx.req.param("collectionId");
        if (!collectionId) return invalidReqestResponse(ctx);

        const user = getUserFromCtx(ctx);

        const res = await GetCollectionProjects(collectionId, user);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function collectionOwner_get(ctx: Context) {
    try {
        const collectionId = ctx.req.param("collectionId");
        if (!collectionId) return invalidReqestResponse(ctx);

        const user = getUserFromCtx(ctx);

        const res = await GetCollectionOwner(collectionId, user);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function collectionProjects_patch(ctx: Context) {
    try {
        const collectionId = ctx.req.param("collectionId");
        const user = getUserFromCtx(ctx);
        if (!collectionId || !user?.id) return invalidReqestResponse(ctx);

        const projects = ctx.get(REQ_BODY_NAMESPACE).projects as string[];
        if (!projects?.length) return invalidReqestResponse(ctx);

        const res = await AddProjectsToCollection(collectionId, projects, user);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function collectionProjects_delete(ctx: Context) {
    try {
        const collectionId = ctx.req.param("collectionId");
        const user = getUserFromCtx(ctx);
        if (!collectionId || !user?.id) return invalidReqestResponse(ctx);

        const projects = ctx.get(REQ_BODY_NAMESPACE).projects as string[];
        if (!projects?.length) return invalidReqestResponse(ctx);

        const res = await DeleteProjectsFromCollection(collectionId, projects, user);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

export default collectionsRouter;

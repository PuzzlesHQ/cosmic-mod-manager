import { iconFieldSchema } from "@app/utils/schemas";
import { newProjectFormSchema } from "@app/utils/schemas/project";
import { updateProjectTagsFormSchema } from "@app/utils/schemas/project/settings/categories";
import { updateDescriptionFormSchema } from "@app/utils/schemas/project/settings/description";
import { addNewGalleryImageFormSchema, updateGalleryImageFormSchema } from "@app/utils/schemas/project/settings/gallery";
import { generalProjectSettingsFormSchema } from "@app/utils/schemas/project/settings/general";
import { updateProjectLicenseFormSchema } from "@app/utils/schemas/project/settings/license";
import { updateExternalLinksFormSchema } from "@app/utils/schemas/project/settings/links";
import { parseInput } from "@app/utils/schemas/utils";
import type { ProjectDetailsData, ProjectVersionData } from "@app/utils/types/api";
import { type Context, Hono } from "hono";
import type { z } from "zod/v4";
import { AuthenticationMiddleware, LoginProtectedRoute } from "~/middleware/auth";
import { getReqRateLimiter, strictGetReqRateLimiter } from "~/middleware/rate-limit/get-req";
import { invalidAuthAttemptLimiter } from "~/middleware/rate-limit/invalid-auth-attempt";
import { critModifyReqRateLimiter, modifyReqRateLimiter } from "~/middleware/rate-limit/modify-req";
import { getUserFromCtx } from "~/routes/auth/helpers/session";
import { REQ_BODY_NAMESPACE } from "~/types/namespaces";
import { HTTP_STATUS, invalidReqestResponse, serverErrorResponse } from "~/utils/http";
import { getAllVisibleProjects } from "../user/controllers/profile";
import { checkProjectSlugValidity, getProjectData } from "./controllers";
import { getProjectDependencies } from "./controllers/dependency";
import { addProjectFollower, removeProjectFollower } from "./controllers/follows";
import { addNewGalleryImage, removeGalleryImage, updateGalleryImage } from "./controllers/gallery";
import { QueueProjectForApproval } from "./controllers/moderation";
import { createNewProject } from "./controllers/new-project";
import { deleteProject, deleteProjectIcon, updateProject, updateProjectIcon } from "./controllers/settings";
import { updateProjectDescription } from "./controllers/settings/description";
import { updateProjectExternalLinks, updateProjectLicense, updateProjectTags } from "./controllers/settings/general";
import { getAllProjectVersions } from "./version/controllers";
import versionRouter from "./version/router";

const projectRouter = new Hono()
    .use(invalidAuthAttemptLimiter)
    .use(AuthenticationMiddleware)

    // Get projects of the currently logged in user
    .get("/", strictGetReqRateLimiter, projects_get)

    .get("/:slug", getReqRateLimiter, project_get)
    .get("/:slug/dependencies", getReqRateLimiter, projectDependencies_get)
    .get("/:slug/check", getReqRateLimiter, projectCheck_get)

    .post("/:slug/follow", getReqRateLimiter, LoginProtectedRoute, projectFollow_post)
    .delete("/:slug/follow", critModifyReqRateLimiter, LoginProtectedRoute, projectFollow_delete)

    .post("/", critModifyReqRateLimiter, LoginProtectedRoute, project_post)
    .patch("/:slug", critModifyReqRateLimiter, LoginProtectedRoute, project_patch)
    .delete("/:slug", critModifyReqRateLimiter, LoginProtectedRoute, project_delete)
    .post("/:id/submit-for-review", critModifyReqRateLimiter, LoginProtectedRoute, project_queueForApproval_post)
    .patch("/:slug/icon", critModifyReqRateLimiter, LoginProtectedRoute, projectIcon_patch)
    .delete("/:slug/icon", critModifyReqRateLimiter, LoginProtectedRoute, projectIcon_delete)
    .patch("/:slug/description", critModifyReqRateLimiter, LoginProtectedRoute, description_patch)
    .patch("/:slug/tags", critModifyReqRateLimiter, LoginProtectedRoute, tags_patch)
    .patch("/:slug/external-links", critModifyReqRateLimiter, LoginProtectedRoute, externalLinks_patch)
    .patch("/:slug/license", critModifyReqRateLimiter, LoginProtectedRoute, license_patch)

    .post("/:slug/gallery", critModifyReqRateLimiter, LoginProtectedRoute, gallery_post)
    .patch("/:slug/gallery/:galleryId", modifyReqRateLimiter, LoginProtectedRoute, galleryItem_patch)
    .delete("/:slug/gallery/:galleryId", critModifyReqRateLimiter, LoginProtectedRoute, galleryItem_delete)

    .route("/:projectSlug/version", versionRouter);

async function projects_get(ctx: Context) {
    try {
        const listedProjectsOnly = ctx.req.query("listedOnly") === "true";
        const userSession = getUserFromCtx(ctx);
        const userName = userSession?.userName;
        if (!userName) return ctx.json({ success: false, message: "You're not logged in" }, HTTP_STATUS.UNAUTHENTICATED);

        const res = await getAllVisibleProjects(userSession, userName, listedProjectsOnly);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function project_get(ctx: Context) {
    try {
        const slug = ctx.req.param("slug");
        if (!slug) return invalidReqestResponse(ctx);
        const userSession = getUserFromCtx(ctx);

        const includeVersions = ctx.req.query("includeVersions") === "true";
        const featuredVersionsOnly = ctx.req.query("featuredOnly") === "true";
        const res = await getProjectData(slug, userSession);

        if (includeVersions !== true || !res.data.project) {
            return ctx.json(res.data, res.status);
        } else {
            // Fetch the project versions if it's to be included
            const project = res.data.project as ProjectDetailsData & { versions: ProjectVersionData[] };
            const versions = await getAllProjectVersions(slug, userSession, featuredVersionsOnly);

            if ("data" in versions.data && versions.data.data) {
                project.versions = versions.data.data;
            } else {
                project.versions = [];
            }

            return ctx.json(
                {
                    success: res.data.success,
                    message: res.data.message,
                    project: project,
                },
                res.status,
            );
        }
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function projectDependencies_get(ctx: Context) {
    try {
        const slug = ctx.req.param("slug");
        const userSession = getUserFromCtx(ctx);
        if (!slug) return invalidReqestResponse(ctx);

        const res = await getProjectDependencies(slug, userSession);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function projectCheck_get(ctx: Context) {
    try {
        const slug = ctx.req.param("slug");
        if (!slug) return invalidReqestResponse(ctx);

        const res = await checkProjectSlugValidity(slug);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function projectFollow_post(ctx: Context) {
    try {
        const slug = ctx.req.param("slug");
        const user = getUserFromCtx(ctx);
        if (!slug || !user?.id) return invalidReqestResponse(ctx);

        const res = await addProjectFollower(slug, user);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function projectFollow_delete(ctx: Context) {
    try {
        const slug = ctx.req.param("slug");
        const user = getUserFromCtx(ctx);
        if (!slug || !user?.id) return invalidReqestResponse(ctx);

        const res = await removeProjectFollower(slug, user);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function project_post(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        if (!userSession) return invalidReqestResponse(ctx);

        const { data, error } = await parseInput(newProjectFormSchema, ctx.get(REQ_BODY_NAMESPACE));
        if (error || !data) return invalidReqestResponse(ctx, error);

        const res = await createNewProject(userSession, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function project_patch(ctx: Context) {
    try {
        const slug = ctx.req.param("slug");
        if (!slug) return invalidReqestResponse(ctx);

        const userSession = getUserFromCtx(ctx);
        if (!userSession) return invalidReqestResponse(ctx);
        const formData = ctx.get(REQ_BODY_NAMESPACE);
        const obj = {
            icon: formData.get("icon"),
            name: formData.get("name"),
            slug: formData.get("slug"),
            visibility: formData.get("visibility"),
            type: JSON.parse(formData.get("type")),
            clientSide: formData.get("clientSide"),
            serverSide: formData.get("serverSide"),
            summary: formData.get("summary"),
        } satisfies z.infer<typeof generalProjectSettingsFormSchema>;

        const { data, error } = await parseInput(generalProjectSettingsFormSchema, obj);
        if (error || !data) return invalidReqestResponse(ctx, error);

        const res = await updateProject(slug, userSession, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function project_delete(ctx: Context) {
    try {
        const slug = ctx.req.param("slug");
        const userSession = getUserFromCtx(ctx);
        if (!userSession || !slug) return invalidReqestResponse(ctx);

        const res = await deleteProject(userSession, slug);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function project_queueForApproval_post(ctx: Context) {
    try {
        const id = ctx.req.param("id");
        const userSession = getUserFromCtx(ctx);
        if (!userSession || !id) return invalidReqestResponse(ctx);

        const res = await QueueProjectForApproval(id, userSession);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function projectIcon_patch(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        const slug = ctx.req.param("slug");
        const formData = ctx.get(REQ_BODY_NAMESPACE);
        const icon = formData.get("icon");

        if (!userSession || !slug || !icon || !(icon instanceof File)) return invalidReqestResponse(ctx, "Invalid data");

        const { data, error } = await parseInput(iconFieldSchema, icon);
        if (error || !data) {
            return invalidReqestResponse(ctx, error as string);
        }

        const res = await updateProjectIcon(userSession, slug, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function projectIcon_delete(ctx: Context) {
    try {
        const userSession = getUserFromCtx(ctx);
        const slug = ctx.req.param("slug");

        if (!userSession || !slug) return invalidReqestResponse(ctx, "Invalid data");
        const res = await deleteProjectIcon(userSession, slug);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function description_patch(ctx: Context) {
    try {
        const slug = ctx.req.param("slug");
        if (!slug) return invalidReqestResponse(ctx);

        const userSession = getUserFromCtx(ctx);
        if (!userSession) return invalidReqestResponse(ctx);

        const { data, error } = await parseInput(updateDescriptionFormSchema, ctx.get(REQ_BODY_NAMESPACE));
        if (error || !data) return invalidReqestResponse(ctx, error);

        const res = await updateProjectDescription(slug, userSession, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function tags_patch(ctx: Context) {
    try {
        const slug = ctx.req.param("slug");
        const userSession = getUserFromCtx(ctx);
        if (!slug || !userSession?.id) return invalidReqestResponse(ctx);

        const { data, error } = await parseInput(updateProjectTagsFormSchema, ctx.get(REQ_BODY_NAMESPACE));
        if (error || !data) return invalidReqestResponse(ctx, error);

        const res = await updateProjectTags(slug, userSession, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function externalLinks_patch(ctx: Context) {
    try {
        const slug = ctx.req.param("slug");
        const userSession = getUserFromCtx(ctx);
        if (!slug || !userSession?.id) return invalidReqestResponse(ctx);

        const { data, error } = await parseInput(updateExternalLinksFormSchema, ctx.get(REQ_BODY_NAMESPACE));
        if (error || !data) return invalidReqestResponse(ctx, error);

        const res = await updateProjectExternalLinks(userSession, slug, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function license_patch(ctx: Context) {
    try {
        const slug = ctx.req.param("slug");
        const userSession = getUserFromCtx(ctx);
        if (!slug || !userSession?.id) return invalidReqestResponse(ctx);

        const { data, error } = await parseInput(updateProjectLicenseFormSchema, ctx.get(REQ_BODY_NAMESPACE));
        if (error || !data) return invalidReqestResponse(ctx, error);

        const res = await updateProjectLicense(userSession, slug, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function gallery_post(ctx: Context) {
    try {
        const slug = ctx.req.param("slug");
        if (!slug) return invalidReqestResponse(ctx);

        const userSession = getUserFromCtx(ctx);
        if (!userSession) return invalidReqestResponse(ctx);

        const formData = ctx.get(REQ_BODY_NAMESPACE);
        const obj = {
            image: formData.get("image"),
            title: formData.get("title"),
            description: formData.get("description"),
            orderIndex: Number.parseInt(formData.get("orderIndex") || "0"),
            featured: formData.get("featured") === "true",
        };

        const { data, error } = await parseInput(addNewGalleryImageFormSchema, obj);
        if (error || !data) return invalidReqestResponse(ctx, error);

        const res = await addNewGalleryImage(slug, userSession, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function galleryItem_patch(ctx: Context) {
    try {
        const { slug, galleryId } = ctx.req.param();
        const userSession = getUserFromCtx(ctx);
        if (!slug || !galleryId || !userSession) return invalidReqestResponse(ctx);

        const { data, error } = await parseInput(updateGalleryImageFormSchema, ctx.get(REQ_BODY_NAMESPACE));
        if (error || !data) return invalidReqestResponse(ctx, error);

        const res = await updateGalleryImage(slug, userSession, galleryId, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function galleryItem_delete(ctx: Context) {
    try {
        const { slug, galleryId } = ctx.req.param();
        const userSession = getUserFromCtx(ctx);
        if (!slug || !userSession || !galleryId) return invalidReqestResponse(ctx);

        const res = await removeGalleryImage(slug, userSession, galleryId);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

export default projectRouter;

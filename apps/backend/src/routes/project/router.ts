import { API_SCOPE } from "@app/utils/pats";
import { iconFieldSchema } from "@app/utils/schemas";
import { newProjectFormSchema } from "@app/utils/schemas/project";
import { updateProjectTagsFormSchema } from "@app/utils/schemas/project/settings/categories";
import { updateDescriptionFormSchema } from "@app/utils/schemas/project/settings/description";
import {
    addNewGalleryImageFormSchema,
    updateGalleryImageFormSchema,
} from "@app/utils/schemas/project/settings/gallery";
import { generalProjectSettingsFormSchema } from "@app/utils/schemas/project/settings/general";
import { updateProjectLicenseFormSchema } from "@app/utils/schemas/project/settings/license";
import { updateExternalLinksFormSchema } from "@app/utils/schemas/project/settings/links";
import { zodParse } from "@app/utils/schemas/utils";
import type { ProjectDetailsData, ProjectVersionData } from "@app/utils/types/api";
import { type Context, Hono } from "hono";
import type { z } from "zod/v4";
import { AuthenticationMiddleware, LoginProtectedRoute } from "~/middleware/auth";
import { getReqRateLimiter, strictGetReqRateLimiter } from "~/middleware/rate-limit/get-req";
import { invalidAuthAttemptLimiter } from "~/middleware/rate-limit/invalid-auth-attempt";
import { critModifyReqRateLimiter, modifyReqRateLimiter } from "~/middleware/rate-limit/modify-req";
import { REQ_BODY_NAMESPACE } from "~/types/namespaces";
import { invalidRequestResponse, serverErrorResponse, unauthenticatedReqResponse } from "~/utils/http";
import { getSessionUser } from "~/utils/router";
import { getAllVisibleProjects } from "../user/controllers/profile";
import { checkProjectSlugValidity, getProjectData } from "./controllers";
import { getProjectDependencies } from "./controllers/dependency";
import { addProjectsToUserFollows, removeProjectsFromUserFollows } from "./controllers/follows";
import { addNewGalleryImage, removeGalleryImage, updateGalleryImage } from "./controllers/gallery";
import { QueueProjectForApproval } from "./controllers/moderation";
import { createNewProject } from "./controllers/new-project";
import { deleteProject, deleteProjectIcon, updateGeneralProjectData, updateProjectIcon } from "./controllers/settings";
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

    .post("/:projectId/follow", getReqRateLimiter, LoginProtectedRoute, projectFollow_post)
    .delete("/:projectId/follow", critModifyReqRateLimiter, LoginProtectedRoute, projectFollow_delete)

    .post("/", critModifyReqRateLimiter, LoginProtectedRoute, project_post)
    .patch("/:id", critModifyReqRateLimiter, LoginProtectedRoute, project_patch)
    .delete("/:id", critModifyReqRateLimiter, LoginProtectedRoute, project_delete)
    .post("/:id/submit-for-review", critModifyReqRateLimiter, LoginProtectedRoute, project_queueForApproval_post)
    .patch("/:id/icon", critModifyReqRateLimiter, LoginProtectedRoute, projectIcon_patch)
    .delete("/:id/icon", critModifyReqRateLimiter, LoginProtectedRoute, projectIcon_delete)
    .patch("/:id/description", critModifyReqRateLimiter, LoginProtectedRoute, description_patch)
    .patch("/:id/tags", critModifyReqRateLimiter, LoginProtectedRoute, tags_patch)
    .patch("/:id/external-links", critModifyReqRateLimiter, LoginProtectedRoute, externalLinks_patch)
    .patch("/:id/license", critModifyReqRateLimiter, LoginProtectedRoute, license_patch)

    .post("/:id/gallery", critModifyReqRateLimiter, LoginProtectedRoute, gallery_post)
    .patch("/:id/gallery/:galleryId", modifyReqRateLimiter, LoginProtectedRoute, galleryItem_patch)
    .delete("/:id/gallery/:galleryId", critModifyReqRateLimiter, LoginProtectedRoute, galleryItem_delete)

    .route("/:projectSlug/version", versionRouter);

async function projects_get(ctx: Context) {
    try {
        const sessionUser = getSessionUser(ctx, API_SCOPE.PROJECT_READ);
        if (!sessionUser) return unauthenticatedReqResponse(ctx);

        const listedProjectsOnly = ctx.req.query("listedOnly") === "true";
        const res = await getAllVisibleProjects(sessionUser, sessionUser.userName, listedProjectsOnly);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function project_get(ctx: Context) {
    try {
        const slug = ctx.req.param("slug");
        if (!slug) return invalidRequestResponse(ctx);

        const sessionUser = getSessionUser(ctx, API_SCOPE.PROJECT_READ);
        const includeVersions = ctx.req.query("includeVersions") === "true";
        const featuredVersionsOnly = ctx.req.query("featuredOnly") === "true";
        const res = await getProjectData(slug, sessionUser);

        if (includeVersions !== true || !res.data.project) {
            return ctx.json(res.data, res.status);
        } else {
            // Fetch the project versions if it's to be included
            const project = res.data.project as ProjectDetailsData & { versions: ProjectVersionData[] };
            const versions = await getAllProjectVersions(slug, sessionUser, featuredVersionsOnly);

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
        if (!slug) return invalidRequestResponse(ctx);

        const sessionUser = getSessionUser(ctx, API_SCOPE.PROJECT_READ);
        const res = await getProjectDependencies(slug, sessionUser);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function projectCheck_get(ctx: Context) {
    try {
        const slug = ctx.req.param("slug");
        if (!slug) return invalidRequestResponse(ctx);

        const res = await checkProjectSlugValidity(slug);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function projectFollow_post(ctx: Context) {
    try {
        // following a project modifies the user data, so technically it falls under a user write
        const sessionUser = getSessionUser(ctx, API_SCOPE.USER_WRITE);
        if (!sessionUser) return unauthenticatedReqResponse(ctx);

        const projectId = ctx.req.param("projectId");
        if (!projectId) return invalidRequestResponse(ctx);

        const res = await addProjectsToUserFollows([projectId], sessionUser);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function projectFollow_delete(ctx: Context) {
    try {
        const sessionUser = getSessionUser(ctx, API_SCOPE.USER_WRITE);
        if (!sessionUser) return unauthenticatedReqResponse(ctx);

        const projectId = ctx.req.param("projectId");
        if (!projectId) return invalidRequestResponse(ctx);

        const res = await removeProjectsFromUserFollows([projectId], sessionUser);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function project_post(ctx: Context) {
    try {
        const sessionUser = getSessionUser(ctx, API_SCOPE.PROJECT_CREATE);
        if (!sessionUser) return unauthenticatedReqResponse(ctx);

        const { data, error } = await zodParse(newProjectFormSchema, ctx.get(REQ_BODY_NAMESPACE));
        if (error || !data) return invalidRequestResponse(ctx, error);

        const res = await createNewProject(sessionUser, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function project_patch(ctx: Context) {
    try {
        const sessionUser = getSessionUser(ctx, API_SCOPE.PROJECT_WRITE);
        if (!sessionUser) return unauthenticatedReqResponse(ctx);

        const projectId = ctx.req.param("id");
        if (!projectId) return invalidRequestResponse(ctx);

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

        const { data, error } = await zodParse(generalProjectSettingsFormSchema, obj);
        if (error || !data) return invalidRequestResponse(ctx, error);

        const res = await updateGeneralProjectData(projectId, sessionUser, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function project_delete(ctx: Context) {
    try {
        const sessionUser = getSessionUser(ctx, API_SCOPE.PROJECT_DELETE);
        if (!sessionUser) return unauthenticatedReqResponse(ctx);

        const projectId = ctx.req.param("id");
        if (!projectId) return invalidRequestResponse(ctx);

        const res = await deleteProject(sessionUser, projectId);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function project_queueForApproval_post(ctx: Context) {
    try {
        const sessionUser = getSessionUser(ctx, API_SCOPE.PROJECT_WRITE);
        if (!sessionUser) return unauthenticatedReqResponse(ctx);

        const projectId = ctx.req.param("id");
        if (!projectId) return invalidRequestResponse(ctx);

        const res = await QueueProjectForApproval(projectId, sessionUser);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function projectIcon_patch(ctx: Context) {
    try {
        const sessionUser = getSessionUser(ctx, API_SCOPE.PROJECT_WRITE);
        if (!sessionUser) return unauthenticatedReqResponse(ctx);

        const projectId = ctx.req.param("id");
        const formData = ctx.get(REQ_BODY_NAMESPACE);
        const icon = formData.get("icon");

        if (!projectId || !icon || !(icon instanceof File)) return invalidRequestResponse(ctx, "Invalid data");

        const { data, error } = await zodParse(iconFieldSchema, icon);
        if (error || !data) {
            return invalidRequestResponse(ctx, error as string);
        }

        const res = await updateProjectIcon(sessionUser, projectId, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function projectIcon_delete(ctx: Context) {
    try {
        const sessionUser = getSessionUser(ctx, API_SCOPE.PROJECT_WRITE);
        if (!sessionUser) return unauthenticatedReqResponse(ctx);

        const projectId = ctx.req.param("id");
        if (!projectId) return invalidRequestResponse(ctx, "Invalid data");

        const res = await deleteProjectIcon(sessionUser, projectId);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function description_patch(ctx: Context) {
    try {
        const sessionUser = getSessionUser(ctx, API_SCOPE.PROJECT_WRITE);
        if (!sessionUser) return unauthenticatedReqResponse(ctx);

        const projectId = ctx.req.param("id");
        if (!projectId) return invalidRequestResponse(ctx);

        const { data, error } = await zodParse(updateDescriptionFormSchema, ctx.get(REQ_BODY_NAMESPACE));
        if (error || !data) return invalidRequestResponse(ctx, error);

        const res = await updateProjectDescription(projectId, sessionUser, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function tags_patch(ctx: Context) {
    try {
        const sessionUser = getSessionUser(ctx, API_SCOPE.PROJECT_WRITE);
        if (!sessionUser) return unauthenticatedReqResponse(ctx);

        const projectId = ctx.req.param("id");
        if (!projectId) return invalidRequestResponse(ctx);

        const { data, error } = await zodParse(updateProjectTagsFormSchema, ctx.get(REQ_BODY_NAMESPACE));
        if (error || !data) return invalidRequestResponse(ctx, error);

        const res = await updateProjectTags(projectId, sessionUser, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function externalLinks_patch(ctx: Context) {
    try {
        const sessionUser = getSessionUser(ctx, API_SCOPE.PROJECT_WRITE);
        if (!sessionUser) return unauthenticatedReqResponse(ctx);

        const projectId = ctx.req.param("id");
        if (!projectId) return invalidRequestResponse(ctx);

        const { data, error } = await zodParse(updateExternalLinksFormSchema, ctx.get(REQ_BODY_NAMESPACE));
        if (error || !data) return invalidRequestResponse(ctx, error);

        const res = await updateProjectExternalLinks(sessionUser, projectId, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function license_patch(ctx: Context) {
    try {
        const sessionUser = getSessionUser(ctx, API_SCOPE.PROJECT_WRITE);
        if (!sessionUser) return unauthenticatedReqResponse(ctx);

        const projectId = ctx.req.param("id");
        if (!projectId) return invalidRequestResponse(ctx);

        const { data, error } = await zodParse(updateProjectLicenseFormSchema, ctx.get(REQ_BODY_NAMESPACE));
        if (error || !data) return invalidRequestResponse(ctx, error);

        const res = await updateProjectLicense(sessionUser, projectId, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function gallery_post(ctx: Context) {
    try {
        const sessionUser = getSessionUser(ctx, API_SCOPE.PROJECT_WRITE);
        if (!sessionUser) return invalidRequestResponse(ctx);

        const projectId = ctx.req.param("id");
        if (!projectId) return invalidRequestResponse(ctx);

        const formData = ctx.get(REQ_BODY_NAMESPACE);
        const obj = {
            image: formData.get("image"),
            title: formData.get("title"),
            description: formData.get("description"),
            orderIndex: Number.parseInt(formData.get("orderIndex") || "0", 10),
            featured: formData.get("featured") === "true",
        };

        const { data, error } = await zodParse(addNewGalleryImageFormSchema, obj);
        if (error || !data) return invalidRequestResponse(ctx, error);

        const res = await addNewGalleryImage(projectId, sessionUser, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function galleryItem_patch(ctx: Context) {
    try {
        const sessionUser = getSessionUser(ctx, API_SCOPE.PROJECT_WRITE);
        if (!sessionUser) return invalidRequestResponse(ctx);

        const galleryId = ctx.req.param("galleryId");
        const projectId = ctx.req.param("id");
        if (!projectId || !galleryId) return invalidRequestResponse(ctx);

        const { data, error } = await zodParse(updateGalleryImageFormSchema, ctx.get(REQ_BODY_NAMESPACE));
        if (error || !data) return invalidRequestResponse(ctx, error);

        const res = await updateGalleryImage(projectId, sessionUser, galleryId, data);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

async function galleryItem_delete(ctx: Context) {
    try {
        const sessionUser = getSessionUser(ctx, API_SCOPE.PROJECT_WRITE);
        if (!sessionUser) return invalidRequestResponse(ctx);

        const galleryId = ctx.req.param("galleryId");
        const projectId = ctx.req.param("id");
        if (!projectId || !galleryId) return invalidRequestResponse(ctx);

        const res = await removeGalleryImage(projectId, sessionUser, galleryId);
        return ctx.json(res.data, res.status);
    } catch (error) {
        console.error(error);
        return serverErrorResponse(ctx);
    }
}

export default projectRouter;

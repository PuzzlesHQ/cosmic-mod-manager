import { type Context, Hono } from "hono";
import { AuthenticationMiddleware } from "~/middleware/auth";
import { invalidAuthAttemptLimiter } from "~/middleware/rate-limiter";
import { getProjectVersionData } from "~/routes/project/version/controllers";
import { generateHash } from "~/utils/file";
import { HTTP_STATUS, invalidRequestResponse, isSuccessResponse, notFoundResponse } from "~/utils/http";
import { respondJson } from "~/utils/jsonRes";
import { getSessionUser } from "~/utils/router";
import { versionFileUrl } from "~/utils/urls";
import { GROUP_ID_PATH } from "./consts";
import { GetProjectMetadata, GetVersionMetadata } from "./controllers/maven-metadata";

const mavenRouter = new Hono()
    .use(invalidAuthAttemptLimiter)
    .use(AuthenticationMiddleware)
    .get(`/${GROUP_ID_PATH}/:project/maven-metadata.xml`, mavenMetadataGet)
    .get(`/${GROUP_ID_PATH}/:project/maven-metadata.xml.sha1`, mavenMetadataGet)
    .get(`/${GROUP_ID_PATH}/:project/:version/:file`, mavenFileGet);

async function mavenMetadataGet(ctx: Context) {
    const project = ctx.req.param("project");
    if (!project) return invalidRequestResponse(ctx);

    const sessionUser = getSessionUser(ctx);

    const res = await GetProjectMetadata(project, sessionUser);
    if (!res.data?.success) {
        return respondJson(ctx, res);
    }

    const xmlMetadata = res.data.data;
    if (ctx.req.path.endsWith(".sha1")) {
        return ctx.text(generateHash(xmlMetadata, "sha1"), HTTP_STATUS.OK);
    }

    return ctx.text(xmlMetadata, res.status, {
        "Content-Type": "text/xml",
    });
}

async function mavenFileGet(ctx: Context) {
    const projectId = ctx.req.param("project");
    const versionId = ctx.req.param("version");
    const fileName = ctx.req.param("file");

    if (!projectId || !versionId || !fileName) return invalidRequestResponse(ctx);

    const sessionUser = getSessionUser(ctx);
    const res = await getProjectVersionData(projectId, versionId, sessionUser);
    if (!isSuccessResponse(res)) return respondJson(ctx, res);
    const version = res.data.data;

    if (fileName.endsWith(".pom") || fileName.endsWith(".pom.sha1")) {
        const xmlMetadata = await GetVersionMetadata(projectId, versionId);

        if (fileName.endsWith(".pom.sha1")) {
            return ctx.text(generateHash(xmlMetadata, "sha1"), HTTP_STATUS.OK);
        }
        return ctx.text(xmlMetadata, HTTP_STATUS.OK, {
            "Content-Type": "text/xml",
        });
    }

    if (fileName.endsWith(".md5")) {
        return ctx.text("md5 is not supported", HTTP_STATUS.NOT_IMPLEMENTED);
    }

    let vFile = version.files.find((file) => file.name === fileName || file.id === fileName);
    if (!vFile && version.primaryFile) vFile = version.primaryFile;
    if (!vFile) return notFoundResponse(ctx, "File not found");

    if (fileName.endsWith(".sha1")) {
        return ctx.text(vFile.sha1_hash ?? "", HTTP_STATUS.OK);
    }

    return ctx.redirect(
        `${versionFileUrl(version.projectId, version.id, vFile.name, true)}`,
        HTTP_STATUS.TEMPORARY_REDIRECT,
    );
}

export default mavenRouter;

import { type Context, Hono } from "hono";
import { AuthenticationMiddleware } from "~/middleware/auth";
import { invalidAuthAttemptLimiter } from "~/middleware/rate-limiter";
import { generateHash } from "~/utils/file";
import { HTTP_STATUS, invalidRequestResponse, notFoundResponse, serverErrorResponse } from "~/utils/http";
import { getSessionUser } from "~/utils/router";
import { versionFileUrl } from "~/utils/urls";
import { getProjectVersionData } from "../project/version/controllers";
import { GROUP_ID } from "./consts";
import { GetProjectMetadata, GetVersionMetadata } from "./controllers/maven-metadata";

const mavenRouter = new Hono()
    .use(invalidAuthAttemptLimiter)
    .use(AuthenticationMiddleware)
    .get(`/${GROUP_ID}/:project/maven-metadata.xml`, mavenMetadataGet)
    .get(`/${GROUP_ID}/:project/maven-metadata.xml.sha1`, mavenMetadataGet)
    .get(`/${GROUP_ID}/:project/:version/:file`, mavenFileGet);

async function mavenMetadataGet(ctx: Context) {
    try {
        const project = ctx.req.param("project");
        const sessionUser = getSessionUser(ctx);

        const res = await GetProjectMetadata(project, sessionUser);
        if (!res.data?.success) {
            return ctx.json(res.data, res.status);
        }

        const xmlMetadata = res.data.metadata;
        if (ctx.req.path.endsWith(".sha1")) {
            return ctx.text(generateHash(xmlMetadata, "sha1"), HTTP_STATUS.OK);
        }

        return ctx.text(xmlMetadata, res.status, {
            "Content-Type": "text/xml",
        });
    } catch (err) {
        console.error(err);
        return serverErrorResponse(ctx);
    }
}

async function mavenFileGet(ctx: Context) {
    try {
        const project = ctx.req.param("project");
        const version = ctx.req.param("version");
        const fileName = ctx.req.param("file");

        if (!project || !version || !fileName) return invalidRequestResponse(ctx);

        if (fileName.endsWith(".pom") || fileName.endsWith(".pom.sha1")) {
            const res = await GetVersionMetadata(project, version);
            if (!res.data.success) return ctx.json(res.data, res.status);

            if (fileName.endsWith(".pom.sha1")) {
                return ctx.text(generateHash(res.data.metadata, "sha1"), HTTP_STATUS.OK);
            }

            return ctx.text(res.data.metadata, HTTP_STATUS.OK, {
                "Content-Type": "text/xml",
            });
        }

        if (fileName.endsWith(".md5")) {
            return ctx.text("md5 is not supported", HTTP_STATUS.NOT_IMPLEMENTED);
        }

        const sessionUser = getSessionUser(ctx);
        const res = await getProjectVersionData(project, version, sessionUser);
        if (res.data.success === false) return ctx.json(res.data, res.status);

        const versionData = res.data.data;
        let vFile: (typeof versionData)["files"][number] | undefined;
        for (const file of versionData.files) {
            if (file.name === fileName || file.id === fileName) {
                vFile = file;
                break;
            }
        }
        if (!vFile && versionData.primaryFile) vFile = versionData.primaryFile;
        if (!vFile) return notFoundResponse(ctx, "File not found");

        if (fileName.endsWith(".sha1")) {
            return ctx.text(vFile.sha1_hash ?? "", HTTP_STATUS.OK);
        }

        return ctx.redirect(
            `${versionFileUrl(versionData.projectId, versionData.id, vFile.name, true)}`,
            HTTP_STATUS.TEMPORARY_REDIRECT,
        );
    } catch (err) {
        console.error(err);
        return serverErrorResponse(ctx);
    }
}

export default mavenRouter;

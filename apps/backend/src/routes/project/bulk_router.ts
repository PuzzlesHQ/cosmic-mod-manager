import { API_SCOPE } from "@app/utils/pats";
import { decodeStringArray } from "@app/utils/string";
import type { ProjectListItem } from "@app/utils/types/api";
import { type Context, Hono } from "hono";
import { GetMany_ProjectsVersions, type TManyVersions } from "~/db/version_item";
import { AuthenticationMiddleware } from "~/middleware/auth";
import { getReqRateLimiter, invalidAuthAttemptLimiter, strictGetReqRateLimiter } from "~/middleware/rate-limiter";
import { invalidRequestResponse } from "~/utils/http";
import { respondJson } from "~/utils/jsonRes";
import { getSessionUser } from "~/utils/router";
import { getHomePageCarouselProjects, getManyProjects, getRandomProjects } from "./controllers";

const bulkProjectsRouter = new Hono()
    .use(invalidAuthAttemptLimiter)
    .use(AuthenticationMiddleware)

    .get("/", strictGetReqRateLimiter, projects_get)
    .get("/random", strictGetReqRateLimiter, projectsRandom_get)
    .get("/home-page-carousel", getReqRateLimiter, homePageCarousel_get);

async function projects_get(ctx: Context) {
    const projectIds = ctx.req.query("ids");
    const userSession = getSessionUser(ctx, API_SCOPE.PROJECT_READ);
    if (!projectIds) return invalidRequestResponse(ctx);

    const idsArray = decodeStringArray(projectIds);
    if (idsArray.length > 100) {
        return invalidRequestResponse(ctx, "Maximum of 100 projects can be fetched at once");
    }

    const res = await getManyProjects(userSession, idsArray);

    const extraInfo = ctx.req.queries("include");
    const includeVersionInfo = extraInfo?.includes("version-info");
    const includeVersionList = extraInfo?.includes("version-list");
    const includeVersionSlug = extraInfo?.includes("version-slug");

    if (includeVersionInfo || includeVersionList || includeVersionSlug) {
        let versionInfoLimit = Number.parseInt(ctx.req.query("version-info-limit") ?? "15", 10);
        if (!versionInfoLimit || Number.isNaN(versionInfoLimit)) {
            versionInfoLimit = 15;
        }

        const versions = await GetMany_ProjectsVersions(res.data.map((p) => p.id));

        for (const project of res.data) {
            const version = versions.find((v) => v.id === project.id);
            if (!version) continue;

            const p = project as ProjectListItem & { versions?: string[] | TManyVersions[number]["versions"] };

            if (includeVersionInfo) {
                p.versions = versionInfoLimit > 0 ? version.versions.slice(0, versionInfoLimit) : version.versions;
            } else if (includeVersionList) {
                p.versions = version.versions.map((v) => v.versionNumber);
            } else if (includeVersionSlug) {
                p.versions = version.versions.map((v) => v.slug);
            }
        }
    }

    return respondJson(ctx, res);
}

async function projectsRandom_get(ctx: Context) {
    const userSession = getSessionUser(ctx, API_SCOPE.PROJECT_READ);
    const count = Number.parseInt(ctx.req.query("count") || "", 10);

    const res = await getRandomProjects(userSession, count);
    return respondJson(ctx, res);
}

async function homePageCarousel_get(ctx: Context) {
    const userSession = getSessionUser(ctx, API_SCOPE.PROJECT_READ);
    const res = await getHomePageCarouselProjects(userSession);
    return respondJson(ctx, res);
}

export default bulkProjectsRouter;

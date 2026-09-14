import { API_SCOPE } from "@app/utils/pats";
import { decodeStringArray } from "@app/utils/string";
import type { ProjectListItem, ProjectVersionData } from "@app/utils/types/api";
import { type Context, Hono } from "hono";
import { GetMany_ProjectsVersions } from "~/db/version_item";
import { AuthenticationMiddleware } from "~/middleware/auth";
import { getReqRateLimiter, invalidAuthAttemptLimiter, strictGetReqRateLimiter } from "~/middleware/rate-limiter";
import { invalidRequestResponse } from "~/utils/http";
import { respondJson } from "~/utils/jsonRes";
import { getSessionUser } from "~/utils/router";
import { getHomePageCarouselProjects, getManyProjects, getRandomProjects } from "./controllers";
import { getFilesFromId } from "./queries/file";
import { filterVersion, formatVersionData, type ProjectVersionFilters } from "./version/controllers/utils";

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

    if (!includeVersionInfo && !includeVersionList && !includeVersionSlug) {
        return respondJson(ctx, res);
    }

    const filters: ProjectVersionFilters = {
        loader: ctx.req.query("loader"),
        releaseChannel: ctx.req.query("releaseChannel"),
        gameVersion: ctx.req.query("gameVersion"),
    };

    let versionInfoLimit = Number.parseInt(ctx.req.query("version-info-limit") ?? "15", 10);
    if (!versionInfoLimit || Number.isNaN(versionInfoLimit)) {
        versionInfoLimit = 15;
    }

    const projects = res.data;
    const versions = await GetMany_ProjectsVersions(projects.map((p) => p.id));

    let files: Awaited<ReturnType<typeof getFilesFromId>> | undefined;

    if (includeVersionInfo) {
        const fileIds: string[] = [];
        for (const item of versions) {
            for (const version of item.versions) {
                for (const file of version.files) {
                    fileIds.push(file.fileId);
                }
            }
        }

        files = await getFilesFromId(fileIds);
    }

    for (const project of projects) {
        const version = versions.find((v) => v.id === project.id);
        if (!version) continue;

        const p = project as ProjectListItem & { versions?: string[] | ProjectVersionData[] };
        let filteredVersions = Object.values(filters).every((v) => !v)
            ? version.versions
            : version.versions.filter((v) => filterVersion(v, filters));

        if (includeVersionInfo) {
            if (!files) {
                throw new Error(`files is ${files}. Why`);
            }
            if (versionInfoLimit > 0) {
                filteredVersions = filteredVersions.slice(0, versionInfoLimit);
            }

            const formattedList = filteredVersions.map((v) => formatVersionData(v, files));

            p.versions = formattedList;
        } else if (includeVersionList) {
            p.versions = filteredVersions.map((v) => v.versionNumber);
        } else if (includeVersionSlug) {
            p.versions = filteredVersions.map((v) => v.slug);
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

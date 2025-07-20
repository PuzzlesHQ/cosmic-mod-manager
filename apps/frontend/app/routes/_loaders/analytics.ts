import { getTimeRange, ISO_DateStr } from "@app/utils/date";
import { encodeArrayIntoStr } from "@app/utils/string";
import type { ProjectListItem } from "@app/utils/types/api";
import type { ProjectDownloads_Analytics } from "@app/utils/types/api/stats";
import type { LoaderFunctionArgs, ShouldRevalidateFunctionArgs } from "react-router";
import { formatDownloadAnalyticsData, getValidTimeline } from "~/utils/analytics";
import { resJson, serverFetch } from "~/utils/server-fetch";

export const timelineKey = "timeline";
const MAX_DATA_POINTS = 50;
const MAX_TOP_PROJECTS = 5;

export type GetFetchUrl_Func = (searchParams: URLSearchParams, projectIds: string[]) => string;

export async function projectAnalyticsLoader(ctx: LoaderFunctionArgs, projectIds: string[], getFetchUrl?: GetFetchUrl_Func) {
    const reqUrl = new URL(ctx.request.url);
    const timeline = getValidTimeline(reqUrl.searchParams.get(timelineKey));
    const timeRange = getTimeRange(timeline);

    const searchParams = new URLSearchParams();
    searchParams.set("projectIds", encodeArrayIntoStr(projectIds));
    searchParams.set("startDate", ISO_DateStr(timeRange[0]));
    searchParams.set("endDate", ISO_DateStr(timeRange[1]));

    const fetchUrl = getFetchUrl ? getFetchUrl(searchParams, projectIds) : AllProjectsAnalyticsURL(searchParams);
    const res = await serverFetch(ctx.request, fetchUrl);
    if (!res.ok) {
        console.error("Failed to fetch project download analytics data");
        return null;
    }

    const data = await resJson<ProjectDownloads_Analytics>(res);
    if (!data) return null;

    // return data as ProjectDownloads_Analytics;
    const downloadsByDate = formatDownloadAnalyticsData(data, timeline, undefined, MAX_DATA_POINTS);
    if (!downloadsByDate) return null;

    const projectsCount = Object.keys(data).length;
    const result = {
        data: downloadsByDate,
        timeline: timeline,
        range: timeRange,
        projectsCount: projectsCount,
        topProjects: [] as TopProjctData[],
    };

    if (projectsCount < 2) return result;

    const _topProjects = getTopDownloadedProjects(data, MAX_TOP_PROJECTS);
    const _topProjectsIds_encoded = encodeArrayIntoStr(_topProjects.map((entry) => entry[0]));
    const projectsData_res = await serverFetch(ctx.request, `/api/projects?ids=${_topProjectsIds_encoded}`);
    if (!projectsData_res.ok) {
        console.error("Failed to fetch top projects data");
        return result;
    }

    const projectsData = await resJson<ProjectListItem[]>(projectsData_res);
    if (!projectsData) return result;

    const topProjectsList: TopProjctData[] = [];
    for (const entry of _topProjects) {
        const downloads = entry[1];
        if (downloads <= 0) continue;

        const project = projectsData.find((p) => p.id === entry[0]);
        if (!project) continue;

        topProjectsList.push({
            id: project.id,
            name: project.name,
            slug: project.slug,
            icon: project.icon,
            color: project.color,
            type: project.type,
            downloads: downloads,
        });
    }

    result.topProjects = topProjectsList;
    return result;
}

function getTopDownloadedProjects(data: ProjectDownloads_Analytics, max: number) {
    const totalProjectDownloads: [string, number][] = [];

    for (const projectId in data) {
        const entry = data[projectId];
        let totalDownloads = 0;

        for (const download of Object.values(entry)) {
            totalDownloads += download;
        }
        if (totalDownloads > 0) totalProjectDownloads.push([projectId, totalDownloads]);
    }

    totalProjectDownloads.sort((a, b) => b[1] - a[1]);

    return totalProjectDownloads.slice(0, max);
}

export interface TopProjctData {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    color: string | null;
    downloads: number;
    type: string[];
}

export type ProjectAnalyticsLoader_Data = Awaited<ReturnType<typeof projectAnalyticsLoader>>;

export function AnalyticsRoute_ShouldRevalidate(props: ShouldRevalidateFunctionArgs) {
    const curr_timeline = props.currentUrl.searchParams.get(timelineKey);
    const next_timeline = props.nextUrl.searchParams.get(timelineKey);
    if (curr_timeline === next_timeline) return false;

    return props.defaultShouldRevalidate;
}

function AllProjectsAnalyticsURL(searchParams: URLSearchParams) {
    return `/api/analytics/downloads?${searchParams.toString()}`;
}

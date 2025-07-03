import { DateFromStr, ISO_DateStr, getTimeRange } from "@app/utils/date";
import { encodeArrayIntoStr } from "@app/utils/string";
import { TimelineOptions } from "@app/utils/types";
import type { ProjectDownloads_Analytics } from "@app/utils/types/api/stats";
import clientFetch from "./client-fetch";

export function getValidTimeline(timeline: string | null) {
    if (!timeline) return TimelineOptions.PREVIOUS_30_DAYS;

    if (Object.values(TimelineOptions).includes(timeline as TimelineOptions)) {
        return timeline as TimelineOptions;
    }

    return TimelineOptions.PREVIOUS_30_DAYS;
}

export type CustomAnalyticsUrl_Func = (searchParams: URLSearchParams, projectIds: string[]) => string;

export async function getProjectDownload_AnalyticsData(
    projectIds: string[],
    timeline: TimelineOptions,
    customUrlFunc?: CustomAnalyticsUrl_Func,
) {
    const timeRange = getTimeRange(timeline);
    const searchParams = new URLSearchParams();
    searchParams.set("projectIds", encodeArrayIntoStr(projectIds));
    searchParams.set("startDate", ISO_DateStr(timeRange[0]));
    searchParams.set("endDate", ISO_DateStr(timeRange[1]));

    const url = customUrlFunc ? customUrlFunc(searchParams, projectIds) : `/api/analytics/downloads?${searchParams.toString()}`;
    const res = await clientFetch(url);
    if (!res.ok) {
        console.error("Failed to fetch project download analytics data");
        return null;
    }

    const data = await res.json();
    return data as ProjectDownloads_Analytics;
}

export function formatDownloadAnalyticsData(
    data_obj: ProjectDownloads_Analytics | null,
    timeline: TimelineOptions,
    _resolutionDays?: number,
    MAX_DATA_POINTS = 45,
) {
    if (!data_obj) return null;

    const allProjectsAnalytics: Record<string, number> = {};
    for (const projectId in data_obj) {
        const projectAnalyticsData = data_obj[projectId];

        for (const date in projectAnalyticsData) {
            if (!allProjectsAnalytics[date]) allProjectsAnalytics[date] = projectAnalyticsData[date];
            else allProjectsAnalytics[date] += projectAnalyticsData[date] || 0;
        }
    }
    if (!allProjectsAnalytics) return null;

    const timeLineRange = getTimeRange(timeline);
    const keys = Object.keys(allProjectsAnalytics);
    const analytics_StartDate = getStartDate(timeline, timeLineRange[0], DateFromStr(keys[0]));
    const analytics_EndDate = timeLineRange[1];

    if (!analytics_StartDate || !analytics_EndDate) return allProjectsAnalytics;
    const resolutionDays = _resolutionDays ? _resolutionDays : Math.max(1, Math.round(keys.length / MAX_DATA_POINTS));

    while (analytics_EndDate >= analytics_StartDate) {
        const dateKey = ISO_DateStr(analytics_EndDate);
        if (!allProjectsAnalytics[dateKey]) allProjectsAnalytics[dateKey] = 0;

        analytics_EndDate.setDate(analytics_EndDate.getDate() - 1);

        // Aggregate data according to the `resolutionDays`
        for (let i = 0; i < resolutionDays - 1; i++) {
            const prevDate = ISO_DateStr(analytics_EndDate);

            allProjectsAnalytics[dateKey] += allProjectsAnalytics[prevDate] || 0;
            delete allProjectsAnalytics[prevDate];
            analytics_EndDate.setDate(analytics_EndDate.getDate() - 1);
        }
    }

    const entries = Object.entries(allProjectsAnalytics);
    entries.sort((a, b) => {
        return (DateFromStr(a[0]) || 0) > (DateFromStr(b[0]) || 0) ? 1 : -1;
    });

    return Object.fromEntries(entries);
}

export function getStartDate(timeline: TimelineOptions, timelineStartDate: Date, firstEntryDate: Date | null) {
    switch (timeline) {
        case TimelineOptions.YESTERDAY:
        case TimelineOptions.THIS_WEEK:
        case TimelineOptions.LAST_WEEK:
        case TimelineOptions.PREVIOUS_7_DAYS:
        case TimelineOptions.THIS_MONTH:
        case TimelineOptions.LAST_MONTH:
        case TimelineOptions.PREVIOUS_30_DAYS:
            return timelineStartDate;

        case TimelineOptions.PREVIOUS_90_DAYS:
        case TimelineOptions.THIS_YEAR:
        case TimelineOptions.LAST_YEAR:
        case TimelineOptions.PREVIOUS_365_DAYS:
        case TimelineOptions.ALL_TIME:
            // If there was no first entry date, that means there's no data about the project at all
            // In that case just return today's date as startDate which will result in no calculation as the endDate will be in past
            return firstEntryDate || new Date();

        default:
            return timelineStartDate;
    }
}

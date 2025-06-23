import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@app/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@app/components/ui/select";
import { WanderingCubesSpinner } from "@app/components/ui/spinner";
import { DateFromStr, FormatDate_ToLocaleString, getTimeRange } from "@app/utils/date";
import { TimelineOptions } from "@app/utils/types";
import type { ProjectDownloads_Analytics } from "@app/utils/types/api/stats";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { FormattedDate } from "~/components/ui/date";
import { formatLocaleCode } from "~/locales";
import { useTranslation } from "~/locales/provider";
import {
    type CustomAnalyticsUrl_Func,
    formatDownloadAnalyticsData,
    getProjectDownload_AnalyticsData,
    getStartDate,
    getValidTimeline,
} from "~/utils/analytics";

const timelineKey = "timeline";
const MAX_DATA_POINTS = 50;

interface AnalyticsData_State {
    data: ProjectDownloads_Analytics[string] | null;
    loading: boolean;
}

interface DownloadsAnalyticsProps {
    projectIds: string[];
    customUrlFunc?: CustomAnalyticsUrl_Func;
}

export default function DownloadsAnalyticsChart(props: DownloadsAnalyticsProps) {
    const { t, locale } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData_State>({ data: null, loading: true });
    const [projectsCount, setProjectsCount] = useState(0);

    let total = 0;
    let atLeastOneDataPoint = false;
    let maxDownloads = 0;
    const formattedAnalyticsData = Object.entries(analyticsData.data || {}).map((entry) => {
        atLeastOneDataPoint = true;
        total += entry[1];

        if (maxDownloads < entry[1]) maxDownloads = entry[1];

        return {
            date: entry[0],
            downloads: entry[1],
        };
    });

    const timeline = getValidTimeline(searchParams.get(timelineKey));
    const range = getTimeRange(timeline);

    function setTimeline(timeline: TimelineOptions) {
        setSearchParams(
            (prev) => {
                prev.set(timelineKey, timeline);
                return prev;
            },
            { preventScrollReset: true },
        );
    }

    async function fetchAnalyticsData() {
        setAnalyticsData((prev) => {
            prev.loading = true;
            return prev;
        });

        const data = await getProjectDownload_AnalyticsData(props.projectIds, timeline, props.customUrlFunc);
        if (!data) return;

        setProjectsCount(Object.keys(data)?.length);
        setAnalyticsData({
            data: formatDownloadAnalyticsData(data, timeline, undefined, MAX_DATA_POINTS),
            loading: false,
        });
    }

    const chartConfig = {
        downloads: {
            label: t.project.downloads,
            color: "hsla(var(--chart-1))",
        },
    } satisfies ChartConfig;

    useEffect(() => {
        fetchAnalyticsData();
    }, [timeline, props.projectIds.toString()]);

    return (
        <div className="flex gap-3 flex-col bg-card-background rounded-lg p-card-surround ps-0">
            <div className="flex items-start justify-between ps-card-surround">
                <div>
                    <h1 className="text-foreground text-xl font-semibold leading-none">{t.project.downloads}</h1>

                    <span className="text-sm font-semibold text-extra-muted-foreground leading-none">
                        <FormattedDate
                            includeTime={false}
                            shortMonthNames
                            date={getStartDate(timeline, range[0], DateFromStr(formattedAnalyticsData[0]?.date))}
                        />{" "}
                        – <FormattedDate includeTime={false} shortMonthNames date={range[1]} />
                    </span>
                </div>

                <Select value={timeline} onValueChange={(val) => setTimeline(val as TimelineOptions)}>
                    <SelectTrigger className="w-fit">
                        <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                        {[
                            TimelineOptions.YESTERDAY,
                            TimelineOptions.THIS_WEEK,
                            TimelineOptions.LAST_WEEK,
                            TimelineOptions.PREVIOUS_7_DAYS,
                            TimelineOptions.THIS_MONTH,
                            TimelineOptions.LAST_MONTH,
                            TimelineOptions.PREVIOUS_30_DAYS,
                            TimelineOptions.PREVIOUS_90_DAYS,
                            TimelineOptions.THIS_YEAR,
                            TimelineOptions.LAST_YEAR,
                            TimelineOptions.PREVIOUS_365_DAYS,
                            TimelineOptions.ALL_TIME,
                        ].map((option) => {
                            return (
                                <SelectItem key={option} value={option}>
                                    {t.graph.timeline[option]}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>

            <ChartContainer config={chartConfig} className="aspect-auto h-[22rem] w-full">
                {atLeastOneDataPoint ? (
                    <LineChart
                        accessibilityLayer
                        data={formattedAnalyticsData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} stroke="currentColor" className="text-shallow-background" />
                        <XAxis
                            className="text-shallow-background"
                            stroke="currentColor"
                            dataKey="date"
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);

                                return FormatDate_ToLocaleString(date, {
                                    shortMonthNames: true,
                                    locale: formatLocaleCode(locale),
                                    includeTime: false,
                                    includeYear: false,
                                });
                            }}
                        />
                        <YAxis
                            className="text-shallow-background"
                            stroke="currentColor"
                            dataKey="downloads"
                            width={48}
                            ticks={getYAxisTicks(maxDownloads)}
                            allowDecimals={false}
                        />
                        <ChartTooltip
                            cursor={{
                                stroke: "currentColor",
                                className: "text-shallow-background",
                            }}
                            content={
                                <ChartTooltipContent
                                    color={chartConfig.downloads.color}
                                    nameKey="downloads"
                                    labelFormatter={(value) => {
                                        const date = new Date(value);

                                        return FormatDate_ToLocaleString(date, {
                                            shortMonthNames: true,
                                            locale: formatLocaleCode(locale),
                                            includeTime: false,
                                        });
                                    }}
                                />
                            }
                        />

                        <Line
                            dataKey="downloads"
                            type="monotone"
                            color={chartConfig.downloads.color}
                            stroke="currentColor"
                            activeDot={{
                                color: chartConfig.downloads.color,
                            }}
                            strokeWidth={2.3}
                            dot={false}
                        />
                    </LineChart>
                ) : (
                    <div className="h-full ps-card-surround flex items-center justify-center">
                        {analyticsData.loading ? (
                            <WanderingCubesSpinner />
                        ) : (
                            <span className="text-md text-center font-mono text-extra-muted-foreground">{t.graph.noDataAvailable}</span>
                        )}
                    </div>
                )}
            </ChartContainer>

            <div className="flex items-center justify-center ps-card-surround gap-4">
                <span className="text-sm font-medium text-extra-muted-foreground leading-none">
                    {t.project.downloads}: <strong>{total}</strong>
                </span>

                {projectsCount > 1 ? (
                    <span className="text-sm font-medium text-extra-muted-foreground leading-none">
                        {t.dashboard.projects}: <strong>{projectsCount}</strong>
                    </span>
                ) : null}
            </div>
        </div>
    );
}

function getYAxisTicks(maxVal: number, tickCount = 4): number[] {
    let step = maxVal;
    if (maxVal >= 50) {
        const _rounded = tickCount * 5;
        const _mod = maxVal % _rounded;
        const _max = _mod === 0 ? maxVal + _rounded : maxVal - _mod + _rounded;

        step = _max / tickCount;
    } else {
        step = maxVal % tickCount === 0 ? maxVal / tickCount + 1 : Math.ceil(maxVal / tickCount);
    }

    const ticks = [0];
    for (let i = 1; i <= tickCount; i++) {
        ticks.push(step * i);
    }

    return ticks;
}

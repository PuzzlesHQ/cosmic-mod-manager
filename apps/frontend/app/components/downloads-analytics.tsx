import { DateFromStr, FormatDate_ToLocaleString } from "@app/utils/date";
import { ProjectType, TimelineOptions } from "@app/utils/types";
import { DownloadIcon } from "lucide-react";
import { useSearchParams } from "react-router";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { fallbackProjectIcon } from "~/components/icons";
import { ImgWrapper } from "~/components/ui/avatar";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart";
import { FormattedDate } from "~/components/ui/date";
import { TextLink } from "~/components/ui/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useTranslation } from "~/locales/provider";
import { type ProjectAnalyticsLoader_Data, timelineKey } from "~/routes/_loaders/analytics";
import { getStartDate } from "~/utils/analytics";
import { ProjectPagePath } from "~/utils/urls";

interface DownloadsAnalyticsProps {
    data: NonNullable<ProjectAnalyticsLoader_Data>;
}

export default function DownloadsAnalyticsChart({ data: props }: DownloadsAnalyticsProps) {
    const { t, formattedLocaleName } = useTranslation();
    const [_, setSearchParams] = useSearchParams();

    const analyticsData = props.data;
    const projectsCount = props.projectsCount;
    const timeline = props.timeline;
    const range = props.range;

    let total = 0;
    let maxDownloads = 0;
    const formattedAnalyticsData = Object.entries(analyticsData || {}).map((entry) => {
        total += entry[1];
        if (maxDownloads < entry[1]) maxDownloads = entry[1];

        return {
            date: entry[0],
            downloads: entry[1],
        };
    });

    function setTimeline(timeline: TimelineOptions) {
        setSearchParams(
            (prev) => {
                prev.set(timelineKey, timeline);
                return prev;
            },
            { preventScrollReset: true },
        );
    }

    const chartConfig = {
        downloads: {
            label: t.project.downloads,
            color: "hsla(var(--chart-1))",
        },
    } satisfies ChartConfig;

    return (
        <>
            <div className="flex flex-col gap-4 rounded-lg bg-card-background p-card-surround ps-0">
                <div className="flex items-start justify-between ps-card-surround">
                    <div>
                        <h1 className="font-semibold text-foreground text-xl leading-none">{t.project.downloads}</h1>

                        <span className="font-semibold text-foreground-extra-muted text-sm leading-none">
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
                    <LineChart
                        accessibilityLayer
                        data={formattedAnalyticsData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} stroke="currentColor" className="text-raised-background" />
                        <XAxis
                            className="text-raised-background"
                            stroke="currentColor"
                            dataKey="date"
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);

                                return FormatDate_ToLocaleString(date, {
                                    shortMonthNames: true,
                                    locale: formattedLocaleName,
                                    includeTime: false,
                                    includeYear: false,
                                });
                            }}
                        />
                        <YAxis
                            className="text-raised-background"
                            stroke="currentColor"
                            dataKey="downloads"
                            width={48}
                            ticks={getYAxisTicks(maxDownloads)}
                            allowDecimals={false}
                        />
                        <ChartTooltip
                            cursor={{
                                stroke: "currentColor",
                                className: "text-raised-background",
                            }}
                            content={
                                <ChartTooltipContent
                                    color={chartConfig.downloads.color}
                                    nameKey="downloads"
                                    labelFormatter={(value) => {
                                        const date = new Date(value);

                                        return FormatDate_ToLocaleString(date, {
                                            shortMonthNames: true,
                                            locale: formattedLocaleName,
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
                </ChartContainer>

                <div className="flex items-center justify-center gap-4 ps-card-surround">
                    <span className="font-medium text-foreground-extra-muted text-sm leading-none">
                        {t.project.downloads}: <strong>{total}</strong>
                    </span>

                    {props.projectsCount > 1 ? (
                        <span className="font-medium text-foreground-extra-muted text-sm leading-none">
                            {t.dashboard.projects}: <strong>{projectsCount}</strong>
                        </span>
                    ) : null}
                </div>
            </div>

            {props.topProjects.length > 0 && (
                <ol className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-4 rounded-lg bg-card-background p-card-surround xl:grid-cols-[max-content_1fr_max-content_1fr]">
                    {props.topProjects.map((project) => {
                        return (
                            <li key={project.id} className="col-span-2 grid grid-cols-subgrid">
                                <TextLink
                                    to={ProjectPagePath(
                                        project.type?.[0] || ProjectType.MOD,
                                        project.slug,
                                        `settings/analytics?${timelineKey}=${timeline}`,
                                    )}
                                    className="flex items-center gap-2 text-foreground-muted"
                                >
                                    <ImgWrapper
                                        src={project.icon || undefined}
                                        alt={project.name}
                                        fallback={fallbackProjectIcon}
                                        className="h-10 w-10"
                                    />

                                    <strong>{project.name}</strong>
                                </TextLink>

                                <span className="flex items-center gap-2">
                                    <DownloadIcon aria-hidden className="h-btn-icon w-btn-icon text-foreground-extra-muted" />{" "}
                                    <strong>{project.downloads}</strong>
                                </span>
                            </li>
                        );
                    })}
                </ol>
            )}
        </>
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

import { parseFileSize } from "@app/utils/number";
import type { Statistics, StorageUsageStats } from "@app/utils/types/api/stats";
import { Label, Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
    type ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "~/components/ui/chart";
import { useTranslation } from "~/locales/provider";

interface Props {
    stats: Statistics;
    storageStats: StorageUsageStats;
}

export default function StatsPage({ stats, storageStats }: Props) {
    const { t } = useTranslation();

    const storageUsageData = [
        { usedBy: "versions", usedStorage: storageStats.breakdown.versionFiles, fill: "var(--color-versions)" },
        { usedBy: "gallery", usedStorage: storageStats.breakdown.galleryImages, fill: "var(--color-gallery)" },
        { usedBy: "icons", usedStorage: storageStats.breakdown.iconImages, fill: "var(--color-icons)" },
    ];
    t.navbar;
    const chartConfig = {
        usedStorage: {
            label: "Storage Used",
        },
        versions: {
            label: t.project.versions,
            color: "hsla(var(--chart-1))",
        },
        gallery: {
            label: t.project.gallery,
            color: "hsla(var(--chart-2))",
        },
        icons: {
            label: t.form.icon,
            color: "hsla(var(--chart-3))",
        },
    } satisfies ChartConfig;

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>{t.moderation.statistics}</CardTitle>
                </CardHeader>

                <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(15rem,1fr))]">
                    <StatCard label={t.dashboard.projects} value={stats.projects} />
                    <StatCard label={t.project.versions} value={stats.versions} />
                    <StatCard label={t.version.files} value={stats.files} />
                    <StatCard label={t.moderation.authors} value={stats.authors} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t.moderation.storage}</CardTitle>
                </CardHeader>

                <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(15rem,1fr))]">
                    <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-[32rem]">
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        hideLabel
                                        valueFormatter={(val) => (typeof val === "number" ? parseFileSize(val) : val)}
                                    />
                                }
                            />
                            <Pie
                                data={storageUsageData}
                                nameKey="usedBy"
                                dataKey="usedStorage"
                                innerRadius={75}
                                strokeWidth={5}
                            >
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) - 22}
                                                        className="fill-foreground font-bold text-3xl"
                                                    >
                                                        {parseFileSize(storageStats.totalUsed).split(" ")[0]}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 14}
                                                        className="fill-foreground-muted font-bold text-xl"
                                                    >
                                                        {parseFileSize(storageStats.totalUsed).split(" ")?.[1]}
                                                    </tspan>
                                                </text>
                                            );
                                        }
                                    }}
                                />

                                <ChartLegend
                                    content={<ChartLegendContent nameKey="usedBy" />}
                                    className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </>
    );
}

interface StatCardProps {
    label: string;
    value: string | number;
}

function StatCard({ label, value }: StatCardProps) {
    return (
        <div className="flex flex-col gap-2 rounded bg-background p-card-surround">
            <span className="font-bold text-foreground-muted">{label}</span>
            <span className="font-bold text-4xl">{value}</span>
        </div>
    );
}

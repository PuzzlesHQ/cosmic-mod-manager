import type { Statistics } from "@app/utils/types/api/stats";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useTranslation } from "~/locales/provider";

export default function StatsPage({ stats }: { stats: Statistics }) {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.moderation.statistics}</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fit,_minmax(15rem,_1fr))]">
                <StatCard label={t.dashboard.projects} value={stats.projects} />
                <StatCard label={t.project.versions} value={stats.versions} />
                <StatCard label={t.version.files} value={stats.files} />
                <StatCard label={t.moderation.authors} value={stats.authors} />
            </CardContent>
        </Card>
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

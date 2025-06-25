import { Card, CardContent, CardHeader, CardTitle } from "@app/components/ui/card";
import type { Statistics } from "@app/utils/types/api/stats";
import { useTranslation } from "~/locales/provider";

export default function StatsPage({ stats }: { stats: Statistics }) {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.moderation.statistics}</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-[repeat(auto-fit,_minmax(15rem,_1fr))]">
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
        <div className="bg-background p-card-surround rounded flex flex-col gap-2">
            <span className="text-muted-foreground font-bold">{label}</span>
            <span className="text-4xl font-bold">{value}</span>
        </div>
    );
}

import { Card, CardContent, CardHeader, CardTitle } from "@app/components/ui/card";
import type { ReportsData } from "~/components/layout/report/_additional-data-loader";
import ReportList from "~/components/layout/report/report-list";
import { useTranslation } from "~/locales/provider";

interface Props {
    data: ReportsData;
}

export default function ReportsDashboard(props: Props) {
    const data = props.data;
    const { t } = useTranslation();

    if (!data.reports) {
        return (
            <div>
                <p>{t.report.noOpenReports}</p>
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.moderation.reports}</CardTitle>
            </CardHeader>
            <CardContent>
                <ReportList data={data} />
            </CardContent>
        </Card>
    );
}

import type { Report } from "@app/utils/types/api/report";
import { useLoaderData } from "react-router";
import { ReportsDataLoader } from "~/components/layout/report/_additional-data-loader";
import ReportList from "~/components/layout/report/report-list";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { SoftRedirect } from "~/components/ui/redirect";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import { resJson, serverFetch } from "~/utils/server-fetch";
import type { Route } from "./+types/reports";

export default function () {
    const session = useSession();
    const data = useLoaderData<typeof loader>();
    const { t } = useTranslation();

    if (!session?.id) return <SoftRedirect to="/login" />;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.moderation.reports}</CardTitle>
            </CardHeader>
            <CardContent>{!data?.reports?.length ? <p>{t.report.noOpenReports}</p> : <ReportList data={data} />}</CardContent>
        </Card>
    );
}

export async function loader(props: Route.LoaderArgs) {
    const res = await serverFetch(props.request, "/api/report");
    const reports = await resJson<Report[]>(res);

    return ReportsDataLoader(props.request, reports);
}

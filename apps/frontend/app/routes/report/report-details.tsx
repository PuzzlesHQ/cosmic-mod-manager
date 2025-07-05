import type { DetailedReport, Report } from "@app/utils/types/api/report";
import { useLoaderData } from "react-router";
import { getDetailedReports, ReportsDataLoader } from "~/components/layout/report/_additional-data-loader";
import { ReportDetails } from "~/components/layout/report/report-details";
import NotFoundPage from "~/pages/not-found";
import { resJson, serverFetch } from "~/utils/server-fetch";
import type { Route } from "./+types/page";

export default function () {
    const data = useLoaderData<typeof loader>();
    if (!data) return <NotFoundPage />;

    return <ReportDetails data={data} />;
}

export async function loader(props: Route.LoaderArgs): Promise<DetailedReport | null> {
    const reportId = props.params.reportId;
    const res = await serverFetch(props.request, `/api/report/${reportId}`);
    const report = await resJson<Report>(res);

    if (!report) return null;
    const data = getDetailedReports(await ReportsDataLoader(props.request, [report]))[0];

    if (!data?.id || !data.reporterUser?.id) return null;
    return data;
}

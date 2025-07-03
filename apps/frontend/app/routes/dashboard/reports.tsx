import type { Report } from "@app/utils/types/api/report";
import { useLoaderData } from "react-router";
import { ReportsDataLoader } from "~/components/layout/report/_additional-data-loader";
import ReportsDashboard from "~/pages/dashboard/reports";
import { resJson, serverFetch } from "~/utils/server-fetch";
import type { Route } from "./+types/reports";

export default function () {
    const data = useLoaderData<typeof loader>();

    return <ReportsDashboard data={data} />;
}

export async function loader(props: Route.LoaderArgs) {
    const res = await serverFetch(props.request, "/api/report");
    const reports = await resJson<Report[]>(res);

    return ReportsDataLoader(props.request, reports);
}

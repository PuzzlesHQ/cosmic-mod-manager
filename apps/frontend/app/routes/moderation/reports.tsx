import type { Report } from "@app/utils/types/api/report";
import { useLoaderData } from "react-router";
import { ReportsDataLoader } from "~/components/layout/report/_additional-data-loader";
import { SoftRedirect } from "~/components/ui/redirect";
import { useSession } from "~/hooks/session";
import Reports_ModerationPage from "~/pages/moderation/reports";
import { resJson, serverFetch } from "~/utils/server-fetch";
import ErrorView from "../error-view";
import type { Route } from "./+types/reports";

export default function () {
    const session = useSession();
    const data = useLoaderData<typeof loader>();

    if (!session?.id) return <SoftRedirect to="/login" />;
    if (!data) return <ErrorView />;

    return <Reports_ModerationPage data={data} />;
}

export async function loader(props: Route.LoaderArgs) {
    const url = new URL(props.request.url);

    const res = await serverFetch(props.request, `/api/report/getAll?${url.searchParams.toString()}`);
    const reports = await resJson<Report[]>(res);

    return ReportsDataLoader(props.request, reports);
}

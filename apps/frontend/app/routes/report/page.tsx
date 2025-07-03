import type { ProjectDetailsData, ProjectVersionData } from "@app/utils/types/api";
import { type Report, ReportItemType } from "@app/utils/types/api/report";
import type { UserProfileData } from "@app/utils/types/api/user";
import { type ShouldRevalidateFunctionArgs, useLoaderData } from "react-router";
import ReportPage, { ITEM_ID_PARAM_KEY, ITEM_TYPE_PARAM_KEY, type LoaderData } from "~/pages/report/page";
import { resJson, serverFetch } from "~/utils/server-fetch";
import type { Route } from "./+types/page";

export default function () {
    const data = useLoaderData<typeof loader>();

    return <ReportPage data={data} />;
}

export function shouldRevalidate(props: ShouldRevalidateFunctionArgs) {
    if (
        props.currentUrl.searchParams.get(ITEM_TYPE_PARAM_KEY) !== props.nextUrl.searchParams.get(ITEM_TYPE_PARAM_KEY) ||
        props.currentUrl.searchParams.get(ITEM_ID_PARAM_KEY) !== props.nextUrl.searchParams.get(ITEM_ID_PARAM_KEY)
    ) {
        return true;
    }

    return false;
}

export async function loader(props: Route.LoaderArgs): Promise<LoaderData> {
    const searchParams = new URL(props.request.url).searchParams;
    const itemType = searchParams.get(ITEM_TYPE_PARAM_KEY) as ReportItemType | null;
    const itemId = searchParams.get(ITEM_ID_PARAM_KEY);

    if (!itemType || !itemId || !Object.values(ReportItemType).includes(itemType)) return null;

    const [existingReport_res, itemData_res] = await Promise.all([
        serverFetch(props.request, `/api/report/existingReport?itemType=${itemType}&itemId=${itemId}`),
        serverFetch(props.request, `/api/${itemType}/${itemId}`),
    ]);
    const existingReport = await resJson<Report>(existingReport_res);

    switch (itemType) {
        case ReportItemType.PROJECT: {
            return {
                itemType: ReportItemType.PROJECT,
                project: (await resJson<{ project: ProjectDetailsData }>(itemData_res))?.project || null,
                existingReport: existingReport,
            };
        }

        case ReportItemType.VERSION: {
            return {
                itemType: ReportItemType.VERSION,
                version: (await resJson<ProjectVersionData>(itemData_res)) || null,
                existingReport: existingReport,
            };
        }

        case ReportItemType.USER: {
            return {
                itemType: ReportItemType.USER,
                user: await resJson<UserProfileData>(itemData_res),
                existingReport: existingReport,
            };
        }
    }

    return null;
}

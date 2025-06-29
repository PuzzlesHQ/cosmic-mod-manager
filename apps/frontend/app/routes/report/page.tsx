import type { ProjectDetailsData, ProjectVersionData } from "@app/utils/types/api";
import { ReportItemType } from "@app/utils/types/api/report";
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
    const itemType = searchParams.get(ITEM_TYPE_PARAM_KEY);
    const itemId = searchParams.get(ITEM_ID_PARAM_KEY);

    if (!itemType || !itemId) return null;

    switch (itemType) {
        case ReportItemType.PROJECT: {
            const res = await serverFetch(props.request, `/api/project/${itemId}`);
            return {
                itemType: ReportItemType.PROJECT,
                project: (await resJson<{ project: ProjectDetailsData }>(res))?.project || null,
            };
        }

        case ReportItemType.VERSION: {
            const [project, versionId] = itemId.split("/version/");
            const res = await serverFetch(props.request, `/api/project/${project}/version/${versionId}`);
            return {
                itemType: ReportItemType.VERSION,
                version: (await resJson<{ data: ProjectVersionData }>(res))?.data || null,
            };
        }

        case ReportItemType.USER: {
            const res = await serverFetch(props.request, `/api/user/${itemId}`);
            return {
                itemType: ReportItemType.USER,
                user: await resJson<UserProfileData>(res),
            };
        }
    }

    return null;
}

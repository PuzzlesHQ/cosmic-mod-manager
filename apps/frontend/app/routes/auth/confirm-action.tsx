import type { ConfirmationType } from "@app/utils/types";
import { useLoaderData } from "react-router";
import ConfirmActionPage from "~/pages/auth/confirm-action/page";
import { resJson, serverFetch } from "~/utils/server-fetch";
import type { Route } from "./+types/confirm-action";

export default function () {
    const data = useLoaderData() as LoaderData;

    return <ConfirmActionPage actionType={data.actionType} code={data.code} />;
}

interface LoaderData {
    actionType: ConfirmationType | null;
    code: string | null;
}

export async function loader(props: Route.LoaderArgs): Promise<LoaderData> {
    let code = null;
    let actionType = null;

    try {
        const url = new URL(props.request.url);
        code = url.searchParams.get("code");

        const res = await serverFetch(props.request, "/api/user/confirmation-action", {
            method: "POST",
            body: JSON.stringify({ code: code }),
        });
        const data = await resJson<{ actionType: ConfirmationType }>(res);

        actionType = data?.actionType as ConfirmationType;
    } catch {}

    return {
        actionType: actionType || null,
        code: code || null,
    };
}

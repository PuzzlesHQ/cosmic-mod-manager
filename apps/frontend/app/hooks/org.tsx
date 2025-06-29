import type { Organisation, ProjectListItem, TeamMember } from "@app/utils/types/api";
import { useRouteLoaderData } from "react-router";
import type { OrgLoaderData } from "~/routes/organization/data-wrapper";
import { useSession } from "./session";

export interface OrgContextData {
    orgSlug: string;

    orgData: Organisation;
    orgProjects: ProjectListItem[];
    currUsersMembership: TeamMember | null;
}

export function useOrgData(): OrgContextData {
    const session = useSession();
    const loaderData = useRouteLoaderData("organization-data-wrapper") as OrgLoaderData;

    // We can safely return incomplete data, because the data-wrapper will handle not found cases
    if (!loaderData?.orgData?.id) {
        // @ts-ignore
        return {
            orgSlug: loaderData?.orgSlug || "",
        };
    }

    const currUsersMembership = loaderData.orgData?.members.find((member) => member.userId === session?.id) || null;

    return {
        orgSlug: loaderData.orgSlug || "",
        orgData: loaderData.orgData,
        orgProjects: loaderData.orgProjects,
        currUsersMembership: currUsersMembership,
    };
}

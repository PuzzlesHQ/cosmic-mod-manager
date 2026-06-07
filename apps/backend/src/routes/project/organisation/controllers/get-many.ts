import type { OrganisationListItem } from "@app/utils/types/api";
import { GetManyOrganizations_ById } from "~/db/organization_item";
import { HTTP_STATUS } from "~/utils/http";
import { orgIconUrl } from "~/utils/urls";

export async function getManyOrgs(orgIds: string[]) {
    const list = await GetManyOrganizations_ById(orgIds);
    const orgsList: OrganisationListItem[] = [];

    for (const org of list) {
        if (!org) continue;

        orgsList.push({
            id: org.id,
            teamId: org.teamId,
            name: org.name,
            slug: org.slug,
            icon: orgIconUrl(org.id, org.iconFileId),
            description: org.description,
        });
    }

    return { data: orgsList, status: HTTP_STATUS.OK };
}

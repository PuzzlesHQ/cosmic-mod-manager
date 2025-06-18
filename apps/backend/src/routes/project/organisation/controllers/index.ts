import { getCurrMember } from "@app/utils/project";
import type { createOrganisationFormSchema } from "@app/utils/schemas/organisation";
import type { OrganisationPermission, ProjectPermission } from "@app/utils/types";
import type { Organisation } from "@app/utils/types/api";
import type { z } from "zod";
import { CreateOrganization, GetManyOrganizations_ById, GetOrganization_BySlugOrId } from "~/db/organization_item";
import { GetUser_ByIdOrUsername, Get_UserOrganizations } from "~/db/user_item";
import type { ContextUserData } from "~/types";
import { HTTP_STATUS, invalidReqestResponseData, notFoundResponseData } from "~/utils/http";
import { generateDbId } from "~/utils/str";
import { orgIconUrl, userIconUrl } from "~/utils/urls";
import { getManyProjects } from "../../controllers";

export async function getOrganisationById(userSession: ContextUserData | undefined, slug: string) {
    const organisation = await GetOrganization_BySlugOrId(slug.toLowerCase(), slug);
    if (!organisation) {
        return notFoundResponseData("Organisation not found");
    }
    const currMember = getCurrMember(userSession?.id, [], organisation.team.members);
    const isMember = currMember?.accepted === true;

    const formattedData = {
        id: organisation.id,
        teamId: organisation.teamId,
        name: organisation.name,
        slug: organisation.slug,
        icon: orgIconUrl(organisation.id, organisation.iconFileId),
        description: organisation.description,
        members: organisation.team.members.map((member) => {
            return {
                id: member.id,
                userId: member.userId,
                teamId: member.teamId,
                userName: member.user.userName,
                avatar: userIconUrl(member.user.id, member.user.avatar),
                role: member.role,
                isOwner: member.isOwner,
                accepted: member.accepted,
                permissions: (isMember ? member.permissions : []) as ProjectPermission[],
                organisationPermissions: (isMember ? member.organisationPermissions : []) as OrganisationPermission[],
            };
        }),
    } satisfies Organisation;

    return { data: formattedData, status: HTTP_STATUS.OK };
}

export async function getUserOrganisations(userSession: ContextUserData | undefined, userSlug: string) {
    let userId = userSlug.toLowerCase() === userSession?.userName.toLowerCase() ? userSession.id : null;
    if (!userId) {
        const user = await GetUser_ByIdOrUsername(userSlug, userSlug);

        if (!user) return notFoundResponseData("User not found");
        userId = user.id;
    }

    const UserOrgs_Id = await Get_UserOrganizations(userId);
    if (!UserOrgs_Id) return { data: [], status: HTTP_STATUS.OK };

    const UserOrganizations = await GetManyOrganizations_ById(UserOrgs_Id);

    const organisationsList: Organisation[] = [];
    for (const org of UserOrganizations) {
        const currMember = getCurrMember(userSession?.id, [], org.team.members);

        organisationsList.push({
            id: org.id,
            teamId: org.teamId,
            name: org.name,
            slug: org.slug,
            description: org.description,
            icon: orgIconUrl(org.id, org.iconFileId),
            members: org.team.members.map((member) => ({
                id: member.id,
                userId: member.userId,
                teamId: member.teamId,
                userName: member.user.userName,
                avatar: userIconUrl(member.user.id, member.user.avatar),
                role: member.role,
                isOwner: member.isOwner,
                accepted: member.accepted,
                permissions: (currMember?.accepted === true ? member.permissions : []) as ProjectPermission[],
                organisationPermissions: (currMember?.accepted === true ? member.organisationPermissions : []) as OrganisationPermission[],
            })),
        });
    }

    return { data: organisationsList, status: HTTP_STATUS.OK };
}

export async function createOrganisation(userSession: ContextUserData, formData: z.infer<typeof createOrganisationFormSchema>) {
    const possiblyExistingOrgWithSameSlug = await GetOrganization_BySlugOrId(formData.slug.toLowerCase());
    if (possiblyExistingOrgWithSameSlug) {
        return invalidReqestResponseData("Organisation with the same slug already exists");
    }

    const newOrganisation = await CreateOrganization({
        data: {
            id: generateDbId(),
            name: formData.name,
            slug: formData.slug,
            description: formData.description,

            // Create the org team
            team: {
                create: {
                    id: generateDbId(),

                    // Create the org owner member
                    members: {
                        create: {
                            id: generateDbId(),
                            userId: userSession.id,
                            role: "Owner",
                            isOwner: true,
                            accepted: true,
                            dateAccepted: new Date(),
                        },
                    },
                },
            },
        },
    });

    return { data: { success: true, slug: newOrganisation.slug }, status: HTTP_STATUS.OK };
}

export async function getOrganisationProjects(userSession: ContextUserData | undefined, slug: string, listedOnly = false) {
    const Org = await GetOrganization_BySlugOrId(slug.toLowerCase(), slug);
    if (!Org) return notFoundResponseData("Organisation not found");
    if (!Org.projects) return { data: [], status: HTTP_STATUS.OK };

    return await getManyProjects(
        userSession,
        Org.projects.map((project) => project.id),
        listedOnly,
    );
}

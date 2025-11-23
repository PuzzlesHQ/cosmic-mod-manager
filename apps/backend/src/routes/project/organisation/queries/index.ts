import type { Prisma } from "@prisma-client";

export function orgMemberPermsSelect(where?: Prisma.TeamMemberWhereInput) {
    return {
        team: {
            select: {
                members: {
                    where: where,
                    select: {
                        id: true,
                        userId: true,
                        organisationPermissions: true,
                        isOwner: true,
                    },
                },
            },
        },
    } satisfies Prisma.OrganisationSelect;
}

import type { Prisma } from "@prisma-client";

export const TEAM_SELECT_FIELDS = {
    select: {
        id: true,

        members: {
            select: {
                id: true,
                teamId: true,
                userId: true,
                role: true,
                isOwner: true,
                permissions: true,
                organisationPermissions: true,
                accepted: true,
                dateAccepted: true,

                user: {
                    select: {
                        id: true,
                    },
                },
            },
            orderBy: { dateAccepted: "asc" },
        },

        project: {
            select: {
                id: true,
            },
        },

        organisation: {
            select: {
                id: true,
            },
        },
    } satisfies Prisma.TeamSelect,
};

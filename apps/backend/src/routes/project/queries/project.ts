import type { OrganisationPermission, ProjectPermission } from "@app/utils/types";
import type { Prisma, TeamMember } from "@prisma-client";

export function projectDetailsFields() {
    return {
        ...projectFields(),

        gallery: galleryFields(),
        team: {
            select: {
                id: true,
                members: teamMembersSelect(),
            },
        },
        organisation: {
            select: {
                id: true,
                iconFileId: true,
                name: true,
                slug: true,
                description: true,
                team: {
                    select: {
                        members: teamMembersSelect(),
                    },
                },
            },
        },
    } satisfies Prisma.ProjectSelect;
}

export function projectFields() {
    return {
        id: true,
        teamId: true,
        organisationId: true,
        name: true,
        slug: true,
        type: true,
        summary: true,
        description: true,
        datePublished: true,
        dateUpdated: true,
        dateQueued: true,
        dateApproved: true,
        requestedStatus: true,
        status: true,
        visibility: true,
        iconFileId: true,
        licenseId: true,
        licenseName: true,
        licenseUrl: true,
        downloads: true,
        followers: true,
        categories: true,
        featuredCategories: true,
        loaders: true,
        gameVersions: true,
        clientSide: true,
        serverSide: true,
        issueTrackerUrl: true,
        projectSourceUrl: true,
        projectWikiUrl: true,
        discordInviteUrl: true,
    } satisfies Prisma.ProjectSelect;
}

export function ListItemProjectFields() {
    return {
        id: true,
        slug: true,
        name: true,
        summary: true,
        type: true,
        iconFileId: true,
        downloads: true,
        followers: true,
        dateUpdated: true,
        datePublished: true,
        status: true,
        visibility: true,
        clientSide: true,
        serverSide: true,
        featuredCategories: true,
        categories: true,
        gameVersions: true,
        loaders: true,
        color: true,
    } satisfies Prisma.ProjectSelect;
}

export function galleryFields() {
    return {
        select: {
            id: true,
            imageFileId: true,
            thumbnailFileId: true,
            projectId: true,
            name: true,
            description: true,
            featured: true,
            dateCreated: true,
            orderIndex: true,
        },
        orderBy: { orderIndex: "desc" },
    } satisfies Prisma.Project$galleryArgs;
}

export function teamPermsSelectObj(where?: Prisma.TeamMemberWhereInput) {
    return {
        team: {
            select: {
                id: true,
                members: {
                    where: where,
                    select: {
                        id: true,
                        userId: true,
                        isOwner: true,
                        permissions: true,
                        organisationPermissions: true,
                        accepted: true,
                    },
                },
            } satisfies Prisma.TeamSelect,
        },
    };
}

export function projectMemberPermissionsSelect(where?: Prisma.TeamMemberWhereInput) {
    return {
        ...teamPermsSelectObj(where),
        organisation: {
            select: {
                id: true,
                ...teamPermsSelectObj(where),
            },
        },
    } satisfies Prisma.ProjectSelect;
}

export function projectMembersSelect() {
    return {
        team: {
            select: {
                members: teamMembersSelect(),
            },
        },
        organisation: {
            select: {
                team: {
                    select: {
                        members: teamMembersSelect(),
                    },
                },
            },
        },
    } satisfies Prisma.ProjectSelect;
}

export function teamMembersSelect() {
    return {
        select: teamMemberFields(),
        orderBy: { dateAccepted: "asc" },
    } satisfies Prisma.Team$membersArgs;
}

export function teamMemberFields() {
    return {
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
                userName: true,
                avatar: true,
            },
        },
    } satisfies Prisma.TeamMemberSelect;
}

// Formatters
interface FormatTeamMemberDataProps extends TeamMember {
    user: {
        id: string;
        userName: string;
        avatar: string | null;
    };
}
export function formatTeamMemberData(member: FormatTeamMemberDataProps) {
    return {
        id: member.id,
        userId: member.userId,
        teamId: member.teamId,
        userName: member.user.userName,
        avatar: member.user.avatar,
        role: member.role,
        isOwner: member.isOwner,
        accepted: member.accepted,
        permissions: member.permissions as ProjectPermission[],
        organisationPermissions: member.organisationPermissions as OrganisationPermission[],
    };
}

import { GlobalUserRole, OrganisationPermission, ProjectPermission } from "~/types";

export const MODERATOR_PERMISSIONS = {
    PROJECT: [],
    ORGANIZATION: [],
};

export const ADMIN_PERMISSIONS = {
    PROJECT: Object.values(ProjectPermission),
    ORGANIZATION: Object.values(OrganisationPermission),
};

type RolePermissions = {
    [key in GlobalUserRole]: {
        PROJECT: ProjectPermission[];
        ORGANIZATION: OrganisationPermission[];
    };
};

export const ROLE_PERMISSIONS: RolePermissions = {
    [GlobalUserRole.ADMIN]: ADMIN_PERMISSIONS,
    [GlobalUserRole.MODERATOR]: MODERATOR_PERMISSIONS,
    [GlobalUserRole.USER]: {
        PROJECT: [],
        ORGANIZATION: [],
    },
};

export function getRolePerms(userRole: string) {
    switch (userRole.toLowerCase()) {
        case GlobalUserRole.ADMIN:
            return ADMIN_PERMISSIONS;

        case GlobalUserRole.MODERATOR:
            return MODERATOR_PERMISSIONS;

        default:
            return {
                PROJECT: [],
                ORGANIZATION: [],
            };
    }
}

export function hasFullItemAccess(isItemOwner: boolean | undefined | null, userRole?: string) {
    return isItemOwner === true || userRole === GlobalUserRole.ADMIN;
}

export function isModerator(userRole: string | undefined | null) {
    return userRole === GlobalUserRole.ADMIN || userRole === GlobalUserRole.MODERATOR;
}

export function isAdmin(role: string | undefined | null) {
    return GlobalUserRole.ADMIN === role;
}

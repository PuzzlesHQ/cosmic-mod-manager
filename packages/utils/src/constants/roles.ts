import { GlobalUserRole, OrganisationPermission, ProjectPermission } from "~/types";

export const MODERATOR_ROLES = [GlobalUserRole.ADMIN, GlobalUserRole.MODERATOR];

export const MODERATOR_PERMISSIONS = {
    PROJECT: [],
    ORGANIZATION: [],
};

export const ADMIN_PERMISSIONS = {
    PROJECT: [
        ProjectPermission.UPLOAD_VERSION,
        ProjectPermission.DELETE_VERSION,
        ProjectPermission.EDIT_DETAILS,
        ProjectPermission.EDIT_DESCRIPTION,
        ProjectPermission.MANAGE_INVITES,
        ProjectPermission.REMOVE_MEMBER,
        ProjectPermission.EDIT_MEMBER,
        ProjectPermission.DELETE_PROJECT,
        ProjectPermission.VIEW_ANALYTICS,
        ProjectPermission.VIEW_REVENUE,
    ],
    ORGANIZATION: [
        OrganisationPermission.EDIT_DETAILS,
        OrganisationPermission.MANAGE_INVITES,
        OrganisationPermission.REMOVE_MEMBER,
        OrganisationPermission.EDIT_MEMBER,
        OrganisationPermission.ADD_PROJECT,
        OrganisationPermission.REMOVE_PROJECT,
        OrganisationPermission.DELETE_ORGANIZATION,
        OrganisationPermission.EDIT_MEMBER_DEFAULT_PERMISSIONS,
    ],
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

export function hasRootAccess(isItemOwner: boolean | undefined | null, userRole?: string) {
    return isItemOwner === true || userRole === GlobalUserRole.ADMIN;
}

export function isModerator(userRole: string | undefined) {
    return MODERATOR_ROLES.includes(userRole as GlobalUserRole);
}

export function isAdmin(role: string | undefined) {
    return GlobalUserRole.ADMIN === role;
}

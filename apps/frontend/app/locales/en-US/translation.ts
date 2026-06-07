import type { PartialLocale } from "~/locales/types";

export default {
    settings: {
        sessionsDesc:
            "These devices are currently logged into your account, you can revoke any session at any time. If you see something you don't recognize, immediately revoke the session and change the password of the associated auth provider.",
        colorTheme: "Color theme",
        colorThemeDesc: "Select your preferred color theme.",

        apiScopes: {
            organization_create: "Create organizations",
            organization_read: "Read organizations",
            organization_write: "Write organizations",
            organization_delete: "Delete organizations",
        },
    },

    dashboard: {
        organizations: "Organizations",
        createOrg: "Create organization",
        creatingOrg: "Creating an organization",
        enterOrgName: "Enter organization name",
        enterOrgDescription: "Enter a short description for your organization",
    },

    project: {
        organization: "Organization",
    },

    projectSettings: {
        leaveOrg: "Leave organization",
        leaveOrgDesc: "Remove yourself as a member of this organization.",
        inviteOrgMemberDesc:
            "Enter the username of the person you'd like to invite to be a member of this organization.",

        overrideValuesDesc:
            "Override organization default values and assign custom permissions and roles to this user on the project.",
        projectNotManagedByOrg:
            "This project is not managed by an organization. If you are the member of any organizations, you can transfer management to one of them.",
        selectOrg: "Select organization",
        projectManagedByOrg: (orgName: string) =>
            `This project is managed by ${orgName}. The defaults for member permissions are set in the organization settings. You may override them below.`,
        removeFromOrg: "Remove from organization",
    },

    organization: {
        orgDoesntHaveProjects: "This organization doesn't have any projects yet.",
        orgSettings: "Organization settings",
        transferProjectsTip:
            "You can transfer your existing projects to this organization from: Project settings > Members",
        noProjects_CreateOne: "This organization doesn't have any projects. Click the button above to create one.",
        orgInfo: "Organization information",
        deleteOrg: "Delete organization",
        deleteOrgDesc:
            "Deleting your organization will transfer all of its projects to the organization owner. This action cannot be undone.",
        sureToDeleteOrg: "Are you sure you want to delete this organization?",
        deleteOrgNamed: (orgName: string) => `Delete organization ${orgName}`,
        deletionWarning: "This will delete this organization forever (like forever ever).",

        perms: {
            delete_organization: "Delete organization",
        },
    },

    user: {
        isntPartOfAnyOrgs: (user: string) => `${user} is not a member of any Organization.`,
    },

    error: {
        oraganizationNotFound: "Organization not found",
        oraganizationNotFoundDesc: (slug: string) => `No organization exists with slug/ID '${slug}'`,
    },

    meta: {
        searchDesc: (projectType: string, siteName_short: string, siteName_long: string) =>
            `Search and download your favorite cosmic reach ${projectType} with ease here on ${siteName_short} (${siteName_long}).`,
        organization: (name: string) => `${name} - Organization`,
        organizationDesc: (orgDesc: string, name: string, siteName_short: string) =>
            `${orgDesc} - View the organization ${name} on ${siteName_short}`,
    },
} satisfies PartialLocale;

import type { FixedStringArray } from "@app/utils/types/helpers";
import type React from "react";
import type { Translation } from "~/locales/types";
import { AboutUs } from "./about";
import { CopyrightPolicy } from "./legal/copyright";
import { PrivacyPolicy } from "./legal/privacy";
import { Rules } from "./legal/rules";
import { SecurityNotice } from "./legal/security";
import tags from "./tags";
import { TermsOfUse } from "./terms";

function Pluralize(count: number, singular: string, plural: string) {
    return count === 1 ? singular : plural;
}

export default {
    common: {
        settings: "Settings",
        success: "Success",
        error: "Error",
        home: "Home",
        somethingWentWrong: "Something went wrong!",
        redirecting: "Redirecting...",
        accept: "Accept",
        decline: "Decline",
        download: "Download",
        report: "Report",
        copyId: "Copy ID",
        all: "All",
        noResults: "No results",
        more: "More",
        search: "Search...",
        you: "You",
        closed: "Closed",
        open: "Open",
        filter: "Filter",
        reset: "Reset",
    },

    // count is a number, whereas the formattedCount is Intl formatted string representation of the count
    // eg: count: 87_400, formattedCount: "87.4K" (dependent on locale)
    count: {
        downloads: (count: number, formattedCount: React.ReactNode) => {
            const downloads = Pluralize(count, "download", "downloads");
            return [formattedCount, " ", downloads];
        },
        followers: (count: number, formattedCount: React.ReactNode) => {
            const followers = Pluralize(count, "follower", "followers");
            return [formattedCount, " ", followers];
        },
        projects: (count: number, formattedCount: React.ReactNode) => {
            const projects = Pluralize(count, "project", "projects");
            return [formattedCount, " ", projects];
        },
        members: (count: number, formattedCount: React.ReactNode) => {
            const members = Pluralize(count, "member", "members");
            return [formattedCount, " ", members];
        },
    },

    navbar: {
        mod: "mod",
        mods: "mods",
        datamod: "datamod",
        datamods: "datamods",
        "resource-pack": "resource pack",
        "resource-packs": "resource packs",
        shader: "shader",
        shaders: "shaders",
        modpack: "modpack",
        modpacks: "modpacks",
        plugin: "plugin",
        plugins: "plugins",
        world: "world",
        worlds: "worlds",
        signout: "Sign Out",
        profile: "Profile",
        skipToMainContent: "Skip to main content",
    },

    homePage: {
        title: (projectType: string): FixedStringArray<3> => ["The place for Cosmic\u00A0Reach ", projectType, ""],
        desc: "The best place for your Cosmic Reach mods. Discover, play, and create content, all in one spot.",
        exploreMods: "Explore mods",
    },

    auth: {
        email: "Email",
        password: "Password",
        changePassword: "Change Password",
        loginUsing: "Login using:",
        dontHaveAccount: (signup: React.ReactNode) => ["Don't have an account? ", signup],
        alreadyHaveAccount: (login: React.ReactNode) => ["Already have an account? ", login],
        forgotPassword: (changePassword: React.ReactNode) => ["Forgot Password? ", changePassword],
        signupWithProviders: "Signup using any of the auth providers:",
        agreement: (terms: React.ReactNode, privacyPolicy: React.ReactNode) => [
            "By creating an account, you agree to our ",
            terms,
            " and ",
            privacyPolicy,
            ".",
        ],
        invalidCode: "Invalid or expired code",
        didntRequest: "Didn't request this?",
        checkSessions: "Check loggedIn sessions",
        confirmNewPass: "Confirm new password",
        confirmNewPassDesc:
            "A new password was recently added to your account and is awaiting confirmation. Confirm below if this was you.",
        newPass: "New password",
        newPass_label: "Enter your new password",
        confirmPass: "Confirm password",
        confirmPass_label: "Re-enter your password",
        deleteAccount: "Delete account",
        deleteAccountDesc:
            "Deleting your account will remove all of your data from our database. There is no going back after you delete your account.",
        enterEmail: "Enter your email address",
    },

    settings: {
        account: "Account",
        preferences: "Preferences",
        publicProfile: "Public Profile",
        accountAndSecurity: "Account and Security",
        sessions: "Sessions",
        toggleFeatures: "Toggle features",
        enableOrDisableFeatures: "Enable or disable certain features on this device.",
        viewTransitions: "View Transitions",
        viewTransitionsDesc: "Enables transitions (morph) when navigating between pages.",
        accountSecurity: "Account security",
        changePassTitle: "Change your account password",
        addPassDesc: "Add a password to use credentials login",
        manageAuthProviders: "Manage authentication providers",
        manageProvidersDesc: "Add or remove login methods from your account.",
        removePass: "Remove password",
        removePassTitle: "Remove your account password",
        removePassDesc: "After removing your password you won't be able to use credentials to log into your account",
        enterCurrentPass: "Enter your current password",
        addPass: "Add password",
        addPassDialogDesc: "You will be able to use this password to log into your account",
        manageProviders: "Manage providers",
        linkedProviders: "Linked auth providers",
        linkProvider: (provider: string) => `Link ${provider} to your account`,
        link: "Link", // Verb
        sureToDeleteAccount: "Are you sure you want to delete your account?",
        profileInfo: "Profile information",
        profileInfoDesc: (site: string) => `Your profile information is publicly viewable on ${site}.`,
        profilePic: "Profile picture",
        bio: "Bio",
        bioDesc: "A short description to tell everyone a little bit about you.",
        visitYourProfile: "Visit your profile",
        profilePageBg: "Profile page background",
        profilePageBgDesc: "This image/video will be used as a custom background for your profile page",

        showIpAddr: "Show IP addresses",
        sessionsDesc:
            "These devices are currently logged into your account, you can revoke any session at any time. If you see something you don't recognize, immediately revoke the session and change the password of the associated auth provider.",
        ipHidden: "IP Hidden",
        lastAccessed: (when: string) => `Last accessed ${when}`,
        created: (when: string) => `Created ${when}`, // eg: Created a month ago
        sessionCreatedUsing: (providerName: string) => `Session created using ${providerName}`,
        currSession: "Current session",
        revokeSession: "Revoke session",

        // Preferences
        colorTheme: "Color theme",
        colorThemeDesc: "Select your preferred color theme.",
        system: "System",
    },

    dashboard: {
        dashboard: "Dashboard",
        overview: "Overview",
        notifications: "Notifications",
        activeReports: "Active reports",
        analytics: "Analytics",
        projects: "Projects",
        organizations: "Organizations",
        collections: "Collections",
        collection: "Collection",
        revenue: "Revenue",
        manage: "Manage",
        seeAll: "See all",
        viewNotifHistory: "View notification history",
        noUnreadNotifs: "You don't have any unread notifications.",
        totalDownloads: "Total downloads",
        fromProjects: (count: number) => {
            const projects = Pluralize(count, "project", "projects");
            return `from ${count} ${projects}`;
        },
        totalFollowers: "Total followers",
        viewHistory: "View history",
        markAllRead: "Mark all as read",
        markRead: "Mark as read",
        deleteNotif: "Delete notification",
        received: "Received",
        history: "History",
        notifHistory: "Notification history",
        invitedToJoin: (user: React.ReactNode, team: React.ReactNode) => [user, " has invited you to join ", team],
        projectStatusUpdated: (project: React.ReactNode, oldStatus: React.ReactNode, newStatus: React.ReactNode) => [
            project,
            " has been updated from ",
            oldStatus,
            " to ",
            newStatus,
            " by the moderators. ",
        ],

        createProjectInfo: "You don't have any projects. Click the button above to create one.",
        type: "Type",
        status: "Status",
        createProject: "Create a project",
        creatingProject: "Creating a project",
        chooseProjectType: "Choose project type",
        projectTypeDesc: "Select the appropriate type for your project",
        createOrg: "Create organization",
        creatingOrg: "Creating an organization",
        enterOrgName: "Enter organization name",
        enterOrgDescription: "Enter a short description for your organization",
        creatingACollection: "Creating a collection",
        enterCollectionName: "Enter collection name",
        createCollection: "Create collection",
    },

    search: {
        // Search labels
        project: "Search projects",
        mod: "Search mods",
        "resource-pack": "Search resource packs",
        shader: "Search shaders",
        plugin: "Search plugins",
        modpack: "Search modpacks",
        datamod: "Search datamods",
        world: "Search worlds",

        // Sorting methods
        showPerPage: "Show per page",
        sortBy: "Sort by",

        relevance: "Relevance",
        downloads: "Downloads",
        trending: "Trending",
        follow_count: "Follow count",
        recently_updated: "Recently updated",
        recently_published: "Recently published",

        // View types
        view: {
            gallery: "Gallery view",
            list: "List view",
        },

        filters: "Filters",
        searchFilters: "Search filters",
        loaders: "Loaders",
        gameVersions: "Game versions",
        channels: "Channels",
        environment: "Environment",
        category: "Categories", // The key is kept singular just for ease of acess, the string is plural
        feature: "Features", // __
        resolution: "Resolutions", // __
        performance_impact: "Performance impact",
        license: "License",
        openSourceOnly: "Open source only",
        clearFilters: "Clear all filters",

        tags: tags,
        searchItemAuthor: (project: React.ReactNode, author: React.ReactNode) => [project, " by ", author],
    },

    project: {
        compatibility: "Compatibility",
        environments: "Environments",
        reportIssues: "Report issues",
        viewSource: "View source",
        visitWiki: "Visit wiki",
        joinDiscord: "Join discord server",
        featuredVersions: "Featured versions",
        creators: "Creators",
        organization: "Organization",
        project: "Project",
        details: "Details",
        licensed: (license: string): FixedStringArray<3> => ["LICENSED", license, ""],
        updatedAt: (when: string) => `Updated ${when}`, // eg: Updated 3 days ago
        publishedAt: (when: string) => `Published ${when}`, // eg: Published 3 days ago
        gallery: "Gallery",
        changelog: "Changelog",
        versions: "Versions",
        noProjectDesc: "No project description provided",
        uploadNewImg: "Upload a new gallery image",
        uploadImg: "Upload gallery image",
        galleryOrderingDesc: "Image with higher ordering will be listed first.",
        featuredGalleryImgDesc:
            "A featured gallery image shows up in search and your project card. Only one gallery image can be featured.",
        addGalleryImg: "Add gallery image",
        featureImg: "Feature image",
        unfeatureImg: "Unfeature image",
        sureToDeleteImg: "Are you sure you want to delete this gallery image?",
        deleteImgDesc: "This will remove this gallery image forever (like really forever).",
        editGalleryImg: "Edit gallery image",
        currImage: "Current image",

        // Version
        uploadVersion: "Upload a version",
        uploadNewVersion: "Upload a new project version",
        showDevVersions: "Show dev versions",
        noProjectVersions: "No project versions found",
        stats: "Stats",
        published: "Published", // Used for table headers
        downloads: "Downloads", // Used for table headers
        openInNewTab: "Open in new tab",
        copyLink: "Copy link",
        doesNotSupport: (project: string, version: string, loader: string) => {
            return `${project} does not support ${version} for ${loader}`;
        },
        downloadItem: (project: string) => `Download ${project}`,
        gameVersion: (version: React.ReactNode) => ["Game version: ", version],
        selectGameVersion: "Select game version",
        platform: (loader: React.ReactNode) => ["Platform: ", loader],
        selectPlatform: "Select platform",
        onlyAvailableFor: (project: string, platform: string) => `${project} is only available for ${platform}`,
        noVersionsAvailableFor: (gameVersion: string, loader: string) => `No versions available for ${gameVersion} on ${loader}`,
        declinedInvitation: "Declined invitation",
        teamInvitationTitle: (teamType: string) => `Invitation to join ${teamType}`, // teamType = organization | project
        teamInviteDesc: (teamType: string, role: string) =>
            `You've been invited be a member of this ${teamType} with the role of '${role}'.`,

        browse: {
            mod: "Browse mods",
            datamod: "Browse datamods",
            "resource-pack": "Browse resource packs",
            shader: "Browse shaders",
            modpack: "Browse modpacks",
            plugin: "Browse plugins",
            world: "Browse worlds",
        },

        rejected: "Rejected",
        withheld: "Withheld",
        archivedMessage: (project: string) =>
            `${project} has been archived. It will not receive any further updates unless the author decides to unarchive the project.`,
        updateProjectStatus: "Update project status",
        sureToUpdateStatus: (projectName: string, projectType: string, prevStatus: string, newStatus: string) =>
            `Are you sure you want to update the status of **${projectName}** ${projectType} from **${prevStatus}** to **${newStatus}**?`,

        publishingChecklist: {
            required: "Required",
            suggestion: "Suggestion",
            review: "Review",
            progress: "Progress:",
            title: "Publishing checklist",
            uploadVersion: "Upload a version",
            uploadVersionDesc: "At least one version is required for a project to be submitted for review.",
            addDescription: "Add a description",
            addDescriptionDesc: "A description that clearly describes the project's purpose and function is required.",
            addIcon: "Add an icon",
            addIconDesc: "Your project should have a nice-looking icon to uniquely identify your project at a glance.",
            featureGalleryImg: "Feature a gallery image",
            featureGalleryImgDesc: "Featured gallery images may be the first impression of many users.",
            selectTags: "Select tags",
            selectTagsDesc: "Select all tags that apply to your project.",
            addExtLinks: "Add external links",
            addExtLinksDesc: "Add any relevant links, such as sources, issues, or a Discord invite.",
            selectLicense: "Select license",
            selectLicenseDesc: (projectType: string) => `Select the license your ${projectType} is distributed under.`,
            selectEnv: "Select supported environments",
            selectEnvDesc: (projectType: string) =>
                `Select if the ${projectType} functions on the client-side and/or server-side.`,
            requiredStepsDesc: "All marked with an asterisk(*) are required",
            submitForReview: "Submit for review",
            submitForReviewDesc:
                "Your project is only viewable by members of the project. It must be reviewed by moderators in order to be published.",
            resubmitForReview: "Resubmit for review",
            resubmit_ApprovalRejected:
                "Your project has been rejected by our moderator. In most cases, you can resubmit for review after addressing the moderator's message.",
            resubmit_ProjectWithheld:
                "Your project has been withheld by our moderator. In most cases, you can resubmit for review after addressing the moderator's message.",
            visit: {
                versionsPage: "Visit versions page",
                descriptionSettings: "Visit description settings",
                generalSettings: "Visit general settings",
                galleryPage: "Visit gallery page",
                tagSettings: "Visit tag settings",
                linksSettings: "Visit links settings",
                licenseSettings: "Visit license settings",
                moderationPage: "Visit moderation page",
            },
        },
    },

    version: {
        version: "Version",
        deleteVersion: "Delete version",
        sureToDelete: "Are you sure you want to delete this version?",
        deleteDesc: "This will remove this version forever (like really forever).",
        enterVersionTitle: "Enter the version title...",
        feature: "Feature version",
        unfeature: "Unfeature version",
        featured: "Featured",
        releaseChannel: "Release channel",
        versionNumber: "Version number",
        selectLoaders: "Select loaders",
        selectVersions: "Select versions",
        cantAddCurrProject: "You cannot add the current project as a dependency",
        cantAddDuplicateDep: "You cannot add the same dependency twice",
        addDep: "Add dependency",
        enterProjectId: "Enter the project ID/Slug",
        enterVersionId: "Enter the version ID/Slug",
        dependencies: "Dependencies",
        files: "Files",

        depencency: {
            required: "Required",
            optional: "Optional",
            incompatible: "Incompatible",
            embedded: "Embedded",
            required_desc: (version: string) => `Version ${version} is required`,
            optional_desc: (version: string) => `Version ${version} is optional`,
            incompatible_desc: (version: string) => `Version ${version} is incompatible`,
            embedded_desc: (version: string) => `Version ${version} is embedded`,
        },

        primary: "Primary",
        noPrimaryFile: "No primary file chosen",
        chooseFile: "Choose file",
        replaceFile: "Replace file",
        uploadExtraFiles: "Upload additional files",
        uploadExtraFilesDesc: "Used for additional files like sources, documentation, etc.",
        selectFiles: "Select files",
        primaryFileRequired: "Primary file is required",
        metadata: "Metadata",
        devReleasesNote: "NOTE:- Older dev releases will be automatically deleted after a new dev release is published.",
        publicationDate: "Publication date",
        publisher: "Publisher",
        versionID: "Version ID",
        copySha1: "Copy SHA-1 hash",
        copySha512: "Copy SHA-512 hash",
        copyFileUrl: "Copy file URL",

        publishedBy: (version: React.ReactNode, author: React.ReactNode, publish_date: React.ReactNode) => [
            version,
            " by ",
            author,
            " on ",
            publish_date,
        ],
    },

    projectSettings: {
        settings: "Project settings",
        general: "General",
        tags: "Tags",
        links: "Links",
        members: "Members",
        view: "View",
        upload: "Upload",
        externalLinks: "External links",
        issueTracker: "Issue tracker",
        issueTrackerDesc: "A place for users to report bugs, issues, and concerns about your project.",
        sourceCode: "Source code",
        sourceCodeDesc: "A page/repository containing the source code for your project.",
        wikiPage: "Wiki page",
        wikiPageDesc: "A page containing information, documentation, and help for the project.",
        discordInvite: "Discord invite",
        discordInviteDesc: "An invitation link to your Discord server.",
        licenseDesc: (projectType: string) =>
            `It is very important to choose a proper license for your ${projectType}. You may choose one from our list or provide a custom license. You may also provide a custom URL to your chosen license; otherwise, the license text will be displayed.`,
        customLicenseDesc:
            "Enter a valid [SPDX license identifier](https://spdx.org/licenses) in the marked area. If your license does not have a SPDX identifier (for example, if you created the license yourself or if the license is Cosmic Reach specific), simply check the box and enter the name of the license instead.",
        selectLicense: "Select license",
        custom: "Custom",
        licenseName: "License name",
        licenseUrl: "License URL (optional)",
        spdxId: "SPDX identifier",
        doesntHaveSpdxId: "License does not have a SPDX identifier",
        tagsDesc: (projectType: string) =>
            `Accurate tagging is important to help people find your ${projectType}. Make sure to select all tags that apply.`,
        featuredCategories: "Featured categories",
        featuredCategoriesDesc: (count: number) => `You can feature up to ${count} of your most relevant tags.`,
        selectAtLeastOneCategory: "Select at least one category in order to feature a category.",
        projectInfo: "Project information",
        clientSide: "Client side",
        clientSideDesc: (projectType: string) => `Select based on if your ${projectType} has functionality on the client side.`,
        serverSide: "Server side",
        serverSideDesc: (projectType: string) =>
            `Select based on if your ${projectType} has functionality on the logical server.`,
        unknown: "Unknown",
        clientOrServer: "Client or server",
        clientAndServer: "Client and server",
        required: "Required",
        optional: "Optional",
        unsupported: "Unsupported",
        visibilityDesc:
            "Listed and archived projects are visible in search. Unlisted projects are published, but not visible in search or on user profiles. Private projects are only accessible by members of the project.",
        ifApproved: "If approved by the moderators:",
        visibleInSearch: "Visible in search",
        visibleOnProfile: "Visible on profile",
        visibleViaUrl: "Visible via URL",
        visibleToMembersOnly: "Only members will be able to view the project",
        listed: "Listed",
        private: "Private",
        public: "Public",
        unlisted: "Unlisted",
        archived: "Archived",
        deleteProject: "Delete project",
        deleteProjectDesc: (site: string) =>
            `Removes your project from ${site}'s servers and search. Clicking on this will delete your project, so be extra careful!`,
        sureToDeleteProject: "Are you sure you want to delete this project?",
        deleteProjectDesc2:
            "If you proceed, all versions and any attached data will be removed from our servers. This may break other projects, so be careful.",
        typeToVerify: (projectName: string) => `To verify, type **${projectName}** below:`,
        typeHere: "Type here...",
        manageMembers: "Manage members",
        leftProjectTeam: "You have left the team",
        leaveOrg: "Leave organization",
        leaveProject: "Leave project",
        leaveOrgDesc: "Remove yourself as a member of this organization.",
        leaveProjectDesc: "Remove yourself as a member of this project.",
        sureToLeaveTeam: "Are you sure you want to leave this team?",
        cantManageInvites: "You don't have access to manage member invites",
        inviteMember: "Invite a member",
        inviteProjectMemberDesc: "Enter the username of the person you'd like to invite to be a member of this project.",
        inviteOrgMemberDesc: "Enter the username of the person you'd like to invite to be a member of this organization.",
        invite: "Invite",
        memberUpdated: "Member updated successfully",
        pending: "Pending",
        role: "Role",
        roleDesc: "The title of the role that this member plays for this team.",
        permissions: "Permissions",
        perms: {
            upload_version: "Upload version",
            delete_version: "Delete version",
            edit_details: "Edit details",
            edit_description: "Edit description",
            manage_invites: "Manage invites",
            remove_member: "Remove member",
            edit_member: "Edit member",
            delete_project: "Delete project",
            view_analytics: "View analytics",
            view_revenue: "View revenue",
        },
        owner: "Owner",
        removeMember: "Remove member",
        transferOwnership: "Transfer ownership",
        overrideValues: "Override values",
        overrideValuesDesc:
            "Override organization default values and assign custom permissions and roles to this user on the project.",
        projectNotManagedByOrg:
            "This project is not managed by an organization. If you are the member of any organizations, you can transfer management to one of them.",
        transferManagementToOrg: "Transfer management",
        selectOrg: "Select organization",
        projectManagedByOrg: (orgName: string) =>
            `This project is managed by ${orgName}. The defaults for member permissions are set in the organization settings. You may override them below.`,
        removeFromOrg: "Remove from organization",
        memberRemoved: "Member removed successfully",
        sureToRemoveMember: (memberName: string) => `Are you sure you want to remove ${memberName} from this team?`,
        ownershipTransfered: "Ownership transferred successfully",
        sureToTransferOwnership: (memberName: string) => `Are you sure you want to transfer ownership to ${memberName}?`,
    },

    organization: {
        orgDoesntHaveProjects: "This organization doesn't have any projects yet.",
        manageProjects: "Manage projects",
        orgSettings: "Organization settings",
        transferProjectsTip: "You can transfer your existing projects to this organization from: Project settings > Members",
        noProjects_CreateOne: "This organization doesn't have any projects. Click the button above to create one.",
        orgInfo: "Organization information",
        deleteOrg: "Delete organization",
        deleteOrgDesc:
            "Deleting your organization will transfer all of its projects to the organization owner. This action cannot be undone.",
        sureToDeleteOrg: "Are you sure you want to delete this organization?",
        deleteOrgNamed: (orgName: string) => `Delete organization ${orgName}`,
        deletionWarning: "This will delete this organization forever (like forever ever).",

        perms: {
            edit_details: "Edit details",
            manage_invites: "Manage invites",
            remove_member: "Remove member",
            edit_member: "Edit member",
            add_project: "Add project",
            remove_project: "Remove project",
            delete_organization: "Delete organization",
            edit_member_default_permissions: "Edit member default permissions",
        },
    },

    user: {
        user: "User",
        admin: "Admin",
        moderator: "Moderator",
        doesntHaveProjects: (user: string) => `${user} doesn't have any projects yet.`,
        isntPartOfAnyOrgs: (user: string) => `${user} is not a member of any Organization.`,
        joined: (when: string) => `Joined ${when}`, // eg: Joined 2 months ago
        accountDeleted: "The user account was deleted.",
    },

    collection: {
        curatedBy: "Curated by",
        searchCollections: "Search collections",
        editingCollection: "Editing collection",
        deleteCollection: "Delete collection",
        sureToDeleteCollection: "Are you sure you want to delete this collection?",
        followedProjects: "Followed projects",
        followedProjectsDesc: "Auto-generated collection of all the projects you're following.",
    },

    footer: {
        resources: "Resources",
        docs: "Docs",
        status: "Status",
        support: "Support",
        socials: "Socials",
        about: "About",
        changeTheme: "Change theme",
        siteOfferedIn: (site: string) => `${site} offered in:`,
    },

    legal: {
        legal: "Legal",
        rules: "Rules",
        rulesTitle: "Content Rules",
        contentRules: Rules,
        termsTitle: "Terms of Use",
        termsOfUse: TermsOfUse,
        copyrightPolicyTitle: "Copyright Policy",
        copyrightPolicy: CopyrightPolicy,
        securityNoticeTitle: "Security Notice",
        securityNotice: SecurityNotice,
        privacyPolicyTitle: "Privacy Policy",
        privacyPolicy: PrivacyPolicy,

        // About us page
        aboutUs: AboutUs,
    },

    moderation: {
        review: "Review projects",
        reports: "Reports",
        moderation: "Moderation",
        statistics: "Statistics",
        authors: "Authors",
        projectsInQueue: (count: number) => {
            if (count === 1) return "There is 1 project in the queue.";
            return `There are ${count} projects in the queue.`;
        },
        // hours will either be 24 or 48
        projectsQueuedFor: (count: number, hours: number) => {
            if (count === 1) return `1 project has been in the queue for over ${hours} hours.`;
            return `${count} projects have been in the queue for over ${hours} hours.`;
        },
        submitted: (when: string) => `Submitted ${when}`, // eg: Submitted 4 hours ago, (the date string comes from the localized phrases defined at end of the file)
        viewProject: "View project",
        awaitingApproval: "Project is queued for approval",
        draft: "Draft",
        approve: "Approve",
        reject: "Reject",
        withhold: "Withhold",
        projectStatus: "Project status",

        status: {
            draft: "Draft",
            processing: "Processing",
            approved: "Approved",
            withheld: "Withheld",
            rejected: "Rejected",
            unknown: "Unknown",
        },

        pageDesc:
            "This is a private conversation thread with the moderators. They may message you with issues concerning this project. This thread is only checked when you submit your project for review.",
        approved_msg: "Your project has been approved by the moderators.",
        underReview_msg: (discord_invite: string) => `Your project is currently under review. 
            If it takes more than 48 hours feel free to contact us on our [Discord server](${discord_invite}).`,
        rejected_msg: (contentRules_url: string) => `Your project does not currently meet our
            [content rules](${contentRules_url}) and the moderators have requested you make changes before it can be approved. 
            Read the messages from the moderators below and address their comments before resubmitting.`,
        repeatedSubmission_warning:
            "Repeated submissions without addressing the moderators' comments may result in an account suspension.",
        messages: "Messages",
        resubmitDesc: {
            _1: (project: string) => `You're submitting ${project} to be reviewed again by the moderators.`,
            _2: "Make sure you have addressed the comments from the moderation team.",
            warning: "Repeated submissions without addressing the moderators' comments may result in an account suspension.",
        },
    },

    chatThread: {
        messagePlaceholder: "Message...",
        noMessages: "No messages yet!",
        replyingTo: (user: React.ReactNode) => ["Replying to ", user],
        addPrivateNote: "Add private note",
        messageDeleted: "This message was deleted",
        projectSubmittedForReview: "submitted the project for review.",
        changedProjectStatus: (oldStatus: React.ReactNode, newStatus: React.ReactNode) => [
            "changed the project's status from ",
            oldStatus,
            " to ",
            newStatus,
        ],
        closedTheThread: "closed the thread.",
        reopenedTheThread: "reopened the thread.",
        reply: "Reply",
        deleteMsg: "Delete message",
        sureToDeleteMsg: "Are you sure you want to delete this message?",
        threadClosedDesc: "This thread is closed and new messages cannot be sent to it.",
        closeThread: "Close thread",
        reopenThread: "Reopen thread",
        permalink: "Permalink",
    },

    form: {
        login: "Login",
        login_withSpace: "Log In",
        signup: "Sign Up",
        email: "Email",
        username: "Username",
        password: "Password",
        name: "Name",
        displayName: "Display name",
        icon: "Icon",
        details: "Details",
        description: "Description",
        id: "ID",
        url: "URL",
        projectType: "Project type",
        visibility: "Visibility",
        summary: "Summary",
        title: "Title",
        ordering: "Ordering",
        featured: "Featured",
        continue: "Continue",
        submit: "Submit",
        remove: "Remove",
        confirm: "Confirm",
        edit: "Edit",
        delete: "Delete",
        cancel: "Cancel",
        saveChanges: "Save Changes",
        uploadIcon: "Upload icon",
        removeIcon: "Remove icon",
        noFileChosen: "No file chosen",
        showAllVersions: "Show all versions",
        createNew: "Create new",
    },

    error: {
        sthWentWrong: "Oops! Something went wrong",
        errorDesc: "Seems like something broke, while we try to resolve the issue try refreshing the page.",
        refresh: "Refresh",

        pageNotFound: "404 | Page not found.",
        pageNotFoundDesc: "Sorry, we couldn't find the page you're looking for.",

        projectNotFound: "Project not found",
        projectNotFoundDesc: (projectType: string, slug: string) => `No ${projectType} exists with slug/ID '${slug}'`,

        versionNotFound: "Version not found",
        versionNotFoundDesc: (project: string, type: string) =>
            `The version of '${project}' ${type} you're looking for could not be found.`,
        gotoVersionsList: "Go to versions list",

        oraganizationNotFound: "Organization not found",
        oraganizationNotFoundDesc: (slug: string) => `No organization exists with slug/ID '${slug}'`,

        userNotFound: "User not found",
        userNotFoundDesc: (userName: string) => `No user exists with userName/ID '${userName}'`,
    },

    editor: {
        heading1: "Heading 1",
        heading2: "Heading 2",
        heading3: "Heading 3",
        bold: "Bold",
        italic: "Italic",
        underline: "Underline",
        strikethrough: "Strikethrough",
        code: "Code",
        spoiler: "Spoiler",
        bulletedList: "Bulleted list",
        numberedList: "Numbered list",
        quote: "Quote",
        insertLink: "Insert link",
        label: "Label",
        enterLabel: "Enter label",
        link: "Link", // Noun
        enterUrl: "Enter the link URL",
        insertImage: "Insert image",
        imgAlt: "Description (alt text)",
        imgAltDesc: "Enter a description for the image",
        enterImgUrl: "Enter the image URL",
        image: "Image",
        inserYtVideo: "Insert YouTube video",
        ytVideoUrl: "YouTube video URL",
        enterYtUrl: "Enter the YouTube video URL",
        video: "Video",
        preview: "Preview",
        insert: "Insert",
        supportsMarkdown: (markdownPageUrl: string) => `You can use [Markdown](${markdownPageUrl}) format here.`,
        keyboardShortcuts: "Keyboard shortcuts",
        action: "Action",
        shortcut: "Shortcut",
        toggleLineWrap: "Toggle line wrap",
    },

    report: {
        content: "content",
        reportToMods: (itemName: string) => `Report ${itemName} to moderators`,

        alreadyReported: (itemName: string) => `You've already reported ${itemName}`,
        alreadyReportedDesc: (itemType: string) =>
            `You have an open report for this ${itemType} already. You can add more details to your report if you have more information to add.`,
        backToContent: (itemType: string) => `Back to ${itemType}`,
        goToReport: "Go to report",
        whatTypeOfContent: "What type of content are you reporting?",
        whatIsContentId: (item: string) => `What is the ID of the ${item.toLowerCase()}?`,
        pleaseReport: "Please report:",
        itsNotFor: "This form is not for:",
        rulesViolation: (siteName_short: string, rules: React.ReactNode, tos: React.ReactNode) => [
            `Violation of ${siteName_short} `,
            rules,
            " or ",
            tos,
        ],
        violationExamples: "Examples include malicious, spam, offensive, deceptive, misleading, and illegal content.",
        bugReports: "Bug reports",
        dmcaTakedowns: "DMCA takedowns",
        seeCopyrightPolicy: (copyrightPolicy: React.ReactNode) => ["See our ", copyrightPolicy, "."],
        whichRuleIsBeingViolated: (siteName_short: string, item: string) =>
            `Which of ${siteName_short}'s rules is this ${item.toLowerCase()} violating?`,
        violationType: {
            spam: "Spam",
            reuploaded_work: "Reuploaded work",
            reuploaded_work_desc: {
                _1: "Please note that you are *not* submitting a DMCA takedown request, but rather a report of reuploaded content.",
                _2: (copyrightPolicy: React.ReactNode) => [
                    "If you meant to file a DMCA takedown request (which is a legal action) instead, please see our ",
                    copyrightPolicy,
                    ".",
                ],
            },
            inappropriate: "Inappropriate",
            malicious: "Malicious",
            malicious_desc: [
                "Reports for malicious or deceptive content must include substantial evidence of the behavior, such as code samples.",
                "Summaries from Microsoft Defender, VirusTotal, or AI malware detection are not sufficient forms of evidence and will not be accepted.",
            ],
            name_squatting: "Name-squatting",
            poor_description: "Poor description",
            invalid_metadata: "Invalid metadata",
            other: "Other",
        },
        provideAdditionalContext: "Please provide additional context about your report",
        additionalContextDesc:
            "Include links and images if possible and relevant. Empty or insufficient reports will be closed and ignored.",
        submitReport: "Submit report",
        noOpenReports: "You don't have any open reports.",
        viewReport: "View report",
        reportedBy: (reporter: React.ReactNode) => ["Reported by ", reporter],
        reportDetails: "Report details",
        status: (status: string) => ["Status: ", status],
        reportedItem: (itemType: string) => ["Reported item: ", itemType],
        ruleViolated: (ruleType: string) => ["Rule violated: ", ruleType],
    },

    graph: {
        noDataAvailable: "No data available for the selected date range.",
        timeline: {
            yesterday: "Yesterday",
            this_week: "This week",
            last_week: "Last week",
            previous_7_days: "Previous 7 days",
            this_month: "This month",
            last_month: "Last month",
            previous_30_days: "Previous 30 days",
            previous_90_days: "Previous 90 days",
            this_year: "This year",
            last_year: "Last year",
            previous_365_days: "Previous 365 days",
            all_time: "All time",
        },
    },

    meta: {
        /* name would be site name in most cases
         For example on login page: "Login - CRMM"
         but on pages like project settings it will be project's name: "Settings - SomeMod"
         same for organization pages
        */
        addContext: (title: string, name: string) => `${title} - ${name}`,

        siteDesc: (siteName_long: string, siteName_short: string) =>
            `Download Cosmic Reach mods, plugins, datamods, shaders, resourcepacks, and modpacks on ${siteName_short} (${siteName_long}). Discover and publish projects on ${siteName_short} with a modern, easy to use interface and API.`,

        searchDesc: (projectType: string, siteName_short: string, siteName_long: string) =>
            `Search and download your favorite cosmic reach ${projectType} with ease here on ${siteName_short} (${siteName_long}).`,

        about: "About Us",
        loginDesc: (siteName_short: string) => `Log into your ${siteName_short} account.`,
        signupDesc: (siteName_short: string) => `Sign up for a ${siteName_short} account.`,
        changePassDesc: (siteName_short: string) => `Change your ${siteName_short} account password.`,

        userPageDesc: (userBio: string, userName: string, siteName_short: string) =>
            `${userBio} - Download ${userName}'s projects on ${siteName_short}`,

        collection: (name: string) => `${name} - Collection`,
        collectionDesc: (userProvidedDesc: string, name: string, siteName_short: string) =>
            `${userProvidedDesc} - View the collection ${name} on ${siteName_short}`,
        collectionNotFound: "Collection not found",
        collectionNotFoundDesc: (collectionId: string) => `No collection found with id: ${collectionId}`,

        copyrightPolicyPageDesc: (siteName_short: string) =>
            `The Copyright Policy of ${siteName_short}, an open source modding platform focused on Cosmic Reach`,
        privacyPolicyPageDesc: (siteName_short: string) =>
            `The Privacy Policy of ${siteName_short}, an open source modding platform focused on Cosmic Reach`,
        contentRulesPageDesc: (siteName_short: string) =>
            `The Content Rules of ${siteName_short}, an open source modding platform focused on Cosmic Reach`,
        securityNoticePageDesc: (siteName_short: string) =>
            `The Security Notice of ${siteName_short}, an open source modding platform focused on Cosmic Reach`,
        tosPageDesc: (siteName_short: string) =>
            `The Terms of Use of ${siteName_short}, an open source modding platform focused on Cosmic Reach`,

        project: (project: string, type: string) => `${project} - Cosmic Reach ${type}`, // type will be mod, datamod etc
        projectDesc: (project: string, summary: string, type: string, author: string, siteName_short: string) =>
            `${summary} - Download the Cosmic Reach ${type} '${project}' by ${author} on ${siteName_short}`,

        galleryDesc: (numImages: number, project: string, type: string, siteName_short: string) =>
            `View ${numImages} image(s) of '${project}' ${type} on ${siteName_short}`,

        changelogDesc: (project: string, versionsNum: number) => `View the changelog of ${project}'s ${versionsNum} version(s).`,

        versionsListDesc: (project: string, versionsNum: number) => `List of ${project}'s ${versionsNum} version(s).`,
        versionPageDesc: (o: {
            project: string;
            versionNumber: string;
            siteName_short: string;
            supportedGameVersions: string;
            loaders: string | null;
            publishedAt: string;
            author: string;
            downloads: string;
        }) => {
            let string = `Download ${o.project} ${o.versionNumber} on ${o.siteName_short}. Supports cosmic reach ${o.supportedGameVersions}`;
            if (o.loaders) string += ` on ${o.loaders}.`;
            string += ` Published on ${o.publishedAt} by ${o.author}. ${o.downloads} downloads.`;

            return string;
        },

        organization: (name: string) => `${name} - Organization`,
        organizationDesc: (orgDesc: string, name: string, siteName_short: string) =>
            `${orgDesc} - View the organization ${name} on ${siteName_short}`,
    },
} satisfies Translation;

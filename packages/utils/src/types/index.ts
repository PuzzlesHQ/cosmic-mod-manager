export enum AuthProvider {
    GITHUB = "github",
    GITLAB = "gitlab",
    DISCORD = "discord",
    GOOGLE = "google",

    CREDENTIAL = "credential",
    UNKNOWN = "unknown",
}

export enum GlobalUserRole {
    ADMIN = "admin",
    MODERATOR = "moderator",
    USER = "user",
}

export enum UserSessionStates {
    ACTIVE = "active",
    UNVERIFIED = "unverified",
}

export interface LoggedInUserData {
    id: string;
    email: string;
    userName: string;
    name: string;
    hasAPassword: boolean;
    avatar: string | null;
    role: GlobalUserRole;
    bio: string | null;
    profilePageBg: string | null;
    sessionId: string | null;
    patId: string | null;
}

export enum ProjectType {
    MOD = "mod",
    MODPACK = "modpack",
    SHADER = "shader",
    RESOURCE_PACK = "resource-pack",
    DATAMOD = "datamod",
    PLUGIN = "plugin",
    WORLD = "world",
}

export enum AuthActionIntent {
    SIGN_IN = "signin",
    SIGN_UP = "signup",
    LINK = "link",
}

export interface LinkedProvidersListData {
    id: string;
    providerName: string;
    providerAccountId: string;
    providerAccountEmail: string;
}

export enum ConfirmationType {
    CONFIRM_NEW_PASSWORD = "confirm-new-password",
    CHANGE_ACCOUNT_PASSWORD = "change-account-password",
    DELETE_USER_ACCOUNT = "delete-user-account",
}

// PROJECT
export enum ProjectVisibility {
    LISTED = "listed",
    PRIVATE = "private",
    UNLISTED = "unlisted",
    ARCHIVED = "archived",
}

export enum ProjectPublishingStatus {
    DRAFT = "draft",
    PROCESSING = "processing",
    APPROVED = "approved",
    WITHHELD = "withheld",
    REJECTED = "rejected",
}

export enum VersionReleaseChannel {
    RELEASE = "release",
    BETA = "beta",
    ALPHA = "alpha",
    DEV = "dev",
}

export enum GameVersionReleaseType {
    RELEASE = "release",
    BETA = "beta",
    ALPHA = "alpha",
    PRE_RELEASE = "pre-release",
    SNAPSHOT = "snapshot",
}

export enum ProjectPermission {
    UPLOAD_VERSION = "upload_version",
    DELETE_VERSION = "delete_version",
    EDIT_DETAILS = "edit_details",
    EDIT_DESCRIPTION = "edit_description",
    MANAGE_INVITES = "manage_invites",
    REMOVE_MEMBER = "remove_member",
    EDIT_MEMBER = "edit_member",
    DELETE_PROJECT = "delete_project",
    VIEW_ANALYTICS = "view_analytics",
    VIEW_REVENUE = "view_revenue",
}

export enum OrganisationPermission {
    EDIT_DETAILS = "edit_details",
    MANAGE_INVITES = "manage_invites",
    REMOVE_MEMBER = "remove_member",
    EDIT_MEMBER = "edit_member",
    ADD_PROJECT = "add_project",
    REMOVE_PROJECT = "remove_project",
    DELETE_ORGANIZATION = "delete_organization",
    EDIT_MEMBER_DEFAULT_PERMISSIONS = "edit_member_default_permissions",
}

export type FileObjectType = {
    name: string;
    size: number;
    type: string;
};

export enum DependsOn {
    PROJECT = "project",
    VERSION = "version",
}

export enum DependencyType {
    REQUIRED = "required",
    OPTIONAL = "optional",
    INCOMPATIBLE = "incompatible",
    EMBEDDED = "embedded",
}

export enum FileType {
    JAR = "jar",
    ZIP = "zip",
    SEVEN_Z = "7z",
    GZ = "gz",
    TAR = "tar",

    PNG = "png",
    JPEG = "jpeg",
    WEBP = "webp",
    GIF = "gif",

    MP4 = "mp4",
    WEBM = "webm",
    MKV = "mkv",
}

export enum EnvironmentSupport {
    UNKNOWN = "unknown",
    REQUIRED = "required",
    OPTIONAL = "optional",
    UNSUPPORTED = "unsupported",
}

export enum TagType {
    CATEGORY = "category",
    FEATURE = "feature",
    RESOLUTION = "resolution",
    PERFORMANCE_IMPACT = "performance_impact",
}

export enum SearchResultSortMethod {
    RELEVANCE = "relevance",
    DOWNLOADS = "downloads",
    TRENDING = "trending",
    FOLLOW_COUNT = "follow_count",
    RECENTLY_UPDATED = "recently_updated",
    RECENTLY_PUBLISHED = "recently_published",
}

export enum CollectionVisibility {
    PUBLIC = "public",
    PRIVATE = "private",
    UNLISTED = "unlisted",
}

export enum TimelineOptions {
    YESTERDAY = "yesterday",
    THIS_WEEK = "this_week",
    LAST_WEEK = "last_week",
    PREVIOUS_7_DAYS = "previous_7_days",
    THIS_MONTH = "this_month",
    LAST_MONTH = "last_month",
    PREVIOUS_30_DAYS = "previous_30_days",
    PREVIOUS_90_DAYS = "previous_90_days",
    THIS_YEAR = "this_year",
    LAST_YEAR = "last_year",
    PREVIOUS_365_DAYS = "previous_365_days",
    ALL_TIME = "all_time",
}

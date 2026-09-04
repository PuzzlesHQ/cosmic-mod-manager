import {
    AuthProvider,
    EnvironmentSupport,
    OrganisationPermission,
    ProjectPermission,
    ProjectPublishingStatus,
    ProjectType,
} from "~/types";

export const authProvidersList = Object.values(AuthProvider).filter(
    (v) => v !== AuthProvider.UNKNOWN,
) as AuthProvider[];

export const projectTypes = Object.values(ProjectType);

export const ProjectPermissionsList = Object.values(ProjectPermission);
export const OrgPermissionsList = Object.values(OrganisationPermission);

export const RejectedStatuses = [ProjectPublishingStatus.REJECTED, ProjectPublishingStatus.WITHHELD];
export function isRejected(projectStatus: string) {
    return RejectedStatuses.includes(projectStatus.toLowerCase() as ProjectPublishingStatus);
}

export function isUnderReview(projectStatus: string) {
    return projectStatus.toLowerCase() === ProjectPublishingStatus.PROCESSING;
}

export function isApproved(projectStatus: string) {
    return projectStatus.toLowerCase() === ProjectPublishingStatus.APPROVED;
}

export const ShowEnvSupportSettingsForType = [ProjectType.MOD, ProjectType.MODPACK, ProjectType.DATAMOD];

export function GetProjectEnvironment(
    type: ProjectType[],
    clientSide?: EnvironmentSupport,
    serverSide?: EnvironmentSupport,
) {
    // Shaders and resource packs can only be used client side
    if (type.includes(ProjectType.SHADER) || type.includes(ProjectType.RESOURCE_PACK)) {
        return {
            clientSide: EnvironmentSupport.REQUIRED,
            serverSide: EnvironmentSupport.UNSUPPORTED,
        };
    }

    // Plugins are server only
    if (type.includes(ProjectType.PLUGIN)) {
        return {
            clientSide: type.includes(ProjectType.MOD) && clientSide ? clientSide : EnvironmentSupport.UNSUPPORTED,
            serverSide: EnvironmentSupport.REQUIRED,
        };
    }

    // Worlds are server only
    if (type.includes(ProjectType.WORLD)) {
        return {
            clientSide: EnvironmentSupport.UNSUPPORTED,
            serverSide: EnvironmentSupport.REQUIRED,
        };
    }

    return {
        clientSide: clientSide || EnvironmentSupport.UNSUPPORTED,
        serverSide: serverSide || EnvironmentSupport.UNSUPPORTED,
    };
}

import { RESERVED_VERSION_SLUGS } from "@app/utils/config/reserved";
import { getFileType } from "@app/utils/convertors";
import { date } from "@app/utils/date";
import { doesMemberHaveAccess, getCurrMember, getLoadersByProjectType } from "@app/utils/project";
import type { VersionDependencies, newVersionFormSchema } from "@app/utils/schemas/project/version";
import { isVersionPrimaryFileValid } from "@app/utils/schemas/validation";
import { ProjectPermission, type ProjectType, ProjectVisibility, VersionReleaseChannel } from "@app/utils/types";
import type { Dependency, VersionFile } from "@prisma/client";
import type { Context } from "hono";
import type { z } from "zod";
import { GetManyProjects_ListItem, GetProject_ListItem, UpdateProject } from "~/db/project_item";
import { CreateVersion, GetVersions } from "~/db/version_item";
import { addInvalidAuthAttempt } from "~/middleware/rate-limit/invalid-auth-attempt";
import {
    aggregateGameVersions,
    aggregateProjectLoaderNames,
    createVersionFiles,
    isAnyDuplicateFile,
    isProjectPublic,
} from "~/routes/project/utils";
import prisma from "~/services/prisma";
import { type ContextUserData, FILE_STORAGE_SERVICE } from "~/types";
import { HTTP_STATUS, invalidReqestResponseData, notFoundResponseData } from "~/utils/http";
import { generateDbId } from "~/utils/str";
import { deleteVersionsData } from "../../controllers/settings";

export async function createNewVersion(
    ctx: Context,
    userSession: ContextUserData,
    projectSlug: string,
    formData: z.infer<typeof newVersionFormSchema>,
) {
    if (!formData?.primaryFile?.name || !(formData.primaryFile instanceof File)) {
        return invalidReqestResponseData("Primary version file is required");
    }

    const [project, _projectVersions] = await Promise.all([
        GetProject_ListItem(projectSlug, projectSlug),
        GetVersions(projectSlug, projectSlug),
    ]);
    if (!project?.id) return notFoundResponseData("Project not found");

    if (project.visibility === ProjectVisibility.ARCHIVED)
        return invalidReqestResponseData("Unarchive the project to upload a new version!");

    const memberObj = getCurrMember(userSession.id, project?.team.members || [], project?.organisation?.team.members || []);
    const canUploadVersion = doesMemberHaveAccess(
        ProjectPermission.UPLOAD_VERSION,
        memberObj?.permissions as ProjectPermission[],
        memberObj?.isOwner,
        userSession.role,
    );
    // Check if the user has permission to upload a version
    if (!canUploadVersion) {
        await addInvalidAuthAttempt(ctx);
        return notFoundResponseData("Project not found");
    }

    // Check if the uploaded file is of valid type
    const primaryFileType = await getFileType(formData.primaryFile);
    if (!primaryFileType || !isVersionPrimaryFileValid(project.type as ProjectType[], primaryFileType)) {
        return invalidReqestResponseData("Invalid primary file type");
    }

    // Check the validity of loaders
    const allowedLoaders = getLoadersByProjectType(project.type as ProjectType[]).map((loader) => loader.name);
    for (const loader of formData.loaders || []) {
        if (!allowedLoaders.includes(loader)) {
            return invalidReqestResponseData(`Loader ${loader} not supported by current project type.`);
        }
    }

    // Check if duplicate files are not being uploaded
    const duplicateFiles = await isAnyDuplicateFile({
        projectId: project.id,
        files: [formData.primaryFile, ...(formData.additionalFiles || []).filter((file) => file instanceof File)],
    });

    if (duplicateFiles === true) {
        return invalidReqestResponseData("Duplicate files are not allowed");
    }

    const projectVersions = _projectVersions?.versions || [];
    // Just to make sure that no version already exists with the same urlSlug or the urlSlug is a reserved slug
    const versionWithSameSlug = projectVersions.find((version) => version.slug === formData.versionNumber.toLowerCase());
    const versionId = generateDbId();
    let newUrlSlug = formData.versionNumber.toLowerCase();
    if (RESERVED_VERSION_SLUGS.includes(newUrlSlug) || versionWithSameSlug || formData.releaseChannel === VersionReleaseChannel.DEV) {
        newUrlSlug = versionId;
    }

    const newVersion = await CreateVersion({
        data: {
            id: versionId,
            projectId: project.id,
            authorId: userSession.id,
            title: formData.title,
            versionNumber: formData.versionNumber,
            changelog: formData.changelog,
            slug: newUrlSlug,
            featured: formData.featured,
            releaseChannel: formData.releaseChannel,
            gameVersions: formData.gameVersions,
            loaders: formData.loaders || [],
        },
    });

    // Add dependencies
    await createVersionDependencies(newVersion.id, formData.dependencies || []);

    let deletedDevVersions: string[] = [];
    // Delete old dev releases
    if (formData.releaseChannel === VersionReleaseChannel.DEV) {
        deletedDevVersions = await deleteExcessDevReleases({
            projectId: project.id,
            versions: projectVersions,
        });
    }

    // Collect all the loaders and game versions from the project and the new version
    const _loaders: string[] = [];
    const _gameVersions: string[] = [];

    for (const version of projectVersions) {
        if (deletedDevVersions.includes(version.id)) continue;

        _loaders.push(...version.loaders);
        _gameVersions.push(...version.gameVersions);
    }
    if (formData.loaders) _loaders.push(...formData.loaders);
    _gameVersions.push(...formData.gameVersions);

    const projectLoaders = aggregateProjectLoaderNames(_loaders);
    const sortedUniqueGameVersions = aggregateGameVersions(_gameVersions);

    // Save all the files
    await createVersionFiles({
        versionId: newVersion.id,
        projectId: project.id,
        files: [
            ...(formData.additionalFiles || []).map((file) => ({
                file: file,
                isPrimary: false,
                storageService: FILE_STORAGE_SERVICE.LOCAL,
            })),
            {
                file: formData.primaryFile,
                isPrimary: true,
                storageService: FILE_STORAGE_SERVICE.LOCAL,
            },
        ],
    });

    // Update project loaders list and supported game versions
    await UpdateProject({
        where: {
            id: project.id,
        },
        data: {
            gameVersions: sortedUniqueGameVersions,
            loaders: projectLoaders,
            dateUpdated: new Date(),
        },
    });

    return {
        data: {
            success: true,
            message: "Successfully created new version",
            slug: newVersion.slug,
        },
        status: HTTP_STATUS.OK,
    };
}

export async function createVersionDependencies(dependentVersionId: string, list: z.infer<typeof VersionDependencies>) {
    if (!list?.length) return [];

    const projectIds = new Set<string>();
    const versionIds = new Set<string>();

    for (const dependency of list) {
        projectIds.add(dependency.projectId);
        if (dependency.versionId) versionIds.add(dependency.versionId);
    }

    // Get all the projects and versions from database
    const [dependencyProjects, dependencyVersions] = await Promise.all([
        GetManyProjects_ListItem(Array.from(projectIds)),

        prisma.version.findMany({
            where: {
                id: {
                    in: Array.from(versionIds),
                },
            },
        }),
    ]);

    const projectMap = new Map<string, string>();
    const versionMap = new Map<string, string>();
    for (const project of dependencyProjects) {
        if (!isProjectPublic(project.visibility, project.status)) continue;
        projectMap.set(project.id, project.slug);
    }
    for (const version of dependencyVersions) {
        versionMap.set(version.id, version.slug);
    }

    const addedDependencies: string[] = [];
    const validProjectLevelDependencies: Dependency[] = [];
    const validVersionLevelDependencies: Dependency[] = [];

    for (const dependency of list) {
        if (addedDependencies.includes(dependency.projectId)) continue;
        addedDependencies.push(dependency.projectId);

        if (projectMap.has(dependency.projectId)) {
            // If the dependency is a version level dependency, check if the version exists
            if (dependency.versionId && versionMap.has(dependency.versionId)) {
                validVersionLevelDependencies.push({
                    id: generateDbId(),
                    projectId: dependency.projectId,
                    versionId: dependency.versionId,
                    dependencyType: dependency.dependencyType,
                    dependentVersionId,
                });
            }
            // If the dependency is a project level dependency
            else {
                validProjectLevelDependencies.push({
                    id: generateDbId(),
                    projectId: dependency.projectId,
                    versionId: null,
                    dependencyType: dependency.dependencyType,
                    dependentVersionId,
                });
            }
        }
    }

    const allDependencies = validProjectLevelDependencies.concat(validVersionLevelDependencies);
    if (allDependencies.length) {
        return await prisma.dependency.createMany({
            data: allDependencies,
        });
    }

    return [];
}

interface PartialFile extends Partial<VersionFile> {
    id: string;
    fileId: string;
}

interface deleteExcessDevReleasesOptions {
    projectId: string;
    versions: {
        id: string;
        slug: string;
        releaseChannel: string;
        files: PartialFile[];
        datePublished: Date;
        loaders: string[];
        gameVersions: string[];
    }[];
}

export async function deleteExcessDevReleases<T extends deleteExcessDevReleasesOptions>({ projectId, versions }: T) {
    const devVersions = versions
        .filter((version) => version.releaseChannel === VersionReleaseChannel.DEV)
        .toSorted((a, b) => {
            return date(b.datePublished)?.getTime() - date(a.datePublished)?.getTime();
        });

    // TODO: Don't use a hardcoded value for the max number of dev releases
    if (devVersions.length < 3) return [];

    const versionsToDelete = devVersions.slice(2);
    const versionIds = versionsToDelete.map((v) => v.id);
    const versionFileIds = [];
    for (const version of versionsToDelete) {
        versionFileIds.push(...version.files.map((f) => f.fileId));
    }

    await deleteVersionsData(projectId, versionIds, versionFileIds, true);
    return versionIds;
}

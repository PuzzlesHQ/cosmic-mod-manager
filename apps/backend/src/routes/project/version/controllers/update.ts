import { doesMemberHaveAccess, getCurrMember, getLoadersByProjectType } from "@app/utils/project";
import type { updateVersionFormSchema, VersionDependencies } from "@app/utils/schemas/project/version";
import { ProjectPermission, type ProjectType, VersionReleaseChannel } from "@app/utils/types";
import type { File as DBFile } from "@prisma-client";
import type { Context } from "hono";
import type { z } from "zod/v4";
import { GetManyFiles_ByID } from "~/db/file_item";
import { GetProject_Details, GetProject_ListItem, UpdateProject } from "~/db/project_item";
import { DeleteVersion, GetVersions, UpdateVersion } from "~/db/version_item";
import { addInvalidAuthAttempt } from "~/middleware/rate-limit/invalid-auth-attempt";
import { getFilesFromId } from "~/routes/project/queries/file";
import {
    aggregateGameVersions,
    aggregateProjectLoaderNames,
    aggregateVersions,
    createVersionFiles,
    deleteVersionFiles,
    isAnyDuplicateFile,
} from "~/routes/project/utils";
import prisma from "~/services/prisma";
import { deleteProjectVersionDirectory } from "~/services/storage";
import { FILE_STORAGE_SERVICE, type UserSessionData } from "~/types";
import { HTTP_STATUS, invalidRequestResponseData, notFoundResponseData } from "~/utils/http";
import { createVersionDependencies, deleteExcessDevReleases } from "./new-version";

export async function updateVersionData(
    ctx: Context,
    projectId: string,
    versionId: string,
    userSession: UserSessionData,
    formData: z.infer<typeof updateVersionFormSchema>,
) {
    const project = await GetProject_Details(projectId);
    if (!project?.id) return notFoundResponseData("Project not found");

    const _AllVersions = (await GetVersions(project.id))?.versions || [];
    if (!_AllVersions.length) return notFoundResponseData("Project not found");

    const projectVersions = [];
    for (const version of _AllVersions) {
        // Primary files cannot be edited or deleted, so better to just exclude them from the list althogether
        projectVersions.push({
            ...version,
            files: version.files.filter((file) => file.isPrimary === false),
        });
    }

    let targetVersion = projectVersions.find((version) => version.slug === versionId || version.id === versionId);
    if (versionId === "latest") targetVersion = projectVersions[0];

    // Return if project or target version not found
    if (!project?.id || !targetVersion?.id) return notFoundResponseData("Project not found");

    // Check if the user has permission to edit a version
    const memberObj = getCurrMember(
        userSession.id,
        project?.team.members || [],
        project?.organisation?.team.members || [],
    );
    const canUpdateVersion = doesMemberHaveAccess(
        ProjectPermission.UPLOAD_VERSION,
        memberObj?.permissions as ProjectPermission[],
        memberObj?.isOwner,
        userSession.role,
    );
    if (!canUpdateVersion) {
        await addInvalidAuthAttempt(ctx);
        return notFoundResponseData("Project not found");
    }

    // Check the validity of loaders
    const allowedLoaders = getLoadersByProjectType(project.type as ProjectType[]).map((loader) => loader.name);
    for (const loader of formData.loaders || []) {
        if (!allowedLoaders.includes(loader)) {
            return invalidRequestResponseData(`Loader ${loader} not supported by current project type.`);
        }
    }

    // Delete removed files and add if there are new files uploaded
    const additionalFiles = formData.additionalFiles || [];
    if (additionalFiles?.length || targetVersion?.files?.length) {
        const newAdditionalFiles: File[] = [];
        const deletedFileList: string[] = [];

        // Get all the uploaded files
        for (const file of additionalFiles) {
            if (file instanceof File) {
                newAdditionalFiles.push(file);
            }
        }

        const nonNewAdditionalFileIds: string[] = [];
        for (const file of additionalFiles) {
            if (file instanceof File) continue;
            nonNewAdditionalFileIds.push(file.id);
        }

        // Get all the deleted files
        for (const file of targetVersion.files) {
            if (!nonNewAdditionalFileIds.includes(file.id)) {
                deletedFileList.push(file.fileId);
            }
        }

        // Delete the files that are not in the new list (means the user removed them)
        if (deletedFileList.length) {
            const dbFiles = await getFilesFromId(deletedFileList);
            const deletedFilesData: DBFile[] = [];
            for (const deletedFile of deletedFileList) {
                const dbFile = dbFiles.get(deletedFile);
                if (dbFile) deletedFilesData.push(dbFile);
            }

            await deleteVersionFiles(project.id, targetVersion.id, deletedFilesData);
        }

        // Check if duplicate files are not being uploaded
        const isDuplicate = await isAnyDuplicateFile({
            projectId: project.id,
            files: newAdditionalFiles,
        });

        if (isDuplicate === true) {
            return invalidRequestResponseData("Duplicate files are not allowed");
        }

        // Save the new files
        if (newAdditionalFiles.length) {
            await createVersionFiles({
                versionId: targetVersion.id,
                projectId: project.id,
                files: newAdditionalFiles.map((file) => ({
                    file: file,
                    isPrimary: false,
                    storageService: FILE_STORAGE_SERVICE.LOCAL,
                })),
            });
        }
    }

    // Delete removed dependencies and add new ones
    const dependenciesList = formData.dependencies || [];
    if (targetVersion.dependencies.length || dependenciesList?.length) {
        const newDependencies: z.infer<typeof VersionDependencies> = [];
        // List of ids of deleted dependencies
        const deletedDependencies: string[] = [];

        for (const dependency of dependenciesList) {
            if (dependency.projectId === project.id) continue;

            let isNewDependency = true;
            for (const existingDependency of targetVersion.dependencies) {
                if (
                    existingDependency.projectId === dependency.projectId &&
                    existingDependency.versionId === dependency.versionId
                ) {
                    isNewDependency = false;
                    break;
                }
            }

            if (isNewDependency === true) newDependencies.push(dependency);
        }

        for (const existingDependency of targetVersion.dependencies) {
            let isDeletedDependency = true;
            for (const dependency of dependenciesList) {
                if (
                    existingDependency.projectId === dependency.projectId &&
                    existingDependency.versionId === dependency.versionId
                ) {
                    isDeletedDependency = false;
                    break;
                }
            }

            if (isDeletedDependency === true) deletedDependencies.push(existingDependency.id);
        }

        // Delete deleted dependencies
        if (deletedDependencies.length) {
            await prisma.dependency.deleteMany({
                where: {
                    id: {
                        in: deletedDependencies,
                    },
                },
            });
        }

        // Create new dependencies
        await createVersionDependencies(targetVersion.id, newDependencies);
    }

    let deletedDevVersions: string[] = [];
    // Only update dev releases if the release channel is changed
    if (
        formData.releaseChannel === VersionReleaseChannel.DEV &&
        formData.releaseChannel !== targetVersion.releaseChannel
    ) {
        deletedDevVersions = await deleteExcessDevReleases({
            projectId: project.id,
            versions: projectVersions,
        });
    }

    // Re evaluate the project loaders list and supported game versions
    const _loaders: string[] = [];
    const _gameVersions: string[] = [];

    for (const version of projectVersions) {
        if (deletedDevVersions.includes(version.id)) continue;

        // Exclude the target version from the list, instead use the new data
        if (version.id === targetVersion.id) {
            _loaders.push(...(formData.loaders || []));
            _gameVersions.push(...formData.gameVersions);
            continue;
        }
        _loaders.push(...version.loaders);
        _gameVersions.push(...version.gameVersions);
    }

    const aggregatedLoaderNames = aggregateProjectLoaderNames(_loaders);
    const aggregatedGameVersions = aggregateVersions(_gameVersions);

    // Finally update the version data
    await UpdateVersion({
        where: {
            id: targetVersion.id,
        },
        data: {
            title: formData.title,
            versionNumber: formData.versionNumber,
            changelog: formData.changelog,
            featured: formData.featured,
            releaseChannel: formData.releaseChannel,
            gameVersions: formData.gameVersions,
            loaders: formData.loaders || [],
        },
    });

    // Update project loaders list and supported game versions
    await UpdateProject({
        where: {
            id: project.id,
        },
        data: {
            gameVersions: aggregatedGameVersions,
            loaders: aggregatedLoaderNames,
        },
    });

    return {
        data: {
            success: true,
            message: "Version updated successfully",
            data: {
                slug: targetVersion.slug,
            },
        },
        status: HTTP_STATUS.OK,
    };
}

export async function deleteProjectVersion(
    ctx: Context,
    projectId: string,
    versionId: string,
    userSession: UserSessionData,
) {
    const project = await GetProject_ListItem(projectId);
    if (!project?.id) return notFoundResponseData("Project not found");

    const projectVersions = (await GetVersions(project.id))?.versions || [];

    let targetVersion = null;
    for (const version of projectVersions) {
        if (version.slug === versionId || version.id === versionId) {
            targetVersion = version;
            break;
        }
    }

    if (!targetVersion?.id) return notFoundResponseData("Project not found");

    // Check if the user has permission to delete a version
    const memberObj = getCurrMember(
        userSession.id,
        project?.team.members || [],
        project?.organisation?.team.members || [],
    );
    const canDeleteVersion = doesMemberHaveAccess(
        ProjectPermission.DELETE_VERSION,
        memberObj?.permissions as ProjectPermission[],
        memberObj?.isOwner,
        userSession.role,
    );
    if (!canDeleteVersion) {
        await addInvalidAuthAttempt(ctx);
        return notFoundResponseData("Project not found");
    }

    const filesData = await GetManyFiles_ByID(targetVersion.files.map((file) => file.fileId));

    // Delete all the files
    await deleteVersionFiles(project.id, targetVersion.id, filesData);

    // Delete the version directory
    await deleteProjectVersionDirectory(FILE_STORAGE_SERVICE.LOCAL, project.id, targetVersion.id);

    const deletedVersion = await DeleteVersion({
        where: {
            id: targetVersion.id,
        },
    });

    // Re evaluate the project loaders list and supported game versions
    const projectLoaders: string[] = [];
    const projectGameVersions: string[] = [];

    for (const version of projectVersions) {
        // Exclude the target version from the list, instead use the new data
        if (version.id === deletedVersion.id) continue;
        projectLoaders.push(...version.loaders);
        projectGameVersions.push(...version.gameVersions);
    }

    const aggregatedLoaderNames = aggregateProjectLoaderNames(projectLoaders);
    const aggregatedGameVersions = aggregateGameVersions(projectGameVersions);

    await UpdateProject({
        where: {
            id: project.id,
        },
        data: {
            gameVersions: aggregatedGameVersions,
            loaders: aggregatedLoaderNames,
        },
    });

    return {
        data: { success: true, message: `Version "${deletedVersion.title}" deleted successfully.` },
        status: HTTP_STATUS.OK,
    };
}

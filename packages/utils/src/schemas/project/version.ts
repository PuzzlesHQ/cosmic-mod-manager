import { z } from "zod/v4";
import {
    MAX_ADDITIONAL_VERSION_FILE_SIZE,
    MAX_OPTIONAL_FILES,
    MAX_VERSION_CHANGELOG_LENGTH,
    MAX_VERSION_FILE_SIZE,
    MAX_VERSION_NUMBER_LENGTH,
    MAX_VERSION_TITLE_LENGTH,
    MIN_VERSION_TITLE_LENGTH,
} from "~/constants";
import { gameVersionsList } from "~/constants/game-versions";
import { loaders } from "~/constants/loaders";
import { fileMaxSize_ErrMsg, mustBeURLSafe } from "~/schemas/utils";
import { createURLSafeSlug } from "~/string";
import { DependencyType, VersionReleaseChannel } from "~/types";

const VersionNumber = z
    .string()
    .min(1)
    .max(MAX_VERSION_NUMBER_LENGTH)
    .refine(
        (val) => {
            return val === createURLSafeSlug(val);
        },
        { error: mustBeURLSafe("Version number") },
    );

const projectLoaderNames = [...loaders.map((loader) => loader.name)] as const;
const ProjectLoaders = z.enum(projectLoaderNames).array().nullable();

const SupportedGameVersions = z
    .enum(gameVersionsList, { error: "Invalid game version" })
    .array()
    .min(1)
    .refine(
        (values) => {
            const uniqueValues = Array.from(new Set(values));
            return uniqueValues.length === values.length;
        },
        { error: "Duplicate entries not allowed" },
    );
export const VersionDependencies = z
    .object({
        projectId: z.string(),
        versionId: z.string().or(z.null()),
        dependencyType: z.enum(DependencyType),
    })
    .array()
    .max(256)
    .nullable();

export const newVersionFormSchema = z.object({
    title: z.string().min(MIN_VERSION_TITLE_LENGTH).max(MAX_VERSION_TITLE_LENGTH),
    changelog: z.string().max(MAX_VERSION_CHANGELOG_LENGTH).nullable(),
    releaseChannel: z.enum(VersionReleaseChannel).default(VersionReleaseChannel.RELEASE).nullish(),
    featured: z.boolean(),
    versionNumber: VersionNumber,
    loaders: ProjectLoaders,
    gameVersions: SupportedGameVersions,
    dependencies: VersionDependencies,

    primaryFile: z.file().max(MAX_VERSION_FILE_SIZE, fileMaxSize_ErrMsg(MAX_VERSION_FILE_SIZE)),
    additionalFiles: z
        .file()
        .max(MAX_ADDITIONAL_VERSION_FILE_SIZE, fileMaxSize_ErrMsg(MAX_ADDITIONAL_VERSION_FILE_SIZE))
        .array()
        .max(MAX_OPTIONAL_FILES, `You can upload up to ${MAX_OPTIONAL_FILES} additional files only.`)
        .nullable(),
});

export const updateVersionFormSchema = z.object({
    title: z.string().min(MIN_VERSION_TITLE_LENGTH).max(MAX_VERSION_TITLE_LENGTH),
    changelog: z.string().max(MAX_VERSION_CHANGELOG_LENGTH).nullable(),
    releaseChannel: z.enum(VersionReleaseChannel).default(VersionReleaseChannel.RELEASE).nullish(),
    featured: z.boolean(),
    versionNumber: VersionNumber,
    loaders: ProjectLoaders,
    gameVersions: SupportedGameVersions,
    dependencies: VersionDependencies,
    additionalFiles: z
        .file()
        .max(MAX_ADDITIONAL_VERSION_FILE_SIZE, fileMaxSize_ErrMsg(MAX_ADDITIONAL_VERSION_FILE_SIZE))
        .or(
            z.object({
                id: z.string(),
                name: z.string(),
                size: z.number(),
                type: z.string(),
            }),
        )
        .array()
        .max(MAX_OPTIONAL_FILES),
});

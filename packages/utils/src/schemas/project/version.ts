import { z } from "zod";
import {
    MAX_ADDITIONAL_VERSION_FILE_SIZE,
    MAX_OPTIONAL_FILES,
    MAX_VERSION_CHANGELOG_LENGTH,
    MAX_VERSION_FILE_SIZE,
    MAX_VERSION_NUMBER_LENGTH,
    MAX_VERSION_TITLE_LENGTH,
    MIN_VERSION_TITLE_LENGTH,
} from "~/constants";
import GAME_VERSIONS from "~/constants/game-versions";
import { loaders } from "~/constants/loaders";
import { getFileType } from "~/convertors";
import { createURLSafeSlug } from "~/string";
import { DependencyType, VersionReleaseChannel } from "~/types";

const AdditionVersionFilesList = z
    .instanceof(File)
    .array()
    .max(MAX_OPTIONAL_FILES, `You can upload up to ${MAX_OPTIONAL_FILES} additional files only.`)
    .optional()
    .refine(
        (files) => {
            const fileNamesList: string[] = [];
            for (const file of files || []) {
                if (file.size > MAX_ADDITIONAL_VERSION_FILE_SIZE) {
                    return false;
                }
                if (!fileNamesList.includes(file.name.toLowerCase())) {
                    fileNamesList.push(file.name.toLowerCase());
                } else {
                    return false;
                }
            }

            return true;
        },
        {
            message: `Error in additional files, Only .jar, .zip, .png and .jpeg file types are allowed. Max size (${MAX_ADDITIONAL_VERSION_FILE_SIZE / (1024 * 1024)} MiB)`,
        },
    );
const VersionNumber = z
    .string()
    .min(1)
    .max(MAX_VERSION_NUMBER_LENGTH)
    .refine(
        (val) => {
            return val === createURLSafeSlug(val).value;
        },
        { message: "Version number must be a URL safe string" },
    );

const projectLoadersList = [...loaders.map((loader) => loader.name)] as const;
const ProjectLoaders = z
    .enum([projectLoadersList[0], ...projectLoadersList.slice(1)])
    .array()
    .optional();
const SupportedGameVersions = z
    .string()
    .array()
    .min(1)
    .refine(
        (values) => {
            const gameVersionNumbersList = GAME_VERSIONS.map((version) => version.value);
            for (const value of values) {
                if (!gameVersionNumbersList.includes(value)) return false;
            }
            return true;
        },
        { message: "Invalid game version" },
    );
export const VersionDependencies = z
    .object({
        projectId: z.string(),
        versionId: z.string().or(z.null()),
        dependencyType: z.nativeEnum(DependencyType),
    })
    .array()
    .max(256)
    .optional();

export const newVersionFormSchema = z.object({
    title: z.string().min(MIN_VERSION_TITLE_LENGTH).max(MAX_VERSION_TITLE_LENGTH),
    changelog: z.string().max(MAX_VERSION_CHANGELOG_LENGTH).optional(),
    releaseChannel: z.nativeEnum(VersionReleaseChannel).default(VersionReleaseChannel.RELEASE),
    featured: z.boolean(),
    versionNumber: VersionNumber,
    loaders: ProjectLoaders,
    gameVersions: SupportedGameVersions,
    dependencies: VersionDependencies,

    primaryFile: z.instanceof(File).refine(
        (file) => {
            if (!file || file.size > MAX_VERSION_FILE_SIZE) return false;
            return true;
        },
        { message: `You can upload a file of size up to ${MAX_VERSION_FILE_SIZE / (1024 * 1024)} MiB only` },
    ),

    additionalFiles: AdditionVersionFilesList,
});

export const updateVersionFormSchema = z.object({
    title: z.string().min(MIN_VERSION_TITLE_LENGTH).max(MAX_VERSION_TITLE_LENGTH),
    changelog: z.string().max(MAX_VERSION_CHANGELOG_LENGTH).optional(),
    releaseChannel: z.nativeEnum(VersionReleaseChannel).default(VersionReleaseChannel.RELEASE),
    featured: z.boolean(),
    versionNumber: VersionNumber,
    loaders: ProjectLoaders,
    gameVersions: SupportedGameVersions,
    dependencies: VersionDependencies,
    additionalFiles: z
        .instanceof(File)
        .or(
            z.object({
                id: z.string(),
                name: z.string(),
                size: z.number(),
                type: z.string(),
            }),
        )
        .array()
        .optional()
        .refine(
            (files) => {
                if ((files?.length || 0) > MAX_OPTIONAL_FILES) return false;
                return true;
            },
            { message: `You can upload up to ${MAX_OPTIONAL_FILES} additional files only.` },
        )
        .refine(
            async (files) => {
                const fileNamesList: string[] = [];
                for (const file of files || []) {
                    if (file instanceof File) {
                        if (file.size > MAX_ADDITIONAL_VERSION_FILE_SIZE || !(await getFileType(file))) return false;
                    }
                    if (!fileNamesList.includes(file.name.toLowerCase())) {
                        fileNamesList.push(file.name.toLowerCase());
                    } else {
                        return false;
                    }
                }

                if (fileNamesList.length < MAX_OPTIONAL_FILES) return true;
                return false;
            },
            {
                message: `Error in additional files, Only .jar, .zip, .png and .jpeg file types are allowed. Max size (${MAX_VERSION_FILE_SIZE / (1024 * 1024)} MiB)`,
            },
        ),
});

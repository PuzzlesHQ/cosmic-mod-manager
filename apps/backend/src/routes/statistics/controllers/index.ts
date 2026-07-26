import { ProjectPublishingStatus, ProjectVisibility } from "@app/utils/types";
import type { Statistics, StorageUsageStats } from "@app/utils/types/api/stats";
import { getGalleryFilesSize, getTotalFilesSize, getVersionFilesSize } from "~/../prisma/client/sql";
import { GetData_FromCache, SetCache, STATISTICS_CACHE_EXPIRY_seconds } from "~/db/_cache";
import prisma from "~/services/prisma";
import { STATISTICS_CACHE_KEY } from "~/types/namespaces";

export async function getStatistics(): Promise<Statistics | null> {
    const cachedStats = await GetData_FromCache<Statistics>(STATISTICS_CACHE_KEY);
    if (cachedStats) return cachedStats;

    const users = prisma.user.count();
    const authors = prisma.user.count({
        where: {
            teamMemberships: {
                some: {
                    accepted: true,
                },
            },
        },
    });

    const projects = prisma.project.count({
        where: {
            visibility: {
                in: [ProjectVisibility.ARCHIVED, ProjectVisibility.LISTED],
            },
            status: ProjectPublishingStatus.APPROVED,
        },
    });

    const files = prisma.versionFile.count({
        where: {
            version: {
                project: {
                    visibility: {
                        in: [ProjectVisibility.ARCHIVED, ProjectVisibility.LISTED],
                    },
                    status: ProjectPublishingStatus.APPROVED,
                },
            },
        },
    });

    const versions = prisma.version.count({
        where: {
            project: {
                visibility: {
                    in: [ProjectVisibility.ARCHIVED, ProjectVisibility.LISTED],
                },
                status: ProjectPublishingStatus.APPROVED,
            },
        },
    });

    const [usersCount, authorsCount, filesCount, projectsCount, versionsCount] = await Promise.all([
        users,
        authors,
        files,
        projects,
        versions,
    ]);

    const stats = {
        users: usersCount,
        authors: authorsCount,
        files: filesCount,
        projects: projectsCount,
        versions: versionsCount,
    };

    // STATISTICS CACHE: set
    const data = JSON.stringify(stats);
    await SetCache(STATISTICS_CACHE_KEY, "", data, STATISTICS_CACHE_EXPIRY_seconds);

    return stats;
}

export async function getStorageUsage(): Promise<StorageUsageStats | null> {
    const [total, versionFiles, galleryFiles] = await Promise.all([
        prisma.$queryRawTyped(getTotalFilesSize()),
        prisma.$queryRawTyped(getVersionFilesSize()),
        prisma.$queryRawTyped(getGalleryFilesSize()),
    ]);

    const totalSize = Number(total[0].sum);
    const versionFilesSize = Number(versionFiles[0].sum);
    const galleryFilesSize = Number(galleryFiles[0].sum);

    if (!totalSize || !versionFilesSize || !galleryFilesSize) return null;

    return {
        totalUsed: totalSize,
        breakdown: {
            versionFiles: versionFilesSize,
            galleryImages: galleryFilesSize,
            iconImages: totalSize - (versionFilesSize + galleryFilesSize),
        },
    };
}

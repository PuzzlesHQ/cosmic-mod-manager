import { ProjectPublishingStatus, ProjectVisibility } from "@app/utils/types";
import type { Statistics } from "@app/utils/types/api/stats";
import { getStatisticsCache, setStatisticsCache } from "~/services/cache/statistics";
import prisma from "~/services/prisma";

export async function getStatistics(): Promise<Statistics | null> {
    // Check cache
    const cachedStats = await getStatisticsCache();
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
    setStatisticsCache(stats);

    return stats;
}

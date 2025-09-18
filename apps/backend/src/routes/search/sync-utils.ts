import { type EnvironmentSupport, ProjectPublishingStatus, ProjectVisibility } from "@app/utils/types";
import type { EnqueuedTask } from "meilisearch";
import { GetManyProjects_Details, type GetProject_Details_ReturnType } from "~/db/project_item";
import { isProjectIndexable } from "~/routes/project/utils";
import { getLast15Days_ProjectDownloads } from "~/services/clickhouse/project-downloads";
import meilisearch from "~/services/meilisearch";
import prisma from "~/services/prisma";
import { projectGalleryFileUrl, projectIconUrl } from "~/utils/urls";

export const MEILISEARCH_PROJECT_INDEX = "projects";
const SYNC_BATCH_SIZE = 1000;

export async function InitialiseSearchDb() {
    try {
        const index = meilisearch.index(MEILISEARCH_PROJECT_INDEX);

        // Setup the search index
        await AwaitEnqueuedTasks([
            await index.updateFilterableAttributes([
                "categories",
                "loaders",
                "type",
                "gameVersions",
                "openSource",
                "clientSide",
                "serverSide",
            ]),
            await index.updateSortableAttributes(["downloads", "followers", "dateUpdated", "datePublished", "recentDownloads"]),
            await index.updateRankingRules(["sort", "words", "typo", "proximity", "attribute"]),
            await index.updateSearchableAttributes(["name", "slug", "summary", "author"]),

            // Delete existing documents
            await index.deleteAllDocuments(),
        ]);

        let cursor = null;
        while (true) {
            cursor = await _SyncBatch(cursor);
            if (!cursor) break;
        }
    } catch (error) {
        console.error(error);
    }
}

export interface ProjectSearchDocument {
    id: string;
    name: string;
    slug: string;
    iconUrl: string | null;
    loaders: string[];
    type: string[];
    gameVersions: string[];
    categories: string[];
    featuredCategories: string[];
    clientSide: EnvironmentSupport;
    serverSide: EnvironmentSupport;
    summary: string;
    downloads: number;
    recentDownloads: number;
    followers: number;
    datePublished: Date;
    dateUpdated: Date;
    openSource: boolean;
    author: string;
    featured_gallery: string | null;
    color: string | null;
    isOrgOwned: boolean;
    visibility: ProjectVisibility;
}

async function _SyncBatch(cursor: null | string) {
    try {
        const index = meilisearch.index(MEILISEARCH_PROJECT_INDEX);

        const _Projects_Ids_Res = await prisma.project.findMany({
            where: {
                visibility: {
                    in: [ProjectVisibility.LISTED, ProjectVisibility.ARCHIVED],
                },
                status: ProjectPublishingStatus.APPROVED,
            },
            cursor: cursor ? { id: cursor } : undefined,
            take: SYNC_BATCH_SIZE,
            skip: cursor ? 1 : 0,
            select: {
                id: true,
            },
        });

        if (_Projects_Ids_Res.length === 0) return;
        const _ProjectIds = _Projects_Ids_Res.map((p) => p.id);

        const Projects = await GetManyProjects_Details(_ProjectIds);
        const recentDownloadsCount_Map = await getLast15Days_ProjectDownloads(_ProjectIds);
        const formattedProjectsData: ProjectSearchDocument[] = [];

        for (const Project of Projects) {
            if (!Project) continue;
            if (!isProjectIndexable(Project.visibility, Project.status)) continue;

            formattedProjectsData.push(FormatSearchDocument(Project, recentDownloadsCount_Map.get(Project.id) || 0));
        }

        await AwaitEnqueuedTask(await index.addDocuments(formattedProjectsData));

        if (formattedProjectsData.length < SYNC_BATCH_SIZE) return null;
        return _Projects_Ids_Res.at(-1)?.id;
    } catch (error) {
        console.error(error);
    }
}

export function FormatSearchDocument<T extends NonNullable<GetProject_Details_ReturnType>>(project: T, recentDownloads: number) {
    const author = project.organisation?.slug || project.team.members?.[0]?.user?.userName;
    const FeaturedGalleryItem = project.gallery.find((item) => item.featured === true);
    const featured_gallery = FeaturedGalleryItem ? projectGalleryFileUrl(project.id, FeaturedGalleryItem.thumbnailFileId) : null;

    return {
        id: project.id,
        name: project.name,
        slug: project.slug,
        iconUrl: projectIconUrl(project.id, project.iconFileId),
        loaders: project.loaders,
        type: project.type,
        gameVersions: project.gameVersions,
        categories: project.categories,
        featuredCategories: project.featuredCategories,
        summary: project.summary,
        downloads: project.downloads,
        recentDownloads: recentDownloads,
        followers: project.followers,
        datePublished: project.datePublished,
        dateUpdated: project.dateUpdated,
        openSource: !!project.projectSourceUrl,
        clientSide: project.clientSide as EnvironmentSupport,
        serverSide: project.serverSide as EnvironmentSupport,
        featured_gallery: featured_gallery,
        color: project.color,
        author: author,
        isOrgOwned: !!project.organisation?.slug,
        visibility: project.visibility as ProjectVisibility,
    } satisfies ProjectSearchDocument;
}

const PROCESSING_TASK_STATUSES = ["enqueued", "processing"];

export async function AwaitEnqueuedTask(task: EnqueuedTask) {
    const TIMEOUT = 10_000;
    let timeElapsed = 0;

    while (true) {
        const UpdatedTask = await meilisearch.getTask(task.taskUid);

        if (PROCESSING_TASK_STATUSES.includes(UpdatedTask.status)) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            timeElapsed += 100;
        } else break;

        if (timeElapsed >= TIMEOUT) {
            console.error(`Meilisearch Task :${task.taskUid} took too long to process. Timed out after ${TIMEOUT}ms`);
            break;
        }
    }
}

export async function AwaitEnqueuedTasks(tasks: EnqueuedTask[], TIMEOUT_ms = 30_000) {
    let timeElapsed = 0;
    const TaskdIds: number[] = [];
    for (const task of tasks) {
        if (task.taskUid) TaskdIds.push(task.taskUid);
    }

    while (true) {
        const UpdatedTasks = await meilisearch.getTasks({ uids: TaskdIds });
        const anyProcessingTask = UpdatedTasks.results.some((task) => PROCESSING_TASK_STATUSES.includes(task.status));

        if (anyProcessingTask) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            timeElapsed += 100;
        } else break;

        if (timeElapsed >= TIMEOUT_ms) {
            console.error(`Meilisearch Tasks took too long to process. Timed out after ${TIMEOUT_ms}ms`);
            break;
        }
    }
}

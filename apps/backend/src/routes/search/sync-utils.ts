import { type EnvironmentSupport, ProjectPublishingStatus, ProjectVisibility } from "@app/utils/types";
import { GetManyProjects_Details, type TProjectDetails } from "~/db/project_item";
import { isProjectIndexable } from "~/routes/project/utils";
import { getLast15Days_ProjectDownloads } from "~/services/clickhouse/project-downloads";
import meilisearch from "~/services/meilisearch";
import prisma from "~/services/prisma";
import { Log } from "~/utils/logger";
import { projectGalleryFileUrl, projectIconUrl } from "~/utils/urls";

export const MEILISEARCH_PROJECT_INDEX = "projects";
const SYNC_BATCH_SIZE = 1000;

export async function InitialiseSearchDb() {
    try {
        const index = meilisearch.index(MEILISEARCH_PROJECT_INDEX);

        // Setup the search index

        await index
            .updateFilterableAttributes([
                "categories",
                "loaders",
                "type",
                "gameVersions",
                "openSource",
                "clientSide",
                "serverSide",
            ])
            .waitTask();
        await index
            .updateSortableAttributes(["downloads", "followers", "dateUpdated", "datePublished", "recentDownloads"])
            .waitTask();
        await index.updateRankingRules(["sort", "words", "typo", "proximity", "attribute"]).waitTask();
        await index.updateSearchableAttributes(["name", "slug", "summary", "author"]).waitTask();

        // Delete existing documents
        await index.deleteAllDocuments().waitTask();

        let cursor = null;
        while (true) {
            cursor = await _SyncBatch(cursor);
            if (!cursor) break;
        }
    } catch (error) {
        Log(error);
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

        const projectIds = await prisma.project.findMany({
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

        if (projectIds.length === 0) return;
        const projectIdsList = projectIds.map((p) => p.id);

        const Projects = await GetManyProjects_Details(projectIdsList);
        const recentDownloadsCount_Map = await getLast15Days_ProjectDownloads(projectIdsList);
        const formattedProjectsData: ProjectSearchDocument[] = [];

        for (const project of Projects) {
            if (!project) continue;
            if (!isProjectIndexable(project.visibility, project.status)) continue;

            formattedProjectsData.push(FormatSearchDocument(project, recentDownloadsCount_Map.get(project.id) || 0));
        }

        await index.addDocuments(formattedProjectsData).waitTask();

        if (formattedProjectsData.length < SYNC_BATCH_SIZE) return null;
        return projectIds.at(-1)?.id;
    } catch (error) {
        Log(error);
    }
}

export function FormatSearchDocument<T extends NonNullable<TProjectDetails>>(project: T, recentDownloads: number) {
    let author = "";
    if (project.team.members) {
        author = project.team.members.find((m) => m.isOwner)?.user.userName ?? "";
    } else if (project.organisation) {
        author = project.organisation.slug;
    }

    // const author = project.organisation?.slug || project.team.members?.[0]?.user.userName;
    const FeaturedGalleryItem = project.gallery.find((item) => item.featured === true);
    const featured_gallery = FeaturedGalleryItem
        ? projectGalleryFileUrl(project.id, FeaturedGalleryItem.thumbnailFileId)
        : null;

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

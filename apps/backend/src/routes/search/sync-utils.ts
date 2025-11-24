import { type EnvironmentSupport, ProjectPublishingStatus, ProjectVisibility } from "@app/utils/types";
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

        await index.addDocuments(formattedProjectsData).waitTask();

        if (formattedProjectsData.length < SYNC_BATCH_SIZE) return null;
        return _Projects_Ids_Res.at(-1)?.id;
    } catch (error) {
        console.error(error);
    }
}

export function FormatSearchDocument<T extends NonNullable<GetProject_Details_ReturnType>>(
    project: T,
    recentDownloads: number,
) {
    const author = project.organisation?.slug || project.team.members?.[0]?.user?.userName;
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

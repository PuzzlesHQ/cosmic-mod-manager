import { ProjectPublishingStatus } from "@app/utils/types";
import type { ProjectListItem } from "@app/utils/types/api";
import type { ProjectSearchDocument } from "./sync-utils";

export function mapSearchProjectToListItem(project: ProjectSearchDocument): ProjectListItem {
    return {
        id: project.id,
        slug: project.slug,
        name: project.name,
        summary: project.summary,
        type: project.type,
        status: ProjectPublishingStatus.APPROVED, // Because only approved projects are indexed for search :)
        icon: project.iconUrl,
        downloads: project.downloads,
        followers: project.followers,
        dateUpdated: project.dateUpdated,
        datePublished: project.datePublished,
        categories: project.categories,
        featuredCategories: project.featuredCategories,
        gameVersions: project.gameVersions,
        loaders: project.loaders,
        author: project.author,
        clientSide: project.clientSide,
        serverSide: project.serverSide,
        featured_gallery: project.featured_gallery,
        color: project.color || null,
        isOrgOwned: project.isOrgOwned,
        visibility: project.visibility,
    };
}

import PaginatedNavigation from "@app/components/misc/pagination-nav";
import { cn } from "@app/components/utils";
import { pageOffsetParamNamespace } from "@app/utils/config/search";
import { type ProjectType, SearchResultSortMethod } from "@app/utils/types";
import type { ProjectListItem } from "@app/utils/types/api";
import ProjectCardItem, { ViewType } from "~/components/search-list-item";
import { useTranslation } from "~/locales/provider";
import { useSearchContext } from "./provider";

export function SearchResults(props: { viewType: ViewType }) {
    const { t } = useTranslation();
    const {
        result: searchResult,
        sortBy,
        projectsPerPage,
        pageOffset,
        pagesCount,
        isLoading,
        isFetching,
        projectType,
    } = useSearchContext();

    const pagination =
        (searchResult?.estimatedTotalHits || 0) > projectsPerPage ? (
            <PaginatedNavigation pagesCount={pagesCount} activePage={pageOffset} searchParamKey={pageOffsetParamNamespace} />
        ) : null;

    return (
        <>
            {pagination}

            <section
                className={cn("w-full h-fit grid grid-cols-1 gap-panel-cards", props.viewType === ViewType.GALLERY && "sm:grid-cols-2")}
                // biome-ignore lint/a11y/useSemanticElements: <explanation>
                role="list"
                aria-label="Search Results"
            >
                {searchResult?.hits?.map((project: ProjectListItem) => (
                    <ProjectCardItem
                        pageId="search-page"
                        projectType={project.type[0] as ProjectType}
                        pageProjectType={projectType}
                        key={project.id}
                        vtId={project.id}
                        viewType={props.viewType}
                        projectName={project.name}
                        projectSlug={project.slug}
                        icon={project.icon}
                        featuredGallery={project.featured_gallery}
                        color={project.color}
                        summary={project.summary}
                        loaders={project.loaders}
                        clientSide={project.clientSide}
                        serverSide={project.serverSide}
                        featuredCategories={project.featuredCategories}
                        downloads={project.downloads}
                        followers={project.followers}
                        dateUpdated={new Date(project.dateUpdated)}
                        datePublished={new Date(project.datePublished)}
                        showDatePublished={sortBy === SearchResultSortMethod.RECENTLY_PUBLISHED}
                        author={project?.author || ""}
                        isOrgOwned={project.isOrgOwned}
                        visibility={project.visibility}
                    />
                ))}
            </section>

            {!searchResult?.hits?.length && !isLoading && !isFetching && (
                <div className="w-full flex items-center justify-center py-8">
                    <span className="text-extra-muted-foreground italic text-xl">{t.common.noResults}</span>
                </div>
            )}

            {!searchResult?.hits?.length && isFetching && <div className="w-full flex items-center justify-center py-8">...</div>}

            {pagination}
        </>
    );
}

import { pageOffsetParamNamespace } from "@app/utils/config/search";
import { isNumber } from "@app/utils/number";
import { type ProjectType, SearchResultSortMethod } from "@app/utils/types";
import type { ProjectListItem } from "@app/utils/types/api";
import PaginatedNavigation from "~/components/misc/pagination-nav";
import ProjectCardItem, { ViewType } from "~/components/misc/search-list-item";
import { cn } from "~/components/utils";
import { useTranslation } from "~/locales/provider";
import { useSearchContext } from "./provider";

export function SearchResults(props: { viewType: ViewType }) {
    const { t } = useTranslation();
    const { result, sortBy, params, isLoading, isFetching, projectType } = useSearchContext();

    const pageLimit = result.limit;
    const totalPages = Math.ceil((result?.estimatedTotalHits || 0) / pageLimit);

    const pageOffsetParamValue = params.get(pageOffsetParamNamespace);
    let activePage = pageOffsetParamValue ? Number.parseInt(pageOffsetParamValue || "1") : 1;
    if (!isNumber(activePage)) activePage = 1;

    const pagination =
        (result?.estimatedTotalHits || 0) > pageLimit ? (
            <PaginatedNavigation pagesCount={totalPages} activePage={activePage} searchParamKey={pageOffsetParamNamespace} />
        ) : null;

    return (
        <>
            {pagination}

            {/** biome-ignore lint/a11y/useSemanticElements: -- */}
            <section
                className={cn(
                    "grid h-fit w-full grid-cols-1 gap-panel-cards",
                    props.viewType === ViewType.GALLERY && "sm:grid-cols-2",
                )}
                role="list"
                aria-label="Search Results"
            >
                {result?.hits?.map((project: ProjectListItem) => (
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

            {!result?.hits?.length && !isLoading && !isFetching && (
                <div className="flex w-full items-center justify-center py-8">
                    <span className="text-extra-muted-foreground text-xl italic">{t.common.noResults}</span>
                </div>
            )}

            {!result?.hits?.length && isFetching && <div className="flex w-full items-center justify-center py-8">...</div>}

            {pagination}
        </>
    );
}

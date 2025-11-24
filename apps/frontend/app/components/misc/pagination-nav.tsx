import { useLocation } from "react-router";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "~/components/ui/pagination";

interface Props {
    pagesCount: number;
    activePage: number;
    searchParamKey?: string;
    includeHashInURL?: boolean;
}

export default function PaginatedNavigation({
    pagesCount,
    activePage,
    searchParamKey = "page",
    includeHashInURL,
}: Props) {
    const loc = useLocation();

    function paginationUrl(page: number) {
        const currUrl = new URL(`https://example.com${loc.pathname}${loc.search}${loc.hash}`);
        if (page === 1) currUrl.searchParams.delete(searchParamKey);
        else currUrl.searchParams.set(searchParamKey, page.toString());

        return currUrl
            .toString()
            .replace(currUrl.origin, "")
            .replace(loc.hash, includeHashInURL === true ? loc.hash : "");
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem className="me-1 sm:me-2">
                    <PaginationPrevious to={activePage === 1 ? "" : paginationUrl(activePage - 1)} />
                </PaginationItem>

                <PaginationLinks activePage={activePage} pagesCount={pagesCount} paginationUrl={paginationUrl} />

                <PaginationItem className="ms-1 sm:ms-2">
                    <PaginationNext to={activePage > pagesCount - 1 ? "" : paginationUrl(activePage + 1)} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

interface PaginationLinksProps {
    pagesCount: number;
    activePage: number;
    paginationUrl: (page: number) => string;
}

function PaginationLinks({ pagesCount, activePage, paginationUrl }: PaginationLinksProps) {
    const MAX_CONTINUOUS_PAGE_LINKS = 5;

    function isPageActive(page: number | undefined) {
        return activePage === page;
    }

    const pages = (() => {
        const list: number[] = new Array(pagesCount);
        for (let i = 0; i < pagesCount; i++) {
            list[i] = i + 1;
        }
        return list;
    })();

    // For less than 7 pages, no need to show ellipsis, all pages can be listed at once
    if (pagesCount < 7) {
        return pages.map((page) => {
            return (
                <PaginationItem key={page}>
                    <PaginationLink to={paginationUrl(page)} isActive={isPageActive(page)}>
                        {page.toString()}
                    </PaginationLink>
                </PaginationItem>
            );
        });
    }
    // Below here we can be sure that pages count is >= 7, so no need to check for that

    // If the active page is less than max number of continuous page links we want, we can show all starting pages
    if (activePage < MAX_CONTINUOUS_PAGE_LINKS) {
        return (
            <>
                {pages.slice(0, MAX_CONTINUOUS_PAGE_LINKS).map((page) => {
                    return (
                        <PaginationItem key={page}>
                            <PaginationLink to={paginationUrl(page)} isActive={isPageActive(page)}>
                                {page.toString()}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}

                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>

                <PaginationItem>
                    <PaginationLink to={paginationUrl(pages[pagesCount - 1])} isActive={isPageActive(pages.at(-1))}>
                        {pages.at(-1)?.toString()}
                    </PaginationLink>
                </PaginationItem>
            </>
        );
    }

    // If active page is less than ma
    if (activePage <= pagesCount - (MAX_CONTINUOUS_PAGE_LINKS - 1)) {
        return (
            <>
                <PaginationItem>
                    <PaginationLink to={paginationUrl(1)} isActive={isPageActive(1)}>
                        1
                    </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>

                {pages.slice(activePage - 2, activePage + 1).map((page) => {
                    return (
                        <PaginationItem key={page}>
                            <PaginationLink to={paginationUrl(page)} isActive={isPageActive(page)}>
                                {page.toString()}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}

                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>

                <PaginationItem>
                    <PaginationLink to={paginationUrl(pages[pagesCount - 1])} isActive={isPageActive(pages.at(-1))}>
                        {pages.at(-1)?.toString()}
                    </PaginationLink>
                </PaginationItem>
            </>
        );
    }

    return (
        <>
            <PaginationItem>
                <PaginationLink to={paginationUrl(1)} isActive={isPageActive(1)}>
                    1
                </PaginationLink>
            </PaginationItem>

            <PaginationItem>
                <PaginationEllipsis />
            </PaginationItem>

            {pages.slice(-1 * MAX_CONTINUOUS_PAGE_LINKS).map((item) => {
                return (
                    <PaginationItem key={item}>
                        <PaginationLink to={paginationUrl(item)} isActive={isPageActive(item)}>
                            {item.toString()}
                        </PaginationLink>
                    </PaginationItem>
                );
            })}
        </>
    );
}

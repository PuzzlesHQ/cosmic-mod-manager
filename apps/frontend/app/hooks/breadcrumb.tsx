import { projectTypes } from "@app/utils/config/project";
import { prepend, removeLeading } from "@app/utils/string";
import { createContext, use, useState } from "react";
import { itemType, MicrodataItemProps, MicrodataItemType } from "~/components/microdata";
import Link from "~/components/ui/link";
import { DefaultLocale } from "~/locales/meta";
import { alterUrlHintLocale, useTranslation } from "~/locales/provider";

interface Breadcrumb {
    label: string;
    href: string;
}

export interface BreadcrumbsContext {
    breadcrumbs: Breadcrumb[];
    setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
}

const BreadcrumbsContext = createContext<BreadcrumbsContext>({
    breadcrumbs: [],
    setBreadcrumbs: () => {},
});

export function BreadcrumbsContextProvider({ children }: { children: React.ReactNode }) {
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

    return <BreadcrumbsContext value={{ breadcrumbs, setBreadcrumbs }}>{children}</BreadcrumbsContext>;
}

export function useBreadcrumbs() {
    return use(BreadcrumbsContext);
}

export function PageBreadCrumbs() {
    const { breadcrumbs } = useBreadcrumbs();
    const _url_BreadCrumbs = getBreadCrumbsFromUrl();
    const breadCrumbsList = breadcrumbs.length ? breadcrumbs : _url_BreadCrumbs;

    if (!breadCrumbsList?.length) return null;

    return (
        <nav aria-label="breadcrumb" aria-hidden hidden>
            <ol className="flex items-center gap-2" itemScope itemType={itemType(MicrodataItemType.BreadCrumbList)}>
                {breadCrumbsList.map((breadcrumb, index) => {
                    return (
                        <li
                            key={breadcrumb.href}
                            itemProp={MicrodataItemProps.itemListElement}
                            itemScope
                            itemType={itemType(MicrodataItemType.ListItem)}
                        >
                            <Link itemProp={MicrodataItemProps.item} to={breadcrumb.href}>
                                <span itemProp={MicrodataItemProps.name}>{breadcrumb.label}</span>
                            </Link>
                            <span className="sr-only" itemProp={MicrodataItemProps.position} content={`${index + 1}`}>
                                {index + 1}
                            </span>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

function getBreadCrumbsFromUrl() {
    const { t } = useTranslation();
    const path = removeLeading("/", alterUrlHintLocale(DefaultLocale, true).pathname);
    const pathParts = path.split("/");

    return pathParts
        .map((part, index) => {
            let href = `${pathParts.slice(0, index + 1).join("/")}`;
            if (!href) href = "/";

            let label = part;
            if (!label) label = "Home";

            // Replace urls like /mod with /mods
            for (const type of projectTypes) {
                if (href === `/${type}`) {
                    href = `/${type}s`;
                    label = t.navbar[`${type}s`];
                }
            }

            // Replace urls like /mod/sodium/version with /mod/sodium/versions
            if (href.endsWith("/version") && href.indexOf("/version") > 0) {
                href = href.replace("/version", "/versions");
                label = t.project.versions;
            }

            // Remove not existing urls
            if (href === "/user") return null;
            if (href === "/organization") return null;

            return { label: label, href: prepend("/", href) };
        })
        .filter((item) => item !== null);
}

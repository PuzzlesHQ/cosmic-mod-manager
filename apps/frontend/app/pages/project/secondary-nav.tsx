import { Capitalize } from "@app/utils/string";
import { ButtonLink, LinkPrefetchStrategy } from "~/components/ui/link";
import { cn } from "~/components/utils";
import { joinPaths } from "~/utils/urls";

interface LinkItem {
    label: string;
    href: string;
    isShown?: boolean;
}

interface Props {
    urlBase: string;
    className?: string;
    linkClassName?: string;
    links: LinkItem[];
    onClick?: (e: React.MouseEvent, link: LinkItem) => void;
}

export default function SecondaryNav({ urlBase, className, links, onClick, linkClassName }: Props) {
    return (
        <nav className={cn("flex items-center justify-start", className)} id="project-page-nav">
            <ul className="flex w-full flex-wrap gap-1">
                {links.map((link) => {
                    if (link.isShown === false) return null;

                    return (
                        <li key={`${urlBase}-${link.href}`} className="flex items-center justify-center">
                            <ButtonLink
                                prefetch={LinkPrefetchStrategy.Render}
                                url={joinPaths(urlBase, link.href)}
                                className={cn("h-10 rounded px-4 py-0 font-semibold", linkClassName)}
                                onClick={(e) => onClick?.(e, link)}
                                preventScrollReset
                            >
                                {Capitalize(link.label)}
                            </ButtonLink>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

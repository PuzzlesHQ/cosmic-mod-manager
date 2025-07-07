import { Prefetch } from "@app/components/ui/link";
import { cn } from "@app/components/utils";
import { Capitalize } from "@app/utils/string";
import { ButtonLink } from "~/components/ui/link";
import { appendPathInUrl } from "~/utils/urls";

interface LinkItem {
    label: string;
    href: string;
    isShown?: boolean;
}

interface Props {
    urlBase: string;
    className?: string;
    links: LinkItem[];
    onClick?: (e: React.MouseEvent, link: LinkItem) => void;
}

export default function SecondaryNav({ urlBase, className, links, onClick }: Props) {
    return (
        <nav className={cn("flex items-center justify-start", className)} id="project-page-nav">
            <ul className="flex w-full flex-wrap gap-1">
                {links.map((link) => {
                    if (link.isShown === false) return null;

                    return (
                        <li key={`${urlBase}-${link.href}`} className="flex items-center justify-center">
                            <ButtonLink
                                prefetch={Prefetch.Render}
                                url={appendPathInUrl(urlBase, link.href)}
                                className="h-10 rounded px-4 py-0 font-semibold"
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

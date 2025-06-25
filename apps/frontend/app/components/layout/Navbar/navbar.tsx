import { BrandIcon, CubeIcon } from "@app/components/icons";
import { Button } from "@app/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@app/components/ui/popover";
import { Separator } from "@app/components/ui/separator";
import { cn } from "@app/components/utils";
import { projectTypes } from "@app/utils/config/project";
import { Capitalize } from "@app/utils/string";
import type { LoggedInUserData } from "@app/utils/types";
import type { Notification } from "@app/utils/types/api/notification";
import { Building2Icon, ChevronDownIcon, LibraryIcon, PlusIcon } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigation } from "react-router";
import ClientOnly from "~/components/client-only";
import Link, { ButtonLink } from "~/components/ui/link";
import ThemeSwitch from "~/components/ui/theme-switcher";
import { useTranslation } from "~/locales/provider";
import CreateNewCollection_Dialog from "~/pages/dashboard/collections/new-collection";
import CreateNewOrg_Dialog from "~/pages/dashboard/organization/new-organization";
import CreateNewProjectDialog from "~/pages/dashboard/projects/new-project";
import Config from "~/utils/config";
import { HamMenu, MobileNav } from "./mobile-nav";
import NavButton from "./nav-button";
import "./styles.css";

interface NavbarProps {
    session: LoggedInUserData | null;
    notifications: Notification[];
}

let closeOtherLinksPopup_timeout: number | undefined;

export default function Navbar(props: NavbarProps) {
    const [isNavMenuOpen, setIsNavMenuOpen] = useState<boolean>(false);
    const [otherLinksPopoverOpen, setOtherLinksPopoverOpen] = useState(false);
    const { t } = useTranslation();
    const nav = t.navbar;

    function toggleNavMenu(newState?: boolean) {
        setIsNavMenuOpen((current) => (newState === true || newState === false ? newState : !current));
    }

    const NavLinks = projectTypes.map((type) => {
        return {
            label: Capitalize(nav[`${type}s`]),
            href: `${type}s`,
        };
    });

    const Important_NavLinks = NavLinks.slice(0, 4);
    const Other_NavLinks = NavLinks.slice(4);
    Other_NavLinks.push({
        label: t.common.all,
        href: "projects",
    });

    function OpenOtherLinksPopup() {
        if (closeOtherLinksPopup_timeout) {
            clearTimeout(closeOtherLinksPopup_timeout);
        }
        setOtherLinksPopoverOpen(true);
    }

    function CloseOtherLinksPopup(instant = false) {
        if (closeOtherLinksPopup_timeout) {
            clearTimeout(closeOtherLinksPopup_timeout);
        }

        if (instant) {
            return setOtherLinksPopoverOpen(false);
        }

        closeOtherLinksPopup_timeout = window.setTimeout(() => {
            setOtherLinksPopoverOpen(false);
        }, 500);
    }

    useEffect(() => {
        if (isNavMenuOpen === true) {
            document.body.classList.add("navmenu-open");
        } else {
            document.body.classList.remove("navmenu-open");
        }
    }, [isNavMenuOpen]);

    const MemoizedThemeSwitch = useMemo(() => <ThemeSwitch />, []);

    return (
        <header className="w-full flex items-start justify-start relative">
            <div
                className={cn(
                    "nav_bg w-full flex items-center justify-center z-50 bg-transparent transition-colors duration-0 delay-300",
                    isNavMenuOpen && "bg-background delay-0",
                )}
            >
                <nav className="container flex flex-wrap items-center justify-between py-3 px-4 sm:px-8">
                    <div className="flex items-center justify-center gap-8">
                        <Link
                            to="/"
                            className="flex items-center justify-center h-nav-item gap-1 bg-background"
                            aria-label="CRMM Home page"
                            onClick={() => {
                                toggleNavMenu(false);
                            }}
                        >
                            <BrandIcon size="1.75rem" strokeWidth={26} />
                            <span className="text-lg font-bold px-1 flex items-end justify-center rounded-lg bg-clip-text bg-accent-bg text-transparent bg-cover bg-gradient-to-b from-rose-200 to-accent-background via-accent-background drop-shadow-2xl">
                                {Config.SITE_NAME_SHORT}
                            </span>
                        </Link>

                        <ul className="hidden lg:flex items-center justify-center gap-1">
                            {Important_NavLinks.map((link) => {
                                return (
                                    <li key={link.href} className="flex items-center justify-center">
                                        <Navlink href={link.href} label={link.label}>
                                            {link.label}
                                        </Navlink>
                                    </li>
                                );
                            })}

                            <li className="flex items-center justify-center">
                                <Popover open={otherLinksPopoverOpen}>
                                    <PopoverTrigger
                                        asChild
                                        onMouseEnter={OpenOtherLinksPopup}
                                        onMouseLeave={() => CloseOtherLinksPopup()}
                                        onKeyUp={(e) => {
                                            if (e.code === "Space" || e.code === "Enter") {
                                                return OpenOtherLinksPopup();
                                            }
                                        }}
                                    >
                                        <Button variant="ghost" className="text-extra-muted-foreground">
                                            {t.common.more} <ChevronDownIcon className="h-btn-icon w-btn-icon" />
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent
                                        className="p-1 min-w-0"
                                        onMouseEnter={OpenOtherLinksPopup}
                                        onMouseLeave={() => CloseOtherLinksPopup()}
                                        onClick={() => CloseOtherLinksPopup(true)}
                                        onKeyUp={(e) => {
                                            if (e.code === "Escape") CloseOtherLinksPopup(true);
                                        }}
                                    >
                                        {Other_NavLinks.map((link) => {
                                            return (
                                                <NavMenuLink
                                                    key={link.href}
                                                    href={link.href}
                                                    label={link.label}
                                                    toggleNavMenu={toggleNavMenu}
                                                >
                                                    {link.label}
                                                </NavMenuLink>
                                            );
                                        })}
                                    </PopoverContent>
                                </Popover>
                            </li>
                        </ul>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex">{props.session?.id ? <CreateThingsPopup /> : MemoizedThemeSwitch}</div>

                        <div className="flex lg:hidden">{MemoizedThemeSwitch}</div>

                        <div className="hidden lg:flex">
                            <NavButton
                                session={props.session}
                                notifications={props.notifications}
                                toggleNavMenu={toggleNavMenu}
                            />
                        </div>

                        <div className="flex lg:hidden align-center justify-center">
                            <HamMenu isNavMenuOpen={isNavMenuOpen} toggleNavMenu={toggleNavMenu} />
                        </div>
                    </div>
                </nav>
            </div>

            <ClientOnly
                Element={() => (
                    <MobileNav
                        session={props.session}
                        notifications={props.notifications}
                        isNavMenuOpen={isNavMenuOpen}
                        NavLinks={NavLinks}
                        toggleNavMenu={toggleNavMenu}
                    />
                )}
            />
        </header>
    );
}

type NavlinkProps = {
    href: string;
    label?: string;
    isDisabled?: boolean;
    tabIndex?: number;
    closeNavMenuOnLinkClick?: boolean;
    className?: string;
    toggleNavMenu?: (newState?: boolean) => void;
    children?: React.ReactNode;
};

export function Navlink({ href, label, children, className }: NavlinkProps) {
    return (
        <ButtonLink
            url={href}
            className={cn(
                "bg-background hover:bg-card-background/70 dark:hover:bg-shallow-background/75 font-semibold",
                className,
            )}
            activeClassName="bg-card-background dark:bg-shallow-background"
        >
            {children ? children : label}
        </ButtonLink>
    );
}

export function NavMenuLink({
    href,
    label,
    isDisabled = false,
    tabIndex,
    className,
    closeNavMenuOnLinkClick = true,
    toggleNavMenu,
    children,
}: NavlinkProps) {
    return (
        <ButtonLink
            url={href}
            className={cn("w-full", className)}
            activeClassName="bg-shallower-background dark:bg-shallow-background"
            tabIndex={isDisabled ? -1 : tabIndex}
            onClick={() => {
                if (closeNavMenuOnLinkClick === true) {
                    toggleNavMenu?.(false);
                }
            }}
        >
            {children ? children : label}
        </ButtonLink>
    );
}

function CreateThingsPopup() {
    const navigation = useNavigation();
    const [popoverOpen, setPopoverOpen] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        setPopoverOpen(false);
    }, [navigation.location?.pathname]);

    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost-inverted"
                    size="sm"
                    aria-label="Create new project or organization"
                    className="bg-background"
                >
                    <PlusIcon aria-hidden className="w-5 h-5" />
                    <ChevronDownIcon
                        aria-hidden
                        className={cn("w-5 h-5 text-extra-muted-foreground transition-all", popoverOpen && "rotate-180")}
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="min-w-fit p-1">
                <CreateNewProjectDialog
                    trigger={
                        <Button className="space-y-0 justify-start" variant="ghost" size="sm">
                            <CubeIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                            {t.dashboard.createProject}
                        </Button>
                    }
                />

                <CreateNewCollection_Dialog>
                    <Button className="space-y-0 justify-start" variant="ghost" size="sm">
                        <LibraryIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                        {t.dashboard.createCollection}
                    </Button>
                </CreateNewCollection_Dialog>

                <Separator />

                <CreateNewOrg_Dialog>
                    <Button className="space-y-0 justify-start" variant="ghost" size="sm">
                        <Building2Icon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                        {t.dashboard.createOrg}
                    </Button>
                </CreateNewOrg_Dialog>
            </PopoverContent>
        </Popover>
    );
}

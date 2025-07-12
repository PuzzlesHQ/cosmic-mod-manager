import { projectTypes } from "@app/utils/config/project";
import { Capitalize } from "@app/utils/string";
import type { LoggedInUserData } from "@app/utils/types";
import { Building2Icon, ChevronDownIcon, LibraryIcon, PlusIcon, SettingsIcon } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigation } from "react-router";
import { BrandIcon, CubeIcon } from "~/components/icons";
import { Button } from "~/components/ui/button";
import Link, { ButtonLink, VariantButtonLink } from "~/components/ui/link";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/components/utils";
import { useTranslation } from "~/locales/provider";
import CreateNewCollection_Dialog from "~/pages/dashboard/collections/new-collection";
import CreateNewOrg_Dialog from "~/pages/dashboard/organization/new-organization";
import CreateNewProjectDialog from "~/pages/dashboard/projects/new-project";
import Config from "~/utils/config";
import { HamMenu, MobileNav } from "./mobile-nav";
import NavButton from "./nav-button";

interface NavbarProps {
    session: LoggedInUserData | null;
}

let closeOtherLinksPopup_timeout: number | undefined;

export default function Navbar(props: NavbarProps) {
    const navigation = useNavigation();
    const curr_location = useLocation();

    const location = navigation.location || curr_location;

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

    // Close the nav menu when the user navigates to a new page
    useEffect(() => {
        if (!isNavMenuOpen) return;
        toggleNavMenu(false);
    }, [location.pathname, location.search, location.hash]);

    const SettingsButton = useMemo(() => {
        return (
            <VariantButtonLink to="/settings" variant="secondary" size="icon" className="rounded-full">
                <SettingsIcon className="h-btn-icon-md w-btn-icon-md" />
            </VariantButtonLink>
        );
    }, []);

    return (
        <header className="relative w-full">
            <nav className="container relative z-50 flex flex-wrap items-center justify-between px-4 py-3 sm:px-8">
                <div className="flex items-center justify-center gap-8">
                    <Link
                        to="/"
                        className="flex h-nav-item items-center justify-center gap-1"
                        aria-label="CRMM Home page"
                        onClick={() => {
                            toggleNavMenu(false);
                        }}
                    >
                        <BrandIcon size="1.75rem" strokeWidth={26} />
                        <span className="flex items-end justify-center rounded-lg bg-accent-bg bg-cover bg-gradient-to-b from-accent-background/90 via-accent-background to-accent-background bg-clip-text px-1 font-bold text-lg text-transparent drop-shadow-2xl">
                            {Config.SITE_NAME_SHORT}
                        </span>
                    </Link>

                    <ul className="hidden items-center justify-center gap-1 lg:flex">
                        {Important_NavLinks.map((link) => {
                            return (
                                <li key={link.href}>
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
                                    className="min-w-0 p-1"
                                    onMouseEnter={OpenOtherLinksPopup}
                                    onMouseLeave={() => CloseOtherLinksPopup()}
                                    onClick={() => CloseOtherLinksPopup(true)}
                                    onKeyUp={(e) => {
                                        if (e.code === "Escape") CloseOtherLinksPopup(true);
                                    }}
                                >
                                    {Other_NavLinks.map((link) => {
                                        return (
                                            <NavMenuLink key={link.href} href={link.href} label={link.label}>
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
                    <div className="hidden lg:flex">{props.session?.id ? <CreateThingsPopup /> : SettingsButton}</div>

                    <div className="flex lg:hidden">{SettingsButton}</div>

                    <div className="hidden lg:flex">
                        <NavButton session={props.session} />
                    </div>

                    <div className="flex justify-center align-center lg:hidden">
                        <HamMenu isNavMenuOpen={isNavMenuOpen} toggleNavMenu={toggleNavMenu} />
                    </div>
                </div>
            </nav>

            <MobileNav session={props.session} isNavMenuOpen={isNavMenuOpen} NavLinks={NavLinks} />
        </header>
    );
}

type NavlinkProps = {
    href: string;
    label?: string;
    isDisabled?: boolean;
    tabIndex?: number;
    className?: string;
    children?: React.ReactNode;
};

export function Navlink({ href, label, children, className }: NavlinkProps) {
    return (
        <ButtonLink
            url={href}
            className={cn("font-semibold hover:bg-shallow-background", className)}
            activeClassName="bg-card-background"
        >
            {children ? children : label}
        </ButtonLink>
    );
}

export function NavMenuLink({ href, label, isDisabled = false, tabIndex, className, children }: NavlinkProps) {
    return (
        <ButtonLink
            url={href}
            className={cn("w-full hover:bg-shallow-background", className)}
            activeClassName="bg-card-background"
            tabIndex={isDisabled ? -1 : tabIndex}
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
                    <PlusIcon aria-hidden className="h-5 w-5" />
                    <ChevronDownIcon
                        aria-hidden
                        className={cn("h-5 w-5 text-extra-muted-foreground transition-all", popoverOpen && "rotate-180")}
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="min-w-fit p-1">
                <CreateNewProjectDialog
                    trigger={
                        <Button className="justify-start space-y-0" variant="ghost" size="sm">
                            <CubeIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                            {t.dashboard.createProject}
                        </Button>
                    }
                />

                <CreateNewCollection_Dialog>
                    <Button className="justify-start space-y-0" variant="ghost" size="sm">
                        <LibraryIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                        {t.dashboard.createCollection}
                    </Button>
                </CreateNewCollection_Dialog>

                <Separator />

                <CreateNewOrg_Dialog>
                    <Button className="justify-start space-y-0" variant="ghost" size="sm">
                        <Building2Icon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                        {t.dashboard.createOrg}
                    </Button>
                </CreateNewOrg_Dialog>
            </PopoverContent>
        </Popover>
    );
}

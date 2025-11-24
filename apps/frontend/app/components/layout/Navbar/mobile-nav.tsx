import { isModerator } from "@app/utils/src/constants/roles";
import type { LoggedInUserData } from "@app/utils/types";
import { imageUrl } from "@app/utils/url";
import { BellIcon, Building2Icon, LayoutListIcon, ScaleIcon, Settings2Icon, UserIcon } from "lucide-react";
import { fallbackUserIcon } from "~/components/icons";
import { ImgWrapper } from "~/components/ui/avatar";
import { cn } from "~/components/utils";
import { useTranslation } from "~/locales/provider";
import { UserProfilePath } from "~/utils/urls";
import { LoginButton, SignOutBtn } from "./nav-button";
import { NavMenuLink } from "./navbar";

interface MobileNavProps {
    session: LoggedInUserData | null;
    isNavMenuOpen: boolean;
    NavLinks: {
        label: string;
        href: string;
    }[];
}

export function MobileNav({ session, isNavMenuOpen, NavLinks }: MobileNavProps) {
    const { t } = useTranslation();

    return (
        <div
            className={cn(
                "nav_items_container fixed top-0 z-30 grid h-[100vh] w-full grid-rows-[4rem_1fr] overflow-y-hidden bg-background opacity-[0.97]",
                isNavMenuOpen && "nav_open",
            )}
            aria-hidden={!isNavMenuOpen}
        >
            {/* dummy */}
            <div className="border-border border-b" />

            <ul className="container flex flex-col gap-1 overflow-y-auto p-6" style={{ scrollbarGutter: "stable" }}>
                {NavLinks.map((link) => {
                    return (
                        <li key={`${link.href}`} className="group w-full">
                            <NavMenuLink
                                href={link.href}
                                label={link.label}
                                isDisabled={!isNavMenuOpen}
                                className="justify-center"
                            >
                                {link.label}
                            </NavMenuLink>
                        </li>
                    );
                })}
                {!!session?.id && (
                    <>
                        <li className="my-2 h-px w-full bg-raised-background"> </li>

                        <li className="mb-2 flex w-full flex-col items-center justify-center gap-1">
                            <div className="flex w-full items-center justify-center gap-2">
                                <ImgWrapper
                                    src={imageUrl(session?.avatar)}
                                    alt={`Profile picture of ${session?.userName}`}
                                    className="h-10 w-10 rounded-full"
                                    fallback={fallbackUserIcon}
                                />

                                <span className="font-semibold text-foreground/90 text-lg leading-none">
                                    {session?.userName}
                                </span>
                            </div>
                        </li>

                        {[
                            {
                                icon: <UserIcon aria-hidden className="h-btn-icon w-btn-icon" />,
                                label: t.navbar.profile,
                                url: UserProfilePath(session.userName),
                            },
                            {
                                icon: <BellIcon aria-hidden className="h-btn-icon w-btn-icon" />,
                                label: t.dashboard.notifications,
                                url: "/dashboard/notifications",
                            },
                            {
                                icon: <Settings2Icon aria-hidden className="h-btn-icon w-btn-icon" />,
                                label: t.common.settings,
                                url: "/settings/profile",
                            },
                            {
                                icon: <LayoutListIcon aria-hidden className="h-btn-icon w-btn-icon" />,
                                label: t.dashboard.projects,
                                url: "/dashboard/projects",
                            },
                            {
                                icon: <Building2Icon aria-hidden className="h-btn-icon w-btn-icon" />,
                                label: t.dashboard.organizations,
                                url: "/dashboard/organizations",
                            },
                        ]?.map((link) => {
                            return (
                                <li
                                    key={`${link.url}`}
                                    className="group relative flex w-full items-center justify-center"
                                >
                                    <NavMenuLink
                                        href={link.url}
                                        label={link.label}
                                        isDisabled={!isNavMenuOpen}
                                        className="justify-center"
                                    >
                                        {link?.icon || null}
                                        {link.label}
                                    </NavMenuLink>
                                </li>
                            );
                        })}

                        {isModerator(session.role) ? (
                            <li className="group relative flex w-full items-center justify-center">
                                <NavMenuLink
                                    href="/moderation/review"
                                    label={t.moderation.moderation}
                                    isDisabled={!isNavMenuOpen}
                                    className="justify-center"
                                >
                                    <ScaleIcon aria-hidden className="h-btn-icon w-btn-icon" />
                                    {t.moderation.moderation}
                                </NavMenuLink>
                            </li>
                        ) : null}

                        <li className="w-full">
                            <SignOutBtn disabled={!isNavMenuOpen} className="justify-center" />
                        </li>
                    </>
                )}
                {!session?.id && (
                    <li className="group flex w-full">
                        <LoginButton className="w-full" disabled={!isNavMenuOpen} />
                    </li>
                )}
            </ul>
        </div>
    );
}

interface HamMenuProps {
    isNavMenuOpen: boolean;
    toggleNavMenu: (newState?: boolean) => void;
}

export function HamMenu({ isNavMenuOpen, toggleNavMenu }: HamMenuProps) {
    function handleHamMenuClick() {
        toggleNavMenu();
    }

    return (
        <button
            type="button"
            className="navItemHeight flex w-10 cursor-pointer items-center justify-center rounded text-foreground hover:bg-raised-background"
            onClick={handleHamMenuClick}
            aria-label="Menu"
        >
            <div className={`ham_menu_icon ${isNavMenuOpen && "ham_menu_open"} relative aspect-square w-full`}>
                <i className="ham_menu_line_1 absolute start-1/2 top-[33%] block h-[0.12rem] w-[50%] translate-x-[-50%] translate-y-[-50%] rounded-full bg-current" />
                <i className="ham_menu_line_2 absolute start-1/2 top-[50%] block h-[0.12rem] w-[50%] translate-x-[-50%] translate-y-[-50%] rounded-full bg-current" />
                <i className="ham_menu_line_3 absolute start-1/2 top-[67%] block h-[0.12rem] w-[50%] translate-x-[-50%] translate-y-[-50%] rounded-full bg-current" />
            </div>
        </button>
    );
}

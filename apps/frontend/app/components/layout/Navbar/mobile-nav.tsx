import { MODERATOR_ROLES } from "@app/utils/src/constants/roles";
import type { LoggedInUserData } from "@app/utils/types";
import type { Notification } from "@app/utils/types/api/notification";
import { imageUrl } from "@app/utils/url";
import { BellIcon, Building2Icon, LayoutListIcon, ScaleIcon, Settings2Icon, UserIcon } from "lucide-react";
import { fallbackUserIcon } from "~/components/icons";
import { ImgWrapper } from "~/components/ui/avatar";
import { NotificationBadge } from "~/components/ui/badge";
import { cn } from "~/components/utils";
import { useTranslation } from "~/locales/provider";
import { UserProfilePath } from "~/utils/urls";
import { LoginButton, SignOutBtn } from "./nav-button";
import { NavMenuLink } from "./navbar";

interface MobileNavProps {
    session: LoggedInUserData | null;
    notifications: Notification[] | null;
    isNavMenuOpen: boolean;
    toggleNavMenu: (newState?: boolean) => void;
    NavLinks: {
        label: string;
        href: string;
    }[];
}

export function MobileNav({ session, notifications, isNavMenuOpen, toggleNavMenu, NavLinks }: MobileNavProps) {
    const { t } = useTranslation();
    const unreadNotifications = (notifications || [])?.filter((n) => !n.read).length;

    return (
        <div
            className={cn("mobile_navmenu absolute start-0 top-[100%] w-full duration-300", isNavMenuOpen && "menu_open")}
            aria-hidden={isNavMenuOpen !== true}
        >
            <div className="relative row-span-2 flex w-full flex-col items-center justify-center">
                <div className="absolute top-0 left-0 z-[3] h-full w-full bg-background opacity-[0.975] dark:opacity-[0.985]" />

                <div className="navlink_list_wrapper z-20 flex h-[100vh] w-full items-start justify-center overflow-y-auto overscroll-contain">
                    <ul className="navlink_list container z-20 flex flex-col items-start justify-start gap-1 px-6 pt-8 pb-28">
                        {NavLinks.map((link) => {
                            return (
                                <li key={`${link.href}`} className="group w-full">
                                    <NavMenuLink
                                        href={link.href}
                                        label={link.label}
                                        isDisabled={!isNavMenuOpen}
                                        toggleNavMenu={toggleNavMenu}
                                        className="h-nav-item items-center justify-center hover:bg-shallower-background dark:hover:bg-shallow-background"
                                    >
                                        {link.label}
                                    </NavMenuLink>
                                </li>
                            );
                        })}
                        {!!session?.id && (
                            <>
                                <li className="my-2 h-px w-full bg-shallower-background dark:bg-shallow-background"> </li>

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
                                        notificationBadge: unreadNotifications,
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
                                                toggleNavMenu={toggleNavMenu}
                                                className="h-nav-item items-center justify-center hover:bg-shallower-background dark:hover:bg-shallow-background"
                                            >
                                                {link?.icon || null}
                                                {link.label}

                                                {link.notificationBadge && unreadNotifications > 0 ? (
                                                    <NotificationBadge>{unreadNotifications}</NotificationBadge>
                                                ) : null}
                                            </NavMenuLink>
                                        </li>
                                    );
                                })}

                                {MODERATOR_ROLES.includes(session.role) ? (
                                    <li className="group relative flex w-full items-center justify-center">
                                        <NavMenuLink
                                            href="/moderation/review"
                                            label={t.moderation.moderation}
                                            isDisabled={!isNavMenuOpen}
                                            toggleNavMenu={toggleNavMenu}
                                            className="h-nav-item items-center justify-center hover:bg-shallower-background dark:hover:bg-shallow-background"
                                        >
                                            <ScaleIcon aria-hidden className="h-btn-icon w-btn-icon" />
                                            {t.moderation.moderation}
                                        </NavMenuLink>
                                    </li>
                                ) : null}

                                <li className="w-full">
                                    <SignOutBtn
                                        disabled={!isNavMenuOpen}
                                        className="justify-center hover:bg-shallower-background dark:hover:bg-shallow-background"
                                    />
                                </li>
                            </>
                        )}
                        {!session?.id && (
                            <li className="group flex w-full">
                                {isNavMenuOpen && <LoginButton onClick={() => toggleNavMenu(false)} className="w-full" />}
                            </li>
                        )}
                    </ul>
                </div>
            </div>
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
            className="navItemHeight flex w-10 cursor-pointer items-center justify-center rounded text-foreground hover:bg-card-background dark:hover:bg-shallow-background"
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

import { fallbackUserIcon } from "@app/components/icons";
import { NotificationBadge } from "@app/components/ui/badge";
import { cn } from "@app/components/utils";
import { MODERATOR_ROLES } from "@app/utils/src/constants/roles";
import type { LoggedInUserData } from "@app/utils/types";
import type { Notification } from "@app/utils/types/api/notification";
import { imageUrl } from "@app/utils/url";
import { BellIcon, Building2Icon, LayoutListIcon, ScaleIcon, Settings2Icon, UserIcon } from "lucide-react";
import { ImgWrapper } from "~/components/ui/avatar";
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
            className={cn("mobile_navmenu w-full absolute top-[100%] start-0 duration-300", isNavMenuOpen && "menu_open")}
            aria-hidden={isNavMenuOpen !== true}
        >
            <div className="w-full flex flex-col items-center justify-center row-span-2 relative">
                <div className="absolute top-0 left-0 w-full h-full bg-background opacity-[0.975] dark:opacity-[0.985] z-[3]" />

                <div className="navlink_list_wrapper overscroll-contain w-full flex items-start justify-center z-20 h-[100vh] overflow-y-auto">
                    <ul className="navlink_list container pt-8 pb-28 px-6 flex flex-col items-start justify-start z-20 gap-1">
                        {NavLinks.map((link) => {
                            return (
                                <li key={`${link.href}`} className="w-full group">
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
                                <li className="w-full h-px bg-shallower-background dark:bg-shallow-background my-2"> </li>

                                <li className="w-full flex flex-col gap-1 items-center justify-center mb-2">
                                    <div className="w-full flex items-center justify-center gap-2">
                                        <ImgWrapper
                                            src={imageUrl(session?.avatar)}
                                            alt={`Profile picture of ${session?.userName}`}
                                            className="w-10 h-10 rounded-full"
                                            fallback={fallbackUserIcon}
                                        />

                                        <span className="leading-none text-lg font-semibold text-foreground/90">
                                            {session?.userName}
                                        </span>
                                    </div>
                                </li>

                                {[
                                    {
                                        icon: <UserIcon aria-hidden className="w-btn-icon h-btn-icon" />,
                                        label: t.navbar.profile,
                                        url: UserProfilePath(session.userName),
                                    },
                                    {
                                        icon: <BellIcon aria-hidden className="w-btn-icon h-btn-icon" />,
                                        label: t.dashboard.notifications,
                                        url: "/dashboard/notifications",
                                        notificationBadge: unreadNotifications,
                                    },
                                    {
                                        icon: <Settings2Icon aria-hidden className="w-btn-icon h-btn-icon" />,
                                        label: t.common.settings,
                                        url: "/settings/profile",
                                    },
                                    {
                                        icon: <LayoutListIcon aria-hidden className="w-btn-icon h-btn-icon" />,
                                        label: t.dashboard.projects,
                                        url: "/dashboard/projects",
                                    },
                                    {
                                        icon: <Building2Icon aria-hidden className="w-btn-icon h-btn-icon" />,
                                        label: t.dashboard.organizations,
                                        url: "/dashboard/organizations",
                                    },
                                ]?.map((link) => {
                                    return (
                                        <li
                                            key={`${link.url}`}
                                            className="w-full group flex items-center justify-center relative"
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
                                    <li className="w-full group flex items-center justify-center relative">
                                        <NavMenuLink
                                            href="/moderation/review"
                                            label={t.moderation.moderation}
                                            isDisabled={!isNavMenuOpen}
                                            toggleNavMenu={toggleNavMenu}
                                            className="h-nav-item items-center justify-center hover:bg-shallower-background dark:hover:bg-shallow-background"
                                        >
                                            <ScaleIcon aria-hidden className="w-btn-icon h-btn-icon" />
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
                            <li className="w-full flex group">
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
            className="navItemHeight w-10 flex items-center justify-center hover:bg-card-background dark:hover:bg-shallow-background cursor-pointer rounded text-foreground"
            onClick={handleHamMenuClick}
            aria-label="Menu"
        >
            <div className={`ham_menu_icon ${isNavMenuOpen && "ham_menu_open"} aspect-square w-full relative`}>
                <i className="ham_menu_line_1 block absolute top-[33%] start-1/2 h-[0.12rem] w-[50%] bg-current rounded-full translate-y-[-50%] translate-x-[-50%]" />
                <i className="ham_menu_line_2 block absolute top-[50%] start-1/2 h-[0.12rem] w-[50%] bg-current rounded-full translate-y-[-50%] translate-x-[-50%]" />
                <i className="ham_menu_line_3 block absolute top-[67%] start-1/2 h-[0.12rem] w-[50%] bg-current rounded-full translate-y-[-50%] translate-x-[-50%]" />
            </div>
        </button>
    );
}

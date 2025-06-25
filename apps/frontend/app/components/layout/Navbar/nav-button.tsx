import { fallbackUserIcon } from "@app/components/icons";
import RefreshPage from "@app/components/misc/refresh-page";
import { NotificationBadge } from "@app/components/ui/badge";
import { Button } from "@app/components/ui/button";
import { Prefetch } from "@app/components/ui/link";
import { Popover, PopoverContent, PopoverTrigger } from "@app/components/ui/popover";
import { Separator } from "@app/components/ui/separator";
import { LoadingSpinner } from "@app/components/ui/spinner";
import { cn } from "@app/components/utils";
import { disableInteractions } from "@app/utils/dom";
import { MODERATOR_ROLES } from "@app/utils/src/constants/roles";
import type { LoggedInUserData } from "@app/utils/types";
import type { Notification } from "@app/utils/types/api/notification";
import { imageUrl } from "@app/utils/url";
import {
    BellIcon,
    Building2Icon,
    LayoutDashboardIcon,
    LayoutListIcon,
    LogInIcon,
    LogOutIcon,
    ScaleIcon,
    Settings2Icon,
    UserIcon,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router";
import { ImgWrapper } from "~/components/ui/avatar";
import { ButtonLink, useNavigate, VariantButtonLink } from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";
import { setReturnUrl } from "~/pages/auth/oauth-providers";
import clientFetch from "~/utils/client-fetch";
import { UserProfilePath } from "~/utils/urls";

export function LoginButton({ className, onClick }: { className?: string; onClick?: () => void }) {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <VariantButtonLink
            prefetch={Prefetch.Render}
            url={"/login"}
            className={className}
            variant="secondary-inverted"
            aria-label={t.form.login_withSpace}
            onClick={(e) => {
                e.preventDefault();

                onClick?.();
                setReturnUrl(location);
                navigate("/login");
            }}
        >
            <LogInIcon aria-hidden className="w-btn-icon h-btn-icon" aria-label={t.form.login_withSpace} />
            {t.form.login_withSpace}
        </VariantButtonLink>
    );
}

interface NavbuttonProps {
    toggleNavMenu: (newState?: boolean) => void;
    session: LoggedInUserData | null;
    notifications: Notification[] | null;
}

export default function NavButton({ session, notifications, toggleNavMenu }: NavbuttonProps) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    if (session === undefined) {
        return <LoadingSpinner size="sm" />;
    }

    const undreadNotifications = (notifications || [])?.filter((n) => !n.read).length;

    if (!session?.id) {
        return (
            <LoginButton
                onClick={() => {
                    toggleNavMenu(false);
                }}
            />
        );
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button size="lg" variant="ghost" aria-label="Profile icon" className="p-0 m-0 h-fit rounded-full w-fit relative">
                    <ImgWrapper
                        src={imageUrl(session.avatar)}
                        alt={`Profile picture of ${session?.userName}`}
                        fallback={fallbackUserIcon}
                        className="p-0.5 h-nav-item w-nav-item rounded-full border-none bg-shallower-background dark:bg-shallow-background"
                    />
                    {undreadNotifications > 0 ? <NotificationBadge className="min-h-1.5 min-w-1.5" /> : null}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="min-w-52 p-1.5 flex flex-col gap-1">
                {[
                    {
                        icon: <UserIcon aria-hidden className="w-btn-icon h-btn-icon" aria-label={t.navbar.profile} />,
                        label: t.navbar.profile,
                        url: UserProfilePath(session.userName),
                        matchExactUrl: false,
                    },
                    {
                        icon: <BellIcon aria-hidden className="w-btn-icon h-btn-icon" aria-label={t.dashboard.notifications} />,
                        label: t.dashboard.notifications,
                        url: "/dashboard/notifications",
                        matchExactUrl: false,
                        notificationBadge: undreadNotifications,
                    },
                    {
                        icon: <Settings2Icon aria-hidden className="w-btn-icon h-btn-icon" aria-label={t.common.settings} />,
                        label: t.common.settings,
                        url: "/settings/profile",
                        matchExactUrl: false,
                    },
                ].map((item) => {
                    return (
                        <ButtonLink key={item.url} url={item.url} exactTailMatch={false} className="relative">
                            {item.icon}
                            {item.label}

                            {item.notificationBadge ? <NotificationBadge /> : null}
                        </ButtonLink>
                    );
                })}

                <Separator className="my-0.5" />

                {[
                    {
                        icon: <LayoutListIcon aria-hidden className="w-btn-icon h-btn-icon" aria-label={t.dashboard.projects} />,
                        label: t.dashboard.projects,
                        url: "/dashboard/projects",
                        matchExactUrl: false,
                    },
                    {
                        icon: (
                            <Building2Icon aria-hidden className="w-btn-icon h-btn-icon" aria-label={t.dashboard.organizations} />
                        ),
                        label: t.dashboard.organizations,
                        url: "/dashboard/organizations",
                        matchExactUrl: false,
                    },
                    {
                        icon: (
                            <LayoutDashboardIcon
                                aria-hidden
                                className="w-btn-icon h-btn-icon"
                                aria-label={t.dashboard.dashboard}
                            />
                        ),
                        label: t.dashboard.dashboard,
                        url: "/dashboard",
                        matchExactUrl: true,
                    },
                ].map((item) => {
                    return (
                        <ButtonLink key={item.url} url={item.url} exactTailMatch={item.matchExactUrl}>
                            {item.icon}
                            {item.label}
                        </ButtonLink>
                    );
                })}
                {MODERATOR_ROLES.includes(session.role) ? (
                    <ButtonLink url="/moderation/review" exactTailMatch={false}>
                        <ScaleIcon aria-hidden className="w-btn-icon h-btn-icon" aria-label={t.moderation.moderation} />
                        {t.moderation.moderation}
                    </ButtonLink>
                ) : null}
                <Separator className="my-0.5" />

                <SignOutBtn disabled={!isOpen} />
            </PopoverContent>
        </Popover>
    );
}

type Props = {
    className?: string;
    disabled?: boolean;
};

export function SignOutBtn({ className, disabled = false }: Props) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    async function handleClick() {
        if (loading || disabled) return;
        setLoading(true);
        disableInteractions();

        await clientFetch("/api/auth/sessions", {
            method: "DELETE",
        });

        RefreshPage(navigate, location);
    }

    return (
        <Button
            variant="ghost-destructive"
            onClick={handleClick}
            tabIndex={disabled ? -1 : 0}
            className={cn("w-full h-nav-item justify-start", className)}
        >
            {loading ? (
                <LoadingSpinner size="xs" />
            ) : (
                <LogOutIcon aria-hidden className="w-btn-icon h-btn-icon" aria-label={t.navbar.signout} />
            )}
            {t.navbar.signout}
        </Button>
    );
}

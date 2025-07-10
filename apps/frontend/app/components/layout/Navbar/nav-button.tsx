import { disableInteractions } from "@app/utils/dom";
import { MODERATOR_ROLES } from "@app/utils/src/constants/roles";
import type { LoggedInUserData } from "@app/utils/types";
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
import { fallbackUserIcon } from "~/components/icons";
import RefreshPage from "~/components/misc/refresh-page";
import { ImgWrapper } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { ButtonLink, useNavigate } from "~/components/ui/link";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { LoadingSpinner } from "~/components/ui/spinner";
import { cn } from "~/components/utils";
import { useTranslation } from "~/locales/provider";
import { LoginDialog } from "~/pages/auth/login/login-card";
import clientFetch from "~/utils/client-fetch";
import { UserProfilePath } from "~/utils/urls";

export function LoginButton({ className, disabled }: { className?: string; disabled?: boolean }) {
    const { t } = useTranslation();

    return (
        <LoginDialog>
            <Button className={className} disabled={disabled} variant="secondary-inverted" aria-label={t.form.login_withSpace}>
                <LogInIcon aria-hidden className="h-btn-icon w-btn-icon" aria-label={t.form.login_withSpace} />
                {t.form.login_withSpace}
            </Button>
        </LoginDialog>
    );
}

interface NavbuttonProps {
    session: LoggedInUserData | null;
}

export default function NavButton({ session }: NavbuttonProps) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    if (!session?.id) return <LoginButton />;

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button size="lg" variant="ghost" aria-label="Profile icon" className="relative m-0 h-fit w-fit rounded-full p-0">
                    <ImgWrapper
                        src={imageUrl(session.avatar)}
                        alt={`Profile picture of ${session?.userName}`}
                        fallback={fallbackUserIcon}
                        className="h-nav-item w-nav-item rounded-full border-none bg-shallower-background p-0.5 dark:bg-shallow-background"
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="flex min-w-52 flex-col gap-1 p-1.5">
                {[
                    {
                        icon: <UserIcon aria-hidden className="h-btn-icon w-btn-icon" aria-label={t.navbar.profile} />,
                        label: t.navbar.profile,
                        url: UserProfilePath(session.userName),
                        matchExactUrl: false,
                    },
                    {
                        icon: <BellIcon aria-hidden className="h-btn-icon w-btn-icon" aria-label={t.dashboard.notifications} />,
                        label: t.dashboard.notifications,
                        url: "/dashboard/notifications",
                        matchExactUrl: false,
                    },
                    {
                        icon: <Settings2Icon aria-hidden className="h-btn-icon w-btn-icon" aria-label={t.common.settings} />,
                        label: t.common.settings,
                        url: "/settings/profile",
                        matchExactUrl: false,
                    },
                ].map((item) => {
                    return (
                        <ButtonLink key={item.url} url={item.url} exactTailMatch={false} className="relative">
                            {item.icon}
                            {item.label}
                        </ButtonLink>
                    );
                })}

                <Separator className="my-0.5" />

                {[
                    {
                        icon: <LayoutListIcon aria-hidden className="h-btn-icon w-btn-icon" aria-label={t.dashboard.projects} />,
                        label: t.dashboard.projects,
                        url: "/dashboard/projects",
                        matchExactUrl: false,
                    },
                    {
                        icon: (
                            <Building2Icon aria-hidden className="h-btn-icon w-btn-icon" aria-label={t.dashboard.organizations} />
                        ),
                        label: t.dashboard.organizations,
                        url: "/dashboard/organizations",
                        matchExactUrl: false,
                    },
                    {
                        icon: (
                            <LayoutDashboardIcon
                                aria-hidden
                                className="h-btn-icon w-btn-icon"
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
                        <ScaleIcon aria-hidden className="h-btn-icon w-btn-icon" aria-label={t.moderation.moderation} />
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
            className={cn("h-nav-item w-full justify-start", className)}
        >
            {loading ? (
                <LoadingSpinner size="xs" />
            ) : (
                <LogOutIcon aria-hidden className="h-btn-icon w-btn-icon" aria-label={t.navbar.signout} />
            )}
            {t.navbar.signout}
        </Button>
    );
}

import { Panel, PanelAside, PanelAsideNavCard, PanelContent } from "@app/components/misc/panel";
import { MODERATOR_ROLES } from "@app/utils/src/constants/roles";
import type { GlobalUserRole } from "@app/utils/types";
import { BarChart2Icon, FlagIcon, LayoutDashboardIcon, ScaleIcon } from "lucide-react";
import { Outlet } from "react-router";
import { ButtonLink } from "~/components/ui/link";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import { FormatUrl_WithHintLocale } from "~/utils/urls";

export default function ModerationPagesLayout() {
    const session = useSession();
    const { t } = useTranslation();
    const mod = t.moderation;

    if (!MODERATOR_ROLES.includes(session?.role as GlobalUserRole)) {
        return (
            <div className="full_page flex items-center justify-center">
                <span className="italic text-muted-foreground text-xl">Lacking permissions to access this page.</span>
            </div>
        );
    }

    const links = [
        {
            name: t.dashboard.overview,
            href: "/moderation",
            icon: <LayoutDashboardIcon aria-hidden className="w-4 h-4" />,
        },
        {
            name: t.dashboard.analytics,
            href: "/moderation/analytics",
            icon: <BarChart2Icon aria-hidden className="w-4 h-4" />,
        },
        {
            name: mod.review,
            href: "/moderation/review",
            icon: <ScaleIcon aria-hidden className="w-4 h-4" />,
        },
        {
            name: mod.reports,
            href: "/moderation/reports",
            icon: <FlagIcon aria-hidden className="w-4 h-4" />,
        },
    ];

    return (
        <Panel className="pb-12">
            <PanelAside aside>
                <PanelAsideNavCard label={mod.moderation}>
                    {links.map((link) => (
                        <ButtonLink
                            url={FormatUrl_WithHintLocale(link.href)}
                            key={link.href}
                            className="relative"
                            preventScrollReset
                        >
                            {link.icon}
                            <span className="text-wrap leading-tight">{link.name}</span>
                        </ButtonLink>
                    ))}
                </PanelAsideNavCard>
            </PanelAside>
            <PanelContent main>
                <Outlet />
            </PanelContent>
        </Panel>
    );
}

export const descriptionSuffix = "an open source modding platform focused on Cosmic Reach";

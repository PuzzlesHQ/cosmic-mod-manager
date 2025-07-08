import { MODERATOR_ROLES } from "@app/utils/src/constants/roles";
import type { GlobalUserRole } from "@app/utils/types";
import { BarChart2Icon, FlagIcon, LayoutDashboardIcon, ScaleIcon } from "lucide-react";
import { Outlet } from "react-router";
import { Panel, PanelContent, SidePanel } from "~/components/misc/panel";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";

export default function ModerationPagesLayout() {
    const session = useSession();
    const { t } = useTranslation();
    const mod = t.moderation;

    if (!MODERATOR_ROLES.includes(session?.role as GlobalUserRole)) {
        return (
            <div className="full_page flex items-center justify-center">
                <span className="text-muted-foreground text-xl italic">Lacking permissions to access this page.</span>
            </div>
        );
    }

    return (
        <Panel className="pb-12">
            <SidePanel
                header={mod.moderation}
                sections={[
                    {
                        items: [
                            {
                                label: t.dashboard.overview,
                                href: "/moderation",
                                icon: <LayoutDashboardIcon aria-hidden className="h-4 w-4" />,
                            },
                            {
                                label: t.dashboard.analytics,
                                href: "/moderation/analytics",
                                icon: <BarChart2Icon aria-hidden className="h-4 w-4" />,
                            },
                            {
                                label: mod.review,
                                href: "/moderation/review",
                                icon: <ScaleIcon aria-hidden className="h-4 w-4" />,
                            },
                            {
                                label: mod.reports,
                                href: "/moderation/reports",
                                icon: <FlagIcon aria-hidden className="h-4 w-4" />,
                            },
                        ],
                    },
                ]}
            />

            <PanelContent main>
                <Outlet />
            </PanelContent>
        </Panel>
    );
}

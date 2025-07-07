import {
    BarChart2Icon,
    BellIcon,
    Building2Icon,
    DollarSignIcon,
    FlagIcon,
    LayoutDashboardIcon,
    LayoutListIcon,
    LibraryIcon,
} from "lucide-react";
import { Outlet } from "react-router";
import { Panel, PanelAside, PanelAsideNavCard, PanelContent } from "~/components/misc/panel";
import { ButtonLink } from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";

export default function DashboardLayout() {
    const { t } = useTranslation();

    const SidePanelLinks = [
        {
            name: t.dashboard.overview,
            href: "/dashboard",
            icon: <LayoutDashboardIcon aria-hidden size="1rem" />,
        },
        {
            name: t.dashboard.notifications,
            href: "/dashboard/notifications",
            icon: <BellIcon aria-hidden size="1rem" />,
        },
        {
            name: t.dashboard.activeReports,
            href: "/dashboard/reports",
            icon: <FlagIcon aria-hidden size="1rem" />,
        },
        {
            name: t.dashboard.analytics,
            href: "/dashboard/analytics",
            icon: <BarChart2Icon size="1rem" />,
        },
    ];

    const ManagementPagesLinks = [
        {
            name: t.dashboard.projects,
            href: "/dashboard/projects",
            icon: <LayoutListIcon aria-hidden size="1rem" />,
        },
        {
            name: t.dashboard.organizations,
            href: "/dashboard/organizations",
            icon: <Building2Icon size="1rem" />,
        },
        {
            name: t.dashboard.collections,
            href: "/dashboard/collections",
            icon: <LibraryIcon aria-hidden size="1rem" />,
        },
        {
            name: t.dashboard.revenue,
            href: "/dashboard/revenue",
            icon: <DollarSignIcon aria-hidden size="1rem" />,
        },
    ];

    return (
        <Panel className="pb-12">
            <PanelAside aside>
                <PanelAsideNavCard label={t.dashboard.dashboard}>
                    {SidePanelLinks.map((link) => (
                        <ButtonLink url={link.href} key={link.href} className="relative" preventScrollReset>
                            {link.icon}
                            {link.name}
                        </ButtonLink>
                    ))}

                    <span className="mt-3 font-semibold text-lg">{t.dashboard.manage}</span>
                    {ManagementPagesLinks.map((link) => (
                        <ButtonLink url={link.href} key={link.href} preventScrollReset>
                            {link.icon}
                            {link.name}
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

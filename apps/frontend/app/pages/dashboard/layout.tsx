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
import { Panel, PanelContent, SidePanel } from "~/components/misc/panel";
import { useTranslation } from "~/locales/provider";

export default function DashboardLayout() {
    const { t } = useTranslation();

    const SidePanelLinks = [
        {
            label: t.dashboard.overview,
            href: "/dashboard",
            icon: <LayoutDashboardIcon aria-hidden className="aspect-square h-[65%]" />,
        },
        {
            label: t.dashboard.notifications,
            href: "/dashboard/notifications",
            icon: <BellIcon aria-hidden className="aspect-square h-[65%]" />,
        },
        {
            label: t.dashboard.activeReports,
            href: "/dashboard/reports",
            icon: <FlagIcon aria-hidden className="aspect-square h-[65%]" />,
        },
        {
            label: t.dashboard.analytics,
            href: "/dashboard/analytics",
            icon: <BarChart2Icon className="aspect-square h-[65%]" />,
        },
    ];

    const ManagementPagesLinks = [
        {
            label: t.dashboard.projects,
            href: "/dashboard/projects",
            icon: <LayoutListIcon aria-hidden className="aspect-square h-[65%]" />,
        },
        {
            label: t.dashboard.organizations,
            href: "/dashboard/organizations",
            icon: <Building2Icon className="aspect-square h-[65%]" />,
        },
        {
            label: t.dashboard.collections,
            href: "/dashboard/collections",
            icon: <LibraryIcon aria-hidden className="aspect-square h-[65%]" />,
        },
        {
            label: t.dashboard.revenue,
            href: "/dashboard/revenue",
            icon: <DollarSignIcon aria-hidden className="aspect-square h-[65%]" />,
        },
    ];

    return (
        <Panel className="pb-12">
            <SidePanel
                header={t.dashboard.dashboard}
                sections={[
                    {
                        items: SidePanelLinks,
                    },
                    {
                        name: t.dashboard.manage,
                        items: ManagementPagesLinks,
                    },
                ]}
            />

            <PanelContent main>
                <Outlet />
            </PanelContent>
        </Panel>
    );
}

import { imageUrl } from "@app/utils/url";
import { BarChart2Icon, SettingsIcon, UsersIcon } from "lucide-react";
import { useMemo } from "react";
import { Outlet } from "react-router";
import { CubeIcon, fallbackOrgIcon } from "~/components/icons";
import { Panel, PanelContent, SidePanel } from "~/components/misc/panel";
import { ImgWrapper } from "~/components/ui/avatar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { LinkPrefetchStrategy } from "~/components/ui/link";
import { useOrgData } from "~/hooks/org";
import { useTranslation } from "~/locales/provider";
import { appendPathInUrl, FormatUrl_WithHintLocale, OrgPagePath } from "~/utils/urls";

export default function OrgSettingsLayout() {
    const { t, formattedLocaleName } = useTranslation();
    const ctx = useOrgData();
    const orgData = ctx.orgData;
    const projects = ctx.orgProjects;

    const baseUrl = OrgPagePath(orgData.slug);
    const sidePanelSections = useMemo(() => {
        return [
            {
                items: [
                    {
                        label: t.dashboard.overview,
                        href: appendPathInUrl(baseUrl, "settings"),
                        icon: <SettingsIcon aria-hidden className="h-btn-icon w-btn-icon" />,
                        prefetch: LinkPrefetchStrategy.Render,
                    },
                    {
                        label: t.projectSettings.members,
                        href: appendPathInUrl(baseUrl, "settings/members"),
                        icon: <UsersIcon aria-hidden className="h-btn-icon w-btn-icon" />,
                        prefetch: LinkPrefetchStrategy.Render,
                    },
                    {
                        label: t.dashboard.projects,
                        href: appendPathInUrl(baseUrl, "settings/projects"),
                        icon: <CubeIcon aria-hidden className="h-btn-icon w-btn-icon" />,
                        prefetch: LinkPrefetchStrategy.Render,
                    },
                    {
                        label: t.dashboard.analytics,
                        href: appendPathInUrl(baseUrl, "settings/analytics"),
                        icon: <BarChart2Icon aria-hidden className="h-btn-icon w-btn-icon" />,
                        prefetch: LinkPrefetchStrategy.Render,
                    },
                ],
            },
        ];
    }, [baseUrl, formattedLocaleName]);

    return (
        <Panel className="pb-12">
            <SidePanel header={t.organization.orgSettings} sections={sidePanelSections}>
                <div className="mb-2 grid gap-3">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href={FormatUrl_WithHintLocale("/dashboard/organizations")}>
                                    {t.dashboard.organizations}
                                </BreadcrumbLink>
                            </BreadcrumbItem>

                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href={FormatUrl_WithHintLocale(baseUrl)}>{orgData.name}</BreadcrumbLink>
                            </BreadcrumbItem>

                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{t.common.settings}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex w-full items-start justify-start gap-3">
                        <ImgWrapper
                            vtId={orgData.id}
                            src={imageUrl(orgData.icon)}
                            alt={orgData.name}
                            fallback={fallbackOrgIcon}
                            className="h-14 w-14 rounded"
                        />

                        <div className="flex flex-col items-start justify-start">
                            <span className="font-semibold text-lg">{orgData.name}</span>
                            <span className="flex items-center justify-center gap-1 text-muted-foreground">
                                {t.count.projects(projects.length, projects.length)}
                            </span>
                        </div>
                    </div>
                </div>
            </SidePanel>

            <PanelContent main>
                <Outlet />
            </PanelContent>
        </Panel>
    );
}

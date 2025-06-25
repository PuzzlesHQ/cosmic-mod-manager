import { CubeIcon, fallbackOrgIcon } from "@app/components/icons";
import { ContentCardTemplate, Panel, PanelAside, PanelContent } from "@app/components/misc/panel";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@app/components/ui/breadcrumb";
import { Prefetch } from "@app/components/ui/link";
import { imageUrl } from "@app/utils/url";
import { BarChart2Icon, SettingsIcon, UsersIcon } from "lucide-react";
import { Outlet } from "react-router";
import { ImgWrapper } from "~/components/ui/avatar";
import { ButtonLink } from "~/components/ui/link";
import { useOrgData } from "~/hooks/org";
import { useTranslation } from "~/locales/provider";
import { appendPathInUrl, FormatUrl_WithHintLocale, OrgPagePath } from "~/utils/urls";

export default function OrgSettingsLayout() {
    const { t } = useTranslation();
    const ctx = useOrgData();
    const orgData = ctx.orgData;
    const projects = ctx.orgProjects;

    const baseUrl = OrgPagePath(orgData.slug);
    return (
        <Panel className="pb-12">
            <PanelAside aside className="flex flex-col gap-panel-cards lg:w-80">
                <ContentCardTemplate className="gap-3">
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

                    <div className="w-full flex items-start justify-start gap-3">
                        <ImgWrapper
                            vtId={orgData.id}
                            src={imageUrl(orgData.icon)}
                            alt={orgData.name}
                            fallback={fallbackOrgIcon}
                            className="rounded h-14 w-14"
                        />

                        <div className="flex flex-col items-start justify-start">
                            <span className="text-lg font-semibold">{orgData.name}</span>
                            <span className="flex items-center justify-center gap-1 text-muted-foreground">
                                {t.count.projects(projects?.length || 0).join(" ")}
                            </span>
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-1">
                        <span className="text-xl font-semibold text-muted-foreground mt-1 mb-0.5">
                            {t.organization.orgSettings}
                        </span>
                        {[
                            {
                                name: t.dashboard.overview,
                                href: "settings",
                                icon: <SettingsIcon aria-hidden className="w-btn-icon h-btn-icon" />,
                            },
                            {
                                name: t.projectSettings.members,
                                href: "settings/members",
                                icon: <UsersIcon aria-hidden className="w-btn-icon h-btn-icon" />,
                            },
                            {
                                name: t.dashboard.projects,
                                href: "settings/projects",
                                icon: <CubeIcon aria-hidden className="w-btn-icon h-btn-icon" />,
                            },
                            {
                                name: t.dashboard.analytics,
                                href: "settings/analytics",
                                icon: <BarChart2Icon aria-hidden className="w-btn-icon h-btn-icon" />,
                            },
                        ].map((link) => (
                            <ButtonLink
                                prefetch={Prefetch.Render}
                                key={link.href}
                                url={appendPathInUrl(baseUrl, link.href)}
                                preventScrollReset
                            >
                                {link.icon}
                                {link.name}
                            </ButtonLink>
                        ))}
                    </div>
                </ContentCardTemplate>
            </PanelAside>

            <PanelContent main>
                <Outlet />
            </PanelContent>
        </Panel>
    );
}

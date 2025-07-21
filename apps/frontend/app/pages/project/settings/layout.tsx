import { imageUrl } from "@app/utils/url";
import {
    BarChart2Icon,
    ChevronRightIcon,
    CopyrightIcon,
    GitCommitHorizontalIcon,
    ImageIcon,
    LinkIcon,
    SettingsIcon,
    TagsIcon,
    TextIcon,
    UsersIcon,
} from "lucide-react";
import { useMemo } from "react";
import { Outlet } from "react-router";
import { fallbackProjectIcon } from "~/components/icons";
import { Panel, PanelContent, SidePanel, type SidePanelSection } from "~/components/misc/panel";
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
import { ProjectStatusBadge } from "~/components/ui/project-status-badge";
import { useProjectData } from "~/hooks/project";
import { useTranslation } from "~/locales/provider";
import type { Locale } from "~/locales/types";
import { joinPaths, OrgPagePath, ProjectPagePath } from "~/utils/urls";
import ModerationBanner from "../moderation-banner";
import { PublishingChecklist } from "../publishing-checklist";

export default function ProjectSettingsLayout() {
    const { t, formattedLocaleName } = useTranslation();
    const ctx = useProjectData();
    const projectData = ctx.projectData;

    const baseUrl = ProjectPagePath(ctx.projectType, projectData.slug);

    let projectsPageUrl = "/dashboard/projects";
    if (projectData.organisation?.id) {
        projectsPageUrl = OrgPagePath(projectData.organisation.slug, "settings/projects");
    }

    const sidePanelSections = useMemo(() => links(t, baseUrl), [formattedLocaleName, baseUrl]);

    return (
        <Panel className="pb-12">
            <SidePanel header={t.projectSettings.settings} sections={sidePanelSections}>
                <div className="mb-3 grid gap-3">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href={projectsPageUrl}>{t.dashboard.projects}</BreadcrumbLink>
                            </BreadcrumbItem>

                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href={baseUrl}>{projectData.name}</BreadcrumbLink>
                            </BreadcrumbItem>

                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{t.common.settings}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex w-full items-start justify-start gap-3">
                        <ImgWrapper
                            vtId={projectData.id}
                            src={imageUrl(projectData.icon)}
                            alt={projectData.name}
                            fallback={fallbackProjectIcon}
                            className="h-14 w-14 rounded"
                        />

                        <div className="flex flex-col items-start justify-start">
                            <span className="font-semibold text-lg leading-tight">{projectData.name}</span>
                            <ProjectStatusBadge status={projectData.status} t={t} />
                        </div>
                    </div>
                </div>
            </SidePanel>

            <PanelContent main>
                <PublishingChecklist />
                <ModerationBanner />

                <Outlet />
            </PanelContent>
        </Panel>
    );
}
function links(t: Locale, base: string): SidePanelSection[] {
    return [
        {
            items: [
                {
                    label: t.projectSettings.general,
                    href: joinPaths(base, "settings"),
                    icon: <SettingsIcon aria-hidden className="h-btn-icon w-btn-icon" />,
                    prefetch: LinkPrefetchStrategy.Render,
                },
                {
                    label: t.projectSettings.tags,
                    href: joinPaths(base, "settings/tags"),
                    icon: <TagsIcon aria-hidden className="h-btn-icon w-btn-icon" />,
                    prefetch: LinkPrefetchStrategy.Render,
                },
                {
                    label: t.form.description,
                    href: joinPaths(base, "settings/description"),
                    icon: <TextIcon aria-hidden className="h-btn-icon w-btn-icon" />,
                    prefetch: LinkPrefetchStrategy.Render,
                },
                {
                    label: t.search.license,
                    href: joinPaths(base, "settings/license"),
                    icon: <CopyrightIcon aria-hidden className="h-btn-icon w-btn-icon" />,
                    prefetch: LinkPrefetchStrategy.Render,
                },
                {
                    label: t.projectSettings.links,
                    href: joinPaths(base, "settings/links"),
                    icon: <LinkIcon aria-hidden className="h-btn-icon w-btn-icon" />,
                    prefetch: LinkPrefetchStrategy.Render,
                },
                {
                    label: t.projectSettings.members,
                    href: joinPaths(base, "settings/members"),
                    icon: <UsersIcon aria-hidden className="h-btn-icon w-btn-icon" />,
                },
            ],
        },
        {
            name: t.projectSettings.view,
            items: [
                {
                    label: t.dashboard.analytics,
                    href: joinPaths(base, "settings/analytics"),
                    icon: <BarChart2Icon aria-hidden className="h-btn-icon w-btn-icon" />,
                    prefetch: LinkPrefetchStrategy.Render,
                },
            ],
        },
        {
            name: t.projectSettings.upload,
            items: [
                {
                    label: t.project.gallery,
                    href: joinPaths(base, "gallery"),
                    icon: <ImageIcon aria-hidden className="h-btn-icon w-btn-icon" />,
                    prefetch: LinkPrefetchStrategy.Render,
                    icon_2: <ChevronRightIcon aria-hidden className="ms-auto h-btn-icon w-btn-icon text-foreground-muted" />,
                },
                {
                    label: t.project.versions,
                    href: joinPaths(base, "versions"),
                    icon: <GitCommitHorizontalIcon aria-hidden className="h-btn-icon w-btn-icon" />,
                    prefetch: LinkPrefetchStrategy.Render,
                    icon_2: <ChevronRightIcon aria-hidden className="ms-auto h-btn-icon w-btn-icon text-foreground-muted" />,
                },
            ],
        },
    ];
}

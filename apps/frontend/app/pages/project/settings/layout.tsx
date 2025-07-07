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
import { Outlet } from "react-router";
import { fallbackProjectIcon } from "~/components/icons";
import { ContentCardTemplate, Panel, PanelAside, PanelContent } from "~/components/misc/panel";
import { ImgWrapper } from "~/components/ui/avatar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { ButtonLink, Prefetch } from "~/components/ui/link";
import { ProjectStatusBadge } from "~/components/ui/project-status-badge";
import { useProjectData } from "~/hooks/project";
import { useTranslation } from "~/locales/provider";
import { appendPathInUrl, FormatUrl_WithHintLocale, OrgPagePath, ProjectPagePath } from "~/utils/urls";
import ModerationBanner from "../moderation-banner";
import { PublishingChecklist } from "../publishing-checklist";

export default function ProjectSettingsLayout() {
    const { t } = useTranslation();
    const ctx = useProjectData();
    const projectData = ctx.projectData;

    const baseUrl = ProjectPagePath(ctx.projectType, projectData.slug);

    let projectsPageUrl = FormatUrl_WithHintLocale("/dashboard/projects");
    if (projectData.organisation?.id) {
        projectsPageUrl = OrgPagePath(projectData.organisation?.slug, "settings/projects");
    }

    return (
        <Panel className="pb-12">
            <PanelAside aside className="flex flex-col gap-panel-cards lg:w-80">
                <ContentCardTemplate className="gap-3">
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

                    <div className="flex w-full flex-col gap-1">
                        <span className="mt-1 mb-0.5 font-semibold text-xl">{t.projectSettings.settings}</span>
                        {links().sidePanel.map((link) => (
                            <ButtonLink
                                prefetch={link.prefetch !== false ? "render" : undefined}
                                key={link.href}
                                url={appendPathInUrl(baseUrl, link.href)}
                                preventScrollReset
                            >
                                {link.icon}
                                {link.name}
                            </ButtonLink>
                        ))}

                        <span className="mt-2 font-semibold text-lg">{t.projectSettings.view}</span>
                        {links().viewPages.map((link) => (
                            <ButtonLink
                                prefetch={Prefetch.Render}
                                key={link.href}
                                url={appendPathInUrl(baseUrl, link.href)}
                                className="justify-between"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    {link.icon}
                                    {link.name}
                                </div>
                                <ChevronRightIcon aria-hidden className="h-btn-icon w-btn-icon text-muted-foreground" />
                            </ButtonLink>
                        ))}

                        <span className="mt-2 font-semibold text-lg">{t.projectSettings.upload}</span>
                        {links().uploadPages.map((link) => (
                            <ButtonLink
                                prefetch={Prefetch.Render}
                                key={link.href}
                                url={appendPathInUrl(baseUrl, link.href)}
                                className="justify-between"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    {link.icon}
                                    {link.name}
                                </div>
                                <ChevronRightIcon aria-hidden className="h-btn-icon w-btn-icon text-muted-foreground" />
                            </ButtonLink>
                        ))}
                    </div>
                </ContentCardTemplate>
            </PanelAside>

            <PanelContent main>
                <PublishingChecklist />
                <ModerationBanner />

                <Outlet />
            </PanelContent>
        </Panel>
    );
}
function links() {
    const { t } = useTranslation();

    return {
        sidePanel: [
            {
                name: t.projectSettings.general,
                href: "settings",
                icon: <SettingsIcon aria-hidden className="h-btn-icon w-btn-icon" />,
            },
            {
                name: t.projectSettings.tags,
                href: "settings/tags",
                icon: <TagsIcon aria-hidden className="h-btn-icon w-btn-icon" />,
            },
            {
                name: t.form.description,
                href: "settings/description",
                icon: <TextIcon aria-hidden className="h-btn-icon w-btn-icon" />,
            },
            {
                name: t.search.license,
                href: "settings/license",
                icon: <CopyrightIcon aria-hidden className="h-btn-icon w-btn-icon" />,
            },
            {
                name: t.projectSettings.links,
                href: "settings/links",
                icon: <LinkIcon aria-hidden className="h-btn-icon w-btn-icon" />,
            },
            {
                name: t.projectSettings.members,
                href: "settings/members",
                icon: <UsersIcon aria-hidden className="h-btn-icon w-btn-icon" />,
                prefetch: false,
            },
        ],

        viewPages: [
            {
                name: t.dashboard.analytics,
                href: "settings/analytics",
                icon: <BarChart2Icon aria-hidden className="h-btn-icon w-btn-icon" />,
            },
        ],

        uploadPages: [
            {
                name: t.project.gallery,
                href: "gallery",
                icon: <ImageIcon aria-hidden className="h-btn-icon w-btn-icon" />,
            },
            {
                name: t.project.versions,
                href: "versions",
                icon: <GitCommitHorizontalIcon aria-hidden className="h-btn-icon w-btn-icon" />,
            },
        ],
    };
}

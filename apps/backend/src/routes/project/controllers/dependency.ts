import type { DependencyType, EnvironmentSupport, ProjectPublishingStatus, ProjectVisibility } from "@app/utils/types";
import type { DependencyListData, ProjectListItem } from "@app/utils/types/api";
import { GetManyProjects_ListItem, GetProject_ListItem } from "~/db/project_item";
import { GetVersions } from "~/db/version_item";
import prisma from "~/services/prisma";
import type { UserSessionData } from "~/types";
import { HTTP_STATUS } from "~/utils/http";
import { projectIconUrl } from "~/utils/urls";
import { isProjectAccessible } from "../utils";

export async function getProjectDependencies(slug: string, userSession: UserSessionData | null) {
    const [project, _projectVersions] = await Promise.all([GetProject_ListItem(slug, slug), GetVersions(slug, slug)]);
    if (!project?.id) {
        return { data: { success: false, message: "Project not found" }, status: HTTP_STATUS.NOT_FOUND };
    }

    // CHECK PERMISSIONS
    const projectAccessible = isProjectAccessible({
        visibility: project.visibility,
        publishingStatus: project.status,
        userId: userSession?.id,
        teamMembers: project.team.members,
        orgMembers: project.organisation?.team.members || [],
        sessionUserRole: userSession?.role,
    });
    if (!projectAccessible) {
        return { data: { success: false, message: "Project not found" }, status: HTTP_STATUS.NOT_FOUND };
    }

    // Aggregate all dependencies
    const dependencies: DependencyListData[] = [];
    for (const version of _projectVersions?.versions || []) {
        if (version.dependencies) {
            for (const dependency of version.dependencies) {
                dependencies.push({
                    projectId: dependency.projectId,
                    versionId: dependency.versionId,
                    dependencyType: dependency.dependencyType as DependencyType,
                });
            }
        }
    }

    // Separate dependencies into project-level and version-level
    const dependencyProjectIds = new Set<string>();
    const dependencyVersionIds = new Set<string>();

    for (const dependency of dependencies) {
        dependencyProjectIds.add(dependency.projectId);

        if (dependency.versionId) {
            dependencyVersionIds.add(dependency.versionId);
        }
    }

    const [dependencyProjects, dependencyVersions] = await Promise.all([
        dependencyProjectIds.size > 0 ? GetManyProjects_ListItem(Array.from(dependencyProjectIds)) : [],

        dependencyVersionIds.size > 0
            ? prisma.version.findMany({
                  where: {
                      id: {
                          in: Array.from(dependencyVersionIds),
                      },
                  },
              })
            : [],
    ]);

    const dependencyProjectsList: ProjectListItem[] = [];
    for (const project of dependencyProjects) {
        if (!project) continue;

        dependencyProjectsList.push({
            id: project.id,
            slug: project.slug,
            name: project.name,
            summary: project.summary,
            type: project.type,
            icon: projectIconUrl(project.id, project.iconFileId),
            downloads: project.downloads,
            followers: project.followers,
            dateUpdated: project.dateUpdated,
            datePublished: project.datePublished,
            status: project.status as ProjectPublishingStatus,
            visibility: project.visibility as ProjectVisibility,
            clientSide: project.clientSide as EnvironmentSupport,
            serverSide: project.serverSide as EnvironmentSupport,
            featuredCategories: project.featuredCategories,
            categories: project.categories,
            gameVersions: project.gameVersions,
            loaders: project.loaders,
            featured_gallery: null,
            color: project.color,
            author: "",
            isOrgOwned: !!project.organisationId,
        });
    }

    return {
        data: {
            projects: dependencyProjectsList,
            versions: dependencyVersions,
        },
        status: HTTP_STATUS.OK,
    };
}

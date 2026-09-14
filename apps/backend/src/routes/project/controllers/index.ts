import { isModerator } from "@app/utils/constants/roles";
import { isNumber } from "@app/utils/number";
import { combineProjectMembers, getCurrMember, sortVersionsWithReference } from "@app/utils/project";
import { gameVersionsList } from "@app/utils/src/constants/game-versions";
import type {
    EnvironmentSupport,
    OrganisationPermission,
    ProjectPermission,
    ProjectPublishingStatus,
    ProjectType,
    ProjectVisibility,
} from "@app/utils/types";
import type { ProjectDetailsData, ProjectListItem } from "@app/utils/types/api";
import type { TeamMember as DBTeamMember } from "@prisma-client";
import { GetData_FromCache, SetCache } from "~/db/_cache";
import { GetManyProjects_ListItem, GetProject_Details, GetProject_ListItem } from "~/db/project_item";
import { mapSearchProjectToListItem } from "~/routes/search/_helpers";
import { MEILISEARCH_PROJECT_INDEX, type ProjectSearchDocument } from "~/routes/search/sync-utils";
import meilisearch from "~/services/meilisearch";
import prisma from "~/services/prisma";
import type { SessionUserData } from "~/types";
import { HTTP_STATUS, notFoundResponseData } from "~/utils/http";
import { orgIconUrl, projectGalleryFileUrl, projectIconUrl, userFileUrl } from "~/utils/urls";
import { isProjectAccessible, isProjectListed } from "../utils";

export async function getProjectData(slug: string, userSession: SessionUserData | null) {
    const project = await GetProject_Details(slug, slug);
    if (!project?.id || !isProjectAccessible(project, userSession)) {
        return notFoundResponseData("Project not found");
    }

    const allMembers = combineProjectMembers(project.team.members, project.organisation?.team.members || []);
    const isSessionUserProjectMember = userSession?.id ? !!allMembers.get(userSession.id) : false;
    const org = project.organisation;

    const formattedProject: ProjectDetailsData = {
        id: project.id,
        threadId: project.threadId,
        teamId: project.team.id,
        orgId: null,
        name: project.name,
        icon: projectIconUrl(project.id, project.iconFileId),
        status: project.status as ProjectPublishingStatus,
        requestedStatus: project.requestedStatus as ProjectPublishingStatus,
        summary: project.summary,
        description: project.description,
        type: project.type as ProjectType[],
        categories: project.categories,
        featuredCategories: project.featuredCategories,
        licenseId: project.licenseId,
        licenseName: project.licenseName,
        licenseUrl: project.licenseUrl,
        dateUpdated: project.dateUpdated,
        datePublished: project.datePublished,
        downloads: project.downloads,
        followers: project.followers,
        slug: project.slug,
        visibility: project.visibility as ProjectVisibility,
        issueTrackerUrl: project?.issueTrackerUrl,
        projectSourceUrl: project?.projectSourceUrl,
        projectWikiUrl: project?.projectWikiUrl,
        discordInviteUrl: project?.discordInviteUrl,
        clientSide: project.clientSide as EnvironmentSupport,
        serverSide: project.serverSide as EnvironmentSupport,
        loaders: project.loaders,
        gameVersions: sortVersionsWithReference(project.gameVersions || [], gameVersionsList),
        gallery: project.gallery
            .map((galleryItem) => {
                const rawImage = projectGalleryFileUrl(project.id, galleryItem.imageFileId);
                const imageThumbnail = projectGalleryFileUrl(project.id, galleryItem.thumbnailFileId);
                if (!rawImage || !imageThumbnail) return null;

                return {
                    id: galleryItem.id,
                    name: galleryItem.name,
                    description: galleryItem.description,
                    image: rawImage,
                    imageThumbnail: imageThumbnail,
                    featured: galleryItem.featured,
                    dateCreated: galleryItem.dateCreated,
                    orderIndex: galleryItem.orderIndex,
                };
            })
            .filter((item) => item !== null),
        members: project.team.members.map((member) =>
            formatProjectMember(member, isSessionUserProjectMember, userSession?.role),
        ),
        organisation: org
            ? {
                  id: org.id,
                  name: org.name,
                  slug: org.slug,
                  description: org.description,
                  icon: orgIconUrl(org.id, org.iconFileId),
                  members: org.team.members.map((member) =>
                      formatProjectMember(member, isSessionUserProjectMember, userSession?.role),
                  ),
              }
            : null,
    };

    return {
        data: {
            success: true,
            data: formattedProject,
        },
        status: HTTP_STATUS.OK,
    } as const;
}

interface FormatMemberProps extends DBTeamMember {
    user: {
        id: string;
        userName: string;
        avatar: string | null;
    };
}

function formatProjectMember<T extends FormatMemberProps>(
    member: T,
    isSessionUserProjectMember: boolean,
    sessionUserRole: string | undefined,
) {
    const canSeeMemberPerms = isSessionUserProjectMember || isModerator(sessionUserRole);

    return {
        id: member.id,
        userId: member.user.id,
        teamId: member.teamId,
        userName: member.user.userName,
        avatar: userFileUrl(member.user.id, member.user.avatar),
        role: member.role,
        isOwner: member.isOwner,
        accepted: member.accepted,
        permissions: canSeeMemberPerms ? (member.permissions as ProjectPermission[]) : [],
        organisationPermissions: canSeeMemberPerms ? (member.organisationPermissions as OrganisationPermission[]) : [],
    };
}

export async function checkProjectSlugValidity(slug: string) {
    const project = await GetProject_ListItem(slug, slug);

    if (!project) {
        return notFoundResponseData("Project not found");
    }

    return { data: { id: project.id }, status: HTTP_STATUS.OK } as const;
}

export async function getManyProjects(
    userSession: SessionUserData | null,
    projectIds: string[],
    listedOnly = false,
    acceptedMember = "",
) {
    const list = await GetManyProjects_ListItem(projectIds);
    const projectsList: ProjectListItem[] = [];

    for (const project of list) {
        if (!project) continue;
        if (listedOnly === true && !isProjectListed(project.visibility, project.status)) {
            continue;
        }

        if (acceptedMember) {
            const member = getCurrMember(
                acceptedMember,
                project.team.members,
                project.organisation?.team.members ?? [],
            );

            if (!member?.accepted) continue;
        }

        if (!isProjectAccessible(project, userSession)) continue;

        const isOrgOwned = !!project.organisationId;
        const author = isOrgOwned
            ? project.organisation?.slug
            : project.team.members.find((member) => member.isOwner)?.user.userName;

        projectsList.push({
            icon: projectIconUrl(project.id, project.iconFileId),
            id: project.id,
            slug: project.slug,
            name: project.name,
            summary: project.summary,
            type: project.type,
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

            author: author || null,
            isOrgOwned: isOrgOwned,
        });
    }

    return {
        // sort in descending order by downloads
        data: projectsList.sort((a, b) => b.downloads - a.downloads),
        status: HTTP_STATUS.OK,
    } as const;
}

export async function getRandomProjects(userSession: SessionUserData | null, count: number) {
    let projectsCount = 20;
    if (isNumber(count) && count > 0 && count <= 100) {
        projectsCount = count;
    }

    const randomProjects: { id: string }[] = await prisma.$queryRaw`
        SELECT id
        FROM "Project"
        TABLESAMPLE SYSTEM_ROWS(${projectsCount})
        WHERE "status" = 'approved'
            AND "visibility" = 'listed'
    `;

    const idsArray = randomProjects?.map((project) => project.id);
    const res = await getManyProjects(userSession, idsArray);

    return res;
}

const HOME_PAGE_PROJECTS_CACHE_NAMESPACE = "homepage-carousel-projects";

export async function getHomePageCarouselProjects(userSession: SessionUserData | null) {
    const projectsCount = 30;

    const cachedData = await GetData_FromCache<ProjectListItem[]>(
        HOME_PAGE_PROJECTS_CACHE_NAMESPACE,
        projectsCount.toString(),
    );
    if (cachedData) {
        return { data: cachedData, status: HTTP_STATUS.OK } as const;
    }

    const trendingProjectCount = Math.floor(projectsCount / 3);
    const randomProjectsCount = projectsCount - trendingProjectCount;

    const index = meilisearch.index(MEILISEARCH_PROJECT_INDEX);
    const result = await index.search(undefined, {
        sort: ["recentDownloads:desc"],
        limit: trendingProjectCount,
    });

    const alreadyAddedIds = new Set<string>();
    const formattedTrendingProjects: ProjectListItem[] = [];
    for (const project of result.hits as ProjectSearchDocument[]) {
        formattedTrendingProjects.push(mapSearchProjectToListItem(project));
        alreadyAddedIds.add(project.id);
    }

    // Taking more than randomProjects count so that we can have a few more
    // in case of duplicates between trending and random projects
    const randomProjectsIds: { id: string }[] = await prisma.$queryRaw`
        SELECT id
        FROM "Project"
        TABLESAMPLE SYSTEM_ROWS(${projectsCount}) 
        WHERE "status" = 'approved' AND "visibility" = 'listed'
    `;

    const projectIds: string[] = [];
    for (const p of randomProjectsIds) {
        if (alreadyAddedIds.has(p.id)) continue; // Skip if the project from trending is already added
        projectIds.push(p.id);
        if (projectIds.length >= randomProjectsCount) break; // Limit to randomProjects_count
    }

    const randomProjects = await getManyProjects(userSession, projectIds);
    const projectsList: ProjectListItem[] = randomProjects.data ?? [];

    if (formattedTrendingProjects.length > 0) {
        projectsList.push(...formattedTrendingProjects);
    }

    await SetCache(HOME_PAGE_PROJECTS_CACHE_NAMESPACE, projectsCount.toString(), JSON.stringify(projectsList), 600);
    return { data: projectsList, status: HTTP_STATUS.OK } as const;
}

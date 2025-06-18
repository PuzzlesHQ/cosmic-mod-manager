import { combineProjectMembers, sortVersionsWithReference } from "@app/utils/project";
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
import type { TeamMember as DBTeamMember } from "@prisma/client";
import { GetManyProjects_ListItem, GetProject_Details, GetProject_ListItem } from "~/db/project_item";
import prisma from "~/services/prisma";
import valkey from "~/services/redis";
import type { ContextUserData } from "~/types";
import { isNumber } from "~/utils";
import { HTTP_STATUS } from "~/utils/http";
import { parseJson } from "~/utils/str";
import { orgIconUrl, projectGalleryFileUrl, projectIconUrl, userIconUrl } from "~/utils/urls";
import { isProjectAccessible, isProjectListed } from "../utils";

export async function getProjectData(slug: string, userSession: ContextUserData | undefined) {
    const project = await GetProject_Details(slug, slug);
    if (!project?.id) {
        return { data: { success: false, message: "Project not found" }, status: HTTP_STATUS.NOT_FOUND };
    }

    const allMembers = combineProjectMembers(project.team.members, project.organisation?.team.members || []);

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
    const currSessionMember = allMembers.get(userSession?.id || "");
    const org = project.organisation;

    const FormattedData: ProjectDetailsData = {
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
        members: project.team.members.map((member) => formatProjectMember(member, currSessionMember)),
        organisation: org
            ? {
                  id: org.id,
                  name: org.name,
                  slug: org.slug,
                  description: org.description,
                  icon: orgIconUrl(org.id, org.iconFileId),
                  members: org.team.members.map((member) => formatProjectMember(member, currSessionMember)),
              }
            : null,
    };

    return {
        data: {
            success: true,
            project: FormattedData,
        },
        status: HTTP_STATUS.OK,
    };
}

interface FormatMemberProps extends DBTeamMember {
    user: {
        id: string;
        userName: string;
        avatar: string | null;
    };
}

function formatProjectMember<T extends FormatMemberProps>(member: T, currMember?: { id?: string }) {
    return {
        id: member.id,
        userId: member.user.id,
        teamId: member.teamId,
        userName: member.user.userName,
        avatar: userIconUrl(member.user.id, member.user.avatar),
        role: member.role,
        isOwner: member.isOwner,
        accepted: member.accepted,
        permissions: currMember?.id ? (member.permissions as ProjectPermission[]) : [],
        organisationPermissions: currMember?.id ? (member.organisationPermissions as OrganisationPermission[]) : [],
    };
}

export async function checkProjectSlugValidity(slug: string) {
    const project = await GetProject_ListItem(slug);

    if (!project) {
        return { data: { success: false, message: "Project not found" }, status: HTTP_STATUS.NOT_FOUND };
    }

    return { data: { id: project.id }, status: HTTP_STATUS.OK };
}

export async function getManyProjects(userSession: ContextUserData | undefined, projectIds: string[], listedOnly = false) {
    const list = await GetManyProjects_ListItem(projectIds);
    const projectsList: ProjectListItem[] = [];

    for (const project of list) {
        if (!project) continue;
        if (listedOnly === true && !isProjectListed(project.visibility)) continue;

        const projectAccessible = isProjectAccessible({
            visibility: project.visibility,
            publishingStatus: project.status,
            userId: userSession?.id,
            teamMembers: project.team.members,
            orgMembers: project.organisation?.team.members || [],
            sessionUserRole: userSession?.role,
        });
        if (!projectAccessible) continue;

        const isOrgOwned = !!project.organisationId;
        const author = isOrgOwned ? project.organisation?.slug : project.team.members.find((member) => member.isOwner)?.user.userName;

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

            author: author,
            isOrgOwned: isOrgOwned,
        });
    }

    return {
        // sort in descending order by downloads
        data: projectsList.sort((a, b) => b.downloads - a.downloads),
        status: HTTP_STATUS.OK,
    };
}

export async function getRandomProjects(userSession: ContextUserData | undefined, count: number, cached = false) {
    let projectsCount = 20;
    if (isNumber(count) && count > 0 && count <= 100) {
        projectsCount = count;
    }

    if (cached) {
        const cache = await valkey.get(`random-projects-cache:${count}`);
        const cachedData = await parseJson<ProjectListItem>(cache);
        if (cachedData) {
            return { data: cachedData, status: HTTP_STATUS.OK };
        }
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

    if (cached) await valkey.set(`random-projects-cache:${count}`, JSON.stringify(res.data), "EX", 300);
    return res;
}

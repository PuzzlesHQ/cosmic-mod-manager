import { doesMemberHaveAccess, getCurrMember, getValidProjectCategories } from "@app/utils/project";
import type { updateProjectTagsFormSchema } from "@app/utils/schemas/project/settings/categories";
import type { updateProjectLicenseFormSchema } from "@app/utils/schemas/project/settings/license";
import type { updateExternalLinksFormSchema } from "@app/utils/schemas/project/settings/links";
import SPDX_LICENSE_LIST from "@app/utils/src/constants/license-list";
import { ProjectPermission } from "@app/utils/types";
import type { z } from "zod/v4";
import { GetProject_ListItem, UpdateProject } from "~/db/project_item";
import type { ContextUserData } from "~/types";
import { HTTP_STATUS, invalidRequestResponseData, notFoundResponseData } from "~/utils/http";

export async function updateProjectTags(
    projectId: string,
    userSession: ContextUserData,
    formData: z.infer<typeof updateProjectTagsFormSchema>,
) {
    const project = await GetProject_ListItem(projectId);
    if (!project?.id) return notFoundResponseData();

    const memberObj = getCurrMember(
        userSession.id,
        project.team?.members || [],
        project.organisation?.team.members || [],
    );
    const hasEditAccess = doesMemberHaveAccess(
        ProjectPermission.EDIT_DETAILS,
        memberObj?.permissions as ProjectPermission[],
        memberObj?.isOwner,
        userSession.role,
    );
    if (!hasEditAccess) {
        return {
            data: { success: false, message: "You don't have the permission to update project tags" },
            status: HTTP_STATUS.UNAUTHORIZED,
        };
    }

    const availableCategories = getValidProjectCategories(project.type).map((category) => category.name);
    const validatedTags = formData.categories.filter((tag) => availableCategories.includes(tag));
    const validatedFeaturedTags = formData.featuredCategories.filter((tag) => validatedTags.includes(tag));

    await UpdateProject({
        where: { id: project.id },
        data: {
            categories: validatedTags,
            featuredCategories: validatedFeaturedTags,
        },
    });

    return { data: { success: true, message: "Project tags updated" }, status: HTTP_STATUS.OK };
}

export async function updateProjectExternalLinks(
    userSession: ContextUserData,
    projectId: string,
    formData: z.infer<typeof updateExternalLinksFormSchema>,
) {
    const project = await GetProject_ListItem(projectId);
    if (!project?.id) return notFoundResponseData();

    const memberObj = getCurrMember(
        userSession.id,
        project.team?.members || [],
        project.organisation?.team.members || [],
    );
    const hasEditAccess = doesMemberHaveAccess(
        ProjectPermission.EDIT_DETAILS,
        memberObj?.permissions as ProjectPermission[],
        memberObj?.isOwner,
        userSession.role,
    );
    if (!hasEditAccess) {
        return {
            data: { success: false, message: "You don't the permission to update links" },
            status: HTTP_STATUS.UNAUTHORIZED,
        };
    }

    await UpdateProject({
        where: { id: project.id },
        data: {
            issueTrackerUrl: formData.issueTracker || "",
            projectSourceUrl: formData.sourceCode || "",
            projectWikiUrl: formData.wikiPage || "",
            discordInviteUrl: formData.discordServer || "",
        },
    });

    return { data: { success: true, message: "External links updated" }, status: HTTP_STATUS.OK };
}

export async function updateProjectLicense(
    userSession: ContextUserData,
    projectId: string,
    formData: z.infer<typeof updateProjectLicenseFormSchema>,
) {
    const project = await GetProject_ListItem(projectId);
    if (!project?.id) return notFoundResponseData();

    const memberObj = getCurrMember(
        userSession.id,
        project.team?.members || [],
        project.organisation?.team.members || [],
    );
    const hasEditAccess = doesMemberHaveAccess(
        ProjectPermission.EDIT_DETAILS,
        memberObj?.permissions as ProjectPermission[],
        memberObj?.isOwner,
        userSession.role,
    );
    if (!hasEditAccess) {
        return {
            data: { success: false, message: "You don't have the permission to update project license" },
            status: HTTP_STATUS.UNAUTHORIZED,
        };
    }

    if (!formData.name && !formData.id) {
        return invalidRequestResponseData("Either license name or a valid SPDX ID is required");
    }

    const spdxLicenseData = SPDX_LICENSE_LIST.find((license) => license.licenseId === formData.id);
    if (formData.id && !spdxLicenseData) {
        return invalidRequestResponseData("The provided SPDX ID is not valid");
    } else if (formData.name && !formData.url) {
        return invalidRequestResponseData("License URL is required when providing a custom license name");
    }

    const licenseId = spdxLicenseData ? spdxLicenseData.licenseId : null;
    const licenseName = spdxLicenseData ? null : formData.name;
    const licenseUrl = formData.url;

    await UpdateProject({
        where: { id: project.id },
        data: {
            licenseName: licenseName,
            licenseId: licenseId,
            licenseUrl: licenseUrl,
        },
    });

    return { data: { success: true, message: "Project license updated" }, status: HTTP_STATUS.OK };
}

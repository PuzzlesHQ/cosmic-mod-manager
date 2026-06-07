import { type CategoryT, categories } from "~/constants/categories";
import { type Loader, loaders } from "~/constants/loaders";
import { getRolePerms } from "~/constants/roles";
import { CapitalizeAndFormatString } from "~/string";
import {
    GlobalUserRole,
    type OrganisationPermission,
    type ProjectPermission,
    ProjectType,
    type TagType,
} from "~/types";

export function doesMemberHaveAccess(
    requiredPermission: ProjectPermission,
    permissions: ProjectPermission[] = [],
    isOwner = false,
    userRole = GlobalUserRole.USER,
) {
    if (!requiredPermission) return false;
    if (isOwner === true) return true;
    if (getRolePerms(userRole).PROJECT.includes(requiredPermission)) return true;
    return permissions.includes(requiredPermission);
}

export function doesOrgMemberHaveAccess(
    requiredPermission: OrganisationPermission,
    permissions: OrganisationPermission[] = [],
    isOwner = false,
    userRole = GlobalUserRole.USER,
) {
    if (!requiredPermission) return false;
    if (isOwner === true) return true;
    if (getRolePerms(userRole).ORGANIZATION.includes(requiredPermission)) return true;
    return permissions.includes(requiredPermission);
}

export function getCurrMember<T extends PartialTeamMember>(
    userId: string | null | undefined,
    teamMembers: T[],
    orgMembers: T[],
) {
    if (!userId) return null;
    const combinedMembers = combineProjectMembers(teamMembers, orgMembers);
    return combinedMembers.get(userId);
}

export function getProjectOwner<T extends PartialTeamMember>(teamMembers: T[], orgMembers: T[]) {
    const combinedMembers = combineProjectMembers(teamMembers, orgMembers);
    for (const member of combinedMembers.values()) {
        if (member.isOwner === true) return member;
    }
}

export function getValidProjectCategories(projectTypes: string[], categoryType?: TagType) {
    const alreadyAddedCategories = new Set<string>();
    const validCategories: CategoryT[] = [];

    // Loop over all categories and check if the project type is in the category's project types
    for (const category of categories) {
        if (categoryType && categoryType !== category.type) continue;

        if (projectTypes.length > 0) {
            for (const type of category.projectTypes) {
                if (projectTypes.includes(type) && !alreadyAddedCategories.has(category.name)) {
                    alreadyAddedCategories.add(category.name);
                    validCategories.push(category);
                    break;
                }
            }
        } else if (!alreadyAddedCategories.has(category.name)) {
            alreadyAddedCategories.add(category.name);
            validCategories.push(category);
        }
    }

    return validCategories;
}

export function getProjectCategoryDataFromName(categoryName: string) {
    for (const category of categories) {
        if (category.name === categoryName.toLowerCase()) return category;
    }

    return null;
}

export interface PartialTeamMember {
    userId: string;
    isOwner: boolean;
}

export function combineProjectMembers<T extends PartialTeamMember>(teamMembers: T[], orgMembers: T[]) {
    const members = new Map<string, T>();
    for (const member of teamMembers) {
        members.set(member.userId, member);
    }

    for (const member of orgMembers) {
        const alreadyAddedMember = members.get(member.userId);
        if (alreadyAddedMember && member?.isOwner === true) {
            members.set(member.userId, {
                ...alreadyAddedMember,
                isOwner: true,
            });

            continue;
        }

        if (alreadyAddedMember) continue;
        members.set(member.userId, member);
    }

    return members;
}

export function sortVersionsWithReference(versions: string[], referenceList: string[]): string[] {
    return versions.sort((a, b) => referenceList.indexOf(a) - referenceList.indexOf(b));
}

export function getProjectCategoriesDataFromNames(categoryNames: string[]) {
    const uniqueCategoryNames = Array.from(new Set(categoryNames));
    const categoriesData = [];

    for (const name of uniqueCategoryNames) {
        const category = getProjectCategoryDataFromName(name);
        if (category) categoriesData.push(category);
    }

    return categoriesData;
}

export function getAllLoaderCategories(projectType?: ProjectType) {
    const allLoadersList = new Set<Loader>();

    for (let i = 0; i < loaders.length; i++) {
        const loader = loaders[i];

        if (!projectType || loader.supportedProjectTypes.includes(projectType)) {
            allLoadersList.add(loader);
        }
    }

    return Array.from(allLoadersList);
}

export function getALlLoaderFilters(projectType: ProjectType[]) {
    if (!projectType?.length) return [];

    const list = new Set<Loader>();
    for (let i = 0; i < loaders.length; i++) {
        const loader = loaders[i];

        for (const supportedType of loader.supportedProjectTypes) {
            if (projectType.includes(supportedType)) {
                list.add(loader);
                break;
            }
        }
    }

    return Array.from(list);
}

export function getLoadersByProjectType(projectType: ProjectType[]) {
    const loadersList = new Set<Loader>();

    for (const loader of loaders) {
        for (const type of projectType) {
            if (loader.supportedProjectTypes.includes(type)) {
                loadersList.add(loader);
                break;
            }
        }
    }

    return Array.from(loadersList);
}

export const compatibleProjectTypes = {
    [ProjectType.WORLD]: [],
    [ProjectType.MODPACK]: [],
    [ProjectType.SHADER]: [ProjectType.RESOURCE_PACK],
    [ProjectType.RESOURCE_PACK]: [ProjectType.SHADER],
    [ProjectType.DATAMOD]: [ProjectType.MOD],
    [ProjectType.MOD]: [ProjectType.PLUGIN, ProjectType.DATAMOD],
    [ProjectType.PLUGIN]: [ProjectType.MOD],
};

export function filterInCompatibleProjectTypes(primaryType: ProjectType, currTypes: ProjectType[]) {
    const filteredTypes = [primaryType];
    const compatibleTypes: ProjectType[] = compatibleProjectTypes[primaryType];

    for (const type of currTypes) {
        if (compatibleTypes.includes(type)) {
            filteredTypes.push(type);
        }
    }

    return filteredTypes;
}

export function validateProjectTypesCompatibility(types: ProjectType[]) {
    if (types.length < 2) return types;

    if (types.includes(ProjectType.WORLD)) return filterInCompatibleProjectTypes(ProjectType.WORLD, types);
    if (types.includes(ProjectType.MODPACK)) return filterInCompatibleProjectTypes(ProjectType.MODPACK, types);
    if (types.includes(ProjectType.SHADER)) return filterInCompatibleProjectTypes(ProjectType.SHADER, types);
    if (types.includes(ProjectType.RESOURCE_PACK))
        return filterInCompatibleProjectTypes(ProjectType.RESOURCE_PACK, types);
    if (types.includes(ProjectType.DATAMOD)) return filterInCompatibleProjectTypes(ProjectType.DATAMOD, types);
    if (types.includes(ProjectType.MOD)) return filterInCompatibleProjectTypes(ProjectType.MOD, types);
    if (types.includes(ProjectType.PLUGIN)) return filterInCompatibleProjectTypes(ProjectType.PLUGIN, types);

    return [ProjectType.MOD];
}

export function FormatProjectTypes(types: string[]) {
    if (types.length === 1) return CapitalizeAndFormatString(types[0]);
    if (types.length === 2) return `${CapitalizeAndFormatString(types[0])} and ${CapitalizeAndFormatString(types[1])}`;

    let str = "";
    for (const type of types.slice(0, -2)) {
        str += `${CapitalizeAndFormatString(type)}, `;
    }

    str += `${CapitalizeAndFormatString(types.at(-2))} and ${CapitalizeAndFormatString(types.at(-1))}`;
    return str;
}

import { GetManyProjects_ListItem, UpdateManyProjects } from "~/db/project_item";
import { GetUser_ByIdOrUsername, UpdateUser } from "~/db/user_item";
import { UpdateProjects_SearchIndex } from "~/routes/search/search-db";
import type { ContextUserData } from "~/types";
import { HTTP_STATUS, invalidRequestResponseData, notFoundResponseData } from "~/utils/http";
import { isProjectPublic } from "../utils";

// Bulk actions
export async function addProjectsToUserFollows(projectIds: string[], userSession: ContextUserData) {
    const projects = await GetManyProjects_ListItem(projectIds);
    if (!projects.length) return invalidRequestResponseData("No projects found!");

    const userData = await GetUser_ByIdOrUsername(undefined, userSession.id);
    if (!userData?.id) return notFoundResponseData("User not found!");

    const privateProjects: string[] = [];
    const addedProjects: string[] = [];
    for (const project of projects) {
        if (!isProjectPublic(project.visibility, project.status)) {
            privateProjects.push(project.id);
            continue;
        }
        if (userData.followingProjects.includes(project.id)) continue;

        addedProjects.push(project.id);
    }

    if (!addedProjects.length) {
        if (privateProjects.length > 0) return invalidRequestResponseData("Can't follow a private project!");
        return invalidRequestResponseData("Already following!");
    }

    await Promise.all([
        UpdateUser({
            where: { id: userData.id },
            data: {
                followingProjects: userData.followingProjects.concat(addedProjects),
            },
        }),

        UpdateManyProjects(
            {
                where: {
                    id: {
                        in: addedProjects,
                    },
                },
                data: {
                    followers: {
                        increment: 1,
                    },
                },
            },
            addedProjects,
        ),

        UpdateProjects_SearchIndex(addedProjects),
    ]);

    return {
        data: {
            success: true,
        },
        status: HTTP_STATUS.OK,
    };
}

export async function removeProjectsFromUserFollows(projectIds: string[], userSession: ContextUserData) {
    if (!projectIds.length) return invalidRequestResponseData("No projects found!");

    const userData = await GetUser_ByIdOrUsername(undefined, userSession.id);
    if (!userData?.id) return notFoundResponseData("User not found!");

    const newList: string[] = [];
    const removedProjects: string[] = [];
    for (const id of userData.followingProjects) {
        if (projectIds.includes(id)) removedProjects.push(id);
        else newList.push(id);
    }

    if (!removedProjects.length) return invalidRequestResponseData("No projects removed!");

    await Promise.all([
        UpdateUser({
            where: { id: userData.id },
            data: {
                followingProjects: newList,
            },
        }),

        UpdateManyProjects(
            {
                where: {
                    id: {
                        in: removedProjects,
                    },
                },
                data: {
                    followers: {
                        decrement: 1,
                    },
                },
            },
            removedProjects,
        ),

        UpdateProjects_SearchIndex(removedProjects),
    ]);

    return {
        data: {
            success: true,
        },
        status: HTTP_STATUS.OK,
    };
}

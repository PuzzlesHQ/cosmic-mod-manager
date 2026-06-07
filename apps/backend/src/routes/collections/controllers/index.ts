import { FOLLOWS_COLLECTIONS_ID, ICON_WIDTH } from "@app/utils/constants";
import { hasFullItemAccess } from "@app/utils/constants/roles";
import { getFileType } from "@app/utils/convertors";
import { date } from "@app/utils/date";
import type { z } from "@app/utils/schemas";
import type { createCollectionFormSchema, updateCollectionFormSchema } from "@app/utils/schemas/collections";
import { CollectionVisibility, FileType } from "@app/utils/types";
import type { Collection, CollectionOwner } from "@app/utils/types/api";
import {
    CreateCollection,
    DeleteCollection,
    DeleteManyCollections_ByUserId,
    GetCollection,
    GetCollections_ByUserId,
    GetManyCollections_ById,
    UpdateCollection,
} from "~/db/collection_item";
import { CreateFile, DeleteFile_ByID, DeleteManyFiles_ByID } from "~/db/file_item";
import { GetManyProjects_ListItem } from "~/db/project_item";
import { GetUser_ByIdOrUsername } from "~/db/user_item";
import { getManyProjects } from "~/routes/project/controllers";
import { addProjectsToUserFollows, removeProjectsFromUserFollows } from "~/routes/project/controllers/follows";
import { deleteCollectionDirectory, deleteCollectionFile, saveCollectionFile } from "~/services/storage";
import { FILE_STORAGE_SERVICE, type UserSessionData } from "~/types";
import { HTTP_STATUS, notFoundResponseData, serverErrorResponseData, unauthorizedReqResponseData } from "~/utils/http";
import { resizeImageToWebp } from "~/utils/images";
import { generateDbId } from "~/utils/str";
import { collectionIconUrl, userFileUrl } from "~/utils/urls";
import { CanEditCollection, CollectionAccessible } from "../utils";

export async function GetUserCollections(userSlug: string, userSession: UserSessionData | null) {
    let userId: string;
    if (userSession?.userName === userSlug || userSession?.id === userSlug) userId = userSession.id;
    else {
        const targetUser = await GetUser_ByIdOrUsername(userSlug, userSlug);
        if (!targetUser) return notFoundResponseData("User not found!");

        userId = targetUser.id;
    }

    const collections = await GetCollections_ByUserId(userId);
    if (!collections) return { data: [], status: HTTP_STATUS.OK };

    const collectionsData = (await GetManyCollections_ById(collections)).sort((a, b) => {
        const created_A = date(a.dateCreated)?.getTime();
        const created_B = date(b.dateCreated)?.getTime();
        if (!created_A || !created_B) return 0;

        return created_B - created_A;
    });

    const formattedData = [];
    for (let i = 0; i < collectionsData.length; i++) {
        const collection = collectionsData[i];
        if (!CollectionAccessible(collection.visibility, collection.userId, userSession)) continue;
        if (
            collection.visibility === CollectionVisibility.UNLISTED &&
            !hasFullItemAccess(collection.userId === userSession?.id, userSession?.role)
        ) {
            continue;
        }

        formattedData.push({
            id: collection.id,
            userId: collection.userId,
            name: collection.name,
            description: collection.description,
            icon: collectionIconUrl(collection.id, collection.iconFileId),
            visibility: collection.visibility as CollectionVisibility,
            dateCreated: collection.dateCreated,
            dateUpdated: collection.dateUpdated,
            projects: collection.projects,
        });
    }

    return {
        // Sort by date created
        data: formattedData,
        status: HTTP_STATUS.OK,
    };
}

export async function GetUserCollection_ByCollectionId(collectionId: string, userSession: UserSessionData | null) {
    if (collectionId.toLowerCase() === FOLLOWS_COLLECTIONS_ID && userSession?.id) {
        return {
            data: {
                id: FOLLOWS_COLLECTIONS_ID,
                userId: userSession?.id,
                name: "Followed Projects",
                description: "Auto-generated collection of all the projects you're following.",
                icon: null,
                visibility: CollectionVisibility.PRIVATE,
                dateCreated: userSession.dateJoined,
                dateUpdated: new Date(),
                projects: userSession.followingProjects,
            },
            status: HTTP_STATUS.OK,
        };
    }

    const collection = await GetCollection(collectionId);
    if (!collection || !CollectionAccessible(collection.visibility, collection.userId, userSession)) {
        return notFoundResponseData("Collection not found!");
    }

    const collectionData: Collection = {
        id: collection.id,
        userId: collection.userId,
        name: collection.name,
        description: collection.description,
        icon: collectionIconUrl(collection.id, collection.iconFileId),
        visibility: collection.visibility as CollectionVisibility,
        dateCreated: collection.dateCreated,
        dateUpdated: collection.dateUpdated,
        projects: collection.projects,
    };

    return {
        data: collectionData,
        status: HTTP_STATUS.OK,
    };
}

export async function GetCollectionProjects(collectionId: string, sessionUser: UserSessionData | null) {
    if (collectionId.toLowerCase() === FOLLOWS_COLLECTIONS_ID && sessionUser?.id) {
        return await getManyProjects(sessionUser, sessionUser.followingProjects);
    }

    const collection = await GetCollection(collectionId);
    if (!collection || !CollectionAccessible(collection.visibility, collection.userId, sessionUser)) {
        return notFoundResponseData("Collection not found!");
    }

    return await getManyProjects(sessionUser, collection.projects);
}

export async function GetCollectionOwner(collectionId: string, userSession: UserSessionData | null) {
    if (collectionId.toLowerCase() === FOLLOWS_COLLECTIONS_ID && userSession?.id) {
        return {
            data: {
                id: userSession.id,
                userName: userSession.userName,
                avatar: userFileUrl(userSession.id, userSession.avatar),
            } satisfies CollectionOwner,
            status: HTTP_STATUS.OK,
        };
    }

    const collection = await GetCollection(collectionId);
    if (!collection || !CollectionAccessible(collection.visibility, collection.userId, userSession)) {
        return notFoundResponseData("Collection not found!");
    }

    const owner = await GetUser_ByIdOrUsername(undefined, collection.userId);
    if (!owner) return notFoundResponseData("Collection owner not found! Idk how :P");

    const ownerData: CollectionOwner = {
        id: owner.id,
        userName: owner.userName,
        avatar: userFileUrl(owner.id, owner.avatar),
    };

    return {
        data: ownerData,
        status: HTTP_STATUS.OK,
    };
}

export async function CreateNewCollection(
    formData: z.infer<typeof createCollectionFormSchema>,
    userSession: UserSessionData,
) {
    const collection = await CreateCollection({
        data: {
            id: generateDbId(),
            userId: userSession.id,
            name: formData.name,
            description: formData.description,
            visibility: CollectionVisibility.PUBLIC,
        },
    });

    return {
        data: {
            success: true,
            message: "Collection created!",
            collectionId: collection.id,
        },
        status: HTTP_STATUS.OK,
    };
}

export async function AddProjectsToCollection(
    collectionId: string,
    projectIds: string[],
    sessionUser: UserSessionData,
) {
    if (collectionId?.toLowerCase() === FOLLOWS_COLLECTIONS_ID && sessionUser.id) {
        return await addProjectsToUserFollows(projectIds, sessionUser);
    }

    const collection = await GetCollection(collectionId);
    if (!collection) return notFoundResponseData("Collection not found!");

    if (!CanEditCollection(collection.userId, sessionUser)) {
        return unauthorizedReqResponseData("You don't have permission to edit this collection!");
    }

    const newProjects = collection.projects;
    // Just to make sure all the project ids are valid, invalid ids won't return any data
    const projects = await GetManyProjects_ListItem(projectIds);
    let count = 0;

    for (let i = 0; i < projects.length; i++) {
        const projectId = projects[i].id;
        if (!newProjects.includes(projectId)) {
            count++;
            collection.projects.push(projectId);
        }
    }

    await UpdateCollection({
        where: { id: collectionId },
        data: { projects: newProjects, dateUpdated: new Date() },
    });

    return {
        data: {
            success: true,
            message: `${count} project(s) added to collection!`,
        },
        status: HTTP_STATUS.OK,
    };
}

export async function DeleteProjectsFromCollection(
    collectionId: string,
    projectIds: string[],
    sessionUser: UserSessionData,
) {
    if (collectionId?.toLowerCase() === FOLLOWS_COLLECTIONS_ID && sessionUser.id) {
        return await removeProjectsFromUserFollows(projectIds, sessionUser);
    }

    const collection = await GetCollection(collectionId);
    if (!collection) return notFoundResponseData("Collection not found!");

    if (!CanEditCollection(collection.userId, sessionUser)) {
        return unauthorizedReqResponseData("You don't have permission to edit this collection!");
    }

    const filteredProjects = [];

    for (let i = 0; i < collection.projects.length; i++) {
        const projectId = collection.projects[i];
        if (projectIds.includes(projectId)) continue;
        filteredProjects.push(projectId);
    }

    await UpdateCollection({
        where: { id: collection.id },
        data: { projects: filteredProjects, dateUpdated: new Date() },
    });

    return {
        data: {
            success: true,
            message: `${projectIds.length} project(s) removed from the collection!`,
        },
        status: HTTP_STATUS.OK,
    };
}

export async function deleteUserCollection(collectionId: string, sessionUser: UserSessionData) {
    const collection = await GetCollection(collectionId);
    if (!collection) return notFoundResponseData("Collection not found!");

    if (!CanEditCollection(collection.userId, sessionUser)) {
        return unauthorizedReqResponseData("You don't have permission to edit this collection!");
    }

    // Delete the collection icon and stuff
    await deleteCollectionDirectory(FILE_STORAGE_SERVICE.LOCAL, collection.id);

    // Delete the collection from database
    await DeleteCollection({
        where: {
            id: collection.id,
        },
    });

    return {
        data: {
            success: true,
            message: "Collection deleted!",
        },
        status: HTTP_STATUS.OK,
    };
}

export async function deleteAllUserCollections(user_id: string, sessionUser: Pick<UserSessionData, "id" | "role">) {
    const collections = await GetCollections_ByUserId(user_id);
    if (!CanEditCollection(user_id, sessionUser)) {
        return unauthorizedReqResponseData("You don't have permission to delete these collections!");
    }

    const collectionDetails = await GetManyCollections_ById(collections);
    const iconFiles = [];
    for (const collection of collectionDetails) {
        if (collection.iconFileId) {
            iconFiles.push(collection.iconFileId);
        }
    }

    await DeleteManyFiles_ByID(iconFiles);
    await Promise.all(
        collectionDetails.map((collection) => deleteCollectionDirectory(FILE_STORAGE_SERVICE.LOCAL, collection.id)),
    );

    await DeleteManyCollections_ByUserId(user_id);

    return {
        data: null,
        status: HTTP_STATUS.NO_CONTENT,
    };
}

export async function editUserCollectionDetails(
    formData: z.infer<typeof updateCollectionFormSchema>,
    collectionId: string,
    sessionUser: UserSessionData,
) {
    const collection = await GetCollection(collectionId);
    if (!collection) return notFoundResponseData("Collection not found!");

    if (!CanEditCollection(collection.userId, sessionUser)) {
        return unauthorizedReqResponseData("You don't have permission to edit this collection!");
    }

    let collectionIconFileId = collection.iconFileId;

    // Delete the old icon if either
    // the user uploaded a new icon or the user removed the icon
    if (collection.iconFileId && (!formData.icon || formData.icon instanceof File)) {
        const deletedFile = await DeleteFile_ByID(collection.iconFileId);
        await deleteCollectionFile(deletedFile.storageService as FILE_STORAGE_SERVICE, collection.id, deletedFile.name);
        collectionIconFileId = null;
    }

    // Update the collection icon if the user uploaded a new one
    if (formData.icon instanceof File) {
        const uploadedImg_Type = await getFileType(formData.icon);
        if (!uploadedImg_Type) return serverErrorResponseData("Failed to get the file type of the uploaded image!");

        const savedIcon_Type = FileType.WEBP;
        const icon_Webp = await resizeImageToWebp(formData.icon, uploadedImg_Type, {
            width: ICON_WIDTH,
            height: ICON_WIDTH,
            fit: "cover",
        });

        const imgFile_Id = `${generateDbId()}_${ICON_WIDTH}.${savedIcon_Type}`;
        const img_SaveUrl = await saveCollectionFile(FILE_STORAGE_SERVICE.LOCAL, collection.id, icon_Webp, imgFile_Id);
        if (!img_SaveUrl) return serverErrorResponseData("Failed to save the collection icon!");

        await CreateFile({
            data: {
                id: imgFile_Id,
                name: imgFile_Id,
                size: icon_Webp.size,
                type: savedIcon_Type,
                url: img_SaveUrl,
                storageService: FILE_STORAGE_SERVICE.LOCAL,
            },
        });

        collectionIconFileId = imgFile_Id;
    }

    await UpdateCollection({
        where: {
            id: collection.id,
        },
        data: {
            name: formData.name,
            description: formData.description,
            visibility: formData.visibility,
            iconFileId: collectionIconFileId,
        },
    });

    return {
        data: {
            success: true,
            message: "Collection updated!",
        },
        status: HTTP_STATUS.OK,
    };
}

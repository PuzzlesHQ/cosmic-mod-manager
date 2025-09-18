import { isModerator } from "@app/utils/constants/roles";
import { getFileType } from "@app/utils/convertors";
import type { profileUpdateFormSchema } from "@app/utils/schemas/settings";
import { ICON_WIDTH } from "@app/utils/src/constants";
import { formatUserName } from "@app/utils/string";
import { FileType, type GlobalUserRole } from "@app/utils/types";
import type { UserProfileData } from "@app/utils/types/api/user";
import type { z } from "zod/v4";
import { CreateFile, DeleteFile_ByID } from "~/db/file_item";
import { Get_UserProjects, GetUser_ByIdOrUsername, GetUser_Unique, UpdateUser } from "~/db/user_item";
import { getManyProjects } from "~/routes/project/controllers";
import { UpdateProjects_SearchIndex } from "~/routes/search/search-db";
import { deleteUserFile, saveUserFile } from "~/services/storage";
import { type ContextUserData, FILE_STORAGE_SERVICE } from "~/types";
import { HTTP_STATUS, invalidReqestResponseData, notFoundResponseData, unauthorizedReqResponseData } from "~/utils/http";
import { resizeImageToWebp } from "~/utils/images";
import { generateDbId } from "~/utils/str";
import { userFileUrl } from "~/utils/urls";

export async function getUserProfileData(slug: string) {
    const user = await GetUser_ByIdOrUsername(slug, slug);
    if (!user) return { data: { success: false, message: "User not found" }, status: HTTP_STATUS.NOT_FOUND };

    const dataObj = {
        id: user.id,
        name: user.name || user.userName,
        userName: user.userName,
        role: user.role as GlobalUserRole,
        avatar: userFileUrl(user.id, user.avatar),
        bio: user.bio,
        dateJoined: user.dateJoined,
        profilePageBg: userFileUrl(user.id, user.profilePageBg),
    } satisfies UserProfileData;

    return { data: dataObj, status: HTTP_STATUS.OK };
}

export async function getUserFollowedProjects(userSlug: string, userSession: ContextUserData | null, idsOnly = true) {
    // If it's the current user's profile, return their following projects directly
    if (userSession && (userSlug === userSession.userName || userSlug === userSession.id)) {
        if (idsOnly) return { data: userSession.followingProjects, status: HTTP_STATUS.OK };

        return getManyProjects(userSession, userSession.followingProjects);
    }

    // regular users can't view other users' following projects
    if (!isModerator(userSession?.role)) {
        return unauthorizedReqResponseData("You are not allowed to view other users' following projects");
    }

    const userData = await GetUser_ByIdOrUsername(userSlug, userSlug);
    if (!userData?.id) return notFoundResponseData("User not found");

    if (idsOnly) return { data: userData.followingProjects, status: HTTP_STATUS.OK };
    return await getManyProjects(userSession, userData.followingProjects);
}

export async function updateUserProfile(userSession: ContextUserData, profileData: z.infer<typeof profileUpdateFormSchema>) {
    const user = await GetUser_Unique({
        where: {
            id: userSession.id,
        },
    });
    if (!user) return notFoundResponseData("User not found");

    profileData.userName = formatUserName(profileData.userName);

    // If the user is trying to change their username, check if the new username is available
    if (profileData.userName.toLowerCase() !== user.userName.toLowerCase()) {
        const existingUserWithSameUserName = await GetUser_ByIdOrUsername(profileData.userName);
        if (existingUserWithSameUserName) {
            return { data: { success: false, message: "Username already taken" }, status: HTTP_STATUS.BAD_REQUEST };
        }

        // Update project's search index so that the new username is reflected
        const UserProjects_Id = await Get_UserProjects(user.id);
        if (UserProjects_Id.length) UpdateProjects_SearchIndex(UserProjects_Id);
    }

    const avatarFileId = await getUserAvatar(user.id, user.avatar, profileData.avatar);

    let profilePageBg_FileId = user.profilePageBg;
    // Delete image file if the user removed their profile page background or uploaded a new one
    if (user.profilePageBg && (!profileData.profilePageBg || profileData.profilePageBg instanceof File)) {
        try {
            const deleted_ImageFile = await DeleteFile_ByID(user.profilePageBg);
            await deleteUserFile(deleted_ImageFile.storageService as FILE_STORAGE_SERVICE, user.id, deleted_ImageFile.name);
        } catch {}

        profilePageBg_FileId = null;
    }

    if (profileData.profilePageBg instanceof File) {
        const fileType = await getFileType(profileData.profilePageBg);
        if (!fileType) return invalidReqestResponseData("Couldn't determine the file type of profilePageBg");

        const bgImgFileId = `${generateDbId()}.${fileType}`;
        const saveUrl = await saveUserFile(FILE_STORAGE_SERVICE.LOCAL, user.id, profileData.profilePageBg, bgImgFileId);

        if (saveUrl) {
            await CreateFile({
                data: {
                    id: bgImgFileId,
                    name: bgImgFileId,
                    size: profileData.profilePageBg.size,
                    type: fileType,
                    url: saveUrl,
                    storageService: FILE_STORAGE_SERVICE.LOCAL,
                },
            });

            profilePageBg_FileId = bgImgFileId;
        }
    }

    await UpdateUser({
        where: {
            id: user.id,
        },
        data: {
            name: profileData.name,
            avatar: avatarFileId,
            userName: profileData.userName,
            bio: profileData.bio,
            profilePageBg: profilePageBg_FileId,
        },
    });

    return { data: { success: true, message: "Profile updated successfully", profileData }, status: HTTP_STATUS.OK };
}

export async function getUserAvatar(
    userId: string,
    prevAvatarId: string | null,
    avatarFile?: null | string | File,
): Promise<string | null> {
    if (typeof avatarFile === "string" || !avatarFile) {
        // If the user didn't upload a new avatar, return the previous avatar
        if (avatarFile && avatarFile.length > 0) return prevAvatarId;

        // If the avatarFile is null, delete the user's avatar
        try {
            if (prevAvatarId && !avatarFile) {
                const deletedDbFile = await DeleteFile_ByID(prevAvatarId);
                await deleteUserFile(deletedDbFile.storageService as FILE_STORAGE_SERVICE, userId, deletedDbFile.name);
            }
        } catch {}

        return null;
    }

    // set the new avatar if the user uploaded one
    const uploadedImg_Type = await getFileType(avatarFile);
    if (!uploadedImg_Type) return null;

    const savedImg_Type = FileType.WEBP;
    const profileImg_Webp = await resizeImageToWebp(avatarFile, uploadedImg_Type, {
        width: ICON_WIDTH,
        height: ICON_WIDTH,
        fit: "cover",
    });

    const imgFile_Id = `${generateDbId()}_${ICON_WIDTH}.${savedImg_Type}`;
    const img_SaveUrl = await saveUserFile(FILE_STORAGE_SERVICE.LOCAL, userId, profileImg_Webp, imgFile_Id);
    if (!img_SaveUrl) return null;

    await CreateFile({
        data: {
            id: imgFile_Id,
            name: imgFile_Id,
            size: profileImg_Webp.size,
            type: savedImg_Type,
            url: img_SaveUrl,
            storageService: FILE_STORAGE_SERVICE.LOCAL,
        },
    });

    return imgFile_Id;
}

export async function getAllVisibleProjects(userSession: ContextUserData | null, userSlug: string, listedProjectsOnly: boolean) {
    const user = await GetUser_ByIdOrUsername(userSlug, userSlug);
    if (!user) return { data: { success: false, message: "user not found" }, status: HTTP_STATUS.NOT_FOUND };

    const UserProjects_Id = await Get_UserProjects(user.id);
    if (!UserProjects_Id.length) return { data: [], status: HTTP_STATUS.OK };

    return await getManyProjects(userSession, UserProjects_Id, listedProjectsOnly);
}

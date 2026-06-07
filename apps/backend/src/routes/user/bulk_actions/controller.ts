import type { GlobalUserRole } from "@app/utils/types";
import type { UserProfileData } from "@app/utils/types/api/user";
import { GetManyUsers_ByIds } from "~/db/user_item";
import { HTTP_STATUS } from "~/utils/http";
import { userFileUrl } from "~/utils/urls";

export async function getManyUsers(ids: string[]) {
    const users = await GetManyUsers_ByIds(ids);

    const list: UserProfileData[] = [];
    for (const user of users) {
        list.push({
            id: user.id,
            name: user.name || user.userName,
            userName: user.userName,
            dateJoined: user.dateJoined,
            role: user.role as GlobalUserRole,
            bio: user.bio,
            avatar: userFileUrl(user.id, user.avatar),
            profilePageBg: userFileUrl(user.id, user.profilePageBg),
        });
    }

    return { data: list, status: HTTP_STATUS.OK };
}

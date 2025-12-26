import { isModerator } from "@app/utils/constants/roles";
import { CollectionVisibility, type GlobalUserRole } from "@app/utils/types";

interface User_T {
    id: string;
    role: GlobalUserRole;
}

export function CollectionAccessible(visibility: string, ownerId: string, user: User_T | null) {
    if (visibility !== CollectionVisibility.PRIVATE) return true;
    if (!user) return false;
    return user.id === ownerId;
}

export function CanEditCollection(ownerId: string, user: User_T | null) {
    if (!user) return false;
    // @MOD-PRIVILEGE
    if (isModerator(user.role)) return true;
    return user.id === ownerId;
}

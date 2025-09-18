import { isModerator } from "@app/utils/constants/roles";
import { CollectionVisibility } from "@app/utils/types";
import type { ContextUserData } from "~/types";

export function CollectionAccessible(visibility: string, ownerId: string, user: ContextUserData | null) {
    if (visibility !== CollectionVisibility.PRIVATE) return true;
    if (!user) return false;
    return user.id === ownerId;
}

export function CanEditCollection(ownerId: string, user: ContextUserData | null) {
    if (!user) return false;
    // @MOD-PRIVILEGE
    if (isModerator(user.role)) return true;
    return user.id === ownerId;
}

import type { GlobalUserRole } from "./../index";

export interface UserProfileData {
    id: string;
    name: string;
    userName: string;
    role: GlobalUserRole;
    avatar: string | null;
    bio: string | null;
    dateJoined: Date;
    profilePageBg: string | null;
}

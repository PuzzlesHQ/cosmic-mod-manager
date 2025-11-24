import type { API_SCOPE } from "~/pats";

export interface PATData {
    id: string;
    userId: string;
    name: string;
    dateCreated: Date;
    dateExpires: Date;
    dateLastUsed: Date | null;
    scopes: API_SCOPE[];

    // The plain text token is only available at creation time
    token?: string;
}

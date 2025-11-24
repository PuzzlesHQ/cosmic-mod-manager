import type { GlobalUserRole } from "@app/utils/types";
import type { User } from "@prisma-client";

export interface SessionDeviceDetails {
    os: {
        name: string;
        version?: string;
    };
    ipAddress: string;
    browser: string;
    city: string;
    country: string;
}

export interface ContextUserData extends User {
    // The original type of name field is `string | null` but when the ContextUserData is returned
    // from the session validation function, the name is user.name if present, otherwise user.userName
    name: string;
    role: GlobalUserRole;
    apiScopes: bigint;

    sessionId: string | null;
    patID: string | null;
}

export enum FILE_STORAGE_SERVICE {
    LOCAL = "local",
}

export enum HashAlgorithms {
    SHA1 = "sha1",
    SHA512 = "sha512",
}

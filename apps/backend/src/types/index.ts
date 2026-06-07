import type { GlobalUserRole } from "@app/utils/types";
import type { GetUser_ReturnType } from "~/db/user_item";

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

export interface UserSessionData extends NonNullable<GetUser_ReturnType> {
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

import { decodePatScopes, encodePatScopes, patContainsRestrictedScopes } from "@app/utils/pats";
import type { createPAT_FormSchema } from "@app/utils/schemas/pat";
import type { PATData } from "@app/utils/types/api/pat";
import type z from "zod";
import { CreatePAT, DeletePAT, GetManyPATs_ByUserID, GetPAT_ById, UpdatePAT } from "~/db/pat_item";
import type { UserSessionData } from "~/types";
import { HTTP_STATUS, invalidRequestResponseData, unauthorizedReqResponseData } from "~/utils/http";
import { generateDbId } from "~/utils/str";
import { generatePAT, hashString } from "../auth/helpers";

export async function getAllUserPATs(user: UserSessionData) {
    const pats = await GetManyPATs_ByUserID(user.id);

    const res = pats.map(
        (pat) =>
            ({
                id: pat.id,
                name: pat.name,
                scopes: decodePatScopes(pat.scopes),
                userId: pat.userId,
                dateCreated: pat.dateCreated,
                dateExpires: pat.dateExpires,
                dateLastUsed: pat.dateLastUsed,
            }) satisfies PATData,
    );

    return {
        data: res,
        status: HTTP_STATUS.OK,
    };
}

export async function createPersonalAccessToken(user: UserSessionData, formData: z.infer<typeof createPAT_FormSchema>) {
    const dateExpires = new Date(formData.dateExpires);
    if (dateExpires.getTime() <= Date.now()) {
        return invalidRequestResponseData("[dateExpires] Expiration date must be in the future");
    }

    const authScopes = encodePatScopes(formData.authScopes);
    const restrictedScope = patContainsRestrictedScopes(authScopes);
    if (restrictedScope) {
        return invalidRequestResponseData(
            `[authScopes] Requested scopes include restricted scopes: '${restrictedScope}'`,
        );
    }

    const token = await generatePAT();
    const tokenHash = hashString(token);

    const pat = await CreatePAT({
        data: {
            id: generateDbId(),
            userId: user.id,
            name: formData.name,
            dateExpires: dateExpires,
            scopes: authScopes,
            tokenHash: tokenHash,
        },
    });

    const formatted = {
        id: pat.id,
        name: pat.name,
        scopes: decodePatScopes(pat.scopes),
        userId: pat.userId,
        dateCreated: pat.dateCreated,
        dateExpires: pat.dateExpires,
        dateLastUsed: pat.dateLastUsed,
        token: token,
    } satisfies PATData;

    return { data: formatted, status: HTTP_STATUS.OK };
}

export async function editPersonalAccessToken(
    user: UserSessionData,
    patId: string,
    formData: z.infer<typeof createPAT_FormSchema>,
) {
    const pat = await GetPAT_ById(patId);
    if (!pat) return invalidRequestResponseData("PAT not found");
    if (pat.userId !== user.id) return unauthorizedReqResponseData("You do not have permission to edit this PAT");

    const dateExpires = new Date(formData.dateExpires);
    if (dateExpires.getTime() <= Date.now()) {
        return invalidRequestResponseData("[dateExpires] Expiration date must be in the future");
    }

    const authScopes = encodePatScopes(formData.authScopes);
    const restrictedScope = patContainsRestrictedScopes(authScopes);
    if (restrictedScope) {
        return invalidRequestResponseData(
            `[authScopes] Requested scopes include restricted scopes: '${restrictedScope}'`,
        );
    }

    await UpdatePAT({
        where: { id: patId },
        data: {
            name: formData.name,
            dateExpires: dateExpires,
            scopes: authScopes,
        },
    });

    return {
        data: {
            success: true,
            message: "PAT updated successfully",
        },
        status: HTTP_STATUS.OK,
    };
}

export async function deletePersonalAccessToken(user: UserSessionData, patId: string) {
    const pat = await GetPAT_ById(patId);
    if (!pat) return invalidRequestResponseData("PAT not found");
    if (pat.userId !== user.id) return unauthorizedReqResponseData("You do not have permission to delete this PAT");

    await DeletePAT({
        where: { id: patId },
    });

    return {
        data: {
            success: true,
            message: "PAT deleted successfully",
        },
        status: HTTP_STATUS.OK,
    };
}

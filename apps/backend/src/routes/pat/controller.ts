import { decodePatScopes, patContainsRestrictedScopes } from "@app/utils/pats";
import type { createPAT_FormSchema } from "@app/utils/schemas/pat";
import type { PATData } from "@app/utils/types/api/pat";
import type z from "zod";
import { CreatePAT, DeletePAT, GetManyPATs_ByUserID, GetPAT_ById, UpdatePAT } from "~/db/pat_item";
import type { ContextUserData } from "~/types";
import { HTTP_STATUS, invalidRequestResponseData, unauthorizedReqResponseData } from "~/utils/http";
import { generateDbId } from "~/utils/str";
import { generatePAT, hashString } from "../auth/helpers";

export async function getAllUserPATs(user: ContextUserData) {
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

export async function createPersonalAccessToken(user: ContextUserData, formData: z.infer<typeof createPAT_FormSchema>) {
    if (formData.dateExpires.getTime() <= Date.now()) {
        return invalidRequestResponseData("Expiration date must be in the future");
    }

    const restrictedScope = patContainsRestrictedScopes(formData.authScopes);
    if (restrictedScope) {
        return invalidRequestResponseData(`Requested scopes include restricted scopes: '${restrictedScope}'`);
    }

    const token = await generatePAT();
    const tokenHash = await hashString(token);

    const pat = await CreatePAT({
        data: {
            id: generateDbId(),
            userId: user.id,
            name: formData.name,
            dateExpires: formData.dateExpires,
            scopes: formData.authScopes,
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
    user: ContextUserData,
    patId: string,
    formData: z.infer<typeof createPAT_FormSchema>,
) {
    const pat = await GetPAT_ById(patId);
    if (!pat) return invalidRequestResponseData("PAT not found");
    if (pat.userId !== user.id) return unauthorizedReqResponseData("You do not have permission to edit this PAT");

    if (formData.dateExpires.getTime() <= Date.now()) {
        return invalidRequestResponseData("Expiration date must be in the future");
    }

    const restrictedScope = patContainsRestrictedScopes(formData.authScopes);
    if (restrictedScope) {
        return invalidRequestResponseData(`Requested scopes include restricted scopes: '${restrictedScope}'`);
    }

    await UpdatePAT({
        where: { id: patId },
        data: {
            name: formData.name,
            dateExpires: formData.dateExpires,
            scopes: formData.authScopes,
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

export async function deletePersonalAccessToken(user: ContextUserData, patId: string) {
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

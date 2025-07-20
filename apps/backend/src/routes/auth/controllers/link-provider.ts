import { getAuthProviderFromString } from "@app/utils/convertors";
import { OAuthProfileDataSchema } from "@app/utils/schemas/auth";
import { zodParse } from "@app/utils/schemas/utils";
import { Capitalize } from "@app/utils/string";
import type { LinkedProvidersListData } from "@app/utils/types";
import type { Context } from "hono";
// import { addToUsedApiRateLimit } from "~/middleware/rate-limiter";
import { addInvalidAuthAttempt } from "~/middleware/rate-limit/invalid-auth-attempt";
import { createNewAuthAccount, getAuthProviderProfileData } from "~/routes/auth/helpers";
import prisma from "~/services/prisma";
import type { ContextUserData } from "~/types";
import { HTTP_STATUS, invalidReqestResponseData } from "~/utils/http";

export async function linkAuthProviderHandler(
    ctx: Context,
    userSession: ContextUserData,
    authProvider: string,
    tokenExchangeCode: string,
) {
    const { data: oAuthData, error } = await zodParse(
        OAuthProfileDataSchema,
        await getAuthProviderProfileData(authProvider, tokenExchangeCode),
    );

    if (!oAuthData || error) {
        let msg = "Invalid profile data received from the auth provider, most likely the code provided was invalid.";
        if (error) msg += `\nERROR: ${error}`;

        return {
            data: {
                message: msg,
                success: false,
            },
            status: HTTP_STATUS.BAD_REQUEST,
        };
    }

    if (!oAuthData.emailVerified) {
        return {
            data: {
                success: false,
                message: `The email associated with the ${Capitalize(oAuthData.providerName)} account is not verified`,
            },
            status: HTTP_STATUS.BAD_REQUEST,
        };
    }

    // Return if an auth account already exists with the same provider
    const possiblyAlreadyExistingAuthAccount = await prisma.authAccount.findFirst({
        where: {
            providerName: oAuthData.providerName,
            OR: [{ providerAccountId: `${oAuthData.providerAccountId}` }, { providerAccountEmail: oAuthData.email }],
        },
    });
    if (possiblyAlreadyExistingAuthAccount?.id) {
        return {
            data: {
                success: false,
                message: `The ${Capitalize(oAuthData.providerName)} account is already linked to a user account`,
            },
            status: HTTP_STATUS.BAD_REQUEST,
        };
    }

    // Return if the same type of provider is already linked with the user
    const existingSameProvider = await prisma.authAccount.findFirst({
        where: {
            userId: userSession.id,
            providerName: oAuthData.providerName,
        },
    });
    if (existingSameProvider?.id) {
        await addInvalidAuthAttempt(ctx);
        return invalidReqestResponseData();
    }

    await createNewAuthAccount(userSession.id, oAuthData);

    return {
        data: {
            success: true,
            message: `Successfully linked ${Capitalize(oAuthData.providerName)} to your account`,
        },
        status: HTTP_STATUS.OK,
    };
}

export async function unlinkAuthProvider(ctx: Context, userSession: ContextUserData, authProvider: string) {
    const allLinkedProviders = await prisma.authAccount.findMany({
        where: {
            userId: userSession.id,
        },
    });

    if (allLinkedProviders.length < 2) {
        return invalidReqestResponseData("You can't remove the only remaining auth provider");
    }

    const providerName = getAuthProviderFromString(authProvider);
    let deletedAuthAccount: number | undefined;

    try {
        deletedAuthAccount = (
            await prisma.authAccount.deleteMany({
                where: {
                    userId: userSession.id,
                    providerName: providerName,
                },
            })
        ).count;
    } catch {}

    if (!deletedAuthAccount || deletedAuthAccount < 1) {
        await addInvalidAuthAttempt(ctx);
        return invalidReqestResponseData();
    }

    return {
        data: { success: true, message: `Unlinked ${Capitalize(providerName)} from your account.` },
        status: HTTP_STATUS.OK,
    };
}

export async function getLinkedAuthProviders(userSession: ContextUserData) {
    const linkedProviders = await prisma.authAccount.findMany({
        where: {
            userId: userSession.id,
        },
    });

    const providersList: LinkedProvidersListData[] = [];
    for (const provider of linkedProviders) {
        providersList.push({
            id: provider.id,
            providerName: provider.providerName,
            providerAccountId: provider.providerAccountId,
            providerAccountEmail: provider.providerAccountEmail,
            avatarImageUrl: provider.avatarUrl,
        });
    }

    return { data: providersList, status: HTTP_STATUS.OK };
}

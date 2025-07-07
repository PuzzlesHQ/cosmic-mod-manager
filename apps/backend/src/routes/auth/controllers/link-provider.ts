import { getAuthProviderFromString } from "@app/utils/convertors";
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
    const profileData = await getAuthProviderProfileData(authProvider, tokenExchangeCode);

    if (!profileData || !profileData?.email || !profileData?.providerName || !profileData?.providerAccountId) {
        return {
            data: {
                message: "Invalid profile data received from the auth provider, most likely the code provided was invalid",
                success: false,
            },
            status: HTTP_STATUS.BAD_REQUEST,
        };
    }

    if (!profileData.emailVerified) {
        return {
            data: {
                success: false,
                message: `The email associated with the ${Capitalize(profileData.providerName)} account is not verified`,
            },
            status: HTTP_STATUS.BAD_REQUEST,
        };
    }

    // Return if an auth account already exists with the same provider
    const possiblyAlreadyExistingAuthAccount = await prisma.authAccount.findFirst({
        where: {
            providerName: profileData.providerName,
            OR: [{ providerAccountId: `${profileData.providerAccountId}` }, { providerAccountEmail: profileData.email }],
        },
    });
    if (possiblyAlreadyExistingAuthAccount?.id) {
        return {
            data: {
                success: false,
                message: `The ${Capitalize(profileData.providerName)} account is already linked to a user account`,
            },
            status: HTTP_STATUS.BAD_REQUEST,
        };
    }

    // Return if the same type of provider is already linked with the user
    const existingSameProvider = await prisma.authAccount.findFirst({
        where: {
            userId: userSession.id,
            providerName: profileData.providerName,
        },
    });
    if (existingSameProvider?.id) {
        await addInvalidAuthAttempt(ctx);
        return invalidReqestResponseData();
    }

    await createNewAuthAccount(userSession.id, profileData);

    return {
        data: {
            success: true,
            message: `Successfully linked ${Capitalize(profileData.providerName)} to your account`,
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
    let deletedAuthAccount: number | undefined ;

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

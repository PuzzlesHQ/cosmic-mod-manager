import { SITE_NAME_SHORT } from "@app/utils/constants";
import { zodParse } from "@app/utils/schemas/utils";
import { Capitalize, CapitalizeAndFormatString } from "@app/utils/string";
import type { Context } from "hono";
import { addInvalidAuthAttempt } from "~/middleware/rate-limit/invalid-auth-attempt";
import { getAuthProviderProfileData } from "~/routes/auth/helpers";
import { createUserSession, setSessionCookie } from "~/routes/auth/helpers/session";
import { OAuthProfileDataSchema } from "~/routes/auth/providers/_schema";
import prisma from "~/services/prisma";
import { HTTP_STATUS, invalidRequestResponseData } from "~/utils/http";

export async function oAuthSignInHandler(ctx: Context, authProvider: string, tokenExchangeCode: string) {
    const { data: oAuthData, error } = await zodParse(
        OAuthProfileDataSchema,
        await getAuthProviderProfileData(authProvider, tokenExchangeCode),
    );

    if (!oAuthData || error) {
        await addInvalidAuthAttempt(ctx);

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

    const authAccount = await prisma.authAccount.findFirst({
        where: {
            providerName: oAuthData.providerName,
            providerAccountId: oAuthData.providerAccountId,
        },
        include: {
            user: true,
        },
    });

    if (!authAccount?.id) {
        const otherProviderAccount = await prisma.authAccount.findFirst({
            where: {
                providerAccountEmail: oAuthData.email,
            },
        });

        if (!otherProviderAccount?.id) {
            return invalidRequestResponseData(
                "The provider you're trying to sign in with is not linked to any crmm account!",
            );
        }

        await addInvalidAuthAttempt(ctx);
        return invalidRequestResponseData(
            `This ${Capitalize(oAuthData.providerName)} account is not linked to your ${SITE_NAME_SHORT} user account. We found a ${CapitalizeAndFormatString(otherProviderAccount.providerName)} account linked to your user account, please sign in using that.\nNOTE: You can manage linked providers in account settings.`,
        );
    }

    const newSession = await createUserSession({
        userId: authAccount.user.id,
        providerName: oAuthData.providerName,
        ctx: ctx,
        user: authAccount.user,
    });
    setSessionCookie(ctx, newSession);

    return {
        data: {
            success: true,
            message: `Successfuly logged in using ${oAuthData.providerName} as ${authAccount.user.userName}`,
        },
        status: HTTP_STATUS.OK,
    };
}

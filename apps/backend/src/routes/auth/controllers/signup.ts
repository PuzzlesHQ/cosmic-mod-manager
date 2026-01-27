import { zodParse } from "@app/utils/schemas/utils";
import { createURLSafeSlug } from "@app/utils/string";
import { GlobalUserRole } from "@app/utils/types";
import type { Context } from "hono";
import { CreateUser, GetUser_ByIdOrUsername, GetUser_Unique } from "~/db/user_item";
import { addInvalidAuthAttempt } from "~/middleware/rate-limit/invalid-auth-attempt";
import { createNewAuthAccount, getAuthProviderProfileData } from "~/routes/auth/helpers";
import { createUserSession, setSessionCookie } from "~/routes/auth/helpers/session";
import { OAuthProfileDataSchema } from "~/routes/auth/providers/_schema";
import { getUserAvatar } from "~/routes/user/controllers/profile";
import prisma from "~/services/prisma";
import { getImageFromHttpUrl } from "~/utils/file";
import { HTTP_STATUS } from "~/utils/http";
import { generateDbId } from "~/utils/str";

export async function oAuthSignUpHandler(ctx: Context, authProvider: string, tokenExchangeCode: string) {
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

    // Return if an auth account already exists with the same provider
    const possiblyAlreadyExistingAuthAccount = await prisma.authAccount.findFirst({
        where: {
            providerName: oAuthData.providerName,
            OR: [{ providerAccountId: `${oAuthData.providerAccountId}` }, { providerAccountEmail: oAuthData.email }],
        },
    });
    if (possiblyAlreadyExistingAuthAccount?.id) {
        await addInvalidAuthAttempt(ctx);
        return {
            data: { success: false, message: "A user already exists with this account, try logging in instead" },
            status: HTTP_STATUS.BAD_REQUEST,
        };
    }

    // Return if a user already exists with the same email
    const possiblyAlreadyExistingUser = await GetUser_Unique({
        where: {
            email: oAuthData.email,
        },
    });
    if (possiblyAlreadyExistingUser?.id) {
        await addInvalidAuthAttempt(ctx);
        return {
            data: { success: false, message: "A user already exists with the email you are trying to sign up with." },
            status: HTTP_STATUS.BAD_REQUEST,
        };
    }

    const userId = generateDbId();
    let userName = createURLSafeSlug(oAuthData.name || "");

    // Check if the username is available
    const existingUserWithSameUserName = userName?.length > 0 ? await GetUser_ByIdOrUsername(userName) : null;
    if (existingUserWithSameUserName) userName = createURLSafeSlug(`${userName}-${userId}`);

    // If the provider didn't provide a name, just set userName equal to the userId
    if (!userName) userName = userId;

    // Create the avatar image
    let avatarImgId: string | null = null;
    try {
        const avatarFile = await getImageFromHttpUrl(oAuthData.avatarImage || "");
        if (avatarFile) avatarImgId = await getUserAvatar(userId, null, avatarFile);
    } catch (error) {
        console.error("Error creating avatar image");
        console.error(error);
    }

    // Finally create a user
    const newUser = await CreateUser({
        data: {
            id: userId,
            email: oAuthData.email,
            userName: userName,
            userNameLower: userName.toLowerCase(),
            name: oAuthData?.name || "",
            emailVerified: oAuthData.emailVerified === true,
            role: GlobalUserRole.USER,
            newSignInAlerts: true,
            avatar: avatarImgId,
        },
    });

    await createNewAuthAccount(newUser.id, oAuthData);

    const newSession = await createUserSession({
        userId: newUser.id,
        providerName: authProvider,
        ctx,
        isFirstSignIn: true,
        user: newUser,
    });
    setSessionCookie(ctx, newSession);

    return {
        data: {
            success: true,
            message: `Successfully signed up using ${authProvider} as ${newUser.name}`,
        },
        status: HTTP_STATUS.OK,
    };
}

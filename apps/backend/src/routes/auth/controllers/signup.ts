import { createURLSafeSlug } from "@app/utils/string";
import { GlobalUserRole } from "@app/utils/types";
import type { Context } from "hono";
import { CreateUser, GetUser_ByIdOrUsername, GetUser_Unique } from "~/db/user_item";
import { addInvalidAuthAttempt } from "~/middleware/rate-limit/invalid-auth-attempt";
import { createNewAuthAccount, getAuthProviderProfileData } from "~/routes/auth/helpers";
import { createUserSession, setSessionCookie } from "~/routes/auth/helpers/session";
import { getUserAvatar } from "~/routes/user/controllers/profile";
import prisma from "~/services/prisma";
import { getImageFromHttpUrl } from "~/utils/file";
import { HTTP_STATUS } from "~/utils/http";
import { generateDbId } from "~/utils/str";

export async function oAuthSignUpHandler(ctx: Context, authProvider: string, tokenExchangeCode: string) {
    const profileData = await getAuthProviderProfileData(authProvider, tokenExchangeCode);

    if (
        !profileData ||
        !profileData?.email ||
        !profileData?.providerName ||
        !profileData?.providerAccountId ||
        !profileData.emailVerified
    ) {
        await addInvalidAuthAttempt(ctx);
        return {
            data: {
                message: "Invalid profile data received from the auth provider, most likely the code provided was invalid",
                success: false,
                data: profileData,
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
        await addInvalidAuthAttempt(ctx);
        return {
            data: { success: false, message: "A user already exists with this account, try to login instead" },
            status: HTTP_STATUS.BAD_REQUEST,
        };
    }

    // Return if a user already exists with the same email
    const possiblyAlreadyExistingUser = await GetUser_Unique({
        where: {
            email: profileData.email,
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
    let userName = createURLSafeSlug(profileData.name || "");

    // Check if the username is available
    const existingUserWithSameUserName = userName?.length > 0 ? await GetUser_ByIdOrUsername(userName) : null;
    if (existingUserWithSameUserName) userName = `${userName}-${userId}`;

    // If the provider didn't provide a name, just set userName equal to the userId
    if (!userName) userName = userId;

    // Create the avatar image
    let avatarImgId: string | null = null;
    try {
        const avatarFile = await getImageFromHttpUrl(profileData.avatarImage || "");
        if (avatarFile) avatarImgId = await getUserAvatar(userId, null, avatarFile);
    } catch (error) {
        console.error("Error creating avatar image");
        console.error(error);
    }

    // Finally create a user
    const newUser = await CreateUser({
        data: {
            id: userId,
            email: profileData.email,
            userName: userName,
            name: profileData?.name || "",
            emailVerified: profileData.emailVerified === true,
            role: GlobalUserRole.USER,
            newSignInAlerts: true,
            avatar: avatarImgId,
        },
    });

    await createNewAuthAccount(newUser.id, profileData);

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

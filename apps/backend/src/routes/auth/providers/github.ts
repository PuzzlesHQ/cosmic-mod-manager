import { AuthProvider } from "@app/utils/types";
import env from "~/utils/env";

export async function getGithubUserProfileData(tokenExchangeCode: string) {
    const authTokenRes = await fetch(
        `https://github.com/login/oauth/access_token?client_id=${env.GITHUB_ID}&client_secret=${env.GITHUB_SECRET}&code=${tokenExchangeCode}`,
        {
            method: "POST",
            headers: {
                accept: "application/json",
            },
        },
    );

    // biome-ignore lint/suspicious/noExplicitAny: don't wanna define a type for this right now
    const tokenData = (await authTokenRes.json()) as any;
    const accessToken = tokenData?.access_token;
    if (!accessToken) return null;

    const [userData, userEmailData] = await Promise.all([
        // biome-ignore lint/suspicious/noExplicitAny: ^^
        fetchUserData(accessToken) as Promise<any>,
        fetchUserEmail(accessToken),
    ]);

    const profile = {
        name: userData?.name || null,
        email: userEmailData?.email?.toLowerCase() || null,
        emailVerified: userEmailData?.verified === true,
        providerName: AuthProvider.GITHUB,
        providerAccountId: userData?.id?.toString() || null,
        authType: "oauth",
        accessToken: accessToken,
        refreshToken: null,
        tokenType: tokenData?.token_type || null,
        scope: tokenData?.scope || null,
        avatarImage: userData?.avatar_url || null,
    };

    // casted to `object` so that the consumers are forced to validate the data using the defined schema
    // find the zod schema ./_schema.ts
    return profile as object;
}

async function fetchUserData(access_token: string) {
    const userDataRes = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `token ${access_token}`,
        },
    });

    return await userDataRes.json();
}

type EmailData = {
    email: string;
    primary: boolean;
    verified: boolean;
    visibility: string | null;
};

async function fetchUserEmail(access_token: string): Promise<EmailData | null> {
    const userEmailRes = await fetch("https://api.github.com/user/emails", {
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${access_token}`,
            "X-Github-Api-Version": "2022-11-28",
        },
    });

    const userEmailData = (await userEmailRes.json()) as EmailData[];
    let userEmailObj: EmailData | null = null;

    for (const emailObj of userEmailData) {
        if (emailObj?.primary === true) {
            userEmailObj = emailObj;
        }
    }

    return userEmailObj;
}

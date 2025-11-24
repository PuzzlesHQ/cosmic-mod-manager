import { AuthProvider } from "@app/utils/types";
import type { OAuthData } from "~/types/oAuth";
import env from "~/utils/env";

export async function getGitlabUserProfileData(tokenExchangeCode: string) {
    const client_id = env.GITLAB_ID;
    const client_secret = env.GITLAB_SECRET;

    const url = new URL("https://gitlab.com/oauth/token");
    url.searchParams.append("grant_type", "authorization_code");
    url.searchParams.append("code", tokenExchangeCode);
    url.searchParams.append("redirect_uri", `${env.OAUTH_REDIRECT_URI}/${AuthProvider.GITLAB}`);

    const authTokenRes = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    const tokenData = await authTokenRes.json();
    const accessToken = tokenData?.access_token;
    const accessTokenType = tokenData?.token_type;

    const userDataRes = await fetch("https://gitlab.com/api/v4/user", {
        headers: {
            Authorization: `${accessTokenType} ${accessToken}`,
        },
    });
    const userProfile = await userDataRes.json();

    const profile = {
        name: userProfile?.name || null,
        email: userProfile?.email?.toLowerCase() || null,
        emailVerified:
            userProfile?.bot === false && userProfile?.locked === false && userProfile?.can_create_project === true,
        providerName: AuthProvider.GITLAB,
        providerAccountId: userProfile?.id?.toString() || null,
        authType: "oauth",
        accessToken: accessToken,
        refreshToken: tokenData?.refresh_token || null,
        tokenType: accessTokenType || null,
        scope: tokenData?.scope || null,
        avatarImage: userProfile?.avatar_url || null,
    } satisfies OAuthData;

    return profile;
}

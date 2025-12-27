import { AuthProvider } from "@app/utils/types";
import env from "~/utils/env";

export async function getDiscordUserProfileData(tokenExchangeCode: string) {
    const client_id = env.DISCORD_ID;
    const client_secret = env.DISCORD_SECRET;

    const formData = new URLSearchParams();
    formData.append("client_id", client_id);
    formData.append("client_secret", client_secret);
    formData.append("grant_type", "authorization_code");
    formData.append("redirect_uri", `${env.OAUTH_REDIRECT_URI}/${AuthProvider.DISCORD}`);
    formData.append("code", tokenExchangeCode);

    const authTokenRes = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
    });

    // biome-ignore lint/suspicious/noExplicitAny: see ./github.ts
    const tokenData = (await authTokenRes.json()) as any;
    const accessToken = tokenData?.access_token;
    const accessTokenType = tokenData?.token_type;

    const userDataRes = await fetch("https://discord.com/api/v10/users/@me", {
        headers: {
            Authorization: `${accessTokenType} ${accessToken}`,
        },
    });
    // biome-ignore lint/suspicious/noExplicitAny: ^^
    const userProfile = (await userDataRes.json()) as any;

    const profile = {
        name: userProfile?.name || null,
        email: userProfile?.email?.toLowerCase() || null,
        emailVerified: userProfile?.verified === true,
        providerName: AuthProvider.DISCORD,
        providerAccountId: userProfile?.id?.toString() || null,
        authType: "oauth",
        accessToken: accessToken,
        refreshToken: tokenData?.refresh_token || null,
        tokenType: accessTokenType || null,
        scope: tokenData?.scope || null,
        avatarImage: `https://cdn.discordapp.com/avatars/${userProfile?.id}/${userProfile?.avatar}`,
    };

    // ^^ see ./github.ts for explanation on the type assertion
    return profile as object;
}

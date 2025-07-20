import { AUTHTOKEN_COOKIE_NAMESPACE, CSRF_STATE_COOKIE_NAMESPACE, PASSWORD_HASH_SALT_ROUNDS } from "@app/utils/constants";
import { getSessionIp } from "@app/utils/headers";
import { convertToIPv6, stripIp } from "@app/utils/ip";
import type { ValidatedOAuthProfile } from "@app/utils/schemas/auth";
import { type AuthActionIntent, AuthProvider } from "@app/utils/types";
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";
import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import { random } from "nanoid";
import { getDiscordUserProfileData } from "~/routes/auth/providers/discord";
import { getGithubUserProfileData } from "~/routes/auth/providers/github";
import { getGitlabUserProfileData } from "~/routes/auth/providers/gitlab";
import { getGoogleUserProfileData } from "~/routes/auth/providers/google";
import prisma from "~/services/prisma";
import env from "~/utils/env";
import { setCookie } from "~/utils/http";
import { generateDbId, generateRandomId } from "~/utils/str";

const oAuthUrlTemplates = {
    [AuthProvider.GITHUB]: (clientId: string, redirectUri: string, csrfState: string) => {
        return `https://github.com/login/oauth/authorize?&response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${redirectUri}&scope=${encodeURIComponent("read:user user:email")}&state=${csrfState}`;
    },
    [AuthProvider.GITLAB]: (clientId: string, redirectUri: string, csrfState: string) => {
        return `https://gitlab.com/oauth/authorize?scope=read_user&response_type=code&client_id=${encodeURI(clientId)}&redirect_uri=${redirectUri}&state=${csrfState}`;
    },
    [AuthProvider.DISCORD]: (clientId: string, redirectUri: string, csrfState: string) => {
        return `https://discord.com/oauth2/authorize?scope=identify+email&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${csrfState}`;
    },
    [AuthProvider.GOOGLE]: (clientId: string, redirectUri: string, csrfState: string) => {
        return `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${redirectUri}&state=${csrfState}&scope=openid+profile+email`;
    },
};

export function getOAuthUrl(ctx: Context, authProvider: string, actionIntent: AuthActionIntent) {
    const redirectUri = `${env.OAUTH_REDIRECT_URI}/${authProvider}`;
    const csrfState = `${actionIntent}-${generateRandomId(24)}`;

    setCookie(ctx, CSRF_STATE_COOKIE_NAMESPACE, csrfState, { httpOnly: false });
    switch (authProvider) {
        case AuthProvider.GITHUB:
            return oAuthUrlTemplates[AuthProvider.GITHUB](env.GITHUB_ID || "", redirectUri, csrfState);
        case AuthProvider.GITLAB:
            return oAuthUrlTemplates[AuthProvider.GITLAB](env.GITLAB_ID || "", redirectUri, csrfState);
        case AuthProvider.DISCORD:
            return oAuthUrlTemplates[AuthProvider.DISCORD](env.DISCORD_ID || "", redirectUri, csrfState);
        case AuthProvider.GOOGLE:
            return oAuthUrlTemplates[AuthProvider.GOOGLE](env.GOOGLE_ID || "", redirectUri, csrfState);
        default:
            return "";
    }
}

export async function getAuthProviderProfileData(authProvider: string, code: string) {
    try {
        switch (authProvider.toLowerCase()) {
            case AuthProvider.GITHUB:
                return await getGithubUserProfileData(code);

            case AuthProvider.GITLAB:
                return await getGitlabUserProfileData(code);

            case AuthProvider.DISCORD:
                return await getDiscordUserProfileData(code);

            case AuthProvider.GOOGLE:
                return await getGoogleUserProfileData(code);

            default:
                return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function createNewAuthAccount(userId: string, data: ValidatedOAuthProfile) {
    return await prisma.authAccount.create({
        data: {
            id: generateDbId(),
            userId: userId,
            providerName: data.providerName,
            providerAccountId: data.providerAccountId,
            providerAccountEmail: data.email,
            accessToken: data.accessToken,
            tokenType: data.tokenType,
            refreshToken: data.refreshToken,
            authType: data.authType,
            authorizationScope: data.scope,
        },
    });
}

export function getUserIpAddress(ctx: Context, strip = true): string | null {
    function getHeader(key: string) {
        return ctx.req.header(key);
    }

    const ipStr = getSessionIp(getHeader, {
        fallbackIp: ctx.env.ip?.address || "::1",
        cdnSecret: env.CDN_SECRET,
        cloudflareSecret: env.CLOUDFLARE_SECRET,
    });

    if (!ipStr) return null;

    const IPv6 = convertToIPv6(ipStr);
    if (!IPv6) return null;

    // Strip the IP address to prevent abuse due to IPv6 (to be used in rate limiting)
    if (strip === false) return IPv6;
    return stripIp(IPv6).toString(16);
}

export function generateRandomToken(): string {
    const bytes = random(32);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
}

export async function hashString(str: string) {
    return (await new Promise((resolve) => {
        const hasher = new Bun.CryptoHasher("sha256", env.HASH_SECRET_KEY);
        hasher.update(str);
        resolve(hasher.digest("hex") as string);
    })) as string;
}

export function getUserSessionCookie(ctx: Context) {
    try {
        const cookie = getCookie(ctx, AUTHTOKEN_COOKIE_NAMESPACE);
        if (!cookie) {
            return null;
        }
        return cookie;
    } catch {}
    return null;
}

// Hash the user password
export async function hashPassword(password: string) {
    const hashedPassword = await Bun.password.hash(password, {
        algorithm: "argon2id",
        timeCost: PASSWORD_HASH_SALT_ROUNDS,
    });

    return hashedPassword;
}

// Compare plain text password and the hashed password
export async function matchPassword(password: string, hash: string) {
    try {
        return await Bun.password.verify(password, hash, "argon2id");
    } catch {
        return false;
    }
}

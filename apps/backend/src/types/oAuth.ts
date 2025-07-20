export interface OAuthData {
    name: string | null;
    email: string | null;
    emailVerified: boolean;
    providerName: string;
    providerAccountId: string;
    authType?: string | null;
    accessToken: string;
    refreshToken?: string | null;
    tokenType?: string | null;
    scope?: string | null;
    avatarImage?: string | null;
}

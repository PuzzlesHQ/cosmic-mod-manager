import { AuthProvider } from "@app/utils/types";
import z from "zod";

export const OAuthProfileDataSchema = z.object({
    name: z.string().nullable(),
    email: z.string().toLowerCase(),
    emailVerified: z.boolean(),
    providerName: z.enum(AuthProvider),
    providerAccountId: z.string(),
    accessToken: z.string(),

    authType: z.string().nullable(),
    refreshToken: z.string().nullable(),
    tokenType: z.string().nullable(),
    scope: z.string().nullable(),
    avatarImage: z.string().nullable(),
});

export type ValidatedOAuthProfile = z.infer<typeof OAuthProfileDataSchema>;

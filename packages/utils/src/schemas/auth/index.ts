import { z } from "zod/v4";
import { MAX_EMAIL_LENGTH, MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "~/constants";
import { AuthProvider } from "~/types";

export const loginFormSchema = z.object({
    email: z.email().max(MAX_EMAIL_LENGTH),
    password: z
        .string()
        .min(MIN_PASSWORD_LENGTH, `Your password must be atleast ${MIN_PASSWORD_LENGTH} characters long`)
        .max(MAX_PASSWORD_LENGTH, `Your password can have a maximum of only ${MAX_PASSWORD_LENGTH} characters`),
});

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

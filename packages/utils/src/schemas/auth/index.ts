import { z } from "zod/v4";
import { MAX_EMAIL_LENGTH, MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "~/constants";

export const loginFormSchema = z.object({
    email: z.email().max(MAX_EMAIL_LENGTH),
    password: z
        .string()
        .min(MIN_PASSWORD_LENGTH, `Your password must be atleast ${MIN_PASSWORD_LENGTH} characters long`)
        .max(MAX_PASSWORD_LENGTH, `Your password can have a maximum of only ${MAX_PASSWORD_LENGTH} characters`),
});

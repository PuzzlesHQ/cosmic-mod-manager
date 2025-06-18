import { z } from "zod";
import { MAX_EMAIL_LENGTH, MAX_PASSWORD_LENGTH, MIN_EMAIL_LENGTH, MIN_PASSWORD_LENGTH } from "~/constants";

export const LoginFormSchema = z.object({
    email: z.string().min(MIN_EMAIL_LENGTH, "Enter your email address").max(MAX_EMAIL_LENGTH, "Invalid email length"),
    password: z
        .string()
        .min(MIN_PASSWORD_LENGTH, `Your password must be atleast ${MIN_PASSWORD_LENGTH} characters long`)
        .max(MAX_PASSWORD_LENGTH, `Your password can have a maximum of only ${MAX_PASSWORD_LENGTH} characters`),
});

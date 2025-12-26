import { z } from "zod/v4";
import { RESERVED_USERNAMES } from "~/config/reserved";
import {
    MAX_DISPLAY_NAME_LENGTH,
    MAX_EMAIL_LENGTH,
    MAX_PASSWORD_LENGTH,
    MAX_PROFILE_PAGE_BG_SIZE,
    MAX_USER_BIO_LENGTH,
    MAX_USERNAME_LENGTH,
    MIN_PASSWORD_LENGTH,
} from "~/constants";
import { getFileType } from "~/convertors";
import { iconFieldSchema } from "~/schemas";
import { fileMaxSize_ErrMsg, mustBeURLSafe } from "~/schemas/utils";
import { isImageFile, isVideoFile } from "~/schemas/validation";
import { createURLSafeSlug } from "~/string";

const userNameSchema = z
    .string()
    .min(2)
    .max(MAX_USERNAME_LENGTH)
    .refine(
        (userName) => {
            if (userName.toLowerCase() !== createURLSafeSlug(userName)) return false;
            return true;
        },
        { error: mustBeURLSafe("Username") },
    )
    .refine(
        (userName) => {
            if (RESERVED_USERNAMES.includes(userName)) return false;
            return true;
        },
        { error: "Can't use a reserved username, please choose something else." },
    );

export const profileUpdateFormSchema = z.object({
    name: z.string().max(MAX_DISPLAY_NAME_LENGTH).nullable(),
    avatar: iconFieldSchema.or(z.string()).nullable(),
    userName: userNameSchema,
    bio: z.string().max(MAX_USER_BIO_LENGTH).nullable(),
    profilePageBg: z
        .union([
            // either a file (to set a new bg)
            z
                .file()
                .max(MAX_PROFILE_PAGE_BG_SIZE, fileMaxSize_ErrMsg(MAX_PROFILE_PAGE_BG_SIZE))
                .refine(
                    async (file) => {
                        const type = await getFileType(file);
                        if (!isImageFile(type) && !isVideoFile(type)) {
                            return false;
                        }

                        return true;
                    },
                    { error: "Invalid file type, only image/video files allowed" },
                ),

            // or any non empty string (to keep existing bg)
            // or an empty string (to remove existing bg)
            z.string(),
        ])
        .nullable(),
});

const passwordSchema = z
    .string()
    .min(MIN_PASSWORD_LENGTH, `Your password must be atleast ${MIN_PASSWORD_LENGTH} characters`)
    .max(MAX_PASSWORD_LENGTH, `Your password can only have a maximum of ${MAX_PASSWORD_LENGTH} characters`);

export const setNewPasswordFormSchema = z
    .object({
        newPassword: passwordSchema,
        confirmNewPassword: passwordSchema,
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        error: "Passwords do not match",
        path: ["confirmNewPassword"],
    });

export const removeAccountPasswordFormSchema = z.object({
    password: z.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH),
});

export const sendAccoutPasswordChangeLinkFormSchema = z.object({
    email: z.email().max(MAX_EMAIL_LENGTH),
});

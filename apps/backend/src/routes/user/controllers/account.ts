import {
    CHANGE_ACCOUNT_PASSWORD_EMAIL_VALIDITY_ms,
    CONFIRM_NEW_PASSWORD_EMAIL_VALIDITY_ms,
    DELETE_USER_ACCOUNT_EMAIL_VALIDITY_ms,
} from "@app/utils/constants";
import { getConfirmActionTypeFromStringName } from "@app/utils/convertors";
import type {
    removeAccountPasswordFormSchema,
    sendAccoutPasswordChangeLinkFormSchema,
    setNewPasswordFormSchema,
} from "@app/utils/schemas/settings";
import { ConfirmationType } from "@app/utils/types";
import type { Context } from "hono";
import type { z } from "zod";
import { GetUser_Unique, UpdateUser } from "~/db/user_item";
import { addInvalidAuthAttempt } from "~/middleware/rate-limit/invalid-auth-attempt";
import { generateRandomToken, hashPassword, hashString, matchPassword } from "~/routes/auth/helpers";
import { invalidateAllOtherUserSessions } from "~/routes/auth/helpers/session";
import prisma from "~/services/prisma";
import type { ContextUserData } from "~/types";
import { isConfirmationCodeValid } from "~/utils";
import { sendChangePasswordEmail, sendConfirmNewPasswordEmail, sendDeleteUserAccountEmail } from "~/utils/email";
import { HTTP_STATUS, invalidReqestResponseData } from "~/utils/http";
import { generateDbId } from "~/utils/str";

const confirmationEmailValidityDict = {
    [ConfirmationType.CONFIRM_NEW_PASSWORD]: CONFIRM_NEW_PASSWORD_EMAIL_VALIDITY_ms,
    [ConfirmationType.CHANGE_ACCOUNT_PASSWORD]: CHANGE_ACCOUNT_PASSWORD_EMAIL_VALIDITY_ms,
    [ConfirmationType.DELETE_USER_ACCOUNT]: DELETE_USER_ACCOUNT_EMAIL_VALIDITY_ms,
};

export async function addNewPassword_ConfirmationEmail(userSession: ContextUserData, formData: z.infer<typeof setNewPasswordFormSchema>) {
    if (formData.newPassword !== formData.confirmNewPassword)
        return { data: { success: false, message: "Passwords do not match" }, status: HTTP_STATUS.BAD_REQUEST };

    if (userSession.password) return invalidReqestResponseData();

    const hashedPassword = await hashPassword(formData.newPassword);
    const token = generateRandomToken();
    const tokenHash = await hashString(token);

    await prisma.userConfirmation.create({
        data: {
            id: generateDbId(),
            userId: userSession.id,
            confirmationType: ConfirmationType.CONFIRM_NEW_PASSWORD,
            accessCode: tokenHash,
            contextData: hashedPassword,
        },
    });

    sendConfirmNewPasswordEmail({
        fullName: userSession.name,
        code: token,
        receiverEmail: userSession.email,
    });

    return {
        data: { message: "You should receive a confirmation email shortly.", success: true },
        status: HTTP_STATUS.OK,
    };
}

export async function getConfirmActionTypeFromCode(token: string) {
    const tokenHash = await hashString(token);
    const confirmationEmail = await prisma.userConfirmation.findUnique({
        where: {
            accessCode: tokenHash,
        },
    });

    const actionType = getConfirmActionTypeFromStringName(confirmationEmail?.confirmationType || "");
    if (!confirmationEmail || !actionType) return invalidReqestResponseData("Invalid or expired code");

    if (!isConfirmationCodeValid(confirmationEmail.dateCreated, confirmationEmailValidityDict[actionType]))
        return invalidReqestResponseData("Invalid or expired code");

    return { data: { actionType: actionType, success: true }, status: HTTP_STATUS.OK };
}

export async function deleteConfirmationActionCode(token: string) {
    const tokenHash = await hashString(token);
    const confirmationEmail = await prisma.userConfirmation.findUnique({
        where: { accessCode: tokenHash },
    });

    if (!confirmationEmail?.id) return invalidReqestResponseData("Invalid or expired code");

    await prisma.userConfirmation.deleteMany({
        where: {
            userId: confirmationEmail.userId,
            confirmationType: confirmationEmail.confirmationType,
        },
    });

    return { data: { success: true, message: "Cancelled successfully" }, status: HTTP_STATUS.OK };
}

export async function confirmAddingNewPassword(code: string) {
    const tokenHash = await hashString(code);

    const confirmationEmail = await prisma.userConfirmation.findUnique({
        where: { accessCode: tokenHash, confirmationType: ConfirmationType.CONFIRM_NEW_PASSWORD },
        select: {
            id: true,
            userId: true,
            dateCreated: true,
            contextData: true,
            user: {
                select: {
                    password: true,
                },
            },
        },
    });
    if (!confirmationEmail) return invalidReqestResponseData("Invalid or expired code");

    if (!isConfirmationCodeValid(confirmationEmail.dateCreated, CONFIRM_NEW_PASSWORD_EMAIL_VALIDITY_ms))
        return invalidReqestResponseData("Invalid or expired code");
    if (confirmationEmail.user.password) return invalidReqestResponseData("A password already exists for your account");

    await UpdateUser({
        where: {
            id: confirmationEmail.userId,
        },
        data: {
            password: confirmationEmail.contextData,
        },
    });

    await prisma.userConfirmation.deleteMany({
        where: {
            userId: confirmationEmail.userId,
            confirmationType: {
                in: [ConfirmationType.CONFIRM_NEW_PASSWORD, ConfirmationType.CHANGE_ACCOUNT_PASSWORD],
            },
        },
    });

    return { data: { success: true, message: "Successfully added the new password" }, status: HTTP_STATUS.OK };
}

export async function removeAccountPassword(
    ctx: Context,
    userSession: ContextUserData,
    formData: z.infer<typeof removeAccountPasswordFormSchema>,
) {
    if (!userSession.password) {
        await addInvalidAuthAttempt(ctx);
        return invalidReqestResponseData();
    }

    const isCorrectPassword = await matchPassword(formData.password, userSession.password);
    if (!isCorrectPassword) {
        await addInvalidAuthAttempt(ctx);
        return invalidReqestResponseData("Incorrect password");
    }

    await UpdateUser({
        where: {
            id: userSession.id,
        },
        data: {
            password: null,
        },
    });

    return { data: { success: true, message: "Account password removed successfully" }, status: HTTP_STATUS.OK };
}

export async function sendAccountPasswordChangeLink(ctx: Context, formData: z.infer<typeof sendAccoutPasswordChangeLinkFormSchema>) {
    const targetUser = await GetUser_Unique({
        where: {
            email: formData.email,
        },
    });

    if (!targetUser?.id) {
        await addInvalidAuthAttempt(ctx);
        return {
            data: {
                success: true,
                message: "You should receive an email with a link to change your password if you entered correct email address.",
            },
            status: HTTP_STATUS.OK,
        };
    }

    const token = generateRandomToken();
    const tokenHash = await hashString(token);

    await prisma.userConfirmation.create({
        data: {
            id: generateDbId(),
            userId: targetUser.id,
            confirmationType: ConfirmationType.CHANGE_ACCOUNT_PASSWORD,
            accessCode: tokenHash,
        },
    });

    sendChangePasswordEmail({
        name: targetUser.name || targetUser.userName,
        code: token,
        receiverEmail: targetUser.email,
    });

    return {
        data: {
            success: true,
            message: "You should receive an email with a link to change your password if you entered correct email address.",
        },
        status: HTTP_STATUS.OK,
    };
}

export async function changeUserPassword(
    ctx: Context,
    token: string,
    formData: z.infer<typeof setNewPasswordFormSchema>,
    userSession: ContextUserData | undefined,
) {
    if (formData.newPassword !== formData.confirmNewPassword) return invalidReqestResponseData("Passwords do not match");

    const tokenHash = await hashString(token);
    const confirmationEmail = await prisma.userConfirmation.findUnique({
        where: {
            accessCode: tokenHash,
            confirmationType: ConfirmationType.CHANGE_ACCOUNT_PASSWORD,
        },
    });

    if (!confirmationEmail?.id) {
        await addInvalidAuthAttempt(ctx);
        return invalidReqestResponseData();
    }

    if (!confirmationEmail?.userId || !isConfirmationCodeValid(confirmationEmail.dateCreated, CHANGE_ACCOUNT_PASSWORD_EMAIL_VALIDITY_ms)) {
        return invalidReqestResponseData();
    }
    const hashedPassword = await hashPassword(formData.newPassword);

    await UpdateUser({
        where: {
            id: confirmationEmail.userId,
        },
        data: {
            password: hashedPassword,
        },
    });

    // Delete all confirmation emails for the user
    await prisma.userConfirmation.deleteMany({
        where: {
            userId: confirmationEmail.userId,
            confirmationType: {
                in: [ConfirmationType.CHANGE_ACCOUNT_PASSWORD, ConfirmationType.CONFIRM_NEW_PASSWORD],
            },
        },
    });

    // Logout all other sessions
    await invalidateAllOtherUserSessions(confirmationEmail.userId, userSession?.sessionId || "");

    return { data: { success: true, message: "Successfully changed account password" }, status: HTTP_STATUS.OK };
}

export async function deleteUserAccountConfirmationEmail(userSession: ContextUserData) {
    const token = generateRandomToken();
    const tokenHash = await hashString(token);

    await prisma.userConfirmation.create({
        data: {
            id: generateDbId(),
            userId: userSession.id,
            confirmationType: ConfirmationType.DELETE_USER_ACCOUNT,
            accessCode: tokenHash,
        },
    });

    sendDeleteUserAccountEmail({ fullName: userSession.name, code: token, receiverEmail: userSession.email });
    return {
        data: { success: true, message: "You should receive a confirmation email shortly" },
        status: HTTP_STATUS.OK,
    };
}

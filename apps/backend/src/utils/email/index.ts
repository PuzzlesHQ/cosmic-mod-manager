import {
    CHANGE_ACCOUNT_PASSWORD_EMAIL_VALIDITY_ms,
    CONFIRM_NEW_PASSWORD_EMAIL_VALIDITY_ms,
    DELETE_USER_ACCOUNT_EMAIL_VALIDITY_ms,
} from "@app/utils/constants";
import { FormatDate_ToLocaleString } from "@app/utils/date";
import { sendEmail } from "~/services/email";
import env from "../env";
import {
    changeAccountPasswordEmailTemplate,
    confirmNewPasswordEmailTemplate,
    deleteUserAccountEmailTemplate,
    newSignInAlertEmailTemplate,
} from "./templates";

const frontendUrl = env.FRONTEND_URL;

export async function sendNewSigninAlertEmail({
    fullName,
    receiverEmail,
    region,
    country,
    ip,
    browserName,
    osName,
    authProviderName,
    revokeAccessCode,
}: {
    fullName: string;
    receiverEmail: string;
    region: string;
    country: string;
    ip: string;
    browserName: string;
    osName: string;
    authProviderName: string;
    revokeAccessCode: string;
}) {
    try {
        const currTime = new Date();

        const emailTemplate = newSignInAlertEmailTemplate({
            fullName: fullName,
            sessionsPageUrl: `${frontendUrl}/settings/sessions`,
            siteUrl: frontendUrl || "",
            osName: osName,
            browserName: browserName,
            ipAddress: ip,
            authProviderName: authProviderName,
            signInLocation: `${region} - ${country}`,
            formattedUtcTimeStamp: `${FormatDate_ToLocaleString(currTime, { utc: true })}  (UTC Time)`,
            revokeSessionLink: `${frontendUrl}/auth/revoke-session?code=${revokeAccessCode}`,
        });

        await sendEmail({
            receiver: receiverEmail,
            subject: emailTemplate.subject,
            text: emailTemplate.text,
            template: emailTemplate.emailHtml,
        });

        return { success: true, message: "Email sent successfully" };
    } catch (err) {
        console.error(err);
        return {
            success: false,
            message: "Error while sending email",
        };
    }
}

export async function sendConfirmNewPasswordEmail({
    fullName,
    code,
    receiverEmail,
}: {
    fullName: string;
    code: string;
    receiverEmail: string;
}) {
    try {
        const emailTemplate = confirmNewPasswordEmailTemplate({
            fullName,
            siteUrl: frontendUrl || "",
            expiryDuration: CONFIRM_NEW_PASSWORD_EMAIL_VALIDITY_ms,
            confirmationPageUrl: `${frontendUrl}/auth/confirm-action?code=${encodeURIComponent(code)}`,
        });

        await sendEmail({
            receiver: receiverEmail,
            subject: emailTemplate.subject,
            template: emailTemplate.emailHtml,
            text: emailTemplate.text,
        });

        return { success: true, message: "Email send successfully" };
    } catch (err) {
        console.error(err);
        return { success: false, message: "Error sending the email" };
    }
}

export async function sendChangePasswordEmail({
    name,
    code,
    receiverEmail,
}: {
    name: string;
    code: string;
    receiverEmail: string;
}) {
    try {
        const emailTemplate = changeAccountPasswordEmailTemplate({
            fullName: name,
            siteUrl: frontendUrl || "",
            expiryDuration: CHANGE_ACCOUNT_PASSWORD_EMAIL_VALIDITY_ms,
            changePasswordPageUrl: `${frontendUrl}/auth/confirm-action?code=${encodeURIComponent(code)}`,
        });

        await sendEmail({
            receiver: receiverEmail,
            subject: emailTemplate.subject,
            template: emailTemplate.emailHtml,
            text: emailTemplate.text,
        });

        return { success: true, message: "Email send successfully" };
    } catch (err) {
        console.error(err);
        return { success: false, message: "Error sending the email" };
    }
}

export async function sendDeleteUserAccountEmail({
    fullName,
    code,
    receiverEmail,
}: {
    fullName: string;
    code: string;
    receiverEmail: string;
}) {
    try {
        const emailTemplate = deleteUserAccountEmailTemplate({
            fullName,
            siteUrl: frontendUrl || "",
            expiryDuration: DELETE_USER_ACCOUNT_EMAIL_VALIDITY_ms,
            changePasswordPageUrl: `${frontendUrl}/auth/confirm-action?code=${encodeURIComponent(code)}`,
        });

        await sendEmail({
            receiver: receiverEmail,
            subject: emailTemplate.subject,
            template: emailTemplate.emailHtml,
            text: emailTemplate.text,
        });

        return { success: true, message: "Email send successfully" };
    } catch (err) {
        console.error(err);
        return { success: false, message: "Error sending the email" };
    }
}

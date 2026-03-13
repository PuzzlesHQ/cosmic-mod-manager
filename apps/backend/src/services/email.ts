import * as nodemailer from "nodemailer";
import env from "~/utils/env";

const noReplyEmailTransporter = nodemailer.createTransport({
    host: env.NOREPLY_SMTP_RELAY,
    port: Number.parseInt(env.NOREPLY_SMTP_PORT, 10) || 587,
    secure: false,
    auth: {
        user: env.NOREPLY_SMTP_USER,
        pass: env.NOREPLY_SMTP_KEY,
    },
});

type sendEmailOptions = {
    receiver: string;
    subject: string;
    template: string;
    text?: string;
};

export async function sendEmail({ receiver, subject, text, template }: sendEmailOptions) {
    return await noReplyEmailTransporter.sendMail({
        from: env.SUPPORT_NOREPLY_EMAIL,
        to: receiver,
        subject: subject,
        text: text || "",
        html: template,
    });
}

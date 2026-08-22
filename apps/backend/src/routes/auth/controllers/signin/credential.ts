import type { loginFormSchema } from "@app/utils/schemas/auth";
import { AuthProvider } from "@app/utils/types";
import type { Context } from "hono";
import type { z } from "zod/v4";
import { GetUser_Unique } from "~/db/user_item";
import { addInvalidAuthAttempt } from "~/middleware/rate-limiter";
import { matchPassword } from "~/routes/auth/helpers";
import { createUserSession, setSessionCookie } from "~/routes/auth/helpers/session";
import { HTTP_STATUS, invalidRequestResponseData } from "~/utils/http";

const RESPONSE_DELAY_ms = 2000;

async function credentialSignIn(ctx: Context, formData: z.infer<typeof loginFormSchema>) {
    const wrongCredsMsg = "Incorrect email or password";

    const user = await GetUser_Unique({
        where: {
            email: formData.email.toLowerCase(),
        },
    });

    if (!user?.id || !user?.password) {
        await addInvalidAuthAttempt(ctx);
        await new Promise((resolve) => setTimeout(resolve, RESPONSE_DELAY_ms));

        return invalidRequestResponseData(wrongCredsMsg);
    }

    const [isCorrectPassword] = await Promise.all([
        matchPassword(formData.password, user.password),
        new Promise((resolve) => setTimeout(resolve, RESPONSE_DELAY_ms)),
    ]);

    if (!isCorrectPassword) {
        await addInvalidAuthAttempt(ctx);
        return invalidRequestResponseData(wrongCredsMsg);
    }

    const newSession = await createUserSession({
        userId: user.id,
        providerName: AuthProvider.CREDENTIAL,
        ctx: ctx,
        isFirstSignIn: false,
        user: user,
    });
    setSessionCookie(ctx, newSession);

    return {
        data: { success: true, message: `Logged in as ${user.name}` },
        status: HTTP_STATUS.OK,
    } as const;
}

export default credentialSignIn;

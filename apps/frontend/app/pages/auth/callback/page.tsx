import RefreshPage from "@app/components/misc/refresh-page";
import { FormErrorMessage } from "@app/components/ui/form-message";
import { toast } from "@app/components/ui/sonner";
import { LoadingSpinner } from "@app/components/ui/spinner";
import { CSRF_STATE_COOKIE_NAMESPACE } from "@app/utils/constants";
import { getAuthProviderFromString } from "@app/utils/convertors";
import { getCookie } from "@app/utils/cookie";
import { AuthActionIntent, AuthProvider } from "@app/utils/types";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import Link, { useNavigate } from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";
import { getReturnUrl } from "../oauth-providers";

export default function OAuthCallbackPage() {
    const { t } = useTranslation();
    const params = useParams();
    const [searchParams] = useSearchParams();

    const authProvider = params.authProvider || null;
    const csrfState = searchParams.get("state") || null;
    const code = searchParams.get("code") || null;

    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    async function submitCode(code: string, provider: AuthProvider, actionIntent: AuthActionIntent) {
        try {
            const response = await clientFetch(`/api/auth/${actionIntent}/${provider}`, {
                method: "POST",
                body: JSON.stringify({ code: code }),
            });
            const data = await response.json();

            if (!response?.ok) {
                setErrorMsg(data?.message || t.common.somethingWentWrong);
                return;
            }

            toast.success(data?.message || t.common.success);

            const returnTo = getReturnUrl();
            if (returnTo?.length) RefreshPage(navigate, decodeURIComponent(returnTo));
            else RefreshPage(navigate, "/dashboard");
        } catch (error) {
            console.error(error);
            setErrorMsg(`${error}` || t.common.somethingWentWrong);
        }
    }

    const actionIntent = csrfState?.startsWith(AuthActionIntent.SIGN_IN)
        ? AuthActionIntent.SIGN_IN
        : csrfState?.startsWith(AuthActionIntent.SIGN_UP)
          ? AuthActionIntent.SIGN_UP
          : AuthActionIntent.LINK;

    useEffect(() => {
        if (
            csrfState !== getCookie(CSRF_STATE_COOKIE_NAMESPACE, document.cookie) ||
            !authProvider ||
            !code ||
            !csrfState ||
            getAuthProviderFromString(authProvider) === AuthProvider.UNKNOWN
        ) {
            toast.error("CSRF state didn't match!");
            navigate("/");
            return;
        }

        submitCode(code, getAuthProviderFromString(authProvider), actionIntent);
    }, [authProvider]);

    return (
        <main className="flex h-[100vh] min-h-[720px] w-full flex-col items-center justify-center gap-4">
            {errorMsg ? (
                <div className="flex w-full max-w-md flex-col items-center justify-center gap-4">
                    <FormErrorMessage text={errorMsg} />
                    {actionIntent === AuthActionIntent.SIGN_IN ? (
                        <Link className="underline-offset-2 hover:underline" to="/login">
                            {t.form.login_withSpace}
                        </Link>
                    ) : actionIntent === AuthActionIntent.SIGN_UP ? (
                        <Link className="underline-offset-2 hover:underline" to="/signup">
                            {t.form.signup}
                        </Link>
                    ) : (
                        <Link className="underline-offset-2 hover:underline" to="/settings/account">
                            {t.common.settings}
                        </Link>
                    )}
                </div>
            ) : (
                <LoadingSpinner />
            )}
        </main>
    );
}

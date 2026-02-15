import { AuthActionIntent } from "@app/utils/types";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { TextLink } from "~/components/ui/link";
import { Separator } from "~/components/ui/separator";
import { useTranslation } from "~/locales/provider";
import OAuthProvidersWidget from "../oauth-providers";

export default function SignUpPage() {
    const { t } = useTranslation();

    return (
        <aside className="flex min-h-[100vh] w-full items-center justify-center py-12">
            <Card className="relative w-full max-w-lg">
                <CardHeader className="mb-1">
                    <CardTitle>{t.form.signup}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <p>{t.auth.signupWithProviders}</p>
                        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                            <OAuthProvidersWidget actionIntent={AuthActionIntent.SIGN_UP} />
                        </div>
                    </div>

                    <p className="text-foreground-muted">
                        {t.auth.agreement(
                            <TextLink key="terms-link" to="/legal/terms">
                                {t.legal.termsTitle}
                            </TextLink>,
                            <TextLink key="privacy-link" to="/legal/privacy">
                                {t.legal.privacyPolicyTitle}
                            </TextLink>,
                        )}
                    </p>

                    <Separator />

                    <div className="flex w-full flex-col items-center justify-center gap-1 text-foreground-muted">
                        <p className="text-center">
                            {t.auth.alreadyHaveAccount(
                                <TextLink key="login-link" to="/login" aria-label={t.form.login}>
                                    {t.form.login}
                                </TextLink>,
                            )}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </aside>
    );
}

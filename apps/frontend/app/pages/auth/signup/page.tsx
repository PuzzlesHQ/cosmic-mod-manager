import { Card, CardContent, CardHeader, CardTitle } from "@app/components/ui/card";
import { Prefetch } from "@app/components/ui/link";
import { Separator } from "@app/components/ui/separator";
import { AuthActionIntent } from "@app/utils/types";
import Link, { TextLink } from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";
import OAuthProvidersWidget from "../oauth-providers";

export default function SignUpPage() {
    const { t } = useTranslation();

    return (
        <aside className="w-full flex items-center justify-center py-12 min-h-[100vh]">
            <Card className="w-full max-w-md relative">
                <CardHeader className="mb-1">
                    <CardTitle>{t.form.signup}</CardTitle>
                </CardHeader>
                <CardContent className="w-full flex flex-col items-start justify-start gap-4">
                    <div className="w-full flex flex-col items-start justify-start gap-2">
                        <p>{t.auth.signupWithProviders}</p>
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <OAuthProvidersWidget actionIntent={AuthActionIntent.SIGN_UP} />
                        </div>
                    </div>

                    <p className="text-muted-foreground">
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

                    <div className="w-full flex flex-col items-center justify-center gap-1">
                        <p className="text-center">
                            <span className="text-muted-foreground">{t.auth.alreadyHaveAccount}</span>{" "}
                            <Link prefetch={Prefetch.Render} to="/login" aria-label={t.form.login} className="text_link">
                                {t.form.login}
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </aside>
    );
}

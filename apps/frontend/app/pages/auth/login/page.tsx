import RefreshPage from "@app/components/misc/refresh-page";
import { Button } from "@app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@app/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@app/components/ui/form";
import { FormErrorMessage } from "@app/components/ui/form-message";
import HorizontalSeparator from "@app/components/ui/hr-separator";
import { Input } from "@app/components/ui/input";
import { Prefetch } from "@app/components/ui/link";
import { toast } from "@app/components/ui/sonner";
import { LoadingSpinner } from "@app/components/ui/spinner";
import { disableInteractions, enableInteractions } from "@app/utils/dom";
import type { z } from "@app/utils/schemas";
import { LoginFormSchema } from "@app/utils/schemas/auth";
import { AuthActionIntent, AuthProvider } from "@app/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogInIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";
import Link, { useNavigate } from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";
import OAuthProvidersWidget from "../oauth-providers";

export default function LoginPage() {
    const { t } = useTranslation();
    const [formError, setFormError] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const navigate = useNavigate();
    const location = useLocation();

    const loginForm = useForm<z.infer<typeof LoginFormSchema>>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function handleCredentialLogin(formData: z.infer<typeof LoginFormSchema>) {
        try {
            if (isLoading === true) return;
            setIsLoading(true);
            disableInteractions();

            const response = await clientFetch(`/api/auth/${AuthActionIntent.SIGN_IN}/${AuthProvider.CREDENTIAL}`, {
                method: "POST",
                body: JSON.stringify(formData),
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                enableInteractions();
                return toast.error(result?.message || "Error");
            }

            toast.success(result?.message || "Success");
            RefreshPage(navigate, location);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="full_page w-full flex items-center justify-center py-12">
            <Card className="w-full max-w-md relative">
                <CardHeader className="mb-1">
                    <CardTitle>{t.form.login_withSpace}</CardTitle>
                </CardHeader>
                <CardContent className="w-full flex flex-col items-start justify-start gap-4">
                    <Form {...loginForm}>
                        <form
                            onSubmit={loginForm.handleSubmit(handleCredentialLogin)}
                            name="Login"
                            className="w-full flex flex-col items-center justify-center gap-form-elements"
                        >
                            <FormField
                                control={loginForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t.auth.email}</FormLabel>
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="example@abc.com"
                                            autoComplete="email"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                field.onChange(e);
                                                setFormError("");
                                            }}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={loginForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t.auth.password}</FormLabel>
                                        <Input
                                            {...field}
                                            autoComplete="current-password"
                                            placeholder="********"
                                            type="password"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                field.onChange(e);
                                                setFormError("");
                                            }}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {formError && <FormErrorMessage text={formError} />}

                            <Button type="submit" aria-label="Login" className="w-full h-form-submit-btn" disabled={isLoading}>
                                {isLoading ? (
                                    <LoadingSpinner size="xs" />
                                ) : (
                                    <LogInIcon aria-hidden className="w-[1.1rem] h-[1.1rem]" />
                                )}
                                {t.form.login}
                            </Button>
                        </form>
                    </Form>

                    <HorizontalSeparator />

                    <div className="w-full flex flex-col items-start justify-start gap-2">
                        <p>{t.auth.loginUsing}</p>
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <OAuthProvidersWidget actionIntent={AuthActionIntent.SIGN_IN} />
                        </div>
                    </div>

                    <div className="w-full flex flex-col items-center justify-center mt-4">
                        <div className="text-center">
                            <span className="text-muted-foreground">{t.auth.dontHaveAccount}</span>{" "}
                            <Link prefetch={Prefetch.Render} to="/signup" aria-label="Sign up" className="text_link">
                                {t.form.signup}
                            </Link>
                        </div>
                        <div className="text-center">
                            <span className="text-muted-foreground">{t.auth.forgotPassword}</span>{" "}
                            <Link
                                prefetch={Prefetch.Render}
                                to="/change-password"
                                aria-label="Change password"
                                className="text_link"
                            >
                                {t.auth.changePassword}
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}

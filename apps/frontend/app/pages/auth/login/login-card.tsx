import RefreshPage from "@app/components/misc/refresh-page";
import { Button } from "@app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@app/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@app/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@app/components/ui/form";
import { FormErrorMessage } from "@app/components/ui/form-message";
import HorizontalSeparator from "@app/components/ui/hr-separator";
import { Input } from "@app/components/ui/input";
import { Prefetch } from "@app/components/ui/link";
import { toast } from "@app/components/ui/sonner";
import { LoadingSpinner } from "@app/components/ui/spinner";
import { VisuallyHidden } from "@app/components/ui/visually-hidden";
import { disableInteractions, enableInteractions } from "@app/utils/dom";
import type { z } from "@app/utils/schemas";
import { LoginFormSchema } from "@app/utils/schemas/auth";
import { AuthActionIntent, AuthProvider } from "@app/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogInIcon } from "lucide-react";
import { Slot } from "radix-ui";
import { useId, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useSearchParams } from "react-router";
import { TextLink, useNavigate } from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";
import OAuthProvidersWidget, { setReturnUrl } from "../oauth-providers";

interface LoginPageCardProps {
    id: string;
}

export function LoginPageCard(props: LoginPageCardProps) {
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
                            render={({ field }) => {
                                const emailInputId = `${props.id}-email-input`;

                                return (
                                    <FormItem>
                                        <FormLabel htmlFor={emailInputId}>{t.auth.email}</FormLabel>
                                        <Input
                                            {...field}
                                            id={emailInputId}
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
                                );
                            }}
                        />

                        <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => {
                                const passInputId = `${props.id}-password-input`;

                                return (
                                    <FormItem>
                                        <FormLabel htmlFor={passInputId}>{t.auth.password}</FormLabel>
                                        <Input
                                            {...field}
                                            id={passInputId}
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
                                );
                            }}
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

                <div className="w-full flex flex-col items-center justify-center mt-4 text-muted-foreground">
                    <div className="text-center">
                        {t.auth.dontHaveAccount(
                            <TextLink key="signup-link" prefetch={Prefetch.Render} to="/signup" aria-label={t.form.signup}>
                                {t.form.signup}
                            </TextLink>,
                        )}
                    </div>
                    <div className="text-center">
                        {t.auth.forgotPassword(
                            <TextLink
                                key="change-password-link"
                                prefetch={Prefetch.Render}
                                to="/change-password"
                                aria-label={t.auth.changePassword}
                            >
                                {t.auth.changePassword}
                            </TextLink>,
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

type LoginDialogProps =
    | {
          isMainDialog: true; // Only one instance of this form is rendered, on other places only a trigger button is rendered
          children?: React.ReactNode;
      }
    | {
          isMainDialog?: false;
          children: React.ReactNode;
      };

export function LoginDialog(props: LoginDialogProps) {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const loginInputId = useId();

    const dialogOpen = useMemo(() => searchParams.get("loginDialog") === "true", [searchParams.get("loginDialog")]);

    function toggleDialog() {
        setReturnUrl(location);
        setSearchParams((params) => {
            if (!dialogOpen) {
                params.set("loginDialog", "true");
            } else {
                params.delete("loginDialog");
            }
            return params;
        });
    }

    if (!props.isMainDialog) {
        return <Slot.Slot onClick={toggleDialog}>{props.children}</Slot.Slot>;
    }

    const loginCard = useMemo(() => <LoginPageCard id={loginInputId} />, []);

    return (
        <Dialog open={dialogOpen} onOpenChange={toggleDialog}>
            <DialogContent className="max-w-md py-0">
                <VisuallyHidden>
                    <DialogTitle>{t.form.login}</DialogTitle>
                    <DialogDescription>{t.form.login}</DialogDescription>
                </VisuallyHidden>
                {loginCard}
            </DialogContent>
        </Dialog>
    );
}

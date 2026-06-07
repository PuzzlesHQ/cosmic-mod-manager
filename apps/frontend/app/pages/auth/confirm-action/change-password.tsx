import type { z } from "@app/utils/schemas";
import { setNewPasswordFormSchema } from "@app/utils/schemas/settings";
import { useState } from "react";
import { Button, CancelButton } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { FormSuccessMessage } from "~/components/ui/form-message";
import { Input } from "~/components/ui/input";
import Link from "~/components/ui/link";
import { toast } from "~/components/ui/sonner";
import { LoadingSpinner } from "~/components/ui/spinner";
import { useFormHook } from "~/hooks/use-form";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";
import SessionsPageLink from "./help-link";

export default function ChangePasswordCard({ code }: { code: string }) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<{ value: boolean; action: null | "cancel" | "set" }>({
        value: false,
        action: null,
    });
    const [successMessage, setSuccessMessage] = useState("");

    const form = useFormHook(setNewPasswordFormSchema, {
        defaultValues: {
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    async function setNewPassword(values: z.infer<typeof setNewPasswordFormSchema>) {
        try {
            if (isLoading.value === true) return;
            setIsLoading({ value: true, action: "set" });

            const response = await clientFetch("/api/user/password", {
                method: "PATCH",
                body: JSON.stringify({ code: code, ...values }),
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || t.common.error);
            }

            return setSuccessMessage(result?.message || t.common.success);
        } finally {
            setIsLoading({ value: false, action: null });
        }
    }

    async function cancelSettingNewPassword() {
        try {
            if (isLoading.value === true) return;
            setIsLoading({ value: true, action: "cancel" });

            const response = await clientFetch("/api/user/confirmation-action", {
                method: "DELETE",
                body: JSON.stringify({ code: code }),
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || t.common.error);
            }

            return setSuccessMessage(result?.message || t.common.success);
        } finally {
            setIsLoading({ value: false, action: null });
        }
    }

    if (successMessage) {
        return (
            <div className="flex w-full max-w-md flex-col items-center justify-center gap-form-elements">
                <FormSuccessMessage text={successMessage} className="w-fit" />
                <Link to="/" className="font-semibold underline-offset-2 hover:underline">
                    {t.common.home}
                </Link>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(setNewPassword)} className="w-full max-w-md">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>{t.auth.changePassword}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-form-elements">
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="new-password-input">{t.auth.newPass}</FormLabel>
                                    <Input
                                        {...field}
                                        type="password"
                                        autoComplete="new-password"
                                        id="new-password-input"
                                        placeholder={t.auth.newPass_label}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmNewPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="confirm-new-password-input">{t.auth.confirmPass}</FormLabel>
                                    <Input
                                        {...field}
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder={t.auth.confirmPass_label}
                                        id="confirm-new-password-input"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex w-full flex-col-reverse gap-form-elements sm:flex-row sm:justify-end">
                            <CancelButton
                                disabled={isLoading.value}
                                className=""
                                type="button"
                                onClick={cancelSettingNewPassword}
                                icon={isLoading.action === "cancel" ? <LoadingSpinner size="xs" /> : null}
                            />

                            <Button type="submit" disabled={isLoading.value || !form.formState.isDirty}>
                                {isLoading.action === "set" ? <LoadingSpinner size="xs" /> : null}
                                {t.auth.changePassword}
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <SessionsPageLink />
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}

import { Button } from "@app/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@app/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@app/components/ui/form";
import { FormSuccessMessage } from "@app/components/ui/form-message";
import { Input } from "@app/components/ui/input";
import { toast } from "@app/components/ui/sonner";
import { LoadingSpinner } from "@app/components/ui/spinner";
import type { z } from "@app/utils/schemas";
import { setNewPasswordFormSchema } from "@app/utils/schemas/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CancelButton } from "~/components/ui/button";
import Link from "~/components/ui/link";
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

    const form = useForm<z.infer<typeof setNewPasswordFormSchema>>({
        resolver: zodResolver(setNewPasswordFormSchema),
        defaultValues: {
            newPassword: "",
            confirmNewPassword: "",
        },
    });
    form.watch();

    async function setNewPassword() {
        try {
            if (isLoading.value === true) return;
            setIsLoading({ value: true, action: "set" });

            const response = await clientFetch("/api/user/password", {
                method: "PATCH",
                body: JSON.stringify({ code: code, ...form.getValues() }),
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
            <div className="w-full max-w-md flex flex-col gap-form-elements items-center justify-center">
                <FormSuccessMessage text={successMessage} className="w-fit" />
                <Link to="/" className="hover:underline underline-offset-2 font-semibold">
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
                    <CardContent className="w-full flex flex-col items-start justify-start gap-form-elements">
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="new-password-input">{t.auth.newPass}</FormLabel>
                                    <Input
                                        type="password"
                                        placeholder={t.auth.newPass_label}
                                        id="new-password-input"
                                        {...field}
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
                                        type="password"
                                        placeholder={t.auth.confirmPass_label}
                                        id="confirm-new-password-input"
                                        {...field}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="w-full flex flex-col-reverse sm:flex-row sm:justify-end gap-form-elements">
                            <CancelButton
                                disabled={isLoading.value}
                                className=""
                                type="button"
                                onClick={cancelSettingNewPassword}
                                icon={isLoading.action === "cancel" ? <LoadingSpinner size="xs" /> : null}
                            />

                            <Button
                                type="submit"
                                disabled={
                                    isLoading.value ||
                                    !form.getValues().newPassword ||
                                    !form.getValues().confirmNewPassword ||
                                    form.getValues().newPassword !== form.getValues().confirmNewPassword
                                }
                            >
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

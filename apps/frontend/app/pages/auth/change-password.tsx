import type { z } from "@app/utils/schemas";
import { sendAccoutPasswordChangeLinkFormSchema } from "@app/utils/schemas/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import HorizontalSeparator from "~/components/ui/hr-separator";
import { Input } from "~/components/ui/input";
import { LinkPrefetchStrategy, TextLink } from "~/components/ui/link";
import { toast } from "~/components/ui/sonner";
import { LoadingSpinner } from "~/components/ui/spinner";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";

export default function ChangePasswordPage() {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof sendAccoutPasswordChangeLinkFormSchema>>({
        resolver: zodResolver(sendAccoutPasswordChangeLinkFormSchema),
        defaultValues: {
            email: "",
        },
    });

    async function sendAccountPasswordChangeEmail() {
        try {
            if (isLoading) return;
            setIsLoading(true);

            const response = await clientFetch("/api/user/change-password", {
                method: "POST",
                body: JSON.stringify(form.getValues()),
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || t.common.error);
            }

            toast.success(result?.message || t.common.success);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="full_page flex w-full items-center justify-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(sendAccountPasswordChangeEmail)} className="w-full max-w-md">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>{t.auth.changePassword}</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-form-elements">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="email-input">{t.auth.email}</FormLabel>

                                        <Input
                                            id="email-input"
                                            type="email"
                                            autoComplete="email"
                                            {...field}
                                            placeholder={t.auth.enterEmail}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button className="h-form-submit-btn w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <LoadingSpinner size="xs" />
                                ) : (
                                    <ArrowRightIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                                )}
                                {t.form.continue}
                            </Button>
                        </CardContent>

                        <CardFooter className="flex w-full flex-col items-center justify-center gap-1">
                            <HorizontalSeparator />

                            <TextLink prefetch={LinkPrefetchStrategy.Render} to="/login">
                                {t.form.login}
                            </TextLink>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </main>
    );
}

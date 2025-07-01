import { Button } from "@app/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@app/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@app/components/ui/form";
import HorizontalSeparator from "@app/components/ui/hr-separator";
import { Input } from "@app/components/ui/input";
import { Prefetch } from "@app/components/ui/link";
import { toast } from "@app/components/ui/sonner";
import { LoadingSpinner } from "@app/components/ui/spinner";
import type { z } from "@app/utils/schemas";
import { sendAccoutPasswordChangeLinkFormSchema } from "@app/utils/schemas/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextLink } from "~/components/ui/link";
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
        <main className="full_page w-full flex items-center justify-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(sendAccountPasswordChangeEmail)} className="w-full max-w-md">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>{t.auth.changePassword}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-form-elements">
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
                                    <ArrowRightIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                                )}
                                {t.form.continue}
                            </Button>
                        </CardContent>

                        <CardFooter className="w-full flex flex-col gap-1 items-center justify-center">
                            <HorizontalSeparator />

                            <TextLink prefetch={Prefetch.Render} to="/login">
                                {t.form.login}
                            </TextLink>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </main>
    );
}

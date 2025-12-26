import { disableInteractions, enableInteractions } from "@app/utils/dom";
import type { z } from "@app/utils/schemas";
import { setNewPasswordFormSchema } from "@app/utils/schemas/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRoundIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, CancelButton } from "~/components/ui/button";
import {
    Dialog,
    DialogBody,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { toast } from "~/components/ui/sonner";
import { LoadingSpinner } from "~/components/ui/spinner";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";

function AddPasswordForm({ email }: { email: string }) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<z.infer<typeof setNewPasswordFormSchema>>({
        resolver: zodResolver(setNewPasswordFormSchema),
        defaultValues: {
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    async function addNewPassword(values: z.infer<typeof setNewPasswordFormSchema>) {
        if (isLoading) return;
        setIsLoading(true);
        disableInteractions();

        try {
            const response = await clientFetch("/api/user/password", {
                method: "POST",
                body: JSON.stringify(values),
            });
            setIsLoading(false);
            const data = await response.json();

            if (!response.ok || data?.success !== true) {
                return toast.error(data?.message || t.common.error);
            }
            toast.success(data?.message || t.common.success);
            form.reset();
        } finally {
            enableInteractions();
            setIsLoading(false);
            setIsDialogOpen(false);
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary">
                    <KeyRoundIcon aria-hidden className="h-btn-icon w-btn-icon" />
                    {t.settings.addPass}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t.settings.addPass}</DialogTitle>
                    <DialogDescription>{t.settings.addPassDialogDesc}</DialogDescription>
                </DialogHeader>

                <DialogBody>
                    <Form {...form}>
                        <form
                            className="flex flex-col items-center justify-start gap-form-elements"
                            onSubmit={form.handleSubmit(addNewPassword)}
                        >
                            <input type="email" name="email" readOnly hidden value={email} />

                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="new-password">{t.auth.newPass}</FormLabel>
                                        <Input
                                            {...field}
                                            autoComplete="new-password"
                                            type="password"
                                            id="new-password"
                                            placeholder={t.auth.newPass_label}
                                            spellCheck={false}
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
                                        <FormLabel htmlFor="confirm-new-password">{t.auth.confirmPass}</FormLabel>
                                        <Input
                                            {...field}
                                            autoComplete="new-password"
                                            type="password"
                                            id="confirm-new-password"
                                            placeholder={t.auth.confirmPass_label}
                                            spellCheck={false}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <DialogClose asChild>
                                    <CancelButton />
                                </DialogClose>
                                <Button disabled={!form.formState.isDirty || isLoading}>
                                    {isLoading ? (
                                        <LoadingSpinner size="xs" />
                                    ) : (
                                        <PlusIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                                    )}
                                    {t.settings.addPass}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}

export default AddPasswordForm;

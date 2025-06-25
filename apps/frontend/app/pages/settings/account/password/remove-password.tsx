import RefreshPage from "@app/components/misc/refresh-page";
import { Button } from "@app/components/ui/button";
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
} from "@app/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@app/components/ui/form";
import { Input } from "@app/components/ui/input";
import { toast } from "@app/components/ui/sonner";
import { LoadingSpinner } from "@app/components/ui/spinner";
import { disableInteractions } from "@app/utils/dom";
import type { z } from "@app/utils/schemas";
import { removeAccountPasswordFormSchema } from "@app/utils/schemas/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";
import { CancelButton } from "~/components/ui/button";
import { useNavigate } from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";

export default function RemovePasswordForm() {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const form = useForm<z.infer<typeof removeAccountPasswordFormSchema>>({
        resolver: zodResolver(removeAccountPasswordFormSchema),
        defaultValues: {
            password: "",
        },
    });

    async function removeAccountPassword() {
        try {
            if (isLoading) return;
            setIsLoading(true);
            disableInteractions();

            const response = await clientFetch("/api/user/password", {
                method: "DELETE",
                body: JSON.stringify(form.getValues()),
            });

            const result = await response.json();
            if (!response.ok || !result?.success) {
                return toast.error(result?.message || t.common.error);
            }

            return toast.success(result?.message || t.common.success);
        } finally {
            setDialogOpen(false);
            setIsLoading(false);

            RefreshPage(navigate, location);
        }
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary-destructive">
                    <Trash2Icon aria-hidden className="w-btn-icon h-btn-icon" />
                    {t.settings.removePass}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t.settings.removePassTitle}</DialogTitle>
                    <DialogDescription>{t.settings.removePassDesc}</DialogDescription>
                </DialogHeader>

                <DialogBody>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(removeAccountPassword)}
                            className="w-full flex flex-col items-start justify-start gap-form-elements"
                        >
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="password-input">{t.auth.password}</FormLabel>
                                        <Input
                                            {...field}
                                            type="password"
                                            id="password-input"
                                            placeholder={t.settings.enterCurrentPass}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <DialogClose asChild>
                                    <CancelButton disabled={isLoading} />
                                </DialogClose>
                                <Button type="submit" variant="destructive" disabled={isLoading || !form.getValues().password}>
                                    {isLoading ? (
                                        <LoadingSpinner size="xs" />
                                    ) : (
                                        <Trash2Icon aria-hidden className="w-btn-icon h-btn-icon" />
                                    )}
                                    {t.settings.removePass}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}

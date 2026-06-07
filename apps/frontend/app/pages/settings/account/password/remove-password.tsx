import { disableInteractions } from "@app/utils/dom";
import { passwordFormSchema } from "@app/utils/schemas/settings";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router";
import RefreshPage from "~/components/misc/refresh-page";
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
import { useNavigate } from "~/components/ui/link";
import { toast } from "~/components/ui/sonner";
import { LoadingSpinner } from "~/components/ui/spinner";
import { useFormHook } from "~/hooks/use-form";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";

export default function RemovePasswordForm() {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const form = useFormHook(passwordFormSchema, {
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
                    <Trash2Icon aria-hidden className="h-btn-icon w-btn-icon" />
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
                            className="flex w-full flex-col items-start justify-start gap-form-elements"
                        >
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="password-input">{t.auth.password}</FormLabel>
                                        <Input
                                            {...field}
                                            autoComplete="current-password"
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
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    disabled={isLoading || !form.formState.isDirty}
                                >
                                    {isLoading ? (
                                        <LoadingSpinner size="xs" />
                                    ) : (
                                        <Trash2Icon aria-hidden className="h-btn-icon w-btn-icon" />
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

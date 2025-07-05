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
import { CharacterCounter, Form, FormField, FormItem, FormLabel, FormMessage } from "@app/components/ui/form";
import { Input } from "@app/components/ui/input";
import { toast } from "@app/components/ui/sonner";
import { LoadingSpinner } from "@app/components/ui/spinner";
import { Textarea } from "@app/components/ui/textarea";
import { VisuallyHidden } from "@app/components/ui/visually-hidden";
import { MAX_ORGANISATION_DESCRIPTION_LENGTH, MAX_ORGANISATION_NAME_LENGTH } from "@app/utils/constants";
import { disableInteractions, enableInteractions } from "@app/utils/dom";
import type { z } from "@app/utils/schemas";
import { createOrganisationFormSchema } from "@app/utils/schemas/organisation";
import { createURLSafeSlug } from "@app/utils/string";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CancelButton } from "~/components/ui/button";
import { useNavigate } from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";
import Config from "~/utils/config";
import { OrgPagePath } from "~/utils/urls";

export default function CreateNewOrg_Dialog({ children }: { children: React.ReactNode }) {
    const { t } = useTranslation();
    const [autoFillUrlSlug, setAutoFillUrlSlug] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof createOrganisationFormSchema>>({
        resolver: zodResolver(createOrganisationFormSchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
        },
    });

    async function createOrganisation(values: z.infer<typeof createOrganisationFormSchema>) {
        try {
            if (isLoading || !isFormSubmittable()) return;
            setIsLoading(true);
            disableInteractions();

            const response = await clientFetch("/api/organization", {
                method: "POST",
                body: JSON.stringify(values),
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                enableInteractions();
                return toast.error(result?.message || t.common.error);
            }

            navigate(OrgPagePath(values.slug));
        } finally {
            setIsLoading(false);
        }
    }

    function isFormSubmittable() {
        const values = form.getValues();
        const isFormInvalid = !values.name || !values.slug || !values.description;
        return !isFormInvalid;
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t.dashboard.creatingOrg}</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>{t.dashboard.creatingOrg}</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <DialogBody>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(createOrganisation)}
                            className="w-full flex flex-col items-start justify-center gap-form-elements"
                        >
                            <FormField
                                name="name"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="org-name-input">
                                            {t.form.name}
                                            <CharacterCounter currVal={field.value} max={MAX_ORGANISATION_NAME_LENGTH} />
                                        </FormLabel>
                                        <Input
                                            placeholder={t.dashboard.enterOrgName}
                                            id="org-name-input"
                                            type="text"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                if (!autoFillUrlSlug) return;
                                                const name = e.target.value;
                                                form.setValue("slug", createURLSafeSlug(name));
                                            }}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="slug"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="org-url-slug-input">
                                            {t.form.url}
                                            <CharacterCounter currVal={field.value} max={MAX_ORGANISATION_NAME_LENGTH} />
                                        </FormLabel>
                                        <Input
                                            id="org-url-slug-input"
                                            placeholder={`${Config.FRONTEND_URL}/organization/YOUR_URL`}
                                            type="text"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                if (autoFillUrlSlug === true) setAutoFillUrlSlug(false);
                                            }}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="description"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="org-description-input">
                                            {t.form.description}
                                            <CharacterCounter currVal={field.value} max={MAX_ORGANISATION_DESCRIPTION_LENGTH} />
                                        </FormLabel>
                                        <Textarea
                                            placeholder={t.dashboard.enterOrgDescription}
                                            id="org-description-input"
                                            {...field}
                                            className="resize-none"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <DialogClose asChild>
                                    <CancelButton type="button" />
                                </DialogClose>
                                <Button disabled={isLoading || !isFormSubmittable()}>
                                    {isLoading ? (
                                        <LoadingSpinner size="xs" />
                                    ) : (
                                        <PlusIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                                    )}
                                    {t.dashboard.createOrg}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}

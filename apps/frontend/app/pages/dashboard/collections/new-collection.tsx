import { MAX_COLLECTION_DESCRIPTION_LENGTH, MAX_COLLECTION_NAME_LENGTH } from "@app/utils/constants";
import { disableInteractions, enableInteractions } from "@app/utils/dom";
import type { z } from "@app/utils/schemas";
import { createCollectionFormSchema } from "@app/utils/schemas/collections";
import { PlusIcon } from "lucide-react";
import type React from "react";
import { useState } from "react";
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
import { CharacterCounter, Form, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useNavigate } from "~/components/ui/link";
import { toast } from "~/components/ui/sonner";
import { LoadingSpinner } from "~/components/ui/spinner";
import { Textarea } from "~/components/ui/textarea";
import { VisuallyHidden } from "~/components/ui/visually-hidden";
import { useFormHook } from "~/hooks/use-form";
import { useTranslation } from "~/locales/provider";
import useCollections from "~/pages/collection/provider";
import clientFetch from "~/utils/client-fetch";
import { CollectionPagePath } from "~/utils/urls";

interface CreateNewCollection_Dialog_Props {
    children: React.ReactNode;
    redirectToCollectionPage?: boolean;
}

export default function CreateNewCollection_Dialog({
    children,
    redirectToCollectionPage = true,
}: CreateNewCollection_Dialog_Props) {
    const { t } = useTranslation();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const collectionsCtx = useCollections();

    const form = useFormHook(createCollectionFormSchema, {
        defaultValues: {
            name: "",
            description: "",
        },
    });

    async function createCollection(values: z.infer<typeof createCollectionFormSchema>) {
        try {
            if (isLoading) return;
            setIsLoading(true);
            disableInteractions();

            const response = await clientFetch("/api/collections", {
                method: "POST",
                body: JSON.stringify(values),
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || t.common.error);
            }

            if (redirectToCollectionPage === true) {
                collectionsCtx.refetchCollections();
                navigate(CollectionPagePath(result.collectionId));
            } else {
                await collectionsCtx.refetchCollections();
                setDialogOpen(false);
            }
        } finally {
            enableInteractions();
            setIsLoading(false);
            form.reset();
        }
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t.dashboard.creatingACollection}</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>{t.dashboard.creatingACollection}</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <DialogBody>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(createCollection)}
                            className="flex w-full flex-col items-start justify-center gap-form-elements"
                        >
                            <FormField
                                name="name"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="collection-name-input">
                                            {t.form.name}
                                            <CharacterCounter currVal={field.value} max={MAX_COLLECTION_NAME_LENGTH} />
                                        </FormLabel>
                                        <Input
                                            placeholder={t.dashboard.enterCollectionName}
                                            id="collection-name-input"
                                            type="text"
                                            {...field}
                                            onChange={field.onChange}
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
                                        <FormLabel htmlFor="collection-description-input">
                                            {t.form.description}
                                            <CharacterCounter
                                                currVal={field.value}
                                                max={MAX_COLLECTION_DESCRIPTION_LENGTH}
                                            />
                                        </FormLabel>
                                        <Textarea
                                            {...field}
                                            value={field.value || ""}
                                            id="collection-description-input"
                                            className="resize-none"
                                            placeholder="..."
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <DialogClose asChild>
                                    <CancelButton type="button" />
                                </DialogClose>
                                <Button disabled={isLoading || !form.formState.isDirty} type="submit">
                                    {isLoading ? (
                                        <LoadingSpinner size="xs" />
                                    ) : (
                                        <PlusIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                                    )}
                                    {t.dashboard.createCollection}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}

import { fallbackProjectIcon } from "@app/components/icons";
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
import { CharacterCounter, Form, FormField, FormItem, FormLabel, FormMessage } from "@app/components/ui/form";
import { Input } from "@app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@app/components/ui/select";
import { toast } from "@app/components/ui/sonner";
import { LoadingSpinner } from "@app/components/ui/spinner";
import { Textarea } from "@app/components/ui/textarea";
import { VisuallyHidden } from "@app/components/ui/visually-hidden";
import { MAX_COLLECTION_DESCRIPTION_LENGTH, MAX_COLLECTION_NAME_LENGTH } from "@app/utils/constants";
import { disableInteractions, enableInteractions } from "@app/utils/dom";
import type { z } from "@app/utils/schemas";
import { updateCollectionFormSchema } from "@app/utils/schemas/collections";
import { Capitalize } from "@app/utils/string";
import { CollectionVisibility } from "@app/utils/types";
import type { Collection } from "@app/utils/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditIcon, SaveIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import IconPicker from "~/components/icon-picker";
import { CancelButton } from "~/components/ui/button";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";
import useCollections from "./provider";

interface EditCollectionProps {
    collection: Collection;
}

export default function EditCollection(props: EditCollectionProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const collectionsCtx = useCollections();

    const form = useForm<z.infer<typeof updateCollectionFormSchema>>({
        resolver: zodResolver(updateCollectionFormSchema),
        defaultValues: {
            name: props.collection.name,
            description: props.collection.description || "",
            visibility: props.collection.visibility,
            icon: props.collection.icon || "",
        },
    });

    async function createCollection(values: z.infer<typeof updateCollectionFormSchema>) {
        try {
            if (isLoading || !isFormSubmittable()) return;
            setIsLoading(true);
            disableInteractions();

            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description || "");
            formData.append("visibility", values.visibility);
            formData.append("icon", values.icon || "");

            const response = await clientFetch(`/api/collections/${props.collection.id}`, {
                method: "PATCH",
                body: formData,
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                enableInteractions();
                return toast.error(result?.message || t.common.error);
            }

            collectionsCtx.refetchCollections();
            RefreshPage(navigate, location);
            setDialogOpen(false);
        } finally {
            setIsLoading(false);
        }
    }

    function isFormSubmittable() {
        const values = form.getValues();
        const isFormInvalid = !values.name;
        return !isFormInvalid;
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full">
                    <EditIcon aria-hidden className="h-btn-icon w-btn-icon" />
                    {t.form.edit}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t.collection.editingCollection}</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>{t.collection.editingCollection}</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <DialogBody>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(createCollection)}
                            className="flex w-full flex-col items-start justify-center gap-form-elements"
                        >
                            <FormField
                                name="icon"
                                control={form.control}
                                render={({ field }) => (
                                    <IconPicker
                                        icon={form.getValues().icon}
                                        fieldName={field.name}
                                        onChange={field.onChange}
                                        fallbackIcon={fallbackProjectIcon}
                                        originalIcon={props.collection.icon || ""}
                                    />
                                )}
                            />

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
                                name="visibility"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t.form.visibility}</FormLabel>

                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select visibility" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={CollectionVisibility.PUBLIC}>
                                                    {Capitalize(CollectionVisibility.PUBLIC)}
                                                </SelectItem>
                                                <SelectItem value={CollectionVisibility.UNLISTED}>
                                                    {Capitalize(CollectionVisibility.UNLISTED)}
                                                </SelectItem>
                                                <SelectItem value={CollectionVisibility.PRIVATE}>
                                                    {Capitalize(CollectionVisibility.PRIVATE)}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                            <CharacterCounter currVal={field.value} max={MAX_COLLECTION_DESCRIPTION_LENGTH} />
                                        </FormLabel>
                                        <Textarea
                                            id="collection-description-input"
                                            {...field}
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
                                <Button disabled={isLoading || !isFormSubmittable()}>
                                    {isLoading ? (
                                        <LoadingSpinner size="xs" />
                                    ) : (
                                        <SaveIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                                    )}
                                    {t.form.saveChanges}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}

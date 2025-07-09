import { MAX_GALLERY_DESCRIPTION_LENGTH, MAX_GALLERY_TITLE_LENGTH } from "@app/utils/constants";
import type { z } from "@app/utils/schemas";
import { updateGalleryImageFormSchema } from "@app/utils/schemas/project/settings/gallery";
import type { GalleryItem, ProjectDetailsData } from "@app/utils/types/api";
import { imageUrl } from "@app/utils/url";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3Icon, FileIcon, SaveIcon, StarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { CharacterCounter, Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useNavigate } from "~/components/ui/link";
import { toast } from "~/components/ui/sonner";
import { LoadingSpinner } from "~/components/ui/spinner";
import { Textarea } from "~/components/ui/textarea";
import { VisuallyHidden } from "~/components/ui/visually-hidden";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";

interface Props {
    galleryItem: GalleryItem;
    projectData: ProjectDetailsData;
}

export default function EditGalleryImage({ galleryItem, projectData }: Props) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const form = useForm<z.infer<typeof updateGalleryImageFormSchema>>({
        resolver: zodResolver(updateGalleryImageFormSchema),
        defaultValues: {
            title: "",
            description: "",
            orderIndex: 0,
            featured: false,
        },
    });
    form.watch();

    async function updateGalleryImage(values: z.infer<typeof updateGalleryImageFormSchema>) {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const response = await clientFetch(`/api/project/${projectData.id}/gallery/${galleryItem.id}`, {
                method: "PATCH",
                body: JSON.stringify(values),
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || t.common.error);
            }

            RefreshPage(navigate, location);
            toast.success(result?.message || t.common.success);
            form.reset();
            setDialogOpen(false);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (galleryItem) {
            form.setValue("title", galleryItem.name);
            form.setValue("description", galleryItem.description || "");
            form.setValue("orderIndex", galleryItem.orderIndex);
            form.setValue("featured", galleryItem.featured);
        }
    }, [galleryItem]);

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" size="sm">
                    <Edit3Icon aria-hidden className="h-3.5 w-3.5" />
                    {t.form.edit}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[36rem]">
                <DialogHeader>
                    <DialogTitle>{t.project.editGalleryImg}</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>{t.project.editGalleryImg}</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>

                <DialogBody>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(updateGalleryImage)}
                            className="flex w-full flex-col items-start justify-start gap-form-elements"
                        >
                            <div className="flex w-full flex-col items-center justify-center">
                                <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded rounded-b-none bg-shallow-background px-4 py-3 sm:flex-nowrap">
                                    <div className="flex w-full items-center justify-start gap-1.5">
                                        <FileIcon
                                            aria-hidden
                                            className="h-btn-icon w-btn-icon flex-shrink-0 text-muted-foreground"
                                        />

                                        <div className="flex flex-wrap items-center justify-start gap-x-2">
                                            <span className="font-semibold">{t.project.currImage}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="aspect-[2/1] w-full overflow-hidden rounded rounded-t-none bg-[hsla(var(--background-dark))]">
                                    <img src={imageUrl(galleryItem.image)} alt="img" className="h-full w-full object-contain" />
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="gallery-item-title">
                                            {t.form.title}
                                            <CharacterCounter currVal={field.value} max={MAX_GALLERY_TITLE_LENGTH} />
                                        </FormLabel>
                                        <Input {...field} placeholder={t.form.title} id="gallery-item-title" />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="gallery-item-description">
                                            {t.form.description}
                                            <CharacterCounter currVal={field.value} max={MAX_GALLERY_DESCRIPTION_LENGTH} />
                                        </FormLabel>
                                        <Textarea
                                            {...field}
                                            placeholder={t.form.description}
                                            className="h-fit min-h-14 resize-none"
                                            id="gallery-item-description"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="orderIndex"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="gallery-item-ordering">
                                            {t.form.ordering}
                                            <FormDescription className="my-1 text-sm leading-normal">
                                                {t.project.galleryOrderingDesc}
                                            </FormDescription>
                                        </FormLabel>
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                const parsedNumber = Number.parseInt(e.target.value);
                                                if (!Number.isNaN(parsedNumber)) {
                                                    field.onChange(parsedNumber);
                                                } else {
                                                    field.onChange("");
                                                }
                                            }}
                                            placeholder="1"
                                            min={0}
                                            type="number"
                                            id="gallery-item-ordering"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="featured"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="gallery-item-featured">
                                            {t.form.featured}
                                            <FormDescription className="my-1 text-sm leading-normal">
                                                {t.project.featuredGalleryImgDesc}
                                            </FormDescription>
                                        </FormLabel>
                                        <Button
                                            variant="secondary"
                                            type="button"
                                            onClick={() => field.onChange(!field.value)}
                                            id="gallery-item-featured"
                                        >
                                            {field.value === true ? (
                                                <StarIcon
                                                    aria-hidden
                                                    fill="currentColor"
                                                    className="h-btn-icon-md w-btn-icon-md"
                                                />
                                            ) : (
                                                <StarIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                                            )}
                                            {field.value === true ? t.project.unfeatureImg : t.project.featureImg}
                                        </Button>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <DialogClose asChild disabled={isLoading}>
                                    <CancelButton disabled={isLoading} />
                                </DialogClose>

                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <LoadingSpinner size="xs" />
                                    ) : (
                                        <SaveIcon aria-hidden className="h-btn-icon w-btn-icon" />
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

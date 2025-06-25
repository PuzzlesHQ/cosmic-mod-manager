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
import { CharacterCounter, Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@app/components/ui/form";
import { Input } from "@app/components/ui/input";
import { toast } from "@app/components/ui/sonner";
import { LoadingSpinner } from "@app/components/ui/spinner";
import { Textarea } from "@app/components/ui/textarea";
import { VisuallyHidden } from "@app/components/ui/visually-hidden";
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
import { CancelButton } from "~/components/ui/button";
import { useNavigate } from "~/components/ui/link";
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
            const response = await clientFetch(`/api/project/${projectData?.slug}/gallery/${galleryItem.id}`, {
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
                    <Edit3Icon aria-hidden className="w-3.5 h-3.5" />
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
                            className="w-full flex flex-col items-start justify-start gap-form-elements"
                        >
                            <div className="w-full flex flex-col items-center justify-center">
                                <div className="w-full flex flex-wrap sm:flex-nowrap items-center justify-between bg-shallow-background rounded px-4 py-3 gap-x-4 gap-y-2 rounded-b-none">
                                    <div className="w-full flex items-center justify-start gap-1.5">
                                        <FileIcon
                                            aria-hidden
                                            className="flex-shrink-0 w-btn-icon h-btn-icon text-muted-foreground"
                                        />

                                        <div className="flex items-center flex-wrap justify-start gap-x-2">
                                            <span className="font-semibold">{t.project.currImage}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full aspect-[2/1] rounded rounded-t-none overflow-hidden bg-[hsla(var(--background-dark))]">
                                    <img src={imageUrl(galleryItem.image)} alt="img" className="object-contain w-full h-full" />
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
                                            <FormDescription className="my-1 leading-normal text-sm">
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
                                            <FormDescription className="my-1 leading-normal text-sm">
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
                                                    className="w-btn-icon-md h-btn-icon-md"
                                                />
                                            ) : (
                                                <StarIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
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
                                        <SaveIcon aria-hidden className="w-btn-icon h-btn-icon" />
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

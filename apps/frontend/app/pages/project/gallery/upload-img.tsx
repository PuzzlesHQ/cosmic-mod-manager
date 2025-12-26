import { MAX_GALLERY_DESCRIPTION_LENGTH, MAX_GALLERY_TITLE_LENGTH } from "@app/utils/constants";
import type { z } from "@app/utils/schemas";
import { addNewGalleryImageFormSchema } from "@app/utils/schemas/project/settings/gallery";
import { validImgFileExtensions } from "@app/utils/schemas/utils";
import type { ProjectDetailsData } from "@app/utils/types/api";
import { FileIcon, PlusIcon, StarIcon, UploadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import RefreshPage from "~/components/misc/refresh-page";
import { Button, buttonVariants, CancelButton } from "~/components/ui/button";
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
import {
    CharacterCounter,
    Form,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { InteractiveLabel } from "~/components/ui/label";
import { useNavigate } from "~/components/ui/link";
import { toast } from "~/components/ui/sonner";
import { LoadingSpinner } from "~/components/ui/spinner";
import { Textarea } from "~/components/ui/textarea";
import { VisuallyHidden } from "~/components/ui/visually-hidden";
import { cn } from "~/components/utils";
import { useFormHook } from "~/hooks/use-form";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";
import { submitFormWithErrorHandling } from "~/utils/form";

interface Props {
    projectData: ProjectDetailsData;
}

export default function UploadGalleryImageForm({ projectData }: Props) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const form = useFormHook(addNewGalleryImageFormSchema, {
        defaultValues: {
            title: "",
            description: "",
            orderIndex: (projectData?.gallery?.[0]?.orderIndex || 0) + 1,
            featured: false,
        },
    });

    async function uploadGalleryImage(values: z.infer<typeof addNewGalleryImageFormSchema>) {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("image", values.image);
            formData.append("title", values.title);
            formData.append("description", values.description || "");
            formData.append("orderIndex", (values.orderIndex || 0).toString());
            formData.append("featured", values.featured.toString());

            const response = await clientFetch(`/api/project/${projectData.id}/gallery`, {
                method: "POST",
                body: formData,
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
        if (projectData) {
            form.setValue("orderIndex", (projectData?.gallery?.[0]?.orderIndex || 0) + 1);
        }
    }, [projectData]);

    function handleClipboardPaste(e: ClipboardEvent) {
        const file = e.clipboardData?.files?.[0];
        if (!file) return;

        const fileExtension = `.${file.name.split(".").pop()}`;
        if (!validImgFileExtensions.includes(fileExtension)) {
            return toast.error(
                `Invalid image type: ${fileExtension}. Allowed types: ${validImgFileExtensions.join(", ")}`,
            );
        }
        form.setValue("image", file);
    }

    useEffect(() => {
        document.addEventListener("paste", handleClipboardPaste);
        return () => document.removeEventListener("paste", handleClipboardPaste);
    }, []);

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="default">
                    <UploadIcon aria-hidden className="h-btn-icon w-btn-icon" />
                    {t.project.uploadImg}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[36rem]">
                <DialogHeader>
                    <DialogTitle>{t.project.uploadNewImg}</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>{t.project.uploadNewImg}</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>

                <DialogBody>
                    <Form {...form}>
                        <form
                            onSubmit={(e) => {
                                submitFormWithErrorHandling(e, addNewGalleryImageFormSchema, form, uploadGalleryImage);
                            }}
                            className="flex w-full flex-col items-start justify-start gap-form-elements"
                        >
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid w-full grid-cols-1">
                                            <div
                                                className={cn(
                                                    "flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded bg-raised-background px-4 py-3 sm:flex-nowrap",
                                                    field.value && "rounded-b-none",
                                                )}
                                            >
                                                <div className="flex w-full items-center justify-start gap-1.5">
                                                    <input
                                                        hidden
                                                        type="file"
                                                        name={field.name}
                                                        id="gallery-image-input"
                                                        className="hidden"
                                                        accept={validImgFileExtensions.join(", ")}
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                field.onChange(file);
                                                            }
                                                        }}
                                                    />
                                                    <FileIcon
                                                        aria-hidden
                                                        className="h-btn-icon w-btn-icon flex-shrink-0 text-foreground-muted"
                                                    />
                                                    {field.value ? (
                                                        <div className="flex flex-wrap items-center justify-start gap-x-2">
                                                            <span className="break-words break-all font-semibold">
                                                                {field.value.name}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-foreground-muted italic">
                                                            {t.form.noFileChosen}
                                                        </span>
                                                    )}
                                                </div>

                                                <InteractiveLabel
                                                    htmlFor="gallery-image-input"
                                                    className={cn(
                                                        buttonVariants({ variant: "secondary-dark" }),
                                                        "cursor-pointer",
                                                    )}
                                                >
                                                    {field.value ? t.version.replaceFile : t.version.chooseFile}
                                                </InteractiveLabel>
                                            </div>
                                            {field.value ? (
                                                <div className="aspect-[2/1] w-full overflow-hidden rounded rounded-t-none bg-zinc-900">
                                                    <img
                                                        src={URL.createObjectURL(field.value)}
                                                        alt="img"
                                                        className="h-full w-full object-contain"
                                                    />
                                                </div>
                                            ) : null}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
                                            <CharacterCounter
                                                currVal={field.value}
                                                max={MAX_GALLERY_DESCRIPTION_LENGTH}
                                            />
                                        </FormLabel>
                                        <Textarea
                                            {...field}
                                            value={field.value || ""}
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
                                            onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
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
                                        <PlusIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                                    )}
                                    {t.project.addGalleryImg}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}

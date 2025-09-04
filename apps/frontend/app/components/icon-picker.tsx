import { getFileType } from "@app/utils/convertors";
import { validImgFileExtensions } from "@app/utils/schemas/utils";
import { isImageFile } from "@app/utils/schemas/validation";
import { imageUrl } from "@app/utils/url";
import { Trash2Icon, UploadIcon } from "lucide-react";
import { Button, buttonVariants } from "~/components/ui/button";
import { FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { InteractiveLabel } from "~/components/ui/label";
import { toast } from "~/components/ui/sonner";
import { cn } from "~/components/utils";
import { useTranslation } from "~/locales/provider";
import { ImgWrapper } from "./ui/avatar";

interface IconPickerProps {
    icon: File | string | undefined;
    fieldName: string;
    onChange: (file: File | undefined) => void;
    fallbackIcon: React.ReactNode;
    originalIcon: string;
    vtId?: string;
    previewClassName?: string;
}

export default function IconPicker(props: IconPickerProps) {
    const { t } = useTranslation();

    return (
        <FormItem>
            <FormLabel className="font-bold">{t.form.icon}</FormLabel>
            <div className="flex flex-wrap items-center justify-start gap-4">
                <input
                    hidden
                    className="hidden"
                    id="project-icon-input"
                    accept={validImgFileExtensions.join(", ")}
                    type="file"
                    value=""
                    name={props.fieldName}
                    onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        if (!isImageFile(await getFileType(file))) {
                            toast.error("Invalid image file type");
                            return;
                        }

                        props.onChange(file);
                    }}
                />

                <ImgWrapper
                    alt={t.form.icon}
                    src={(() => {
                        const image = props.icon;
                        if (image instanceof File) return URL.createObjectURL(image);
                        if (!image) return "";

                        return imageUrl(props.originalIcon || "");
                    })()}
                    className={cn("rounded", props.previewClassName)}
                    fallback={props.fallbackIcon}
                    // Only set view transition id if the icon has not changed
                    vtId={!(props.icon instanceof File) ? props.vtId : undefined}
                />

                <div className="flex flex-col items-start justify-center gap-2">
                    <InteractiveLabel
                        htmlFor="project-icon-input"
                        className={cn(buttonVariants({ variant: "secondary", size: "default" }), "cursor-pointer")}
                    >
                        <UploadIcon aria-hidden className="h-btn-icon w-btn-icon" />
                        {t.form.uploadIcon}
                    </InteractiveLabel>
                    {props.icon ? (
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => {
                                props.onChange(undefined);
                            }}
                        >
                            <Trash2Icon aria-hidden className="h-btn-icon w-btn-icon" />
                            {t.form.removeIcon}
                        </Button>
                    ) : null}
                </div>
            </div>

            <FormMessage />
        </FormItem>
    );
}

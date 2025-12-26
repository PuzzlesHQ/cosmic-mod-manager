import { MAX_DISPLAY_NAME_LENGTH, MAX_USER_BIO_LENGTH, MAX_USERNAME_LENGTH } from "@app/utils/constants";
import type { z } from "@app/utils/schemas";
import { profileUpdateFormSchema } from "@app/utils/schemas/settings";
import { validImgFileExtensions, validVideoFileExtensions } from "@app/utils/schemas/utils";
import type { LoggedInUserData } from "@app/utils/types";
import { FileImageIcon, HelpCircleIcon, SaveIcon, Trash2Icon, UserIcon } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router";
import IconPicker from "~/components/icon-picker";
import { fallbackUserIcon } from "~/components/icons";
import RefreshPage from "~/components/misc/refresh-page";
import { Button, buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { CharacterCounter, Form, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { InteractiveLabel } from "~/components/ui/label";
import { useNavigate, VariantButtonLink } from "~/components/ui/link";
import { toast } from "~/components/ui/sonner";
import { LoadingSpinner } from "~/components/ui/spinner";
import { Textarea } from "~/components/ui/textarea";
import { TooltipProvider, TooltipTemplate } from "~/components/ui/tooltip";
import { cn } from "~/components/utils";
import { useFormHook } from "~/hooks/use-form";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";
import Config from "~/utils/config";
import { submitFormWithErrorHandling } from "~/utils/form";
import { UserProfilePath } from "~/utils/urls";

interface Props {
    session: LoggedInUserData;
}

export function ProfileSettingsPage({ session }: Props) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const form = useFormHook(profileUpdateFormSchema, {
        defaultValues: {
            name: session.name,
            userName: session.userName,
            avatar: session.avatar,
            bio: session.bio,
            profilePageBg: session.profilePageBg,
        },
    });

    async function saveSettings(values: z.infer<typeof profileUpdateFormSchema>) {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const formData = new FormData();
            for (const key in values) {
                const value = values[key as keyof typeof values];
                formData.append(key, value ?? "");
            }

            const response = await clientFetch("/api/user", {
                method: "PATCH",
                body: formData,
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message ?? t.common.error);
            }

            RefreshPage(navigate, location);
            toast.success(result?.message ?? t.common.success);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t.settings.profileInfo}</CardTitle>
                <CardDescription>{t.settings.profileInfoDesc(Config.SITE_NAME_SHORT)}</CardDescription>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={(e) => {
                            submitFormWithErrorHandling(e, profileUpdateFormSchema, form, saveSettings);
                        }}
                        className="flex w-full flex-col items-start justify-start gap-form-elements"
                    >
                        <FormField
                            control={form.control}
                            name="avatar"
                            render={({ field }) => (
                                <IconPicker
                                    vtId={session.id}
                                    icon={form.getValues().avatar}
                                    fieldName={field.name}
                                    onChange={field.onChange}
                                    fallbackIcon={fallbackUserIcon}
                                    originalIcon={session.avatar || ""}
                                    previewClassName="rounded-full"
                                />
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="userName"
                            render={({ field }) => (
                                <FormItem className="md:w-fit">
                                    <FormLabel htmlFor="username-input">
                                        {t.form.username}
                                        <CharacterCounter currVal={field.value} max={MAX_USERNAME_LENGTH} />
                                    </FormLabel>
                                    <Input
                                        {...field}
                                        className="md:w-[32ch]"
                                        id="username-input"
                                        autoComplete="username"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="md:w-fit">
                                    <FormLabel htmlFor="displayname-input">
                                        {t.form.displayName}
                                        <CharacterCounter currVal={field.value} max={MAX_DISPLAY_NAME_LENGTH} />
                                    </FormLabel>
                                    <Input
                                        {...field}
                                        value={field.value ?? ""}
                                        className="md:w-[32ch]"
                                        id="displayname-input"
                                        autoComplete="name"
                                        placeholder={form.getValues().userName}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem className="md:w-fit">
                                    <FormLabel htmlFor="user-description-input">
                                        {t.settings.bio}
                                        <CharacterCounter currVal={field.value} max={MAX_USER_BIO_LENGTH} />
                                    </FormLabel>

                                    <Textarea
                                        {...field}
                                        value={field.value ?? ""}
                                        className="min-h-16 resize-none md:w-[48ch]"
                                        spellCheck="false"
                                        id="user-description-input"
                                        placeholder={t.settings.bioDesc}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="profilePageBg"
                            render={({ field }) => (
                                <TooltipProvider>
                                    <FormItem
                                        onPaste={(e) => {
                                            const file = e.clipboardData?.files?.[0];
                                            if (!file) return;

                                            field.onChange(file);
                                        }}
                                    >
                                        <FormLabel htmlFor="bg-input" className="justify-start gap-2">
                                            {t.settings.profilePageBg}{" "}
                                            <TooltipTemplate content={t.settings.profilePageBgDesc}>
                                                <HelpCircleIcon className="h-btn-icon w-btn-icon cursor-help text-foreground-extra-muted" />
                                            </TooltipTemplate>
                                        </FormLabel>

                                        <div className="grid w-full max-w-md grid-cols-1">
                                            <div
                                                className={cn(
                                                    "flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded bg-raised-background px-4 py-2 sm:flex-nowrap",
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
                                                        accept={validImgFileExtensions
                                                            .concat(validVideoFileExtensions)
                                                            .join(",")}
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) field.onChange(file);
                                                        }}
                                                    />
                                                    <FileImageIcon
                                                        aria-hidden
                                                        className="h-btn-icon w-btn-icon flex-shrink-0 text-foreground-muted"
                                                    />
                                                    {field.value instanceof File ? (
                                                        <div className="flex flex-wrap items-center justify-start gap-x-2">
                                                            <span className="break-words break-all font-semibold">
                                                                {field.value.name}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-foreground-muted italic">
                                                            {field.value?.split("/").at(-1) || t.form.noFileChosen}
                                                        </span>
                                                    )}
                                                </div>

                                                {field.value ? (
                                                    <Button
                                                        type="button"
                                                        variant="secondary-dark"
                                                        size="sm"
                                                        onClick={() => field.onChange(null)}
                                                    >
                                                        <Trash2Icon className="h-btn-icon w-btn-icon" />
                                                        {t.form.remove}
                                                    </Button>
                                                ) : (
                                                    <InteractiveLabel
                                                        htmlFor="gallery-image-input"
                                                        className={cn(
                                                            buttonVariants({ variant: "secondary-dark", size: "sm" }),
                                                            "cursor-pointer",
                                                        )}
                                                    >
                                                        {t.version.chooseFile}
                                                    </InteractiveLabel>
                                                )}
                                            </div>
                                            {field.value ? (
                                                <div className="aspect-[2/1] w-full overflow-hidden rounded rounded-t-none bg-zinc-900">
                                                    {/* HACKY_THING */}
                                                    <video
                                                        src={
                                                            field.value instanceof File
                                                                ? URL.createObjectURL(field.value)
                                                                : field.value
                                                        }
                                                        poster={
                                                            field.value instanceof File
                                                                ? URL.createObjectURL(field.value)
                                                                : field.value
                                                        }
                                                        muted
                                                        autoPlay
                                                        loop
                                                        className="h-full w-full object-contain"
                                                    />
                                                </div>
                                            ) : null}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                </TooltipProvider>
                            )}
                        />

                        <div className="mt-2 flex w-full flex-wrap items-center gap-x-3 gap-y-2">
                            <Button type="submit" disabled={!form.formState.isDirty || isLoading}>
                                {isLoading ? (
                                    <LoadingSpinner size="xs" />
                                ) : (
                                    <SaveIcon aria-hidden className="h-btn-icon w-btn-icon" />
                                )}
                                {t.form.saveChanges}
                            </Button>

                            <VariantButtonLink to={UserProfilePath(session.userName)}>
                                <UserIcon aria-hidden className="h-btn-icon w-btn-icon" />
                                {t.settings.visitYourProfile}
                            </VariantButtonLink>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

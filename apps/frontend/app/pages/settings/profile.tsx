import { MAX_DISPLAY_NAME_LENGTH, MAX_USER_BIO_LENGTH, MAX_USERNAME_LENGTH } from "@app/utils/constants";
import type { z } from "@app/utils/schemas";
import { profileUpdateFormSchema } from "@app/utils/schemas/settings";
import type { LoggedInUserData } from "@app/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";
import IconPicker from "~/components/icon-picker";
import { fallbackUserIcon } from "~/components/icons";
import RefreshPage from "~/components/misc/refresh-page";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { CharacterCounter, Form, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useNavigate, VariantButtonLink } from "~/components/ui/link";
import { toast } from "~/components/ui/sonner";
import { LoadingSpinner } from "~/components/ui/spinner";
import { Textarea } from "~/components/ui/textarea";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";
import Config from "~/utils/config";
import { UserProfilePath } from "~/utils/urls";

interface Props {
    session: LoggedInUserData;
}

function initForm(user: LoggedInUserData) {
    return {
        name: user.name || "",
        userName: user.userName,
        avatar: user.avatar || "",
        bio: user.bio || "",
    };
}

export function ProfileSettingsPage({ session }: Props) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const initialValues = initForm(session);
    const form = useForm<z.infer<typeof profileUpdateFormSchema>>({
        resolver: zodResolver(profileUpdateFormSchema),
        defaultValues: initialValues,
    });
    form.watch();

    async function saveSettings(values: z.infer<typeof profileUpdateFormSchema>) {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", values.name || "");
            formData.append("userName", values.userName);
            formData.append("avatar", values.avatar || "");
            formData.append("bio", values.bio || "");

            const response = await clientFetch("/api/user", {
                method: "PATCH",
                body: formData,
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || t.common.error);
            }

            RefreshPage(navigate, location);
            toast.success(result?.message || t.common.success);
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
                        onSubmit={form.handleSubmit(saveSettings)}
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
                                    <Input {...field} className="md:w-[32ch]" id="username-input" autoComplete="username" />
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
                                        className="min-h-32 resize-none md:w-[48ch]"
                                        spellCheck="false"
                                        id="user-description-input"
                                        placeholder={t.settings.bioDesc}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="mt-2 flex w-full flex-wrap items-center gap-x-3 gap-y-2">
                            <Button
                                type="submit"
                                disabled={JSON.stringify(initialValues) === JSON.stringify(form.getValues()) || isLoading}
                            >
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

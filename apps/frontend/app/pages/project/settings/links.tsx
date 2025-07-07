import RefreshPage from "@app/components/misc/refresh-page";
import { Button } from "@app/components/ui/button";
import { Card, CardTitle } from "@app/components/ui/card";
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@app/components/ui/form";
import { Input } from "@app/components/ui/input";
import { toast } from "@app/components/ui/sonner";
import { LoadingSpinner } from "@app/components/ui/spinner";
import type { z } from "@app/utils/schemas";
import { updateExternalLinksFormSchema } from "@app/utils/schemas/project/settings/links";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";
import { useNavigate } from "~/components/ui/link";
import { useProjectData } from "~/hooks/project";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";

export default function ExternalLinksSettingsPage() {
    const { t } = useTranslation();
    const projectData = useProjectData().projectData;

    const navigate = useNavigate();
    const location = useLocation();

    const form = useForm<z.infer<typeof updateExternalLinksFormSchema>>({
        resolver: zodResolver(updateExternalLinksFormSchema),
        defaultValues: {
            issueTracker: projectData?.issueTrackerUrl || undefined,
            sourceCode: projectData?.projectSourceUrl || undefined,
            wikiPage: projectData?.projectWikiUrl || undefined,
            discordServer: projectData?.discordInviteUrl || undefined,
        },
    });
    form.watch();

    async function updateLinks(values: z.infer<typeof updateExternalLinksFormSchema>) {
        const res = await clientFetch(`/api/project/${projectData?.slug}/external-links`, {
            method: "PATCH",
            body: JSON.stringify(values),
        });
        const data = await res.json();

        if (!res.ok || !data?.success) {
            return toast.error(data?.message || "Failed to update external links");
        }

        RefreshPage(navigate, location);
        return toast.success(data?.message);
    }

    const formValues = form.getValues();
    const hasFormChanged =
        (projectData?.issueTrackerUrl || "") !== (formValues.issueTracker || "") ||
        (projectData?.projectSourceUrl || "") !== (formValues.sourceCode || "") ||
        (projectData?.projectWikiUrl || "") !== (formValues.wikiPage || "") ||
        (projectData?.discordInviteUrl || "") !== (formValues.discordServer || "");

    return (
        <Card className="flex w-full flex-col items-start justify-start gap-6 p-card-surround">
            <CardTitle>{t.projectSettings.externalLinks}</CardTitle>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(updateLinks)} className="flex w-full flex-col items-start justify-start gap-4">
                    <FormField
                        control={form.control}
                        name="issueTracker"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between gap-x-4 md:flex-row">
                                <FormLabel htmlFor="issue-tracker-url-input">
                                    <span className="flex flex-col items-start justify-start gap-1">
                                        <span className="font-bold">{t.projectSettings.issueTracker}</span>
                                        <FormDescription className="font-normal text-base text-muted-foreground">
                                            {t.projectSettings.issueTrackerDesc}
                                        </FormDescription>
                                    </span>
                                    <FormMessage />
                                </FormLabel>

                                <Input
                                    {...field}
                                    type="url"
                                    autoComplete="on"
                                    id="issue-tracker-url-input"
                                    value={field.value || ""}
                                    placeholder="Enter a valid URL"
                                    className="w-full md:w-[48ch] lg:w-[36ch] xl:w-[48ch]"
                                />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="sourceCode"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between gap-x-4 md:flex-row">
                                <FormLabel htmlFor="source-code-url-input">
                                    <span className="flex flex-col items-start justify-start gap-1">
                                        <span className="font-bold">{t.projectSettings.sourceCode}</span>
                                        <FormDescription className="font-normal text-base text-muted-foreground">
                                            {t.projectSettings.sourceCodeDesc}
                                        </FormDescription>
                                    </span>
                                    <FormMessage />
                                </FormLabel>

                                <Input
                                    {...field}
                                    type="url"
                                    autoComplete="on"
                                    id="source-code-url-input"
                                    value={field.value || ""}
                                    placeholder="Enter a valid URL"
                                    className="w-full md:w-[48ch] lg:w-[36ch] xl:w-[48ch]"
                                />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="wikiPage"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between gap-x-4 md:flex-row">
                                <FormLabel htmlFor="wiki-page-url-input">
                                    <span className="flex flex-col items-start justify-start gap-1">
                                        <span className="font-bold">{t.projectSettings.wikiPage}</span>
                                        <FormDescription className="font-normal text-base text-muted-foreground">
                                            {t.projectSettings.wikiPageDesc}
                                        </FormDescription>
                                    </span>
                                    <FormMessage />
                                </FormLabel>

                                <Input
                                    {...field}
                                    type="url"
                                    autoComplete="on"
                                    id="wiki-page-url-input"
                                    value={field.value || ""}
                                    placeholder="Enter a valid URL"
                                    className="w-full md:w-[48ch] lg:w-[36ch] xl:w-[48ch]"
                                />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="discordServer"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between gap-x-4 md:flex-row">
                                <FormLabel htmlFor="discord-invite-url-input">
                                    <span className="flex flex-col items-start justify-start gap-1">
                                        <span className="font-bold">{t.projectSettings.discordInvite}</span>
                                        <FormDescription className="font-normal text-base text-muted-foreground">
                                            {t.projectSettings.discordInviteDesc}
                                        </FormDescription>
                                    </span>
                                    <FormMessage />
                                </FormLabel>

                                <Input
                                    {...field}
                                    type="url"
                                    autoComplete="on"
                                    id="discord-invite-url-input"
                                    value={field.value || ""}
                                    placeholder="Enter a valid URL"
                                    className="w-full md:w-[48ch]"
                                />
                            </FormItem>
                        )}
                    />

                    <div className="flex w-full items-center justify-end">
                        <Button type="submit" disabled={!hasFormChanged || form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? (
                                <LoadingSpinner size="xs" />
                            ) : (
                                <SaveIcon aria-hidden className="h-btn-icon w-btn-icon" />
                            )}
                            {t.form.saveChanges}
                        </Button>
                    </div>
                </form>
            </Form>
        </Card>
    );
}

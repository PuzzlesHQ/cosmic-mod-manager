import { MAX_ORGANISATION_DESCRIPTION_LENGTH, MAX_ORGANISATION_NAME_LENGTH } from "@app/utils/constants";
import type { z } from "@app/utils/schemas";
import { orgSettingsFormSchema } from "@app/utils/schemas/organisation/settings/general";
import { createURLSafeSlug } from "@app/utils/string";
import type { Organisation } from "@app/utils/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import IconPicker from "~/components/icon-picker";
import { fallbackProjectIcon } from "~/components/icons";
import MarkdownRenderBox from "~/components/md-editor/md-renderer";
import { ContentCardTemplate } from "~/components/misc/panel";
import RefreshPage from "~/components/misc/refresh-page";
import { Button, CancelButton } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
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
import { useOrgData } from "~/hooks/org";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import { LeaveTeam } from "~/pages/project/settings/members/page";
import clientFetch from "~/utils/client-fetch";
import Config from "~/utils/config";
import { submitFormWithErrorHandling } from "~/utils/form";
import { OrgPagePath } from "~/utils/urls";

function getInitialValues(orgData: Organisation) {
    return {
        icon: orgData.icon || "",
        name: orgData.name,
        slug: orgData.slug,
        description: orgData.description || "",
    };
}

export default function GeneralOrgSettings() {
    const { t } = useTranslation();
    const orgData = useOrgData().orgData;
    const session = useSession();

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const orgMembership = orgData.members.find((m) => m.userId === session?.id);

    const initialValues = getInitialValues(orgData);
    const form = useForm<z.infer<typeof orgSettingsFormSchema>>({
        resolver: zodResolver(orgSettingsFormSchema),
        defaultValues: initialValues,
    });
    form.watch();

    async function saveSettings(values: z.infer<typeof orgSettingsFormSchema>) {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("icon", values.icon || "");
            formData.append("name", values.name);
            formData.append("slug", values.slug);
            formData.append("description", values.description);

            const response = await clientFetch(`/api/organization/${orgData.id}`, {
                method: "PATCH",
                body: formData,
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || t.common.error);
            }

            const newPathname = OrgPagePath(result?.slug || orgData.slug, "settings");
            RefreshPage(navigate, newPathname);
            toast.success(result?.message || t.common.success);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <ContentCardTemplate title={t.organization.orgInfo}>
                <Form {...form}>
                    <form
                        onSubmit={(e) => {
                            submitFormWithErrorHandling(e, orgSettingsFormSchema, form, saveSettings);
                        }}
                        className="flex w-full flex-col items-start justify-start gap-form-elements"
                    >
                        <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <IconPicker
                                    icon={form.getValues().icon}
                                    fieldName={field.name}
                                    onChange={field.onChange}
                                    fallbackIcon={fallbackProjectIcon}
                                    originalIcon={orgData.icon || ""}
                                />
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="md:w-fit">
                                    <FormLabel className="font-bold" htmlFor="org-name-input">
                                        {t.form.name}
                                        <CharacterCounter currVal={field.value} max={MAX_ORGANISATION_NAME_LENGTH} />
                                    </FormLabel>
                                    <Input {...field} className="md:w-[32ch]" id="org-name-input" autoComplete="off" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem className="md:w-fit">
                                    <FormLabel className="font-bold" htmlFor="org-slug-input">
                                        {t.form.url}
                                        <CharacterCounter currVal={field.value} max={MAX_ORGANISATION_NAME_LENGTH} />
                                    </FormLabel>
                                    <div className="flex w-full flex-col items-start justify-center gap-0.5">
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(createURLSafeSlug(e.target.value));
                                            }}
                                            className="md:w-[32ch]"
                                            id="org-slug-input"
                                            autoComplete="off"
                                        />
                                        <span className="px-1 text-foreground-muted text-sm lg:text-base">
                                            {Config.FRONTEND_URL}/organization/
                                            <em className="font-[500] text-foreground not-italic">{form.getValues().slug}</em>
                                        </span>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="md:w-fit">
                                    <FormLabel className="font-bold" htmlFor="org-description-input">
                                        {t.form.description}
                                        <CharacterCounter currVal={field.value} max={MAX_ORGANISATION_DESCRIPTION_LENGTH} />
                                    </FormLabel>
                                    <Textarea
                                        {...field}
                                        className="min-h-32 resize-none md:w-[48ch]"
                                        spellCheck="false"
                                        id="org-description-input"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="mt-2 flex w-full items-center justify-end">
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
                        </div>
                    </form>
                </Form>
            </ContentCardTemplate>

            {orgMembership?.id ? (
                <Card>
                    <CardContent className="pt-card-surround">
                        <LeaveTeam
                            teamId={orgData.teamId}
                            currUsersMembership={orgMembership}
                            refreshData={async () => RefreshPage(navigate, OrgPagePath(orgData.slug))}
                            isOrgTeam
                        />
                    </CardContent>
                </Card>
            ) : null}

            <DeleteOrgDialog name={orgData.name} slug={orgData.slug} />
        </>
    );
}

function DeleteOrgDialog({ name, slug }: { name: string; slug: string }) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [submittable, setSubmittable] = useState(false);
    const navigate = useNavigate();

    async function deleteOrg() {
        if (!submittable || isLoading) return;
        setIsLoading(true);
        try {
            const res = await clientFetch(`/api/organization/${slug}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (!res.ok || !data?.success) {
                return toast.error(data?.message || t.common.error);
            }

            toast.success(data?.message || "Success");
            RefreshPage(navigate, "/dashboard/organizations");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <ContentCardTemplate title={t.organization.deleteOrg} className="flex w-full flex-row flex-wrap justify-between gap-4">
            <p className="max-w-[65ch] text-foreground-muted">{t.organization.deleteOrgDesc}</p>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="destructive">
                        <Trash2Icon aria-hidden className="h-btn-icon w-btn-icon" />
                        {t.organization.deleteOrg}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t.organization.sureToDeleteOrg}</DialogTitle>
                        <VisuallyHidden>
                            <DialogDescription>{t.organization.deleteOrgNamed(name)}</DialogDescription>
                        </VisuallyHidden>
                    </DialogHeader>
                    <DialogBody className="flex flex-col gap-4 text-foreground-muted">
                        <p className="leading-snug">{t.organization.deletionWarning}</p>

                        <div className="flex w-full flex-col gap-1">
                            <MarkdownRenderBox text={t.projectSettings.typeToVerify(name)} divElem />

                            <Input
                                placeholder={t.projectSettings.typeHere}
                                className="w-full sm:w-[32ch]"
                                onChange={(e) => {
                                    if (e.target.value === name) {
                                        setSubmittable(true);
                                    } else if (submittable === true) {
                                        setSubmittable(false);
                                    }
                                }}
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <CancelButton />
                            </DialogClose>
                            <Button disabled={!submittable || isLoading} variant="destructive" onClick={deleteOrg}>
                                {isLoading ? (
                                    <LoadingSpinner size="xs" />
                                ) : (
                                    <Trash2Icon aria-hidden className="h-btn-icon w-btn-icon" />
                                )}
                                {t.organization.deleteOrg}
                            </Button>
                        </DialogFooter>
                    </DialogBody>
                </DialogContent>
            </Dialog>
        </ContentCardTemplate>
    );
}

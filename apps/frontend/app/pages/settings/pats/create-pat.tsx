import { AddDays, DateFromStr } from "@app/utils/date";
import { API_SCOPE, PAT_RESTRICTED_SCOPES } from "@app/utils/pats";
import { createPAT_FormSchema } from "@app/utils/schemas/pat";
import { CapitalizeAndFormatString } from "@app/utils/string";
import type { PATData } from "@app/utils/types/api/pat";
import { PencilIcon, PlusIcon, SaveIcon } from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { useLocation } from "react-router";
import { toast } from "sonner";
import type { z } from "zod/v4";
import RefreshPage from "~/components/misc/refresh-page";
import { Button, CancelButton } from "~/components/ui/button";
import { LabelledCheckbox } from "~/components/ui/checkbox";
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
import { Form, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useNavigate } from "~/components/ui/link";
import { LoadingSpinner } from "~/components/ui/spinner";
import { VisuallyHidden } from "~/components/ui/visually-hidden";
import { useFormHook } from "~/hooks/use-form";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";
import { submitFormWithErrorHandling } from "~/utils/form";
import { resJson } from "~/utils/server-fetch";

export function CreatePAT_Dialog({ setPats }: { setPats: React.Dispatch<React.SetStateAction<PATData[]>> }) {
    const { t } = useTranslation();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function createPAT(data: z.infer<typeof createPAT_FormSchema>) {
        if (loading) return;
        setLoading(true);

        try {
            const response = await clientFetch("/api/pat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const resData = await resJson<{ message: string }>(response);
                toast.error("Couldn't create PAT", { description: resData?.message ?? undefined });
                return;
            }

            const patData = await resJson<PATData>(response);
            if (patData) setPats((pats) => [patData, ...pats]);

            setDialogOpen(false);
            toast.success("PAT created!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <PatInfoForm
            patData={null}
            onSubmit={createPAT}
            loading={loading}
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
            trigger={
                <Button size="sm">
                    <PlusIcon className="h-btn-icon w-btn-icon" />
                    {t.settings.create_a_PAT}
                </Button>
            }
            dialog={{
                title: t.settings.createPAT_long,
                submitText: t.settings.createPAT,
                submitBtnIcon: <PlusIcon className="h-btn-icon w-btn-icon" />,
            }}
        />
    );
}

export function EditPAT_Dialog({ pat }: { pat: PATData }) {
    const { t } = useTranslation();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    async function updatePAT(data: z.infer<typeof createPAT_FormSchema>) {
        if (loading) return;
        setLoading(true);

        try {
            const response = await clientFetch(`/api/pat/${pat.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const resData = await resJson<{ message: string }>(response);
                toast.error("Couldn't update PAT", { description: resData?.message ?? undefined });
                return;
            }

            RefreshPage(navigate, location);
            setDialogOpen(false);
        } finally {
            setLoading(false);
        }
    }

    return (
        <PatInfoForm
            patData={pat}
            onSubmit={updatePAT}
            loading={loading}
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
            trigger={
                <Button variant="outline" size="icon" title={t.settings.editToken}>
                    <PencilIcon className="size-4" />
                </Button>
            }
            dialog={{
                title: t.settings.editPAT_long,
                submitText: t.form.saveChanges,
                submitBtnIcon: <SaveIcon className="h-btn-icon w-btn-icon" />,
            }}
        />
    );
}

interface PatInfoFormProps {
    patData: PATData | null;
    onSubmit: (data: z.infer<typeof createPAT_FormSchema>) => Promise<void>;
    loading: boolean;
    dialogOpen: boolean;
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;

    trigger: React.ReactNode;
    dialog: {
        title: string;
        submitText: string;
        submitBtnIcon: React.ReactNode;
    };
}

function defaultFormValues(patData: PATData | null) {
    return {
        name: patData?.name ?? "",
        authScopes: patData ? patData.scopes : [],
        dateExpires: patData ? dateIsoString(new Date(patData.dateExpires)) : "",
    };
}

function PatInfoForm({ patData, onSubmit, loading, ...props }: PatInfoFormProps) {
    const { t } = useTranslation();

    const form = useFormHook(createPAT_FormSchema, {
        defaultValues: defaultFormValues(patData),
    });

    useLayoutEffect(() => {
        if (props.dialogOpen === true) {
            form.reset(defaultFormValues(patData));
        }
    }, [props.dialogOpen]);

    return (
        <Dialog open={props.dialogOpen} onOpenChange={props.setDialogOpen}>
            <DialogTrigger asChild className="w-fit">
                {props.trigger}
            </DialogTrigger>

            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{props.dialog.title}</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>{props.dialog.title}</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>

                <DialogBody className="grid gap-4">
                    <Form {...form}>
                        <form
                            onSubmit={(e) => {
                                submitFormWithErrorHandling(e, createPAT_FormSchema, form, onSubmit);
                            }}
                            className="grid gap-form-elements"
                        >
                            <FormField
                                name="name"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="pat-name-input">
                                            {t.form.name}
                                            <FormMessage />
                                        </FormLabel>
                                        <Input
                                            placeholder="Enter the PAT's name..."
                                            id="pat-name-input"
                                            type="text"
                                            {...field}
                                        />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="authScopes"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="items-stretch">
                                        <FormLabel>{t.settings.scopes}</FormLabel>

                                        <div className="grid gap-x-3 gap-y-2 sm:grid-cols-3">
                                            {Object.values(API_SCOPE)
                                                .filter((scope) => PAT_RESTRICTED_SCOPES.includes(scope) === false)
                                                .map((scope) => {
                                                    return (
                                                        <LabelledCheckbox
                                                            key={scope}
                                                            checked={field.value.includes(scope)}
                                                            onCheckedChange={(checked) => {
                                                                if (checked === true) {
                                                                    field.onChange([...field.value, scope]);
                                                                } else {
                                                                    field.onChange(
                                                                        field.value.filter((item) => item !== scope),
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            {t.settings.apiScopes[scope] ??
                                                                CapitalizeAndFormatString(scope)}
                                                        </LabelledCheckbox>
                                                    );
                                                })}
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="dateExpires"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="pat-expiration-input">
                                            {t.settings.expirationData}
                                            <FormMessage />
                                        </FormLabel>
                                        <Input
                                            className="w-fit"
                                            name={field.name}
                                            value={field.value}
                                            id="pat-expiration-input"
                                            type="date"
                                            min={dateIsoString(AddDays(new Date(), 1))}
                                            max="2100-01-01"
                                            onChange={(e) => {
                                                const date = DateFromStr(e.target.value);
                                                if (!e.target.value || !date) field.onChange("");
                                                else field.onChange(dateIsoString(date));
                                            }}
                                            required
                                        />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <DialogClose asChild>
                                    <CancelButton />
                                </DialogClose>

                                <Button type="submit" disabled={loading || !form.formState.isDirty}>
                                    {loading ? <LoadingSpinner size="xs" /> : props.dialog.submitBtnIcon}
                                    {props.dialog.submitText}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}

function dateIsoString(date: Date) {
    return date.toISOString().split("T")[0];
}

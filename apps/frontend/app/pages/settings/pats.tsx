import { SITE_NAME_SHORT } from "@app/utils/constants";
import { API_SCOPE, decodePatScopes, PAT_RESTRICTED_SCOPES, togglePatScope } from "@app/utils/pats";
import { createPAT_FormSchema } from "@app/utils/schemas/pat";
import { CapitalizeAndFormatString } from "@app/utils/string";
import type { PATData } from "@app/utils/types/api/pat";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";
import { toast } from "sonner";
import type { z } from "zod/v4";
import MarkdownRenderBox from "~/components/md-editor/md-renderer";
import RefreshPage from "~/components/misc/refresh-page";
import { Button, CancelButton } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { LabelledCheckbox } from "~/components/ui/checkbox";
import CopyBtn from "~/components/ui/copy-btn";
import { FormattedDate, TimePassedSince } from "~/components/ui/date";
import {
    Dialog,
    DialogBody,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useNavigate } from "~/components/ui/link";
import { DotSeparator } from "~/components/ui/separator";
import { LoadingSpinner } from "~/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";
import Config from "~/utils/config";
import { submitFormWithErrorHandling } from "~/utils/form";
import { resJson } from "~/utils/server-fetch";

// TODO: add the api route to edit pats
// TODO: add translations

export default function PersonalAccessTokensSettingsPage({ pats: _pats }: { pats: PATData[] }) {
    const { t } = useTranslation();
    const [pats, setPats] = useState(_pats);

    useEffect(() => {
        setPats((prev) => {
            const updatedList: PATData[] = [];

            for (const pat of _pats) {
                const existingPat = prev.find((p) => p.id === pat.id);
                if (existingPat) {
                    updatedList.push(existingPat);
                } else {
                    updatedList.push(pat);
                }
            }
            return updatedList;
        });
    }, [_pats]);

    return (
        <Card>
            <CardHeader className="flex flex-row flex-wrap justify-between">
                <CardTitle>{t.settings.personalAccessTokens}</CardTitle>

                <CreatePAT_Dialog setPats={setPats} />
            </CardHeader>
            <CardContent className="grid gap-form-elements">
                <MarkdownRenderBox text={t.settings.personalAccessTokensDesc(SITE_NAME_SHORT, Config.DOCS_URL)} />

                <TooltipProvider>
                    {pats.map((pat) => {
                        return (
                            <div
                                key={pat.id}
                                className="group/pat-item flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded bg-background px-4 py-3"
                            >
                                <div className="flex grow flex-col gap-2.5 sm:gap-1">
                                    <div className="grid gap-x-2">
                                        <span className="font-semibold text-foreground">{pat.name}</span>

                                        {pat.token && (
                                            <div className="flex items-center gap-2 text-foreground-muted">
                                                <span className="font-mono">{pat.token}</span>
                                                <CopyBtn text={pat.token} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex w-full flex-wrap items-center justify-start gap-x-2 text-foreground-muted">
                                        {pat.dateLastUsed ? (
                                            <Tooltip>
                                                <TooltipTrigger className="cursor-text" asChild>
                                                    <span>
                                                        {t.settings.lastAccessed(TimePassedSince({ date: pat.dateLastUsed }))}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <FormattedDate date={pat.dateExpires} />
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            <span>Never used</span>
                                        )}

                                        <DotSeparator />

                                        <Tooltip>
                                            <TooltipTrigger className="cursor-text" asChild>
                                                <span>Expires {TimePassedSince({ date: pat.dateExpires })}</span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <FormattedDate date={pat.dateExpires} />
                                            </TooltipContent>
                                        </Tooltip>

                                        <DotSeparator />

                                        <Tooltip>
                                            <TooltipTrigger className="cursor-text" asChild>
                                                <span>{t.settings.created(TimePassedSince({ date: pat.dateCreated }))}</span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <FormattedDate date={pat.dateCreated} />
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Button variant="outline" size="icon" title={t.settings.editToken}>
                                        <PencilIcon className="size-4" />
                                    </Button>

                                    <DeletePAT_Dialog pat={pat} />
                                </div>
                            </div>
                        );
                    })}
                </TooltipProvider>
            </CardContent>
        </Card>
    );
}

function CreatePAT_Dialog({ setPats }: { setPats: React.Dispatch<React.SetStateAction<PATData[]>> }) {
    const { t } = useTranslation();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(createPAT_FormSchema),
        defaultValues: {
            name: "",
            authScopes: 0n,
        },
    });

    async function createPAT(data: z.infer<typeof createPAT_FormSchema>) {
        if (loading) return;
        setLoading(true);

        try {
            const response = await clientFetch("/api/pat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...data,
                    authScopes: data.authScopes.toString(),
                }),
            });

            if (!response.ok) {
                const resData = await resJson<{ message: string }>(response);
                toast.error("Couldn't create PAT", { description: resData?.message ?? undefined });
                return;
            }

            const patData = await resJson<PATData>(response);
            if (patData) setPats((pats) => [patData, ...pats]);

            form.reset();
            setDialogOpen(false);
            toast.success("PAT created!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild className="w-fit">
                <Button size="sm">
                    <PlusIcon className="h-btn-icon w-btn-icon" />
                    Create a PAT
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Create personal access token</DialogTitle>
                </DialogHeader>

                <DialogBody className="grid gap-4">
                    <Form {...form}>
                        <form
                            onSubmit={(e) => {
                                submitFormWithErrorHandling(e, createPAT_FormSchema, form, createPAT);
                            }}
                            className="grid gap-form-elements"
                        >
                            <FormField
                                name="name"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="pat-name-input">
                                            Name
                                            <FormMessage />
                                        </FormLabel>
                                        <Input placeholder="Enter the PAT's name..." id="pat-name-input" type="text" {...field} />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="authScopes"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="items-stretch">
                                        <FormLabel>Scopes</FormLabel>

                                        <div className="grid gap-x-3 sm:grid-cols-3">
                                            {Object.values(API_SCOPE)
                                                .filter((scope) => PAT_RESTRICTED_SCOPES.includes(scope) === false)
                                                .map((scope) => {
                                                    return (
                                                        <LabelledCheckbox
                                                            key={scope}
                                                            checked={decodePatScopes(field.value).includes(scope)}
                                                            onCheckedChange={() => {
                                                                field.onChange(togglePatScope(field.value, scope));
                                                                console.log(field.value.toString(2));
                                                            }}
                                                            className="py-1.5"
                                                        >
                                                            <span>
                                                                {t.settings.apiScopes[scope] ?? CapitalizeAndFormatString(scope)}
                                                            </span>
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
                                            Expiration Date
                                            <FormMessage />
                                        </FormLabel>
                                        <Input
                                            className="w-fit"
                                            name={field.name}
                                            value={field.value?.toISOString().split("T")[0]}
                                            id="pat-expiration-input"
                                            type="date"
                                            min={new Date().toISOString().split("T")[0]}
                                            max={new Date("2100-01-01").toISOString().split("T")[0]}
                                            onChange={(e) => {
                                                field.onChange(new Date(e.target.value));
                                            }}
                                        />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <DialogClose asChild>
                                    <CancelButton />
                                </DialogClose>

                                <Button type="submit" disabled={loading}>
                                    {loading ? <LoadingSpinner size="xs" /> : <PlusIcon className="h-btn-icon w-btn-icon" />}
                                    Create PAT
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}

function DeletePAT_Dialog({ pat }: { pat: PATData }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    async function deletePAT() {
        if (loading) return;
        setLoading(true);

        try {
            const response = await clientFetch(`/api/pat/${pat.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const resData = await response.json();
                toast.error("Couldn't delete PAT", { description: resData?.message ?? undefined });
                return;
            }

            toast.success("PAT deleted!");
            RefreshPage(navigate, location);
            setDialogOpen(false);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary-destructive" size="icon" title={t.settings.revokeToken}>
                    <Trash2Icon className="size-4" />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete personal access token</DialogTitle>
                </DialogHeader>
                <DialogBody className="grid gap-form-elements">
                    <MarkdownRenderBox text={`Are you sure you want to delete PAT **\`${pat.name}\`**?`} />

                    <DialogFooter>
                        <DialogClose asChild>
                            <CancelButton />
                        </DialogClose>

                        <Button variant="destructive" onClick={deletePAT} disabled={loading}>
                            {loading ? <LoadingSpinner size="xs" /> : <Trash2Icon className="h-btn-icon w-btn-icon" />}
                            Delete PAT
                        </Button>
                    </DialogFooter>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}

import { SITE_NAME_SHORT } from "@app/utils/constants";
import type { PATData } from "@app/utils/types/api/pat";
import { Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { toast } from "sonner";
import MarkdownRenderBox from "~/components/md-editor/md-renderer";
import RefreshPage from "~/components/misc/refresh-page";
import { Button, CancelButton } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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
import { useNavigate } from "~/components/ui/link";
import { DotSeparator } from "~/components/ui/separator";
import { LoadingSpinner } from "~/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";
import Config from "~/utils/config";
import { CreatePAT_Dialog, EditPAT_Dialog } from "./create-pat";

export default function PersonalAccessTokensSettingsPage({ pats: _pats }: { pats: PATData[] }) {
    const { t } = useTranslation();
    const [pats, setPats] = useState(_pats);

    useEffect(() => {
        setPats((prev) => {
            const updatedList: PATData[] = [];

            for (const pat of _pats) {
                const existingPat = prev.find((p) => p.id === pat.id);
                if (existingPat) {
                    updatedList.push({ ...existingPat, ...pat });
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
                                                        {t.settings.lastAccessed(
                                                            TimePassedSince({ date: pat.dateLastUsed }),
                                                        )}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <FormattedDate date={pat.dateExpires} />
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            <span>{t.settings.neverUsed}</span>
                                        )}

                                        <DotSeparator />

                                        <Tooltip>
                                            <TooltipTrigger className="cursor-text" asChild>
                                                <span>
                                                    {t.settings.expires(TimePassedSince({ date: pat.dateExpires }))}
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <FormattedDate date={pat.dateExpires} />
                                            </TooltipContent>
                                        </Tooltip>

                                        <DotSeparator />

                                        <Tooltip>
                                            <TooltipTrigger className="cursor-text" asChild>
                                                <span>
                                                    {t.settings.created(TimePassedSince({ date: pat.dateCreated }))}
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <FormattedDate date={pat.dateCreated} />
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <EditPAT_Dialog pat={pat} />

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
                    <DialogTitle>{t.settings.deletePAT_long}</DialogTitle>
                </DialogHeader>
                <DialogBody className="grid gap-form-elements">
                    <MarkdownRenderBox text={t.settings.sureToDeletePAT(pat.name)} />

                    <DialogFooter>
                        <DialogClose asChild>
                            <CancelButton />
                        </DialogClose>

                        <Button variant="destructive" onClick={deletePAT} disabled={loading}>
                            {loading ? <LoadingSpinner size="xs" /> : <Trash2Icon className="h-btn-icon w-btn-icon" />}
                            {t.settings.deletePAT}
                        </Button>
                    </DialogFooter>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}

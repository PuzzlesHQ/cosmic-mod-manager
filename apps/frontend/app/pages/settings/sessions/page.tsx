import { Capitalize } from "@app/utils/string";
import { AuthProvider, type LoggedInUserData } from "@app/utils/types";
import type { SessionListData } from "@app/utils/types/api";
import { KeyRoundIcon, XIcon } from "lucide-react";
import React, { useState } from "react";
import { useLocation } from "react-router";
import RefreshPage from "~/components/misc/refresh-page";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import CopyBtn from "~/components/ui/copy-btn";
import { FormattedDate, TimePassedSince } from "~/components/ui/date";
import { useNavigate } from "~/components/ui/link";
import { DotSeparator } from "~/components/ui/separator";
import { toast } from "~/components/ui/sonner";
import { LoadingSpinner } from "~/components/ui/spinner";
import { Switch } from "~/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { useTranslation } from "~/locales/provider";
import { authProvidersList } from "~/pages/auth/oauth-providers";
import clientFetch from "~/utils/client-fetch";

interface Props {
    session: LoggedInUserData;
    loggedInSessions: SessionListData[];
}

export default function SessionsPage({ loggedInSessions, session: currSession }: Props) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<{ value: boolean; sessionId: string }>({ value: false, sessionId: "" });
    const [showIp, setShowIp] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    async function revokeSession(sessionId: string) {
        try {
            if (isLoading.value) return;
            setIsLoading({ value: true, sessionId: sessionId });

            const response = await clientFetch("/api/auth/sessions", {
                method: "DELETE",
                body: JSON.stringify({ sessionId: sessionId }),
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || t.common.error);
            }

            toast.success(result?.message || t.common.success);
            RefreshPage(navigate, location);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading({ value: false, sessionId: "" });
        }
    }

    return (
        <Card className="w-full">
            <CardHeader className="gap-3">
                <div className="flex items-center justify-between gap-x-6 gap-y-2">
                    <CardTitle>{t.settings.sessions}</CardTitle>
                    <label
                        className="flex items-center justify-center gap-2 text-foreground-muted text-sm"
                        htmlFor="show-ip-addresses"
                    >
                        {t.settings.showIpAddr}
                        <Switch checked={showIp} onCheckedChange={setShowIp} id="show-ip-addresses" />
                    </label>
                </div>
                <CardDescription>{t.settings.sessionsDesc}</CardDescription>
            </CardHeader>
            <CardContent className="relative grid min-h-24 gap-form-elements">
                <TooltipProvider>
                    {loggedInSessions.map((session) => {
                        return (
                            <div
                                key={session.id}
                                className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded bg-background px-4 py-3"
                            >
                                <div className="flex grow flex-col gap-2.5 sm:gap-1">
                                    <div className="flex flex-wrap items-center justify-start gap-x-2 font-medium">
                                        <span>{session.browser}</span>
                                        <DotSeparator />
                                        <span>{session.os}</span>
                                        <DotSeparator />
                                        <div className="flex items-center justify-center gap-2">
                                            {showIp ? (
                                                <span>{session.ip}</span>
                                            ) : (
                                                <span className="text-foreground-extra-muted" title={session.ip || ""}>
                                                    [{t.settings.ipHidden}]
                                                </span>
                                            )}
                                            <CopyBtn text={session.ip || ""} id={`session-ip-${session.id}`} />
                                        </div>
                                    </div>

                                    <div className="flex w-full flex-wrap items-center justify-start gap-x-2 text-foreground-muted">
                                        {session.city || session.country ? (
                                            <>
                                                <span>
                                                    {session.city || ""}
                                                    {session.city && session.country && " - "}
                                                    {session.country || ""}
                                                </span>
                                                <DotSeparator />
                                            </>
                                        ) : null}

                                        <Tooltip>
                                            <TooltipTrigger className="cursor-text">
                                                <span>
                                                    {t.settings.lastAccessed(TimePassedSince({ date: session.dateLastActive }))}
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <FormattedDate date={session.dateLastActive} />
                                            </TooltipContent>
                                        </Tooltip>

                                        <DotSeparator />

                                        <Tooltip>
                                            <TooltipTrigger className="cursor-text">
                                                <span>{t.settings.created(TimePassedSince({ date: session.dateCreated }))}</span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <FormattedDate date={session.dateCreated} />
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>

                                    <div className="mt-1 flex items-center justify-start">
                                        <Tooltip>
                                            <TooltipTrigger className="flex cursor-default items-center justify-start gap-2 text-foreground-muted">
                                                {session?.providerName !== AuthProvider.CREDENTIAL ? (
                                                    authProvidersList?.map((authProvider) => {
                                                        if (authProvider?.name.toLowerCase() === session?.providerName) {
                                                            return (
                                                                <React.Fragment key={authProvider.name}>
                                                                    {authProvider?.icon}
                                                                </React.Fragment>
                                                            );
                                                        }
                                                        return <React.Fragment key={authProvider.name}>{null}</React.Fragment>;
                                                    })
                                                ) : (
                                                    <KeyRoundIcon aria-hidden className="h-4 w-4" />
                                                )}
                                                <span className="capitalize">{session?.providerName}</span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {t.settings.sessionCreatedUsing(Capitalize(session?.providerName))}
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>
                                <div>
                                    {session.id === currSession?.sessionId ? (
                                        <span className="text-foreground-muted italic">{t.settings.currSession}</span>
                                    ) : (
                                        <Button
                                            variant="secondary"
                                            disabled={isLoading.value}
                                            onClick={() => {
                                                revokeSession(session.id);
                                            }}
                                        >
                                            {isLoading.value && isLoading.sessionId === session.id ? (
                                                <LoadingSpinner size="xs" />
                                            ) : (
                                                <XIcon aria-hidden className="h-btn-icon w-btn-icon" />
                                            )}
                                            {t.settings.revokeSession}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </TooltipProvider>
            </CardContent>
        </Card>
    );
}

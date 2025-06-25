import RefreshPage from "@app/components/misc/refresh-page";
import { Button } from "@app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@app/components/ui/card";
import CopyBtn from "@app/components/ui/copy-btn";
import { DotSeparator } from "@app/components/ui/separator";
import { toast } from "@app/components/ui/sonner";
import { LoadingSpinner } from "@app/components/ui/spinner";
import { Switch } from "@app/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@app/components/ui/tooltip";
import { Capitalize } from "@app/utils/string";
import { AuthProvider, type LoggedInUserData } from "@app/utils/types";
import type { SessionListData } from "@app/utils/types/api";
import { KeyRoundIcon, XIcon } from "lucide-react";
import React, { useState } from "react";
import { useLocation } from "react-router";
import { FormattedDate, TimePassedSince } from "~/components/ui/date";
import { useNavigate } from "~/components/ui/link";
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
                        className="flex gap-2 items-center justify-center text-sm text-muted-foreground"
                        htmlFor="show-ip-addresses"
                    >
                        {t.settings.showIpAddr}
                        <Switch checked={showIp} onCheckedChange={setShowIp} id="show-ip-addresses" />
                    </label>
                </div>
                <CardDescription>{t.settings.sessionsDesc}</CardDescription>
            </CardHeader>
            <CardContent className="w-full flex items-center justify-center flex-col gap-form-elements relative min-h-24">
                {loggedInSessions.map((session) => {
                    return (
                        <TooltipProvider key={session.id}>
                            <div
                                key={session.id}
                                className="w-full flex flex-wrap gap-x-6 gap-y-3 items-center justify-between bg-background rounded py-3 px-4"
                            >
                                <div className="flex flex-col gap-2.5 sm:gap-1 grow">
                                    <div className="font-medium flex flex-wrap gap-x-2 items-center justify-start">
                                        <span>{session.browser}</span>
                                        <DotSeparator />
                                        <span>{session.os}</span>
                                        <DotSeparator />
                                        <div className="flex gap-2 items-center justify-center">
                                            {showIp ? (
                                                <span>{session.ip}</span>
                                            ) : (
                                                <span className="text-extra-muted-foreground" title={session.ip || ""}>
                                                    [{t.settings.ipHidden}]
                                                </span>
                                            )}
                                            <CopyBtn text={session.ip || ""} id={`session-ip-${session.id}`} />
                                        </div>
                                    </div>

                                    <div className="w-full flex flex-wrap gap-x-2 items-center justify-start text-muted-foreground">
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
                                            <TooltipContent className="bg-shallower-background dark:bg-shallow-background">
                                                <FormattedDate date={session.dateLastActive} />
                                            </TooltipContent>
                                        </Tooltip>

                                        <DotSeparator />

                                        <Tooltip>
                                            <TooltipTrigger className="cursor-text">
                                                <span>{t.settings.created(TimePassedSince({ date: session.dateCreated }))}</span>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-shallower-background dark:bg-shallow-background">
                                                <FormattedDate date={session.dateCreated} />
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>

                                    <div className="flex items-center justify-start mt-1">
                                        <Tooltip>
                                            <TooltipTrigger className="cursor-default flex gap-2 items-center justify-start text-muted-foreground">
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
                                                    <KeyRoundIcon aria-hidden className="w-4 h-4" />
                                                )}
                                                <span className="capitalize">{session?.providerName}</span>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-shallower-background dark:bg-shallow-background">
                                                {t.settings.sessionCreatedUsing(Capitalize(session?.providerName))}
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>
                                <div>
                                    {session.id === currSession?.sessionId ? (
                                        <span className="text-muted-foreground italic">{t.settings.currSession}</span>
                                    ) : (
                                        <Button
                                            variant="secondary-inverted"
                                            disabled={isLoading.value}
                                            onClick={() => {
                                                revokeSession(session.id);
                                            }}
                                        >
                                            {isLoading.value && isLoading.sessionId === session.id ? (
                                                <LoadingSpinner size="xs" />
                                            ) : (
                                                <XIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                            )}
                                            {t.settings.revokeSession}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </TooltipProvider>
                    );
                })}
            </CardContent>
        </Card>
    );
}

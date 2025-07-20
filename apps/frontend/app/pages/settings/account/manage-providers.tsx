import { getAuthProviderFromString } from "@app/utils/convertors";
import { Capitalize } from "@app/utils/string";
import { AuthActionIntent, AuthProvider, type LinkedProvidersListData } from "@app/utils/types";
import { ExternalLinkIcon, Link2Icon, SettingsIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import RefreshPage from "~/components/misc/refresh-page";
import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { TextLink, useNavigate } from "~/components/ui/link";
import { toast } from "~/components/ui/sonner";
import { LoadingSpinner } from "~/components/ui/spinner";
import { VisuallyHidden } from "~/components/ui/visually-hidden";
import { useTranslation } from "~/locales/provider";
import { authProvidersList, setReturnUrl } from "~/pages/auth/oauth-providers";
import clientFetch from "~/utils/client-fetch";
import Config from "~/utils/config";
import { resJson } from "~/utils/server-fetch";

export default function ManageAuthProviders({ linkedAuthProviders }: { linkedAuthProviders: LinkedProvidersListData[] }) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<{ value: boolean; provider: AuthProvider | null }>({
        value: false,
        provider: null,
    });

    const navigate = useNavigate();
    const location = useLocation();

    async function removeAuthProvider(provider: AuthProvider) {
        try {
            if (isLoading.value === true) return;
            setIsLoading({ value: true, provider: provider });

            const response = await clientFetch(`/api/auth/${AuthActionIntent.LINK}/${provider}`, {
                method: "DELETE",
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || t.common.error);
            }

            RefreshPage(navigate, location);
            toast.success(result?.message || t.common.success);
        } finally {
            setIsLoading({ value: false, provider: null });
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary">
                    <SettingsIcon aria-hidden className="h-btn-icon w-btn-icon" />
                    {t.settings.manageProviders}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t.settings.linkedProviders}</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>{t.settings.manageProvidersDesc}</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <DialogBody className="grid gap-6">
                    {authProvidersList.map((authProvider) => {
                        let additionalProviderDetails = null;
                        for (const linkedProvider of linkedAuthProviders) {
                            if (getAuthProviderFromString(linkedProvider.providerName) === authProvider.name) {
                                additionalProviderDetails = linkedProvider;
                                break;
                            }
                        }

                        return (
                            <div key={authProvider.name} className="flex flex-wrap items-center justify-between">
                                <div className="grid grid-cols-[min-content_1fr] items-center gap-3">
                                    <i className="flex h-8 w-8 items-center justify-center">{authProvider.icon}</i>

                                    <div className="grid gap-1">
                                        <span className="font-bold leading-none">{Capitalize(authProvider.name)}</span>

                                        {!!additionalProviderDetails && (
                                            <div className="flex min-h-5 items-center gap-2 text-foreground-muted leading-none">
                                                <span className="text-sm">{additionalProviderDetails.providerAccountEmail}</span>

                                                <LinkToProviderProfile
                                                    provider={authProvider.name}
                                                    accountId={additionalProviderDetails.providerAccountId}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {additionalProviderDetails ? (
                                    <Button
                                        variant="secondary-destructive"
                                        size="sm"
                                        disabled={isLoading.value}
                                        onClick={() => removeAuthProvider(getAuthProviderFromString(authProvider.name))}
                                    >
                                        {isLoading.provider === getAuthProviderFromString(authProvider.name) ? (
                                            <LoadingSpinner size="xs" />
                                        ) : (
                                            <Trash2Icon aria-hidden className="h-btn-icon w-btn-icon" />
                                        )}
                                        {t.form.remove}
                                    </Button>
                                ) : (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => {
                                            setReturnUrl(location);
                                            window.location.href = `${Config.BACKEND_URL_PUBLIC}/api/auth/${AuthActionIntent.LINK}/${authProvider.name}?redirect=true`;
                                        }}
                                    >
                                        {isLoading.provider === getAuthProviderFromString(authProvider.name) ? (
                                            <LoadingSpinner size="xs" />
                                        ) : (
                                            <Link2Icon aria-hidden className="h-btn-icon w-btn-icon" />
                                        )}
                                        {t.settings.link}
                                    </Button>
                                )}
                            </div>
                        );
                    })}
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}

interface LinkToProviderProfileProps {
    provider: AuthProvider;
    accountId: string;
}

function LinkToProviderProfile(props: LinkToProviderProfileProps) {
    const [profileUrl, setProfileUrl] = useState<string | null>(null);

    async function fetchUserProfileUrl() {
        if (props.provider === AuthProvider.GITHUB) {
            const res = await clientFetch(`https://api.github.com/user/${props.accountId}`);
            if (!res.ok) return null;
            const data = await resJson<{ html_url: string }>(res);
            if (data) setProfileUrl(data.html_url);
        }
    }

    useEffect(() => {
        fetchUserProfileUrl();
    }, [props.accountId]);

    if (!profileUrl) return null;

    return (
        <TextLink to={profileUrl} target="_blank">
            <ExternalLinkIcon className="h-4 w-4" />
        </TextLink>
    );
}

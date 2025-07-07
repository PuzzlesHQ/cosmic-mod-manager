import RefreshPage from "@app/components/misc/refresh-page";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@app/components/ui/accordion";
import { Button } from "@app/components/ui/button";
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@app/components/ui/dialog";
import { toast } from "@app/components/ui/sonner";
import { LoadingSpinner } from "@app/components/ui/spinner";
import { VisuallyHidden } from "@app/components/ui/visually-hidden";
import { getAuthProviderFromString } from "@app/utils/convertors";
import { Capitalize } from "@app/utils/string";
import { AuthActionIntent, type AuthProvider, type LinkedProvidersListData } from "@app/utils/types";
import { Link2Icon, SettingsIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";
import { authProvidersList, setReturnUrl } from "~/pages/auth/oauth-providers";
import clientFetch from "~/utils/client-fetch";
import Config from "~/utils/config";

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
                        <DialogDescription>Manage login auth provider for your account</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <DialogBody>
                    <Accordion type="multiple" className="w-full">
                        {authProvidersList.map((authProvider) => {
                            let additionalProviderDetails = null;
                            for (const linkedProvider of linkedAuthProviders) {
                                if (getAuthProviderFromString(linkedProvider.providerName) === authProvider.name) {
                                    additionalProviderDetails = linkedProvider;
                                    break;
                                }
                            }

                            return (
                                <AccordionItem key={authProvider.name} value={authProvider.name} className="border-transparent">
                                    <AccordionTrigger className="text-base">
                                        <div className="flex items-center justify-start gap-2">
                                            <i className="flex w-6 items-center justify-start">{authProvider.icon}</i>
                                            {Capitalize(authProvider.name)}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="flex w-full items-center justify-between">
                                        <p className="text-muted-foreground">
                                            {additionalProviderDetails ? (
                                                <span className="font-medium text-foreground">
                                                    {additionalProviderDetails.providerAccountEmail}
                                                </span>
                                            ) : (
                                                t.settings.linkProvider(Capitalize(authProvider.name))
                                            )}
                                        </p>

                                        {additionalProviderDetails ? (
                                            <Button
                                                variant="secondary-destructive"
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
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}

import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Button, CancelButton } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { FormSuccessMessage } from "~/components/ui/form-message";
import { toast } from "~/components/ui/sonner";
import { LoadingSpinner } from "~/components/ui/spinner";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";
import Config from "~/utils/config";
import SessionsPageLink from "./help-link";

export default function DeleteAccountConfirmationCard({ code }: { code: string }) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<{ value: boolean; action: "cancelling" | "confirming" | null }>({
        value: false,
        action: null,
    });
    const [successMessage, setSuccessMessage] = useState("");

    async function confirmAccountDeletion() {
        try {
            if (isLoading.value === true) return;
            setIsLoading({ value: true, action: "confirming" });

            const response = await clientFetch("/api/user", {
                method: "DELETE",
                body: JSON.stringify({ code: code }),
            });

            const result = await response.json();
            if (result?.success === true) {
                return setSuccessMessage(result?.message || t.common.success);
            }

            return toast.error(result?.message || t.common.error);
        } finally {
            setIsLoading({ value: false, action: null });
        }
    }

    async function cancelAccountDeletion() {
        try {
            if (isLoading.value === true) return;
            setIsLoading({ value: true, action: "cancelling" });

            const response = await clientFetch("/api/user/confirmation-action", {
                method: "DELETE",
                body: JSON.stringify({ code: code }),
            });

            const result = await response.json();
            if (result?.success === true) {
                return setSuccessMessage(result?.message || t.common.success);
            }

            return toast.error(result?.message || t.common.error);
        } finally {
            setIsLoading({ value: false, action: null });
        }
    }

    return (
        <>
            <title>{`${t.auth.deleteAccount} - ${Config.SITE_NAME_SHORT}`}</title>
            <meta name="description" content={`Confirm to delete your ${Config.SITE_NAME_SHORT} account`} />

            <Card className="max-w-md">
                <CardHeader>
                    <CardTitle>{t.auth.deleteAccount}</CardTitle>
                </CardHeader>
                {successMessage ? (
                    <CardContent className="items-center justify-center gap-2">
                        <FormSuccessMessage text={successMessage} />
                        <a href="/" className="font-semibold underline-offset-2 hover:underline">
                            {t.common.home}
                        </a>
                    </CardContent>
                ) : (
                    <>
                        <CardContent>
                            <CardDescription>{t.auth.deleteAccountDesc}</CardDescription>
                            <div className="mt-3 flex w-full items-center justify-end gap-panel-cards">
                                <CancelButton
                                    icon={isLoading.action === "cancelling" ? <LoadingSpinner size="xs" /> : null}
                                    onClick={cancelAccountDeletion}
                                    disabled={isLoading.value}
                                />

                                <Button variant="destructive" onClick={confirmAccountDeletion} disabled={isLoading.value}>
                                    {isLoading.action === "confirming" ? (
                                        <LoadingSpinner size="xs" />
                                    ) : (
                                        <Trash2Icon aria-hidden className="h-btn-icon w-btn-icon" />
                                    )}
                                    {t.form.delete}
                                </Button>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <SessionsPageLink />
                        </CardFooter>
                    </>
                )}
            </Card>
        </>
    );
}

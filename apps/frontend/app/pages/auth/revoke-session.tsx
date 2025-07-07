import { FormErrorMessage, FormSuccessMessage } from "@app/components/ui/form-message";
import { toast } from "@app/components/ui/sonner";
import { LoadingSpinner } from "@app/components/ui/spinner";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";

export default function RevokeSessionPage() {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");
    const [searchParams] = useSearchParams();

    async function RevokeSession(code: string) {
        try {
            setIsLoading(true);

            const response = await clientFetch(`/api/auth/sessions/${code}`, {
                method: "DELETE",
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || t.common.error);
            }
            setSuccessMessage(result?.message || t.common.success);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const code = searchParams.get("code");
        if (code) {
            RevokeSession(code);
        }
    }, [searchParams]);

    return (
        <main className="full_page flex w-full items-center justify-center">
            <div className="flex w-full max-w-md items-center justify-center">
                {isLoading ? (
                    <LoadingSpinner />
                ) : successMessage ? (
                    <FormSuccessMessage text={successMessage} className="w-fit" />
                ) : (
                    <FormErrorMessage text={t.common.error} className="w-fit" />
                )}
            </div>
        </main>
    );
}

import { Trash2Icon } from "lucide-react";
import ConfirmDialog from "~/components/confirm-dialog";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/sonner";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";

export default function DeleteAccountDialog() {
    const { t } = useTranslation();

    async function deleteAccount() {
        const response = await clientFetch("/api/user/delete-account", { method: "POST" });
        const result = await response.json();

        if (!response.ok || !result?.success) {
            toast.error(result?.message || t.common.error);
            return;
        }

        toast.success(result?.message || t.common.success);
        return;
    }

    return (
        <ConfirmDialog
            title={t.auth.deleteAccount}
            description={t.settings.sureToDeleteAccount}
            confirmText={t.form.delete}
            variant="destructive"
            onConfirm={deleteAccount}
        >
            <Button variant="destructive">
                <Trash2Icon aria-hidden className="h-btn-icon w-btn-icon" />
                {t.auth.deleteAccount}
            </Button>
        </ConfirmDialog>
    );
}

import type { ProjectDetailsData } from "@app/utils/types/api";
import { Trash2Icon } from "lucide-react";
import ConfirmDialog from "~/components/confirm-dialog";
import RefreshPage from "~/components/misc/refresh-page";
import { Button } from "~/components/ui/button";
import { useNavigate } from "~/components/ui/link";
import { toast } from "~/components/ui/sonner";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";

interface Props {
    projectData: ProjectDetailsData;
    projectSlug: string;
    versionSlug: string;
}

export default function DeleteVersionDialog({ projectData, projectSlug, versionSlug }: Props) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    async function deleteVersion() {
        const response = await clientFetch(`/api/project/${projectSlug}/version/${versionSlug}`, {
            method: "DELETE",
        });
        const result = await response.json();

        if (!response.ok || !result?.success) {
            return toast.error(result?.message || t.common.error);
        }

        RefreshPage(navigate, `/${projectData?.type[0]}/${projectSlug}/versions`);
        return toast.success(result?.message || t.common.success);
    }

    return (
        <ConfirmDialog
            title={t.version.sureToDelete}
            description={t.version.deleteDesc}
            confirmText={t.version.deleteVersion}
            variant="destructive"
            onConfirm={deleteVersion}
        >
            <Button variant="secondary-destructive">
                <Trash2Icon aria-hidden className="h-btn-icon w-btn-icon" />
                {t.form.delete}
            </Button>
        </ConfirmDialog>
    );
}

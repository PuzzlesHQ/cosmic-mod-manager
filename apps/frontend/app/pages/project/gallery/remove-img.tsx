import RefreshPage from "@app/components/misc/refresh-page";
import { toast } from "@app/components/ui/sonner";
import type { ProjectDetailsData } from "@app/utils/types/api";
import { useLocation } from "react-router";
import ConfirmDialog from "~/components/confirm-dialog";
import { useNavigate } from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";

interface Props {
    projectData: ProjectDetailsData;
    children: React.ReactNode;
    id: string;
}

export default function RemoveGalleryImage({ children, id, projectData }: Props) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    async function deleteImage() {
        const response = await clientFetch(`/api/project/${projectData?.slug}/gallery/${id}`, {
            method: "DELETE",
        });

        const result = await response.json();

        if (!response.ok || !result?.success) {
            return toast.error(result?.message || t.common.error);
        }

        RefreshPage(navigate, location);
        return toast.success(result?.message || t.common.success);
    }

    return (
        <ConfirmDialog
            title={t.project.sureToDeleteImg}
            description={t.project.deleteImgDesc}
            confirmText={t.form.delete}
            variant="destructive"
            onConfirm={deleteImage}
        >
            {children}
        </ConfirmDialog>
    );
}

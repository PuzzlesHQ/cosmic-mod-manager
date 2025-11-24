import { disableInteractions, enableInteractions } from "@app/utils/dom";
import { ProjectPublishingStatus, type ProjectType } from "@app/utils/types";
import { useLocation } from "react-router";
import ConfirmDialog from "~/components/confirm-dialog";
import { ProjectStatusIcon } from "~/components/icons";
import MarkdownRenderBox from "~/components/md-editor/md-renderer";
import RefreshPage from "~/components/misc/refresh-page";
import { Button, type ButtonVariants_T } from "~/components/ui/button";
import { useNavigate } from "~/components/ui/link";
import { toast } from "~/components/ui/sonner";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";

interface UpdateProjectStatusProps {
    projectId: string;
    projectName: string;
    projectType: ProjectType;
    prevStatus: ProjectPublishingStatus;
    newStatus: ProjectPublishingStatus;

    trigger: {
        icon?: React.ReactNode;
        text: string;
        className?: string;
    } & ButtonVariants_T;

    dialogConfirmBtn?: {
        icon?: React.ReactNode;
        text?: string;
    } & ButtonVariants_T;
}

export default function UpdateProjectStatusDialog(props: UpdateProjectStatusProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    async function updateStatus(status = ProjectPublishingStatus.APPROVED) {
        disableInteractions();

        const res = await clientFetch(`/api/moderation/project/${props.projectId}`, {
            method: "POST",
            body: JSON.stringify({ status: status }),
        });
        const data = await res.json();

        if (!res.ok || data?.success === false) {
            toast.error(data?.message);
            enableInteractions();
        }

        toast.success(data?.message);
        RefreshPage(navigate, location);
        // TODO: Fix this
        // navigate("/moderation/review");
    }

    return (
        <ConfirmDialog
            title={t.project.updateProjectStatus}
            description={
                <MarkdownRenderBox
                    text={t.project.sureToUpdateStatus(
                        props.projectName,
                        t.navbar[props.projectType],
                        props.prevStatus,
                        props.newStatus,
                    )}
                />
            }
            confirmText={props.dialogConfirmBtn?.text || props.trigger.text}
            confirmIcon={
                props.dialogConfirmBtn?.icon || props.trigger.icon || <ProjectStatusIcon status={props.newStatus} />
            }
            variant={props.dialogConfirmBtn?.variant}
            size={props.dialogConfirmBtn?.size}
            onConfirm={() => {
                return updateStatus(props.newStatus);
            }}
        >
            <Button
                variant={props.trigger.variant}
                size={props.trigger.size || "sm"}
                className={props.trigger.className}
            >
                {props.trigger.icon || <ProjectStatusIcon status={props.newStatus} />}
                {props.trigger.text}
            </Button>
        </ConfirmDialog>
    );
}

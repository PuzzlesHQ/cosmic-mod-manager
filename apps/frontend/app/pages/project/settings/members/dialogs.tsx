import { toast } from "@app/components/ui/sonner";
import type { TeamMember } from "@app/utils/types/api";
import { ArrowRightLeftIcon, UserXIcon } from "lucide-react";
import ConfirmDialog from "~/components/confirm-dialog";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";

interface RemoveMemberDialogProps {
    member: TeamMember;
    refreshData: () => Promise<void>;
    children: React.ReactNode;
}

export function RemoveMemberDialog({ member, refreshData, children }: RemoveMemberDialogProps) {
    const { t } = useTranslation();

    async function removeTeamMember() {
        const res = await clientFetch(`/api/team/${member.teamId}/member/${member.id}`, {
            method: "DELETE",
        });
        const data = await res.json();

        if (!res.ok || !data?.success) {
            return toast.error(data?.message || t.common.error);
        }

        await refreshData();
        return toast.success(t.projectSettings.memberRemoved);
    }
    return (
        <ConfirmDialog
            title={t.projectSettings.removeMember}
            description={t.projectSettings.sureToRemoveMember(member.userName)}
            variant="destructive"
            confirmText={t.projectSettings.removeMember}
            confirmIcon={<UserXIcon aria-hidden className="h-btn-icon w-btn-icon" />}
            onConfirm={removeTeamMember}
        >
            {children}
        </ConfirmDialog>
    );
}

interface TransferOwnershipDialogProps {
    member: TeamMember;
    teamId: string;
    refreshData: () => Promise<void>;
    children: React.ReactNode;
}

export function TransferOwnershipDialog({ member, teamId, refreshData, children }: TransferOwnershipDialogProps) {
    const { t } = useTranslation();

    async function transferOwnership() {
        const res = await clientFetch(`/api/team/${teamId}/owner`, {
            method: "PATCH",
            body: JSON.stringify({ userId: member.userId }),
        });
        const data = await res.json();

        if (!res.ok || !data?.success) {
            return toast.error(data?.message || t.common.error);
        }

        await refreshData();
        return toast.success(data?.message || t.projectSettings.ownershipTransfered);
    }
    return (
        <ConfirmDialog
            title={t.projectSettings.transferOwnership}
            description={t.projectSettings.sureToTransferOwnership(member.userName)}
            confirmText={t.projectSettings.transferOwnership}
            variant="destructive"
            onConfirm={transferOwnership}
            confirmIcon={<ArrowRightLeftIcon aria-hidden className="h-btn-icon w-btn-icon" />}
        >
            {children}
        </ConfirmDialog>
    );
}

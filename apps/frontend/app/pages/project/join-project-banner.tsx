import { CheckIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardTitle } from "~/components/ui/card";
import { toast } from "~/components/ui/sonner";
import { LoadingSpinner } from "~/components/ui/spinner";
import { cn } from "~/components/utils";
import { useTranslation } from "~/locales/provider";
import { acceptTeamInvite, leaveTeam } from "./settings/members/utils";

interface Props {
    teamId: string;
    role: string;
    className?: string;
    refreshData: () => Promise<void>;
    isOrg?: boolean;
}

interface LoadingData {
    value: boolean;
    action: "accept" | "decline" | null;
}

export default function TeamInvitationBanner({ teamId, role, className, refreshData, isOrg }: Props) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<LoadingData>({ value: false, action: null });

    async function handleAcceptInvite() {
        if (isLoading.value) return;
        setIsLoading({ value: true, action: "accept" });

        try {
            const data = await acceptTeamInvite(teamId);
            if (!data?.success) return toast.error(data?.message || t.common.error);

            await refreshData();
            return toast.success(data?.message || t.common.success);
        } finally {
            setIsLoading({ value: false, action: null });
        }
    }

    async function handleDeclineInvite() {
        if (isLoading.value) return;
        setIsLoading({ value: true, action: "decline" });

        try {
            const data = await leaveTeam(teamId);
            if (!data?.success) return toast.error(data?.message || t.common.error);

            await refreshData();
            return toast.success(t.project.declinedInvitation);
        } finally {
            setIsLoading({ value: false, action: null });
        }
    }

    const teamType = isOrg ? t.project.organization : t.project.project;

    return (
        <Card className={cn("flex w-full flex-col gap-4 p-card-surround", className)}>
            <CardTitle className="text-muted-foreground">{t.project.teamInvitationTitle(teamType)}</CardTitle>
            <span className="ProjectDetailsData text-muted-foreground">{t.project.teamInviteDesc(teamType, role)}</span>
            <div className="flex flex-wrap items-center justify-start gap-3">
                <Button className="" size="sm" onClick={handleAcceptInvite} disabled={isLoading.value}>
                    {isLoading.value === true && isLoading.action === "accept" ? (
                        <LoadingSpinner size="xs" />
                    ) : (
                        <CheckIcon aria-hidden className="h-btn-icon w-btn-icon" />
                    )}
                    {t.common.accept}
                </Button>

                <Button
                    className=""
                    size="sm"
                    variant="secondary-destructive"
                    disabled={isLoading.value}
                    onClick={handleDeclineInvite}
                >
                    {isLoading.value === true && isLoading.action === "decline" ? (
                        <LoadingSpinner size="xs" />
                    ) : (
                        <XIcon aria-hidden className="h-btn-icon w-btn-icon" />
                    )}
                    {t.common.decline}
                </Button>
            </div>
        </Card>
    );
}

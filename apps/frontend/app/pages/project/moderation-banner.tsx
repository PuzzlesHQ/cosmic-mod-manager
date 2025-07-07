import { Button } from "@app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@app/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@app/components/ui/popover";
import { MODERATOR_ROLES } from "@app/utils/src/constants/roles";
import { ProjectPublishingStatus } from "@app/utils/types";
import { MoreVerticalIcon, XIcon } from "lucide-react";
import { useProjectData } from "~/hooks/project";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import UpdateProjectStatusDialog from "./update-project-status";

export default function ModerationBanner() {
    const { t } = useTranslation();
    const ctx = useProjectData();
    const session = useSession();

    if (!session?.id || !MODERATOR_ROLES.includes(session.role)) return null;
    if (!ctx.projectData.requestedStatus) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg-plus">{t.moderation.awaitingApproval}</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-row flex-wrap items-center justify-start gap-x-3">
                <UpdateProjectStatusDialog
                    projectId={ctx.projectData.id}
                    projectName={ctx.projectData.name}
                    projectType={ctx.projectData.type[0]}
                    prevStatus={ctx.projectData.status}
                    newStatus={ProjectPublishingStatus.APPROVED}
                    trigger={{
                        text: t.moderation.approve,
                        variant: "default",
                    }}
                    dialogConfirmBtn={{ variant: "default" }}
                />

                <UpdateProjectStatusDialog
                    projectId={ctx.projectData.id}
                    projectName={ctx.projectData.name}
                    projectType={ctx.projectData.type[0]}
                    prevStatus={ctx.projectData.status}
                    newStatus={ProjectPublishingStatus.REJECTED}
                    trigger={{
                        text: t.moderation.reject,
                        variant: "secondary-destructive",
                        icon: <XIcon aria-hidden className="h-btn-icon w-btn-icon" />,
                    }}
                    dialogConfirmBtn={{ variant: "destructive" }}
                />

                <Popover>
                    <PopoverTrigger asChild>
                        <Button size="icon" className="rounded-full" variant="outline">
                            <MoreVerticalIcon aria-hidden className="h-btn-icon w-btn-icon" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit min-w-0 p-1">
                        <UpdateProjectStatusDialog
                            projectId={ctx.projectData.id}
                            projectName={ctx.projectData.name}
                            projectType={ctx.projectData.type[0]}
                            prevStatus={ctx.projectData.status}
                            newStatus={ProjectPublishingStatus.WITHHELD}
                            trigger={{
                                text: t.moderation.withhold,
                                variant: "ghost-destructive",
                            }}
                            dialogConfirmBtn={{ variant: "destructive" }}
                        />
                    </PopoverContent>
                </Popover>
            </CardContent>
        </Card>
    );
}

import { ProjectPublishingStatus } from "@app/utils/types";
import { ProjectStatusIcon } from "~/components/icons";
import { cn } from "~/components/utils";
import type { Locale } from "~/locales/types";
import { LabelledIcon } from "./labelled-icon";
import { TooltipProvider, TooltipTemplate } from "./tooltip";

interface ProjectStatusBadge {
    status: ProjectPublishingStatus;
    t: Locale;
}

export function ProjectStatusBadge(props: ProjectStatusBadge) {
    let colorClass = "";
    switch (props.status) {
        case ProjectPublishingStatus.DRAFT:
            colorClass = "text-foreground-muted bg-raised-background";
            break;
        case ProjectPublishingStatus.APPROVED:
            colorClass = "text-success-fg bg-success-bg";
            break;
        case ProjectPublishingStatus.PROCESSING:
            colorClass = "text-warning-fg bg-warning-bg";
            break;
        case ProjectPublishingStatus.WITHHELD:
        case ProjectPublishingStatus.REJECTED:
            colorClass = "text-error-fg bg-error-bg";
            break;
    }

    return (
        <TooltipProvider>
            <TooltipTemplate content={props.t.moderation.statusDesc[props.status]}>
                <LabelledIcon
                    icon={<ProjectStatusIcon status={props.status} />}
                    className={cn("cursor-help rounded-full px-2 py-1 font-semibold text-sm", colorClass)}
                >
                    {props.t.moderation.status[props.status]}
                </LabelledIcon>
            </TooltipTemplate>
        </TooltipProvider>
    );
}

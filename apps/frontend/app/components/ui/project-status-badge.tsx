import { ProjectStatusDesc, ProjectStatusIcon } from "@app/components/icons";
import { cn } from "@app/components/utils";
import { ProjectPublishingStatus } from "@app/utils/types";
import type { Locale } from "~/locales/types";

interface ProjectStatusBadge {
    status: ProjectPublishingStatus;
    t: Locale;
    title?: boolean;
}

export function ProjectStatusBadge(props: ProjectStatusBadge) {
    let colorClass = "";
    switch (props.status) {
        case ProjectPublishingStatus.DRAFT:
            colorClass = "text-muted-foreground";
            break;
        case ProjectPublishingStatus.APPROVED:
            colorClass = "text-success-foreground";
            break;
        case ProjectPublishingStatus.PROCESSING:
            colorClass = "text-warning-foreground";
            break;
        case ProjectPublishingStatus.WITHHELD:
        case ProjectPublishingStatus.REJECTED:
            colorClass = "text-danger-foreground";
            break;
    }

    return (
        <span
            title={props.title === false ? undefined : ProjectStatusDesc(props.status)}
            className={cn(
                "inline-block gap-x-[0.8ch] font-semibold bg-shallow-background text-sm cursor-help px-2 py-[0.13em] rounded-full",
                colorClass,
            )}
        >
            <ProjectStatusIcon status={props.status} className="mb-[0.1ch]" /> {props.t.moderation.status[props.status]}
        </span>
    );
}

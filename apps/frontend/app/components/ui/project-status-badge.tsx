import { ProjectPublishingStatus } from "@app/utils/types";
import { ProjectStatusDesc, ProjectStatusIcon } from "~/components/icons";
import { cn } from "~/components/utils";
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
        <span
            title={props.title === false ? undefined : ProjectStatusDesc(props.status)}
            className={cn(
                "inline-block cursor-help gap-x-space rounded-full px-2 py-[0.15em] font-semibold text-sm leading-[0]",
                colorClass,
            )}
        >
            <ProjectStatusIcon status={props.status} className="mb-[0.1ch]" /> {props.t.moderation.status[props.status]}
        </span>
    );
}

import { CapitalizeAndFormatString } from "@app/utils/string";
import { VersionReleaseChannel } from "@app/utils/types";
import { FlaskConicalIcon } from "lucide-react";
import { cn } from "~/utils";

interface Props {
    releaseChannel: VersionReleaseChannel | string;
    labelClassName?: string;
    className?: string;
}

export default function ReleaseChannelChip({ releaseChannel, labelClassName, className }: Props) {
    return (
        <div
            className={cn(
                "flex items-center justify-start gap-1.5",
                releaseChannelTextColor(releaseChannel as VersionReleaseChannel),
                className,
            )}
        >
            <div className="h-2 w-2 rounded-full bg-current" />
            <span className={cn("font-semibold text-muted-foreground/90 leading-none", labelClassName)}>
                {CapitalizeAndFormatString(releaseChannel)}
            </span>
        </div>
    );
}

export function ReleaseChannelBadge({ releaseChannel, className }: Props) {
    return (
        <div
            aria-hidden
            className={cn(
                "flex aspect-square h-10 shrink-0 items-center justify-center rounded-full",
                releaseChannelTextColor(releaseChannel as VersionReleaseChannel),
                releaseChannelBackgroundColor(releaseChannel as VersionReleaseChannel),
                className,
            )}
        >
            <ReleaseChannelIcon releaseChannel={releaseChannel as VersionReleaseChannel} />
        </div>
    );
}

function ReleaseChannelIcon({ releaseChannel, className }: Props) {
    switch (releaseChannel) {
        case VersionReleaseChannel.RELEASE:
            return <span className={cn("font-extrabold uppercase", className)}>R</span>;

        case VersionReleaseChannel.BETA:
            return <span className={cn("font-bold text-lg", className)}>β</span>;

        case VersionReleaseChannel.ALPHA:
            return <span className={cn("font-bold text-[1.25rem]", className)}>α</span>;

        case VersionReleaseChannel.DEV:
            return <FlaskConicalIcon aria-hidden className={cn("h-5 w-5", className)} />;

        default:
            return null;
    }
}

export function releaseChannelTextColor(releaseChannel: VersionReleaseChannel) {
    switch (releaseChannel) {
        case VersionReleaseChannel.RELEASE:
            return "!text-blue-500 dark:!text-blue-400";

        case VersionReleaseChannel.BETA:
            return "!text-orange-600 dark:!text-orange-400";

        case VersionReleaseChannel.ALPHA:
        case VersionReleaseChannel.DEV:
            return "!text-danger-foreground";

        default:
            return "";
    }
}

export function releaseChannelBackgroundColor(releaseChannel: VersionReleaseChannel) {
    switch (releaseChannel) {
        case VersionReleaseChannel.RELEASE:
            return "!bg-blue-500/15 dark:!bg-blue-400/15";

        case VersionReleaseChannel.BETA:
            return "!bg-orange-600/15 dark:!bg-orange-400/15";

        case VersionReleaseChannel.ALPHA:
        case VersionReleaseChannel.DEV:
            return "!bg-danger-foreground/15";

        default:
            return "";
    }
}

import { UsersIcon } from "lucide-react";
import { CubeIcon, fallbackOrgIcon, fallbackProjectIcon } from "~/icons";
import { ImgWrapper } from "~/ui/avatar";
import Link from "~/ui/link";
import { cn } from "~/utils";

interface ListItemCardProps {
    vtId: string;
    title: string;
    url: string;
    icon?: string | React.ReactNode;
    description?: string;
    children: React.ReactNode;
    fallbackIcon?: React.ReactNode;
    className?: string;
    viewTransitions?: boolean;
}

export function ListItemCard(props: ListItemCardProps) {
    return (
        <Link
            to={props.url}
            aria-label={props.title}
            className={cn(
                "grid w-full grid-cols-[max-content_1fr] gap-panel-cards rounded-lg bg-background/75 p-card-surround transition-colors hover:bg-background/50",
                props.className,
            )}
        >
            <ImgWrapper
                vtId={props.vtId}
                viewTransitions={props.viewTransitions}
                src={props.icon || ""}
                alt={props.title}
                fallback={props.fallbackIcon}
                className="h-20 w-20 rounded-xl border-shallower-background sm:h-24 sm:w-24 dark:border-shallow-background"
            />

            <div className="flex flex-col items-start justify-start">
                <div className="w-full font-bold text-foreground-bright text-md">{props.title}</div>
                <span className="w-full text-muted-foreground/75 text-sm leading-tight">{props.description}</span>
                <div className="mt-auto flex w-full flex-wrap items-start justify-start gap-x-3 text-extra-muted-foreground">
                    {props.children}
                </div>
            </div>
        </Link>
    );
}

interface OrgListItemCard extends Omit<ListItemCardProps, "children"> {
    members: number;
    membersCount: React.ReactNode;
    t?: {
        count: {
            members: typeof membersCount;
        };
    };
}

export function OrgListItemCard({ members, ...props }: OrgListItemCard) {
    const t = props.t || { count: { members: membersCount } };

    return (
        <ListItemCard {...props} fallbackIcon={fallbackOrgIcon}>
            <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                <UsersIcon aria-hidden className="h-btn-icon w-btn-icon font-medium text-extra-muted-foreground" />
                {t.count.members(members, members)}
            </div>
        </ListItemCard>
    );
}

interface CollectionListItemCard extends Omit<ListItemCardProps, "children"> {
    visibility: React.ReactNode;
    projects: number;
    t?: {
        count: {
            projects: typeof projectsCount;
        };
    };
}

export function CollectionListItemCard(props: CollectionListItemCard) {
    const t = props.t || { count: { projects: projectsCount } };

    return (
        <ListItemCard {...props} fallbackIcon={fallbackProjectIcon}>
            <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                <CubeIcon aria-hidden className="h-btn-icon w-btn-icon font-medium" />
                {t.count.projects(props.projects, props.projects)}
            </div>

            {props.visibility}
        </ListItemCard>
    );
}

function membersCount(count: number, formattedCount: React.ReactNode) {
    switch (count) {
        case 1:
            return [formattedCount, " member"];
        default:
            return [formattedCount, " members"];
    }
}

function projectsCount(count: number, formattedCount: React.ReactNode) {
    switch (count) {
        case 1:
            return [formattedCount, " project"];
        default:
            return [formattedCount, " projects"];
    }
}

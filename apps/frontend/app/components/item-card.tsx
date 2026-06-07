import { UsersIcon } from "lucide-react";
import type React from "react";
import { CubeIcon, fallbackOrgIcon, fallbackProjectIcon } from "~/components/icons";
import { ImgWrapper } from "~/components/ui/avatar";
import Link from "~/components/ui/link";
import { cn } from "~/components/utils";
import { useTranslation } from "~/locales/provider";

interface ListItemCardProps {
    vtId: string;
    title: string;
    url: string;
    icon?: string | React.ReactNode;
    description?: string;
    children: React.ReactNode;
    fallbackIcon?: React.ReactNode;
    className?: string;
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
                src={props.icon || ""}
                alt={props.title}
                fallback={props.fallbackIcon}
                className="h-20 w-20 rounded-xl border-border sm:h-24 sm:w-24"
            />

            <div className="flex flex-col items-start justify-start">
                <div className="w-full font-bold text-foreground-bright text-md">{props.title}</div>
                <span className="w-full text-foreground-muted/75 text-sm leading-tight">{props.description}</span>
                <div className="mt-auto flex w-full flex-wrap items-start justify-start gap-x-3 text-foreground-extra-muted">
                    {props.children}
                </div>
            </div>
        </Link>
    );
}

interface OrgListItemCard extends Omit<ListItemCardProps, "children"> {
    members: number;
}

export function OrgListItemCard({ members, ...props }: OrgListItemCard) {
    const { t } = useTranslation();

    return (
        <ListItemCard {...props} fallbackIcon={fallbackOrgIcon}>
            <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                <UsersIcon aria-hidden className="h-btn-icon w-btn-icon font-medium text-foreground-extra-muted" />
                {t.count.members(members, members)}
            </div>
        </ListItemCard>
    );
}

interface CollectionListItemCard extends Omit<ListItemCardProps, "children"> {
    visibility: React.ReactNode;
    projects: number;
}

export function CollectionListItemCard(props: CollectionListItemCard) {
    const { t } = useTranslation();

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

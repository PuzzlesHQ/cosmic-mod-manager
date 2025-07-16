import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import type { LinkProps } from "react-router";
import { Button, type ButtonProps, buttonVariants } from "~/components/ui/button";
import Link from "~/components/ui/link";
import { cn } from "~/components/utils";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
    return <nav aria-label="pagination" className={cn("mx-auto flex w-full justify-center", className)} {...props} />;
}
Pagination.displayName = "Pagination";

function PaginationContent({ ref, className, ...props }: React.ComponentProps<"ul">) {
    return <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />;
}
PaginationContent.displayName = "PaginationContent";

function PaginationItem({ ref, className, ...props }: React.ComponentProps<"li">) {
    return <li ref={ref} className={cn("", className)} {...props} />;
}
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
    isActive?: boolean;
} & Pick<ButtonProps, "size"> &
    LinkProps;

function PaginationLink({ className, isActive, size = "icon", ...props }: PaginationLinkProps) {
    return (
        <Link
            aria-current={isActive ? "page" : undefined}
            className={cn(
                buttonVariants({
                    variant: isActive ? "default" : "secondary",
                    size,
                }),
                "h-9 transition-none",
                !isActive && "bg-raised-background hover:bg-hover-background",
                className,
            )}
            viewTransition={false}
            preventScrollReset
            {...props}
        />
    );
}
PaginationLink.displayName = "PaginationLink";

function PaginationPrevious({ className, to, ...props }: React.ComponentProps<typeof PaginationLink>) {
    const icon = <ChevronLeftIcon aria-hidden className="h-btn-icon w-btn-icon" />;
    if (!to) {
        return (
            <Button variant="secondary" disabled size="icon" aria-label="Previous page">
                {icon}
            </Button>
        );
    }

    return (
        <PaginationLink
            to={to}
            aria-label="Previous page"
            size="default"
            className={cn("h-iconified-btn w-iconified-btn p-0", className)}
            {...props}
        >
            {icon}
        </PaginationLink>
    );
}
PaginationPrevious.displayName = "PaginationPrevious";

function PaginationNext({ className, to, ...props }: React.ComponentProps<typeof PaginationLink>) {
    const icon = <ChevronRightIcon aria-hidden className="h-btn-icon w-btn-icon" />;
    if (!to) {
        return (
            <Button variant="secondary" disabled size="icon" aria-label="Next page">
                {icon}
            </Button>
        );
    }

    return (
        <PaginationLink
            to={to}
            aria-label="Next page"
            size="default"
            className={cn("h-iconified-btn w-iconified-btn p-0", className)}
            {...props}
        >
            {icon}
        </PaginationLink>
    );
}
PaginationNext.displayName = "PaginationNext";

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            aria-hidden
            className={cn("flex h-iconified-btn w-iconified-btn items-center justify-center", className)}
            {...props}
        >
            <MoreHorizontalIcon aria-hidden className="h-btn-icon w-btn-icon text-foreground-extra-muted" />
            <span className="sr-only">More pages</span>
        </span>
    );
}
PaginationEllipsis.displayName = "PaginationEllipsis";

export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious };

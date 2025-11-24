import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import Link from "~/components/ui/link";
import { cn } from "~/components/utils";

function Breadcrumb({
    ref,
    className,
    ...props
}: React.ComponentProps<"nav"> & {
    separator?: React.ReactNode;
}) {
    return (
        <nav ref={ref} aria-label="breadcrumb" className={cn("max-w-full overflow-x-hidden", className)} {...props} />
    );
}
Breadcrumb.displayName = "Breadcrumb";

function BreadcrumbList({ ref, className, ...props }: React.ComponentProps<"ol">) {
    return (
        <ol
            ref={ref}
            className={cn("flex flex-wrap items-center gap-x-1 break-words text-base text-foreground-muted", className)}
            {...props}
        />
    );
}
BreadcrumbList.displayName = "BreadcrumbList";

function BreadcrumbItem({ ref, className, ...props }: React.ComponentProps<"li">) {
    return <li ref={ref} className={cn("inline-flex items-center gap-x-1", className)} {...props} />;
}
BreadcrumbItem.displayName = "BreadcrumbItem";

function BreadcrumbLink({
    ref,
    asChild,
    className,
    href,
    ...props
}: React.ComponentProps<"a"> & {
    asChild?: boolean;
}) {
    return (
        <Link
            to={href || "#"}
            className={cn("text-accent-text transition-all hover:brightness-110", className)}
            {...props}
        />
    );
}
BreadcrumbLink.displayName = "BreadcrumbLink";

function BreadcrumbPage({ ref, className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            ref={ref}
            aria-disabled="true"
            aria-current="page"
            className={cn("font-normal text-foreground", className)}
            {...props}
        />
    );
}
BreadcrumbPage.displayName = "BreadcrumbPage";

function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<"li">) {
    return (
        <li
            role="presentation"
            aria-hidden="true"
            className={cn("text-foreground-muted [&>svg]:h-btn-icon [&>svg]:w-btn-icon", className)}
            {...props}
        >
            {children ?? <ChevronRightIcon aria-hidden />}
        </li>
    );
}
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            role="presentation"
            aria-hidden="true"
            className={cn("flex h-9 w-9 items-center justify-center", className)}
            {...props}
        >
            <MoreHorizontalIcon aria-hidden className="h-btn-icon w-btn-icon" />
            <span className="sr-only">More</span>
        </span>
    );
}
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";

export {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
};

import { isCurrLinkActive } from "@app/utils/string";
import type { VariantProps } from "class-variance-authority";
import type React from "react";
import type { LinkProps } from "react-router";
import { useNavigate as __useNavigate, Link as RemixLink, useLocation } from "react-router";
import { cn } from "~/utils";
import { buttonVariants } from "./button";

interface CustomLinkProps extends LinkProps {
    ref?: React.ComponentProps<"a">["ref"];
}
export type PrefetchBehavior = "intent" | "render" | "none" | "viewport";

function Link({ ref, ...props }: CustomLinkProps) {
    return <RemixLink ref={ref} {...props} to={props.to} viewTransition={props.viewTransition !== false} />;
}
export default Link;

interface ButtonLinkProps extends Omit<LinkProps, "to"> {
    url: string;
    children: React.ReactNode;
    className?: string;
    exactTailMatch?: boolean;
    activityIndicator?: boolean;
    tabIndex?: number;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    activeClassName?: string;
    preventScrollReset?: boolean;
    ref?: React.ComponentProps<"a">["ref"];
}

export function ButtonLink({
    ref,
    url,
    children,
    className,
    exactTailMatch = true,
    activityIndicator = true,
    activeClassName,
    ...props
}: ButtonLinkProps) {
    const location = useLocation();

    return (
        <Link
            {...props}
            to={url}
            ref={ref}
            className={cn(
                "bg_hover_stagger flex min-h-10 w-full items-center justify-start gap-2 whitespace-nowrap px-4 py-2 font-medium text-muted-foreground hover:bg-shallow-background/60",
                isCurrLinkActive(url, location.pathname, exactTailMatch) &&
                    activityIndicator &&
                    "bg-shallow-background/70 text-foreground",
                isCurrLinkActive(url, location.pathname, exactTailMatch) && `active ${activeClassName}`,
                className,
            )}
        >
            {children}
        </Link>
    );
}

export interface VariantLinkProps extends VariantProps<typeof buttonVariants> {
    children: React.ReactNode;
    url: string;
    className?: string;
    label?: string;
    target?: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void | Promise<void>;
    tabIndex?: number;
    preventScrollReset?: boolean;
    prefetch?: PrefetchBehavior;
    viewTransition?: boolean;
    ref?: React.ComponentProps<"a">["ref"];
}

export function VariantButtonLink({
    ref,
    children,
    url,
    className,
    label,
    variant = "secondary",
    size = "default",
    ...props
}: VariantLinkProps & Omit<CustomLinkProps, "to">) {
    return (
        <Link
            to={url}
            ref={ref}
            className={cn("flex items-center justify-center gap-2 font-medium", buttonVariants({ variant, size }), className)}
            aria-label={label}
            {...props}
        >
            {children}
        </Link>
    );
}

export function useNavigate() {
    return __useNavigate();
}

export enum Prefetch {
    Intent = "intent",
    Render = "render",
    None = "none",
    Viewport = "viewport",
}

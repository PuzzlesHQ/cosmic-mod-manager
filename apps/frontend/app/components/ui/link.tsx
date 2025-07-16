import type React from "react";
import {
    useNavigate as __useNavigate,
    type LinkProps,
    type NavigateFunction,
    type NavigateOptions,
    Link as RemixLink,
    useLocation,
} from "react-router";
import type { VariantProps } from "~/components/types";
import { cn } from "~/components/utils";
import { usePreferences } from "~/hooks/preferences";
import { FormatUrl_WithHintLocale, isCurrLinkActive } from "~/utils/urls";
import { buttonVariants } from "./button";

export enum LinkPrefetchStrategy {
    Intent = "intent",
    Render = "render",
    None = "none",
    Viewport = "viewport",
}

interface CustomLinkProps extends LinkProps {
    ref?: React.ComponentProps<"a">["ref"];
    escapeUrlWrapper?: boolean;
}

export default function Link({ ref, escapeUrlWrapper, ...props }: CustomLinkProps) {
    let to = props.to.toString();
    if (escapeUrlWrapper !== true) to = FormatUrl_WithHintLocale(to);
    const { viewTransitions } = usePreferences();

    return <RemixLink ref={ref} {...props} to={to} viewTransition={viewTransitions !== false} />;
}

export function TextLink(props: React.ComponentProps<typeof Link>) {
    return (
        <Link {...props} className={cn(props.className, "text-foreground-link hover:underline hover:brightness-110")}>
            {props.children}
        </Link>
    );
}

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
                "bg_hover_stagger flex min-h-10 w-full items-center justify-start gap-2 whitespace-nowrap px-4 py-2 font-medium text-foreground-muted hover:bg-hover-background",
                isCurrLinkActive(url, location.pathname, exactTailMatch) &&
                    activityIndicator &&
                    "bg-raised-background text-foreground-bright",
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
    to: string;
    className?: string;
    label?: string;
    target?: string;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void | Promise<void>;
    tabIndex?: number;
    preventScrollReset?: boolean;
    viewTransition?: boolean;
    ref?: React.ComponentProps<"a">["ref"];
}

export function VariantButtonLink({
    ref,
    children,
    to,
    className,
    label,
    variant = "secondary",
    size = "default",
    ...props
}: VariantLinkProps & CustomLinkProps) {
    return (
        <Link
            to={to}
            ref={ref}
            className={cn("flex items-center justify-center gap-2 font-medium", buttonVariants({ variant, size }), className)}
            aria-label={label}
            {...props}
        >
            {children}
        </Link>
    );
}

export function useNavigate(escapeUrlWrapper?: boolean, initOptions?: NavigateOptions) {
    const navigate = __useNavigate();
    const { viewTransitions } = usePreferences();

    function __navigate(to: string, options?: NavigateOptions): void {
        const toUrl = escapeUrlWrapper === true ? to : FormatUrl_WithHintLocale(to);

        navigate(toUrl, { viewTransition: viewTransitions !== false, ...initOptions, ...options });
    }

    return __navigate as NavigateFunction;
}

import type React from "react";
import { useCallback } from "react";
import { Link as RemixLink, useLocation, useNavigate as useNavigate_Original, type LinkProps, type NavigateOptions } from "react-router";
import type { VariantProps } from "~/components/types";
import { cn } from "~/components/utils";
import { usePreferences } from "~/hooks/preferences";
import { useTranslation } from "~/locales/provider";
import { changeHintLocale, isCurrLinkActive } from "~/utils/urls";
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
    const { locale } = useTranslation();
    const { viewTransitions } = usePreferences();

    let to = props.to?.toString().trim() || "#";
    if (escapeUrlWrapper !== true && !to.startsWith("#")) to = changeHintLocale(locale, to);

    return <RemixLink ref={ref} {...props} to={to} viewTransition={viewTransitions !== false} />;
}

export function TextLink(props: React.ComponentProps<typeof Link>) {
    return (
        <Link
            {...props}
            className={cn("text-foreground-link underline-offset-3 hover:underline hover:brightness-110", props.className)}
        >
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

    const isActive = isCurrLinkActive(url, location.pathname, exactTailMatch);

    return (
        <Link
            {...props}
            to={url}
            ref={ref}
            className={cn(
                buttonVariants({ variant: "ghost" }),
                "bg_hover_stagger h-[unset] min-h-10 justify-start whitespace-normal",
                isActive && activityIndicator && "bg-raised-background hover:brightness-95 dark:hover:brightness-110",
                isActive && `active ${activeClassName}`,
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
        <Link to={to} ref={ref} className={cn(buttonVariants({ variant, size }), className)} aria-label={label} {...props}>
            {children}
        </Link>
    );
}

export function useNavigate(dontAlterHintLocale?: boolean, initOptions?: NavigateOptions) {
    const navigate = useNavigate_Original();
    const { locale, formattedLocaleName } = useTranslation();
    const { viewTransitions } = usePreferences();

    useCallback(() => {}, [
        viewTransitions, formattedLocaleName
    ])

    function __navigate(_to: string, options?: NavigateOptions): void {
        const to = _to?.trim() || "#";
        const toUrl = dontAlterHintLocale || to.startsWith("#") ? to : changeHintLocale(locale, to);

        navigate(toUrl, { viewTransition: viewTransitions !== false, ...initOptions, ...options });
    }

    return __navigate;
}

export type NavigateFunction = ReturnType<typeof useNavigate>;

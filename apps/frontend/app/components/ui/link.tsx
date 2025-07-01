import DefaultLink, {
    useNavigate as __useNavigate,
    ButtonLink as DefaultButtonLink,
    VariantButtonLink as DefaultVariantButtonLink,
} from "@app/components/ui/link";
import { cn } from "@app/components/utils";
import type React from "react";
import type { NavigateFunction, NavigateOptions } from "react-router";
import { FormatUrl_WithHintLocale } from "~/utils/urls";

export type PrefetchBehavior = "intent" | "render" | "none" | "viewport";

interface Props extends Omit<React.ComponentProps<typeof DefaultLink>, "viewTransitions"> {
    escapeUrlWrapper?: boolean;
}

export default function Link({ ref, escapeUrlWrapper, ...props }: Props) {
    let to = props.to;
    if (escapeUrlWrapper !== true) to = FormatUrl_WithHintLocale(to.toString());

    return <DefaultLink {...props} ref={ref} to={to} />;
}

export function TextLink({ ref, escapeUrlWrapper, ...props }: Props) {
    let to = props.to;
    if (escapeUrlWrapper !== true) to = FormatUrl_WithHintLocale(to.toString());

    return <DefaultLink {...props} ref={ref} to={to} className={cn(props.className, "link_blue hover:underline")} />;
}

type ButtonLinkProps = React.ComponentProps<typeof DefaultButtonLink>;
export function ButtonLink(props: ButtonLinkProps) {
    return <DefaultButtonLink {...props} url={FormatUrl_WithHintLocale(props.url)} />;
}

type VariantButtonLinkProps = React.ComponentProps<typeof DefaultVariantButtonLink>;
export function VariantButtonLink(props: VariantButtonLinkProps) {
    return <DefaultVariantButtonLink {...props} url={FormatUrl_WithHintLocale(props.url)} />;
}

export function useNavigate(escapeUrlWrapper?: boolean, initOptions?: NavigateOptions) {
    const navigate = __useNavigate();

    function __navigate(to: string, options?: NavigateOptions): void {
        const toUrl = escapeUrlWrapper === true ? to : FormatUrl_WithHintLocale(to);

        navigate(toUrl, { viewTransition: true, ...initOptions, ...options });
    }

    return __navigate as NavigateFunction;
}

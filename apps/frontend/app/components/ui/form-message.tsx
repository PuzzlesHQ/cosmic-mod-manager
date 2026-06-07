import { CheckCheckIcon, TriangleAlertIcon } from "lucide-react";
import type React from "react";
import { cn } from "~/components/utils";

type Props = {
    text?: string;
    className?: string;
    labelClassName?: string;
    children?: React.ReactNode;
};

export function FormErrorMessage({ text, className, labelClassName, children }: Props) {
    return (
        <div
            className={cn(
                "flex w-full items-center justify-start gap-2 rounded bg-error-bg px-4 py-2 text-error-fg",
                className,
            )}
        >
            <TriangleAlertIcon aria-hidden className="h-btn-icon w-btn-icon shrink-0" />
            {children ? children : <p className={cn("leading-snug", labelClassName)}>{text}</p>}
        </div>
    );
}

export function FormSuccessMessage({ text, className, labelClassName, children }: Props) {
    return (
        <div
            className={cn(
                "flex w-full items-center justify-start gap-2 rounded bg-success-bg px-4 py-2 text-success-fg",
                className,
            )}
        >
            <CheckCheckIcon aria-hidden className="h-btn-icon w-btn-icon shrink-0" />
            {children ? children : <p className={cn("leading-snug", labelClassName)}>{text}</p>}
        </div>
    );
}

export function FormWarningMessage({ text, className, labelClassName, children }: Props) {
    return (
        <div
            className={cn(
                "flex w-full items-center justify-start gap-2 rounded bg-warning-bg px-4 py-2 text-warning-fg",
                className,
            )}
        >
            <TriangleAlertIcon aria-hidden className="h-btn-icon w-btn-icon shrink-0" />
            {children ? children : <p className={cn("leading-snug", labelClassName)}>{text}</p>}
        </div>
    );
}

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
                "flex w-full items-center justify-start gap-2 rounded bg-danger-background/15 px-4 py-2 text-danger-foreground",
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
                "flex w-full items-center justify-start gap-2 rounded bg-success-background/15 px-4 py-2 text-success-foreground",
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
                "flex w-full items-center justify-start gap-2 rounded bg-warning-background/15 px-4 py-2 text-warning-foreground",
                className,
            )}
        >
            <TriangleAlertIcon aria-hidden className="h-btn-icon w-btn-icon shrink-0" />
            {children ? children : <p className={cn("leading-snug", labelClassName)}>{text}</p>}
        </div>
    );
}

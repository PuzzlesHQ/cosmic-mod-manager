import { CheckCheckIcon, TriangleAlertIcon } from "lucide-react";
import type React from "react";
import { cn } from "~/utils";

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
                "w-full flex items-center justify-start gap-2 px-4 py-2 rounded text-danger-foreground bg-danger-background/15",
                className,
            )}
        >
            <TriangleAlertIcon aria-hidden className="w-btn-icon h-btn-icon shrink-0" />
            {children ? children : <p className={cn("leading-snug", labelClassName)}>{text}</p>}
        </div>
    );
}

export function FormSuccessMessage({ text, className, labelClassName, children }: Props) {
    return (
        <div
            className={cn(
                "w-full flex items-center gap-2 justify-start px-4 py-2 text-success-foreground rounded bg-success-background/15",
                className,
            )}
        >
            <CheckCheckIcon aria-hidden className="w-btn-icon h-btn-icon shrink-0" />
            {children ? children : <p className={cn("leading-snug", labelClassName)}>{text}</p>}
        </div>
    );
}

export function FormWarningMessage({ text, className, labelClassName, children }: Props) {
    return (
        <div
            className={cn(
                "w-full flex items-center gap-2 justify-start px-4 py-2 text-warning-foreground rounded bg-warning-background/15",
                className,
            )}
        >
            <TriangleAlertIcon aria-hidden className="w-btn-icon h-btn-icon shrink-0" />
            {children ? children : <p className={cn("leading-snug", labelClassName)}>{text}</p>}
        </div>
    );
}

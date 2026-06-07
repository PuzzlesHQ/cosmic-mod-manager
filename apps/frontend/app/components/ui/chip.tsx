import type React from "react";
import { cn } from "~/components/utils";
import { type ButtonProps, buttonVariants } from "./button";

interface ChipProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

function Chip({ children, className, style }: ChipProps) {
    return (
        <div
            style={style}
            className={cn(
                "flex min-h-6 items-center gap-1 whitespace-nowrap text-nowrap rounded-full bg-raised-background px-2 py-0.5 font-semibold text-foreground-extra-muted text-sm leading-[0]",
                className,
            )}
        >
            {children}
        </div>
    );
}

export function ChipButton({ ref, variant = "secondary", className, children, id, onClick, style }: ButtonProps) {
    return (
        <button
            ref={ref}
            type="button"
            className={cn(
                buttonVariants({ variant }),
                "h-fit w-fit cursor-pointer rounded-full border-foreground/25 font-semibold text-[0.85rem] text-foreground underline-offset-2",
                "min-h-6 gap-x-1.5 px-2 py-1 leading-[0]",
                className,
            )}
            id={id}
            onClick={onClick}
            style={style}
        >
            {children}
        </button>
    );
}

export default Chip;

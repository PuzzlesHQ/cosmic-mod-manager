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
        <span
            style={style}
            className={cn(
                "flex items-center gap-1 whitespace-nowrap text-nowrap rounded-full bg-raised-background px-2 py-[0.13rem] font-semibold text-foreground-extra-muted text-sm",
                className,
            )}
        >
            {children}
        </span>
    );
}

export function ChipButton({ ref, variant = "secondary", className, children, id, onClick, style }: ButtonProps) {
    return (
        <button
            ref={ref}
            type="button"
            className={cn(
                buttonVariants({ variant }),
                "h-fit w-fit cursor-pointer border-foreground/25 font-semibold text-[0.85rem] text-foreground",
                "gap-x-1.5 px-2 py-0.5",
                variant === "outline" && "py-[calc(0.125rem_-_1px)] pe-1",
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

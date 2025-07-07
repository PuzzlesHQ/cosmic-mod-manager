import type React from "react";
import { forwardRef } from "react";
import { cn } from "~/utils";
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
                "flex items-center gap-1 whitespace-nowrap text-nowrap rounded-full bg-shallow-background/75 px-2 py-[0.13rem] font-semibold text-extra-muted-foreground text-sm",
                className,
            )}
        >
            {children}
        </span>
    );
}

export const ChipButton = forwardRef<HTMLDivElement, ButtonProps>(
    ({ variant = "secondary-inverted", className, children, id, onClick, style }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    buttonVariants({ variant }),
                    "h-fit w-fit cursor-pointer border-shallower-background font-semibold text-[0.85rem] text-foreground",
                    "gap-x-1.5 px-2 py-0.5",
                    variant === "outline" && "py-[calc(0.125rem_-_1px)] pe-1",
                    className,
                )}
                id={id}
                // @ts-ignore
                onClick={onClick}
                style={style}
            >
                {children}
            </div>
        );
    },
);

export default Chip;

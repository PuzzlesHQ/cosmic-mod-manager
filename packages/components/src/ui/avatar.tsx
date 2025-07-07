import type React from "react";
import { cn } from "~/utils";
import { viewTransitionStyleObj } from "~/view-transitions";

interface Props extends React.HTMLAttributes<HTMLElement> {
    src: string | React.ReactNode;
    alt: string;
    className?: string;
    fallback?: React.ReactNode;
    loading?: "eager" | "lazy";
    vtId?: string; // View Transition ID
    viewTransitions?: boolean;
}

export function ImgWrapper({ vtId, src, alt, className, loading, fallback, viewTransitions, ...props }: Props) {
    if (!src || typeof src !== "string") {
        return (
            <div
                {...props}
                className={cn(
                    "flex h-24 w-24 shrink-0 items-center justify-center rounded border border-shallow-background bg-shallow-background",
                    className,
                )}
            >
                {src || fallback}
            </div>
        );
    }

    const style = viewTransitionStyleObj(vtId, viewTransitions);

    return (
        <img
            {...props}
            src={src}
            loading={loading}
            alt={alt}
            className={cn(
                "h-24 w-24 shrink-0 rounded border border-shallow-background bg-shallow-background object-cover shadow shadow-background/50",
                className,
            )}
            style={style}
        />
    );
}

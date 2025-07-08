import type React from "react";
import { useMemo } from "react";
import { cn } from "~/components/utils";
import { viewTransitionStyleObj } from "~/components/view-transitions";

interface Props extends React.HTMLAttributes<HTMLElement> {
    src: string | React.ReactNode;
    alt: string;
    className?: string;
    fallback?: React.ReactNode;
    loading?: "eager" | "lazy";
    vtId?: string; // View Transition ID
}

export function ImgWrapper({ vtId, src, alt, className, loading, fallback, ...props }: Props) {
    const style = useMemo(() => viewTransitionStyleObj(vtId), [vtId]);

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

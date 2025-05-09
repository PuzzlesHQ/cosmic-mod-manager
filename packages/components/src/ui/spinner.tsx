import { useEffect } from "react";
import { cn } from "~/utils";

type LoaderSizes = "xs" | "sm" | "default" | "lg" | "xl" | "2xl";

export function LoadingSpinner({ size }: { size?: LoaderSizes }) {
    let loaderSize = "1.25rem";
    let borderWidth = "0.2rem";

    switch (size) {
        case "xs":
            loaderSize = "1rem";
            borderWidth = "0.15rem";
            break;
        case "sm":
            loaderSize = "1.25rem";
            borderWidth = "0.16rem";
            break;
        case "lg":
            loaderSize = "2.5rem";
            borderWidth = "0.2rem";
            break;
        case "xl":
            loaderSize = "3.25rem";
            borderWidth = "0.25rem";
            break;
        case "2xl":
            loaderSize = "4rem";
            borderWidth = "0.3rem";
            break;
        default:
            loaderSize = "2rem";
            borderWidth = "0.2rem";
            break;
    }

    return (
        <div
            aria-label="Loading..."
            className="size-[var(--size)] [border-width:_var(--border-width)] border-current border-s-transparent border-e-transparent rounded-[999px] animate-spin"
            style={{
                // @ts-ignore
                "--size": loaderSize,
                // @ts-ignore
                "--border-width": borderWidth,
            }}
        />
    );
}

export function WanderingCubesSpinner({ className }: { className?: string }) {
    return (
        <span
            className={cn("wandering_cubes_animation flex items-center justify-center text-muted-foreground", className)}
            role="presentation"
            aria-label="Loading"
        >
            <span className="flex items-center justify-center relative contain-paint size-[var(--frame-size)]">
                <span className="wandering_cube cube1 bg-current" />
                <span className="wandering_cube cube2 bg-current" />
            </span>
        </span>
    );
}

export function FullPageSpinner({ size, className }: { size?: LoaderSizes; className?: string }) {
    return (
        <div className={cn("w-full full_page flex items-center justify-center", className)}>
            <LoadingSpinner size={size} />
        </div>
    );
}

export function FullWidthSpinner({
    size,
    className,
    customSpinner,
}: {
    size?: LoaderSizes;
    className?: string;
    customSpinner?: React.ReactNode;
}) {
    return (
        <div className={cn("w-full flex items-center justify-center py-12", className)}>
            {customSpinner ? customSpinner : <LoadingSpinner size={size} />}
        </div>
    );
}

export function SuspenseFallback({ className, spinnerClassName }: { className?: string; spinnerClassName?: string }) {
    return (
        <div className={cn("w-full flex items-center justify-center py-12", className)}>
            <WanderingCubesSpinner className={spinnerClassName} />
        </div>
    );
}

interface AbsoluteSpinnerProps {
    size?: LoaderSizes;
    className?: string;
    spinnerWrapperClassName?: string;
    backdropBgClassName?: string;
    preventScroll?: boolean;
}

export function AbsolutePositionedSpinner({
    size,
    className,
    spinnerWrapperClassName,
    backdropBgClassName,
    preventScroll = false,
}: AbsoluteSpinnerProps) {
    useEffect(() => {
        if (preventScroll !== true) return;
        document.body.classList.add("no-scrollbar");

        return () => {
            document.body.classList.remove("no-scrollbar");
        };
    }, []);

    return (
        <div
            className={cn(
                "absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-full rounded-xl flex items-center justify-center",
                className,
            )}
        >
            <div
                className={cn(
                    "w-full h-full flex items-center justify-center relative rounded-xl backdrop-blur-[2px]",
                    spinnerWrapperClassName,
                )}
            >
                <div
                    className={cn(
                        "w-full h-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-background opacity-50",
                        backdropBgClassName,
                    )}
                />
                <LoadingSpinner size={size} />
            </div>
        </div>
    );
}

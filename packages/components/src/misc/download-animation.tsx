import { DownloadIcon } from "lucide-react";
import { createContext, useContext, useState } from "react";
import { cn } from "~/utils";

export function DownloadRipple() {
    const { isAnimationPlaying, isVisible } = useContext(DownloadAnimationContext);

    return (
        <div
            aria-hidden
            className={cn(
                "download-animation z-[9999] inset-0 fixed top-0 left-0 w-full h-full grid place-items-center",
                !isAnimationPlaying && "animation-hidden",
                !isVisible && "-z-50",
            )}
        >
            <div className="wrapper w-fit grid place-items-center">
                <RippleCircle className="absolute circle-3 h-[55rem] w-[55rem] opacity-40" />
                <RippleCircle className="absolute circle-2 h-[30rem] w-[30rem] opacity-40" />
                <RippleCircle className="circle-1 h-[15rem] w-[15rem] grid place-items-center">
                    <DownloadIcon aria-hidden className="w-10 h-10 text-foreground" />
                </RippleCircle>
            </div>
        </div>
    );
}

function RippleCircle({ children, className }: { children?: React.ReactNode; className?: string }) {
    return (
        <div className={cn(" rounded-full bg-accent-background/25 border-[0.2rem] border-accent-background", className)}>
            {children}
        </div>
    );
}

interface DownloadAnimationContext {
    show: () => void;
    isAnimationPlaying: boolean;
    isVisible: boolean;
}

export const DownloadAnimationContext = createContext<DownloadAnimationContext>({
    show: () => {},
    isAnimationPlaying: false,
    isVisible: false,
});

let animationTimeoutRef: number | null = null;
let visibilityTimeoutRef: number | null = null;

export function DownloadAnimationProvider({ children }: { children: React.ReactNode }) {
    const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    function showAnimation() {
        if (animationTimeoutRef) window.clearTimeout(animationTimeoutRef);
        if (visibilityTimeoutRef) window.clearTimeout(visibilityTimeoutRef);

        setIsVisible(true);
        setIsAnimationPlaying(true);

        animationTimeoutRef = window.setTimeout(() => {
            setIsAnimationPlaying(false);

            visibilityTimeoutRef = window.setTimeout(() => {
                setIsVisible(false);
            }, 600);
        }, 600);
    }

    return (
        <DownloadAnimationContext.Provider
            value={{
                show: showAnimation,
                isAnimationPlaying: isAnimationPlaying,
                isVisible: isVisible,
            }}
        >
            {children}
        </DownloadAnimationContext.Provider>
    );
}

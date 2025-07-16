import { DownloadIcon } from "lucide-react";
import { createContext, useContext, useState } from "react";
import { toast } from "sonner";
import { cn } from "~/components/utils";

export function DownloadRipple() {
    const { isAnimationPlaying, isVisible } = useContext(FileDownloader);

    return (
        <div
            aria-hidden
            className={cn(
                "download-animation fixed inset-0 top-0 left-0 z-[9999] grid h-full w-full place-items-center",
                !isAnimationPlaying && "animation-hidden",
                !isVisible && "-z-50",
            )}
        >
            <div className="wrapper grid w-fit place-items-center">
                <RippleCircle className="circle-3 absolute h-[55rem] w-[55rem] opacity-40" />
                <RippleCircle className="circle-2 absolute h-[30rem] w-[30rem] opacity-40" />
                <RippleCircle className="circle-1 grid h-[15rem] w-[15rem] place-items-center">
                    <DownloadIcon aria-hidden className="h-10 w-10 text-foreground" />
                </RippleCircle>
            </div>
        </div>
    );
}

function RippleCircle({ children, className }: { children?: React.ReactNode; className?: string }) {
    return <div className={cn("rounded-full border-[0.2rem] border-accent-bg bg-accent-bg/25", className)}>{children}</div>;
}

interface DownloadAnimationContext {
    downloadFile: (fileUrl: string | undefined) => void;
    isAnimationPlaying: boolean;
    isVisible: boolean;
}

export const FileDownloader = createContext<DownloadAnimationContext>({
    downloadFile: (_fileUrl: string | undefined) => {},
    isAnimationPlaying: false,
    isVisible: false,
});

let animationTimeoutRef: number | null = null;
let visibilityTimeoutRef: number | null = null;

export function DownloadAnimationProvider({ children }: { children: React.ReactNode }) {
    const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    function downloadFile(fileUrl: string | undefined) {
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

        if (!fileUrl) {
            toast.error("Empty file download url provided.");
        } else {
            // Trigger the download
            window.location.href = fileUrl;
        }
    }

    return (
        <FileDownloader.Provider
            value={{
                downloadFile: downloadFile,
                isAnimationPlaying: isAnimationPlaying,
                isVisible: isVisible,
            }}
        >
            {children}
        </FileDownloader.Provider>
    );
}

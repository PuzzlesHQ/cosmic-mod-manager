import { DownloadIcon } from "lucide-react";
import { createContext, use, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "~/components/utils";

export function DownloadRipple() {
    const { isAnimationPlaying, isVisible } = use(FileDownloader);

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
    downloadFile: (fileUrl: string | undefined, fileSize: number) => void;
    isAnimationPlaying: boolean;
    isVisible: boolean;
}

export const FileDownloader = createContext<DownloadAnimationContext>({
    downloadFile: (_fileUrl: string | undefined, _fileSize: number) => {},
    isAnimationPlaying: false,
    isVisible: false,
});

export function DownloadProvider({ children }: { children: React.ReactNode }) {
    const animationTimeoutRef = useRef<number | null>(null);
    const visibilityTimeoutRef = useRef<number | null>(null);

    const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    // const [downloadingFiles, setDownloadingFiles] = useState<RunningDownload[]>([]);

    function downloadFile(fileUrl: string | undefined, fileSize: number) {
        if (animationTimeoutRef.current) window.clearTimeout(animationTimeoutRef.current);
        if (visibilityTimeoutRef.current) window.clearTimeout(visibilityTimeoutRef.current);

        setIsVisible(true);
        setIsAnimationPlaying(true);

        animationTimeoutRef.current = window.setTimeout(() => {
            setIsAnimationPlaying(false);

            visibilityTimeoutRef.current = window.setTimeout(() => {
                setIsVisible(false);
            }, 600);
        }, 600);

        if (!fileUrl) return toast.error("Empty file download url provided.");

        downloadFile_TheDefaultWay(fileUrl);
    }

    function downloadFile_TheDefaultWay(fileUrl: string) {
        window.location.href = fileUrl;
    }

    // const downloadsProgress = (
    //     <div className="fixed end-0 bottom-0 z-[9999] grid w-full max-w-md gap-4 p-4">
    //         {downloadingFiles.map((file) => (
    //             <div
    //                 key={file.url}
    //                 className="grid gap-2 overflow-clip rounded border border-raised-background bg-card-background p-2 shadow-md"
    //             >
    //                 <div className="grid grid-cols-[2rem_1fr] gap-2">
    //                     <div className="flex items-center justify-center">
    //                         <DownloadIcon className="h-5 w-5 text-foreground-extra-muted" />
    //                     </div>

    //                     <div>
    //                         <span className="font-medium font-mono text-foreground text-sm">{file.name}</span>
    //                         <p className="ms-auto font-mono text-xs">
    //                             <span>{parseFileSize(file.progress)}</span> <span>/</span> <span>{parseFileSize(file.size)}</span>
    //                         </p>
    //                     </div>
    //                 </div>
    //             </div>
    //         ))}
    //     </div>
    // );

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

// interface RunningDownload {
//     url: string;
//     size: number;
//     name: string;
//     progress: number;
// }

// function getFileName(contentDisposition: string | null) {
//     if (!contentDisposition) return null;

//     return contentDisposition
//         .split(";")
//         .map((part) => part.trim())
//         .find((part) => part.startsWith("filename="))
//         ?.split("=")[1]
//         ?.replace(/"/g, "");
// }

import { MiB } from "@app/utils/number";
import { DownloadIcon } from "lucide-react";
import { createContext, use, useEffect, useRef, useState } from "react";
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

const DOWNLOAD_CHUNK_SIZE = 1 * MiB;

export function DownloadProvider({ children }: { children: React.ReactNode }) {
    const animationTimeoutRef = useRef<number | null>(null);
    const visibilityTimeoutRef = useRef<number | null>(null);

    const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [downloadingFiles, setDownloadingFiles] = useState<RunningDownload[]>([]);

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

        if (fileSize < 19 * MiB) {
            downloadFile_TheDefaultWay(fileUrl);
        } else {
            downloadFileManually(fileUrl);
        }
    }

    function downloadFile_TheDefaultWay(fileUrl: string) {
        window.location.href = fileUrl;
    }

    async function downloadFileManually(fileUrl: string) {
        if (downloadingFiles.some((d) => d.url === fileUrl)) {
            return toast.error("File is already being downloaded.");
        }

        const res = await fetch(fileUrl, { method: "HEAD" });

        const fileName = getFileName(res.headers.get("Content-Disposition")) || fileUrl.split("/").pop() || "downloaded_file";
        if (!res.ok || !res.body) {
            toast.error(`Failed to download file from ${fileUrl}: ${res.status} ${res.statusText}`);
            return;
        }
        const contentLength = Number.parseInt(res.headers.get("Content-Length") || "0", 10);

        const newDownload: RunningDownload = {
            url: fileUrl,
            name: fileName,
            size: contentLength,
            progress: 0,
        };

        setDownloadingFiles((prev) => [...prev, newDownload]);

        try {
            const res = await fetch(fileUrl, { headers: { Range: `bytes=0-${DOWNLOAD_CHUNK_SIZE}` } });
            if (!res.ok || !res.body) {
                throw new Error(`Failed to download file from ${fileUrl}: ${res.statusText}`);
            }

            const reader = res.body.getReader();
            const contentLength = Number.parseInt(res.headers.get("Content-Length") || "0", 10);
            newDownload.size = contentLength;

            let downloadedBytes = 0;
            const chunks: Blob[] = [];

            while (true) {
                const _read = await reader.read();
                if (_read.value) {
                    chunks.push(new Blob([_read.value]));
                    downloadedBytes += _read.value.length;
                    newDownload.progress = (downloadedBytes / contentLength) * 100;
                }

                if (_read.done) break;
                if (downloadedBytes >= contentLength) break;

                setDownloadingFiles((prev) =>
                    prev.map((d) => (d.url === fileUrl ? { ...d, progress: newDownload.progress } : d)),
                );
            }

            reader.releaseLock();

            const blob = new Blob(chunks, { type: res.headers.get("Content-Type") || "application/octet-stream" });
            const link = document.createElement("a");

            link.href = URL.createObjectURL(blob);
            link.download = newDownload.name;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error(error);
            toast.error("Failed to download file");
        } finally {
            setDownloadingFiles((prev) => prev.filter((d) => d.url !== fileUrl));
        }
    }

    useEffect(() => {
        console.log(downloadingFiles);
    }, [downloadingFiles]);

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

interface RunningDownload {
    url: string;
    size: number;
    name: string;
    progress: number;
}

function getFileName(contentDisposition: string | null) {
    if (!contentDisposition) return null;

    return contentDisposition
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith("filename="))
        ?.split("=")[1]
        ?.replace(/"/g, "");
}

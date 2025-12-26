import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from "lucide-react";
import { Toaster as Sonner } from "sonner";

export { toast } from "sonner";

export function Toaster(props: React.ComponentProps<typeof Sonner>) {
    return (
        <Sonner
            theme={undefined}
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast: "text-base group toast group-[.toaster]:bg-card-background group-[.toaster]:text-foreground-bright group-[.toaster]:border group-[.toaster]:border-border",
                    title: "leading-tight text-sm",
                    description: "text-sm !text-foreground-muted",
                    actionButton: "!bg-accent-bg !text-accent-bg-foreground",
                    cancelButton: "!bg-raised-background !text-foreground-muted",
                },
                duration: 10000,
            }}
            icons={{
                success: <CircleCheckIcon className="size-4" />,
                info: <InfoIcon className="size-4" />,
                warning: <TriangleAlertIcon className="size-4" />,
                error: <OctagonXIcon className="size-4" />,
                loading: <Loader2Icon className="size-4 animate-spin" />,
            }}
            {...props}
        />
    );
}

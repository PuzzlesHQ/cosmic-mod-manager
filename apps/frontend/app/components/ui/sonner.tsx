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
                    title: "leading-tight",
                    description: "text-sm group-[.toast]:text-foreground-muted",
                    actionButton: "group-[.toast]:bg-accent-bg group-[.toast]:text-accent-bg-foreground",
                    cancelButton: "group-[.toast]:bg-raised-background group-[.toast]:text-foreground-muted",
                },
                duration: 10000,
            }}
            {...props}
        />
    );
}

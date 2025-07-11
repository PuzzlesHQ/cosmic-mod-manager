import { Toaster as Sonner } from "sonner";

export { toast } from "sonner";

export function Toaster(props: React.ComponentProps<typeof Sonner>) {
    return (
        <Sonner
            theme={undefined}
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast: "text-base group toast group-[.toaster]:bg-card-background group-[.toaster]:text-foreground-bright group-[.toaster]:border group-[.toaster]:border-shallow-background",
                    title: "leading-tight",
                    description: "text-sm group-[.toast]:text-muted-foreground",
                    actionButton:
                        "group-[.toast]:bg-accent-background group-[.toast]:text-white dark:group-[.toast]:text-zinc-900",
                    cancelButton: "group-[.toast]:bg-shallow-background group-[.toast]:text-muted-foreground",
                },
                duration: 10000,
            }}
            {...props}
        />
    );
}

import { XIcon } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "~/components/utils";
import { buttonVariants } from "./button";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

function DialogOverlay({ ref, className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
    return (
        <DialogPrimitive.Overlay
            ref={ref}
            className={cn("backdrop-animation fixed inset-0 z-50 bg-black/90", className)}
            {...props}
        />
    );
}
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

function DialogContent({ ref, className, children, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Content
                ref={ref}
                className={cn(
                    "fixed top-[50%] left-[50%] z-50 grid max-h-full w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 overflow-y-auto border border-border bg-card-background py-card-surround shadow-lg outline-none sm:rounded",
                    "dialog-animation",
                    className,
                )}
                {...props}
            >
                {children}
                <DialogPrimitive.Close
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "absolute inset-e-2.5 top-2.5 rounded p-1.5 disabled:pointer-events-none",
                    )}
                >
                    <XIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                    <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
            </DialogPrimitive.Content>
        </DialogPortal>
    );
}
DialogContent.displayName = DialogPrimitive.Content.displayName;

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("flex flex-col gap-1 border-b border-b-border px-card-surround pb-4 text-start", className)}
            {...props}
        />
    );
}
DialogHeader.displayName = "DialogHeader";

function DialogBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("px-card-surround", className)} {...props} />;
}
DialogBody.displayName = "DialogHeader";

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("flex w-full flex-col-reverse gap-x-2 gap-y-2 sm:flex-row sm:justify-end", className)}
            {...props}
        />
    );
}
DialogFooter.displayName = "DialogFooter";

function DialogTitle({ ref, className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
    return (
        <DialogPrimitive.Title
            ref={ref}
            className={cn("pe-7 font-bold text-foreground text-lg leading-none tracking-tight", className)}
            {...props}
        />
    );
}
DialogTitle.displayName = DialogPrimitive.Title.displayName;

function DialogDescription({ ref, className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
    return (
        <DialogPrimitive.Description
            ref={ref}
            className={cn("pe-8 text-foreground-muted text-sm", className)}
            {...props}
        />
    );
}
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
    Dialog,
    DialogBody,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
};

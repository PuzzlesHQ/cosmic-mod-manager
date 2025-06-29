import { XIcon } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "~/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

function DialogOverlay({ ref, className, ...props }: React.ComponentPropsWithRef<typeof DialogPrimitive.Overlay>) {
    return (
        <DialogPrimitive.Overlay
            ref={ref}
            className={cn(
                "fixed inset-0 z-50 bg-black/90 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                className,
            )}
            {...props}
        />
    );
}
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

function DialogContent({ ref, className, children, ...props }: React.ComponentPropsWithRef<typeof DialogPrimitive.Content>) {
    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Content
                ref={ref}
                className={cn(
                    "fixed left-[50%] top-[50%] z-50 grid w-full max-h-full py-card-surround max-w-lg translate-x-[-50%] translate-y-[-50%] overflow-y-auto gap-4 border border-shallow-background/50 bg-card-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded outline-none",
                    className,
                )}
                {...props}
            >
                {children}
                <DialogPrimitive.Close className="absolute end-3 top-3 rounded p-1.5 transition-opacity text-muted-foreground hover:text-foreground hover:bg-shallow-background disabled:pointer-events-none">
                    <XIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
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
            className={cn("flex flex-col gap-1 px-card-surround pb-4 text-start border-b border-b-shallow-background", className)}
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
            className={cn("w-full flex flex-col-reverse sm:flex-row sm:justify-end gap-form-elements gap-y-2", className)}
            {...props}
        />
    );
}
DialogFooter.displayName = "DialogFooter";

function DialogTitle({ ref, className, ...props }: React.ComponentPropsWithRef<typeof DialogPrimitive.Title>) {
    return (
        <DialogPrimitive.Title
            ref={ref}
            className={cn("text-lg text-foreground font-bold leading-none tracking-tight pe-7", className)}
            {...props}
        />
    );
}
DialogTitle.displayName = DialogPrimitive.Title.displayName;

function DialogDescription({ ref, className, ...props }: React.ComponentPropsWithRef<typeof DialogPrimitive.Description>) {
    return <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground pe-8", className)} {...props} />;
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

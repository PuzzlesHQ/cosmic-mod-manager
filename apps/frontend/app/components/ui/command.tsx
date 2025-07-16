import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";
import type { Dialog as DialogPrimitive } from "radix-ui";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { cn } from "~/components/utils";

function Command({ ref, className, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
    return (
        <CommandPrimitive
            ref={ref}
            className={cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-card-background text-foreground", className)}
            {...props}
        />
    );
}
Command.displayName = CommandPrimitive.displayName;

interface CommandDialogProps extends DialogPrimitive.DialogProps {}

function CommandDialog({ children, ...props }: CommandDialogProps) {
    return (
        <Dialog {...props}>
            <DialogContent className="overflow-hidden p-0">
                <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-foreground-extra-muted [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-btn-icon-md [&_[cmdk-input-wrapper]_svg]:w-btn-icon-md [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-btn-icon-md [&_[cmdk-item]_svg]:w-btn-icon-md">
                    {children}
                </Command>
            </DialogContent>
        </Dialog>
    );
}

function CommandInput({
    ref,
    className,
    wrapperClassName,
    ...props
}: React.ComponentProps<typeof CommandPrimitive.Input> & { wrapperClassName?: string }) {
    return (
        <div className={cn("flex items-center border-border border-b px-3", wrapperClassName)} cmdk-input-wrapper="">
            <SearchIcon aria-hidden className="me-2 h-btn-icon w-btn-icon shrink-0 text-foreground-extra-muted" />
            <CommandPrimitive.Input
                ref={ref}
                className={cn(
                    "fle h-10 w-full rounded-md bg-transparent py-2 text-sm outline-none placeholder:text-foreground-extra-muted disabled:cursor-not-allowed disabled:opacity-50",
                    className,
                )}
                {...props}
            />
        </div>
    );
}

CommandInput.displayName = CommandPrimitive.Input.displayName;

function CommandList({ ref, className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
    return <CommandPrimitive.List ref={ref} className={cn("max-h-[18rem] overflow-y-auto", className)} {...props} />;
}
CommandList.displayName = CommandPrimitive.List.displayName;

function CommandEmpty({ ref, ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) {
    return <CommandPrimitive.Empty ref={ref} className="py-5 text-center text-foreground-muted text-sm" {...props} />;
}
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

function CommandGroup({ ref, className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) {
    return (
        <CommandPrimitive.Group
            ref={ref}
            className={cn(
                "p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-foreground-extra-muted [&_[cmdk-group-heading]]:text-sm",
                className,
            )}
            {...props}
        />
    );
}
CommandGroup.displayName = CommandPrimitive.Group.displayName;

function CommandSeparator({ ref, className, ...props }: React.ComponentProps<typeof CommandPrimitive.Separator>) {
    return <CommandPrimitive.Separator ref={ref} className={cn("-mx-1 h-px bg-border", className)} {...props} />;
}
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

function CommandItem({ ref, className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
    return (
        <CommandPrimitive.Item
            ref={ref}
            className={cn(
                "relative flex cursor-default select-none items-center rounded-md px-2.5 py-1.5 font-medium text-foreground-muted text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-raised-background data-[selected=true]:text-foreground data-[disabled=true]:opacity-50",
                className,
            )}
            {...props}
        />
    );
}
CommandItem.displayName = CommandPrimitive.Item.displayName;

function CommandShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
    return <span className={cn("ms-auto text-foreground-extra-muted text-tiny tracking-widest", className)} {...props} />;
}
CommandShortcut.displayName = "CommandShortcut";

export {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
};

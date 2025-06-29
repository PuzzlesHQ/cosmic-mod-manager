import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";
import type { Dialog as DialogPrimitive } from "radix-ui";
import { Dialog, DialogContent } from "~/ui/dialog";
import { cn } from "~/utils";

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
                <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-extra-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-btn-icon-md [&_[cmdk-input-wrapper]_svg]:w-btn-icon-md [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-btn-icon-md [&_[cmdk-item]_svg]:w-btn-icon-md">
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
        <div className={cn("flex items-center border-b border-shallow-background px-3", wrapperClassName)} cmdk-input-wrapper="">
            <SearchIcon aria-hidden className="me-2 w-btn-icon h-btn-icon shrink-0 text-extra-muted-foreground" />
            <CommandPrimitive.Input
                ref={ref}
                className={cn(
                    "fle h-10 w-full rounded-md bg-transparent py-2 text-sm outline-none placeholder:text-extra-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
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
    return <CommandPrimitive.Empty ref={ref} className="py-5 text-center text-sm text-muted-foreground" {...props} />;
}
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

function CommandGroup({ ref, className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) {
    return (
        <CommandPrimitive.Group
            ref={ref}
            className={cn(
                "p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-extra-muted-foreground",
                className,
            )}
            {...props}
        />
    );
}
CommandGroup.displayName = CommandPrimitive.Group.displayName;

function CommandSeparator({ ref, className, ...props }: React.ComponentProps<typeof CommandPrimitive.Separator>) {
    return <CommandPrimitive.Separator ref={ref} className={cn("-mx-1 h-px bg-shallow-background", className)} {...props} />;
}
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

function CommandItem({ ref, className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
    return (
        <CommandPrimitive.Item
            ref={ref}
            className={cn(
                "relative flex cursor-default select-none text-muted-foreground items-center rounded-md px-2.5 py-1.5 text-sm font-medium outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-shallow-background data-[selected=true]:text-foreground data-[disabled=true]:opacity-50",
                className,
            )}
            {...props}
        />
    );
}
CommandItem.displayName = CommandPrimitive.Item.displayName;

function CommandShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
    return <span className={cn("ms-auto text-tiny tracking-widest text-extra-muted-foreground", className)} {...props} />;
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

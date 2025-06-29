import { CheckIcon, ChevronRightIcon, DotIcon } from "lucide-react";
import { ContextMenu as ContextMenuPrimitive } from "radix-ui";
import type React from "react";
import { cn } from "~/utils";

const ContextMenu = ContextMenuPrimitive.Root;

const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

const ContextMenuGroup = ContextMenuPrimitive.Group;

const ContextMenuPortal = ContextMenuPrimitive.Portal;

const ContextMenuSub = ContextMenuPrimitive.Sub;

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

function ContextMenuSubTrigger({
    ref,
    className,
    inset,
    children,
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean;
}) {
    return (
        <ContextMenuPrimitive.SubTrigger
            ref={ref}
            className={cn(
                "flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none focus:bg-zinc-100 focus:text-zinc-900 data-[state=open]:bg-zinc-100 data-[state=open]:text-zinc-900 dark:focus:bg-zinc-800 dark:focus:text-zinc-50 dark:data-[state=open]:bg-zinc-800 dark:data-[state=open]:text-zinc-50",
                inset && "ps-8",
                className,
            )}
            {...props}
            dir="default"
        >
            {children}
            <ChevronRightIcon aria-hidden className="ms-auto h-4 w-4" />
        </ContextMenuPrimitive.SubTrigger>
    );
}
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

function ContextMenuSubContent({ ref, className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
    return (
        <ContextMenuPrimitive.SubContent
            ref={ref}
            className={cn(
                "z-50 min-w-[8rem] overflow-hidden rounded-md border border-zinc-200 bg-white p-1 text-zinc-950 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50",
                className,
            )}
            {...props}
        />
    );
}
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

function ContextMenuContent({ ref, className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
    return (
        <ContextMenuPrimitive.Portal>
            <ContextMenuPrimitive.Content
                ref={ref}
                className={cn(
                    "z-50 min-w-[8rem] overflow-hidden rounded border border-shallow-background bg-card-background text-foreground p-1 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                    className,
                )}
                {...props}
                // @ts-ignore
                dir="default"
            />
        </ContextMenuPrimitive.Portal>
    );
}
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

function ContextMenuItem({
    ref,
    className,
    inset,
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean;
}) {
    return (
        <ContextMenuPrimitive.Item
            ref={ref}
            className={cn(
                "relative flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none text-muted-foreground focus:bg-shallow-background focus:text-foreground-bright data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                inset && "ps-8",
                className,
            )}
            {...props}
            dir="default"
        />
    );
}
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

function ContextMenuCheckboxItem({
    ref,
    className,
    children,
    checked,
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
    return (
        <ContextMenuPrimitive.CheckboxItem
            ref={ref}
            className={cn(
                "relative flex cursor-default select-none items-center rounded-md py-1.5 ps-8 pe-2 text-sm outline-none focus:bg-shallow-background focus:text-foreground-bright data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                className,
            )}
            checked={checked}
            {...props}
            dir="default"
        >
            <span className="absolute start-2 flex h-3.5 w-3.5 items-center justify-center">
                <ContextMenuPrimitive.ItemIndicator>
                    <CheckIcon aria-hidden className="h-4 w-4" />
                </ContextMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </ContextMenuPrimitive.CheckboxItem>
    );
}
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName;

function ContextMenuRadioItem({
    ref,
    className,
    children,
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
    return (
        <ContextMenuPrimitive.RadioItem
            ref={ref}
            className={cn(
                "relative flex cursor-default select-none items-center rounded-md py-1.5 ps-8 pe-2 text-sm outline-none focus:bg-shallow-background focus:text-foreground-bright data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                className,
            )}
            {...props}
            dir="default"
        >
            <span className="absolute start-2 flex h-3.5 w-3.5 items-center justify-center">
                <ContextMenuPrimitive.ItemIndicator>
                    <DotIcon aria-hidden className="h-4 w-4 fill-current" />
                </ContextMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </ContextMenuPrimitive.RadioItem>
    );
}
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

function ContextMenuLabel({
    ref,
    className,
    inset,
    ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean;
}) {
    return (
        <ContextMenuPrimitive.Label
            ref={ref}
            className={cn("px-2 py-1.5 text-sm font-semibold text-foreground-bright", inset && "ps-8", className)}
            {...props}
        />
    );
}
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

function ContextMenuSeparator({ ref, className, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
    return (
        <ContextMenuPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-shallow-background", className)} {...props} />
    );
}
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

function ContextMenuShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
    return <span className={cn("ms-auto text-xs tracking-widest text-extra-muted-foreground", className)} {...props} />;
}
ContextMenuShortcut.displayName = "ContextMenuShortcut";

export {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuPortal,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
};

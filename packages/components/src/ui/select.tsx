import { CheckIcon, ChevronDown, ChevronUp } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";
import { cn } from "~/utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

function SelectTrigger({
    ref,
    className,
    children,
    noDefaultStyles,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
    noDefaultStyles?: boolean;
}) {
    return (
        <SelectPrimitive.Trigger
            ref={ref}
            className={cn(
                noDefaultStyles !== true && "input_box_styles w-full justify-between gap-2 [&>span]:line-clamp-1",
                "[&_.indicator]:data-[state=open]:rotate-180",
                className,
            )}
            {...props}
            dir="default"
        >
            {children}

            <SelectPrimitive.Icon asChild>
                <ChevronDown className="indicator h-btn-icon w-btn-icon text-muted-foreground transition-transform" />
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
    );
}
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

function SelectScrollUpButton({ ref, className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
    return (
        <SelectPrimitive.ScrollUpButton
            ref={ref}
            className={cn("flex cursor-default items-center justify-center py-1", className)}
            {...props}
        >
            <ChevronUp className="h-4 w-4" />
        </SelectPrimitive.ScrollUpButton>
    );
}
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

function SelectScrollDownButton({ ref, className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
    return (
        <SelectPrimitive.ScrollDownButton
            ref={ref}
            className={cn("flex cursor-default items-center justify-center py-1", className)}
            {...props}
        >
            <ChevronDown className="h-4 w-4" />
        </SelectPrimitive.ScrollDownButton>
    );
}
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

function SelectContent({
    ref,
    className,
    children,
    position = "popper",
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Content
                ref={ref}
                className={cn(
                    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded border border-shallower-background bg-card-background text-foreground data-[state=closed]:animate-out data-[state=open]:animate-in",
                    position === "popper" &&
                        "data-[side=left]:-translate-x-1 data-[side=top]:-translate-y-1 data-[side=right]:translate-x-1 data-[side=bottom]:translate-y-1",
                    className,
                )}
                position={position}
                {...props}
                dir="default"
            >
                <SelectScrollUpButton />
                <SelectPrimitive.Viewport
                    className={cn(
                        "p-1",
                        position === "popper" &&
                            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
                    )}
                >
                    {children}
                </SelectPrimitive.Viewport>
                <SelectScrollDownButton />
            </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
    );
}
SelectContent.displayName = SelectPrimitive.Content.displayName;

function SelectLabel({ ref, className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
    return <SelectPrimitive.Label ref={ref} className={cn("px-2 py-1.5 font-semibold text-sm", className)} {...props} />;
}
SelectLabel.displayName = SelectPrimitive.Label.displayName;

function SelectItem({ ref, className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
    return (
        <SelectPrimitive.Item
            ref={ref}
            className={cn(
                "relative flex w-full cursor-default select-none items-center rounded py-1.5 ps-2 pe-8 text-sm outline-none focus:bg-shallow-background focus:text-foreground-bright data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                className,
            )}
            {...props}
            dir="default"
        >
            <span className="absolute end-2 flex h-btn-icon w-btn-icon items-center justify-center">
                <SelectPrimitive.ItemIndicator>
                    <CheckIcon aria-hidden className="h-btn-icon w-btn-icon" />
                </SelectPrimitive.ItemIndicator>
            </span>
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </SelectPrimitive.Item>
    );
}
SelectItem.displayName = SelectPrimitive.Item.displayName;

function SelectSeparator({ ref, className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
    return (
        <SelectPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-shallower-background", className)} {...props} />
    );
}
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
};

import { Popover as PopoverPrimitive } from "radix-ui";
import { cn } from "~/components/utils";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverAnchor = PopoverPrimitive.Anchor;

function PopoverContent({
    ref,
    className,
    align = "center",
    sideOffset = 4,
    ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
    return (
        <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
                ref={ref}
                align={align}
                sideOffset={sideOffset}
                className={cn(
                    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-full min-w-[18rem] max-w-lg rounded border border-shallow-background bg-card-background p-4 shadow-foreground/25 shadow-lg outline-none data-[state=closed]:animate-out data-[state=open]:animate-in dark:shadow-zinc-950",
                    "flex flex-col gap-1",
                    className,
                )}
                {...props}
            />
        </PopoverPrimitive.Portal>
    );
}
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

const PopoverClose = PopoverPrimitive.Close;

export { Popover, PopoverAnchor, PopoverClose, PopoverContent, PopoverTrigger };

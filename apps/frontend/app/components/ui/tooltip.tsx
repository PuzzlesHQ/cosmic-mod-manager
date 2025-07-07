import { Tooltip as TooltipPrimitive } from "radix-ui";
import { cn } from "~/components/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

function TooltipContent({ ref, className, sideOffset = 4, ...props }: React.ComponentProps<typeof TooltipPrimitive.Content>) {
    return (
        <TooltipPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cn(
                "fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 animate-in overflow-hidden rounded bg-shallow-background px-3 py-1.5 text-foreground text-sm data-[state=closed]:animate-out",
                className,
            )}
            {...props}
        />
    );
}
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };

export function TooltipTemplate({
    asChild = true,
    content,
    children,
    className,
}: {
    asChild?: boolean;
    content: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
            <TooltipContent className={className}>{content}</TooltipContent>
        </Tooltip>
    );
}

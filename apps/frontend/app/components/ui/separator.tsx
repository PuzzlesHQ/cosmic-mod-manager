import { Separator as SeparatorPrimitive } from "radix-ui";
import { cn } from "~/components/utils";

function Separator({
    ref,
    className,
    orientation = "horizontal",
    decorative = true,
    ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
    return (
        <SeparatorPrimitive.Root
            ref={ref}
            decorative={decorative}
            orientation={orientation}
            className={cn(
                "shrink-0 bg-shallow-background",
                orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
                className,
            )}
            {...props}
        />
    );
}
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };

export function DotSeparator({ className }: { className?: string }) {
    return <i className={cn("flex h-1 w-1 flex-shrink-0 rounded-full bg-foreground/40", className)} />;
}

import { Switch as SwitchPrimitives } from "radix-ui";
import { cn } from "~/components/utils";

function Switch({ ref, className, ...props }: React.ComponentProps<typeof SwitchPrimitives.Root>) {
    return (
        <SwitchPrimitives.Root
            className={cn(
                "peer inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-accent-bg data-[state=unchecked]:bg-raised-background",
                className,
            )}
            {...props}
            name="switch"
            ref={ref}
        >
            <SwitchPrimitives.Thumb
                className={cn(
                    "pointer-events-none block h-4 w-4 rounded-full bg-foreground shadow-lg ring-0 transition-transform data-[state=checked]:bg-accent-bg-foreground",
                    "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-1",
                    "rtl:data-[state=checked]:-translate-x-5 rtl:data-[state=unchecked]:-translate-x-1",
                )}
            />
        </SwitchPrimitives.Root>
    );
}
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };

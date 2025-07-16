import { cva, type VariantProps } from "class-variance-authority";
import { Label as LabelPrimitive } from "radix-ui";
import { cn } from "~/components/utils";

const labelVariants = cva(
    "text-md font-semibold text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

export function Label({
    ref,
    className,
    ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>) {
    return <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />;
}
Label.displayName = LabelPrimitive.Root.displayName;

interface LabelElemProps extends React.ComponentProps<"label"> {}

export function InteractiveLabel({ children, htmlFor, ...props }: LabelElemProps) {
    return (
        <label
            {...props}
            htmlFor={htmlFor}
            // biome-ignore lint/a11y/noNoninteractiveTabindex: tabindex 0 to make the label focusable by keyboard
            tabIndex={0}
            onKeyDown={(e: React.KeyboardEvent<HTMLLabelElement>) => {
                if (e.code === "Enter" || e.code === "Space") {
                    e.preventDefault();
                    // @ts-ignore
                    e.target.click();
                }
            }}
        >
            {children}
        </label>
    );
}

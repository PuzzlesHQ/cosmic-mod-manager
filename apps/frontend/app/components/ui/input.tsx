import { cn } from "~/components/utils";

function Input({ ref, className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            type={type}
            className={cn(
                "input_box_styles w-full font-medium text-base file:border-0 file:bg-transparent file:font-medium file:text-sm",
                className,
            )}
            spellCheck={false}
            ref={ref}
            {...props}
        />
    );
}
Input.displayName = "Input";

export { Input };

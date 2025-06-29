import { cn } from "~/utils";

function Input({ ref, className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            type={type}
            className={cn("input_box_styles w-full file:border-0 file:bg-transparent file:text-sm file:font-medium", className)}
            spellCheck={false}
            ref={ref}
            {...props}
        />
    );
}
Input.displayName = "Input";

export { Input };

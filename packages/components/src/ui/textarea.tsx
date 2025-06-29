import { cn } from "~/utils";

function Textarea({ ref, className, ...props }: React.ComponentProps<"textarea">) {
    return <textarea className={cn("input_box_styles w-full flex min-h-20", className)} ref={ref} {...props} />;
}
Textarea.displayName = "Textarea";

export { Textarea };

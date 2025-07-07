import { cn } from "~/components/utils";

function Textarea({ ref, className, ...props }: React.ComponentProps<"textarea">) {
    return <textarea className={cn("input_box_styles flex min-h-20 w-full", className)} ref={ref} {...props} />;
}
Textarea.displayName = "Textarea";

export { Textarea };

import { cn } from "~/components/utils";

interface Props extends React.ComponentProps<"span"> {
    icon: React.ReactNode;
    labelClassName?: string;
    children: string | React.ReactNode;
}

export function LabelledIcon({ icon, children, labelClassName, className, ...props }: Props) {
    return (
        <span className={cn("inline-flex items-center gap-1.5 text-foreground-muted", className)} {...props}>
            {icon}
            <span className={cn("trim-both", labelClassName)}>{children}</span>
        </span>
    );
}

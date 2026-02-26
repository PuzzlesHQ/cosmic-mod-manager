import { cn } from "~/components/utils";

interface Props extends React.ComponentProps<"span"> {
    icon: React.ReactNode;
    wrapperClassName?: string;
    className?: string;
    children: string | React.ReactNode;
}

export function LabelledIcon({ icon, children, wrapperClassName, className, ...props }: Props) {
    return (
        <span className={cn("inline-flex items-center gap-1.5 text-foreground-muted", wrapperClassName)} {...props}>
            {icon}
            <span className={cn("trim-both", className)}>{children}</span>
        </span>
    );
}

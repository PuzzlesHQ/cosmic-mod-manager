import { cn } from "~/components/utils";

interface Props extends React.ComponentProps<"span"> {
    icon?: React.ReactNode;
    labelClassName?: string;
    children: string | React.ReactNode;
}

export function LabelledIcon({ icon, children, labelClassName, className, ...props }: Props) {
    return (
        <span className={cn("inline-flex w-fit items-center gap-1.5", className)} {...props}>
            {icon}
            <span className={cn("trim-both leading-none", labelClassName)}>{children}</span>
        </span>
    );
}

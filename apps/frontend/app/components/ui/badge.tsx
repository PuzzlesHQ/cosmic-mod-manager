import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/components/utils";

export const badgeVariants = cva(
    "focus:keyboard_focus_ring inline-flex items-center rounded border border-raised-background px-2 py-0.5 font-bold text-xs transition-colors",
    {
        variants: {
            variant: {
                default: "border-transparent bg-foreground-bright text-background shadow hover:brightness-110",
                secondary: "border-transparent bg-raised-background text-foreground hover:brightness-110",
                destructive: "border-transparent bg-danger-btn-bg text-danger-btn-fg shadow",
                warning: "border-transparent border-warning-fg text-warning-fg shadow",
                outline: "border-border text-foreground",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

const notificationBadgeVariants = cva(
    "absolute grid grid-cols-1 place-items-center rounded-full p-1 font-mono font-semibold text-xs leading-[0.6]",
    {
        variants: {
            variant: {
                default: "bg-accent-bg text-accent-bg-foreground",
                secondary: "bg-raised-background text-foreground",
            },
            align: {
                left: "-translate-x-1/4 -translate-y-1/4 start-0 top-0",
                right: "-translate-y-1/4 end-0 top-0 translate-x-1/4",
            },
        },
        defaultVariants: {
            variant: "default",
            align: "right",
        },
    },
);

export interface NotificationBadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof notificationBadgeVariants> {}

export function NotificationBadge({ className, variant, align, ...props }: NotificationBadgeProps) {
    return <div className={cn(notificationBadgeVariants({ variant, align }), className)} {...props} />;
}

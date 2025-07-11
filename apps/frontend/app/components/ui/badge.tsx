import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/components/utils";

export const badgeVariants = cva(
    "inline-flex items-center rounded border border-shallow-background px-2 py-0.5 text-xs font-bold transition-colors focus:keyboard_focus_ring",
    {
        variants: {
            variant: {
                default: "border-transparent bg-foreground-bright text-background shadow hover:bg-foreground/90",
                secondary: "border-transparent bg-shallow-background text-foreground hover:bg-shallow-background/80",
                destructive: "border-transparent bg-danger-foreground text-background shadow hover:bg-danger-foreground/80",
                warning: "border-transparent shadow text-warning-foreground border-warning-background",
                outline: "text-foreground border-shallower-background",
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
    "font-mono text-xs leading-[0.6] font-semibold rounded-full p-1 grid grid-cols-1 place-items-center absolute",
    {
        variants: {
            variant: {
                default: "bg-accent-background text-background",
                secondary: "bg-shallower-background/75 text-foreground",
            },
            align: {
                left: "top-0 start-0 -translate-x-1/4 -translate-y-1/4",
                right: "top-0 end-0 translate-x-1/4 -translate-y-1/4",
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

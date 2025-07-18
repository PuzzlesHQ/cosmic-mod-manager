import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { CancelButtonIcon } from "~/components/icons";
import { cn } from "~/components/utils";
import { useTranslation } from "~/locales/provider";

export const buttonVariants = cva(
    "focus-visible:keyboard_focus_ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded font-[500] transition-[color,filter,background-color] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary-btn-bg font-[600] text-primary-btn-fg hover:brightness-90 dark:hover:brightness-115",
                destructive: "bg-danger-btn-bg font-[600] text-danger-btn-fg hover:brightness-90 dark:hover:brightness-115",

                outline: "border border-border text-foreground-muted hover:bg-raised-background hover:text-foreground",

                secondary: "bg-raised-background text-foreground-muted hover:brightness-95 dark:hover:brightness-115",
                "secondary-destructive": "bg-error-bg font-[600] text-error-fg hover:brightness-90 dark:hover:brightness-115",
                "secondary-dark": "bg-card-background text-foreground-muted hover:brightness-95 dark:hover:brightness-115",

                ghost: "text-foreground-muted hover:bg-raised-background hover:text-foreground",
                "ghost-destructive": "text-error-fg hover:bg-error-bg",
                moderation:
                    "bg-moderation-btn-bg font-[600] text-moderation-btn-fg hover:brightness-90 dark:hover:brightness-115",
                link: "whitespace-normal text-wrap text-foreground-link underline-offset-2 hover:underline hover:brightness-110",
            },
            size: {
                default: "h-10 px-4 py-1.5",
                sm: "h-9 px-3",
                lg: "h-11 px-8",
                icon: "h-iconified-btn w-iconified-btn",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

export type ButtonVariants_T = VariantProps<typeof buttonVariants>;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants_T {
    asChild?: boolean;
    icon?: React.ReactNode | null;
    ref?: React.ComponentProps<"button">["ref"];
}

export function Button({ ref, className, variant, size, asChild = false, ...props }: ButtonProps) {
    const Comp = asChild ? Slot.Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
}
Button.displayName = "Button";

export function CancelButton({ variant = "secondary", children, icon, ...props }: ButtonProps) {
    const { t } = useTranslation();

    return (
        <Button variant={variant} {...props}>
            {icon ? icon : <CancelButtonIcon aria-hidden className="h-btn-icon w-btn-icon" />}
            {children || t.form.cancel}
        </Button>
    );
}

import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { CancelButtonIcon } from "~/components/icons";
import { cn } from "~/components/utils";
import { useTranslation } from "~/locales/provider";

export const buttonVariants = cva(
    "inline-flex gap-2 items-center justify-center whitespace-nowrap rounded font-[500] focus-visible:outline-none focus-visible:keyboard_focus_ring disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "font-[600] bg-primary-btn-bg text-primary-btn-fg hover:brightness-90",
                destructive: "font-[600] bg-danger-btn-bg text-danger-btn-fg hover:brightness-90",

                outline: "border border-border text-foreground-muted hover:bg-raised-background hover:brightness-95",

                secondary: "bg-raised-background text-foreground-muted hover:brightness-95",
                "secondary-destructive": "font-[600] text-error-fg bg-error-bg hover:brightness-90",
                "secondary-dark": "text-foreground-muted bg-card-background hover:brightness-95",

                ghost: "text-foreground-muted hover:bg-raised-background hover:brightness-95",
                "ghost-destructive": "text-error-fg hover:bg-error-bg hover:brightness-95",
                moderation: "font-[600] bg-moderation-btn-bg text-moderation-btn-fg hover:brightness-90",
                link: "text-foreground-link underline-offset-4 hover:underline hover:brightness-95",
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

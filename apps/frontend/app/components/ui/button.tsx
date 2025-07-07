import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { CancelButtonIcon } from "~/components/icons";
import { cn } from "~/components/utils";
import { useTranslation } from "~/locales/provider";

export const buttonVariants = cva(
    "inline-flex gap-2 items-center justify-center whitespace-nowrap rounded font-[500] transition-colors focus-visible:outline-none focus-visible:keyboard_focus_ring disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "font-[600] bg-accent-background text-card-background dark:text-background hover:bg-accent-background/90 [--shadow-alpha:0.25]",
                destructive:
                    "font-[600] bg-danger-background text-card-background dark:text-background hover:bg-danger-background/90 [--shadow-alpha:1]",

                outline: "border border-shallow-background hover:bg-shallow-background/70 hover:dark:bg-shallow-background",

                secondary:
                    "bg-shallow-background dark:bg-shallow-background/70 text-muted-foreground hover:bg-shallow-background/70 hover:dark:bg-shallow-background",
                "secondary-no-shadow":
                    "bg-shallow-background dark:bg-shallow-background/70 text-muted-foreground hover:bg-shallow-background/70 hover:dark:bg-shallow-background",
                "secondary-inverted":
                    "text-muted-foreground bg-card-background dark:bg-shallow-background/70 hover:bg-card-background/70 dark:hover:bg-shallow-background",
                "secondary-destructive":
                    "text-danger-foreground bg-shallow-background dark:bg-shallow-background/70 hover:bg-shallow-background/70 hover:dark:bg-shallow-background",
                "secondary-destructive-inverted":
                    "text-danger-foreground bg-card-background dark:bg-shallow-background/70 hover:bg-card-background/70 dark:hover:bg-shallow-background",
                "secondary-dark":
                    "text-muted-foreground bg-card-background dark:bg-card-background/70 hover:bg-card-background/70 hover:dark:bg-card-background",

                ghost: "text-muted-foreground hover:bg-shallow-background hover:dark:bg-shallow-background/75",
                "ghost-no-shadow": "text-muted-foreground hover:bg-shallow-background hover:dark:bg-shallow-background/75",
                "ghost-inverted": "text-muted-foreground hover:bg-card-background dark:hover:bg-shallow-background/75",
                "ghost-destructive": "text-danger-foreground hover:bg-shallow-background dark:hover:bg-shallow-background/75",

                "moderation-submit":
                    "font-medium text-card-background dark:text-background bg-[#e08325] hover:bg-[#ffa347] dark:bg-[#ffa347] dark:hover:bg-[#e08325]",

                link: "text-foreground underline-offset-4 hover:underline",
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

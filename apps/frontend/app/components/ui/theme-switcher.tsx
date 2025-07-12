import type { VariantProps } from "class-variance-authority";
import { MoonIcon, SunIcon } from "~/components/icons";
import { Button, type buttonVariants } from "~/components/ui/button";
import { cn } from "~/components/utils";
import { usePreferences } from "~/hooks/preferences";
import { applyTheme } from "~/hooks/preferences/theme";
import { ThemePreferences } from "~/hooks/preferences/types";

type variant = VariantProps<typeof buttonVariants>["variant"];

interface ThemeSwitchProps {
    className?: string;
    iconWrapperClassName?: string;
    iconClassName?: string;
    iconSize?: string;
    label?: string;
    noDefaultStyle?: boolean;
    variant?: variant;
}
export default function ThemeSwitch({
    className,
    iconWrapperClassName,
    iconClassName,
    iconSize = "45%",
    label,
    noDefaultStyle,
    variant = "ghost",
}: ThemeSwitchProps) {
    const ctx = usePreferences();

    function setNewTheme(theme: ThemePreferences) {
        ctx.updatePreferences({ theme: theme });
    }

    async function transitionTheme(e: React.MouseEvent<HTMLButtonElement>) {
        const newTheme = ctx.toggleTheme();

        document.documentElement.setAttribute("data-view-transition", "theme-switch");
        if (!document.startViewTransition) setNewTheme(newTheme);
        else {
            const x = e.clientX;
            const y = e.clientY;

            document.documentElement.style.setProperty("--click-x", `${x}px`);
            document.documentElement.style.setProperty("--click-y", `${y}px`);

            const transition = document.startViewTransition(() =>
                applyTheme(newTheme, ctx.prefersOLED, document.documentElement),
            );
            await transition.finished;
            setNewTheme(newTheme);
        }
        document.documentElement.removeAttribute("data-view-transition");
    }

    return (
        <Button
            type="button"
            variant={variant}
            title={label || "Change theme"}
            className={cn(
                "overflow-hidden",
                noDefaultStyle !== true && "rounded-full p-0 hover:bg-card-background dark:hover:bg-shallow-background",
                className,
            )}
            onClick={transitionTheme}
        >
            <div
                className={cn(
                    "relative flex aspect-square h-nav-item items-center justify-center rounded-full",
                    iconWrapperClassName,
                )}
            >
                {ctx.activeTheme === ThemePreferences.DARK || ctx.activeTheme === ThemePreferences.OLED ? (
                    <SunIcon size={iconSize} className={iconClassName} />
                ) : (
                    <MoonIcon size={iconSize} className={iconClassName} />
                )}
            </div>
            {label && <p className="whitespace-nowrap text-nowrap pe-4">{label}</p>}
        </Button>
    );
}

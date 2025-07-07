import type { VariantProps } from "class-variance-authority";
import { MoonIcon, SunIcon } from "~/components/icons";
import { ThemeOptions } from "~/components/types";
import { Button, type buttonVariants } from "~/components/ui/button";
import { cn } from "~/components/utils";
import useTheme from "~/hooks/theme";

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
    const { theme, setTheme } = useTheme();

    async function switchTheme() {
        document.documentElement.setAttribute("data-view-transition", "theme-switch");

        if (theme === ThemeOptions.DARK) {
            setTheme(ThemeOptions.LIGHT);
        } else {
            setTheme(ThemeOptions.DARK);
        }
    }

    async function transitionTheme(e: React.MouseEvent<HTMLButtonElement>) {
        if (!document.startViewTransition) return switchTheme();

        const x = e.clientX;
        const y = e.clientY;

        document.documentElement.style.setProperty("--click-x", `${x}px`);
        document.documentElement.style.setProperty("--click-y", `${y}px`);

        const transition = document.startViewTransition(switchTheme);

        await transition.finished;
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
                {theme === ThemeOptions.DARK ? (
                    <SunIcon size={iconSize} className={iconClassName} />
                ) : (
                    <MoonIcon size={iconSize} className={iconClassName} />
                )}
            </div>
            {label && <p className="whitespace-nowrap text-nowrap pe-4">{label}</p>}
        </Button>
    );
}

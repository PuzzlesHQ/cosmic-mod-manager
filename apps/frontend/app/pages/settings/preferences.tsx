import { CatIcon, MonitorIcon, MoonIcon, MoonStarIcon, SunIcon } from "lucide-react";
import type React from "react";
import { ImgWrapper } from "~/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { cn } from "~/components/utils";
import { usePreferences } from "~/hooks/preferences";
import { getEffectiveTheme, getThemeClasses } from "~/hooks/preferences/theme";
import { ThemePreferences } from "~/hooks/preferences/types";
import { useTranslation } from "~/locales/provider";

export default function PreferencesPage() {
    const { t } = useTranslation();
    const ctx = usePreferences();
    const selectedThemeOption = ctx.theme;

    function toggleViewTransitions(checked: boolean) {
        ctx.updatePreferences({ viewTransitions: checked });
    }

    async function updateThemePreference(e: React.MouseEvent<HTMLButtonElement>, theme: ThemePreferences) {
        let newTheme = theme;
        let prefersOLED = ctx.prefersOLED;

        if (theme === ThemePreferences.OLED) {
            newTheme = ThemePreferences.OLED;
            prefersOLED = true;
        } else if (theme === ThemePreferences.DARK) {
            newTheme = ThemePreferences.DARK;
            prefersOLED = false;
        } else {
            newTheme = theme;
        }

        const prevTheme = getEffectiveTheme(ctx.theme, ctx.prefersOLED, true);
        const newEffectiveTheme = getEffectiveTheme(newTheme, prefersOLED, true);

        const isUpdatedThemeDifferent = prevTheme !== newEffectiveTheme;

        document.documentElement.setAttribute("data-view-transition", "theme-switch");
        if (!document.startViewTransition || !isUpdatedThemeDifferent) {
            ctx.updatePreferences({ theme: newTheme, prefersOLED });
        } else {
            const x = e.clientX;
            const y = e.clientY;

            document.documentElement.style.setProperty("--click-x", `${x}px`);
            document.documentElement.style.setProperty("--click-y", `${y}px`);

            const transition = document.startViewTransition(() => {
                ctx.updatePreferences({ theme: newTheme, prefersOLED });
            });
            await transition.finished;
        }
        document.documentElement.removeAttribute("data-view-transition");
    }

    return (
        <>
            <Card useSectionTag className="w-full">
                <CardHeader>
                    <CardTitle>{t.settings.colorTheme}</CardTitle>
                    <CardDescription>{t.settings.colorThemeDesc}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-[repeat(auto-fit,_minmax(14rem,1fr))] gap-panel-cards">
                    {Object.values(ThemePreferences).map((theme) => {
                        const resolvedTheme = theme === ThemePreferences.SYSTEM ? ctx.systemTheme : theme;

                        return (
                            <RadioBtnSelector
                                key={theme}
                                label={t.settings.themes[theme]}
                                checked={selectedThemeOption === theme}
                                onClick={(e) => updateThemePreference(e, theme)}
                            >
                                <ThemePreview theme={resolvedTheme} isActive={theme === ctx.theme} />
                            </RadioBtnSelector>
                        );
                    })}
                </CardContent>
            </Card>

            <Card useSectionTag>
                <CardHeader>
                    <CardTitle>{t.settings.toggleFeatures}</CardTitle>
                    <CardDescription>{t.settings.enableOrDisableFeatures}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex w-full items-center justify-between gap-x-6 gap-y-1">
                        <label htmlFor="view-transitions" className="shrink-[2] grow basis-[min-content]">
                            <span className="my-0 block font-bold text-foreground text-lg">{t.settings.viewTransitions}</span>
                            <span className="my-0 block text-muted-foreground">{t.settings.viewTransitionsDesc}</span>
                        </label>
                        <Switch id="view-transitions" checked={ctx.viewTransitions} onCheckedChange={toggleViewTransitions} />
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

interface RadioBtnSelectorProps {
    checked: boolean;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    label: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

function RadioBtnSelector(props: RadioBtnSelectorProps) {
    return (
        <button type="button" className="grid appearance-none rounded border border-shallow-background" onClick={props.onClick}>
            {props.children}

            <div className="flex items-center gap-2 rounded-b bg-shallow-background px-4 py-2">
                <svg
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={cn(
                        "lucide lucide-circle-dot h-btn-icon w-btn-icon text-muted-foreground",
                        props.checked && "text-accent-background",
                    )}
                    aria-hidden="true"
                >
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"></circle>
                    {props.checked && <circle cx="12" cy="12" r="5.5" stroke="none" fill="currentColor"></circle>}
                </svg>

                <span className={cn("font-semibold text-muted-foreground", props.checked && "text-foreground-bright")}>
                    {props.label} {props.icon}
                </span>
            </div>
        </button>
    );
}

const THEME_ICONS = {
    [ThemePreferences.DARK]: <MoonIcon className="h-5 w-5 text-current" />,
    [ThemePreferences.OLED]: <MoonStarIcon className="h-5 w-5 text-current" />,
    [ThemePreferences.LIGHT]: <SunIcon className="h-5 w-5 text-current" />,
    [ThemePreferences.SYSTEM]: <MonitorIcon className="h-5 w-5 text-current" />,
    [ThemePreferences.CATPPUCCIN_MOCHA]: <CatIcon className="h-5 w-5 text-current" />,
};

function ThemePreview({ theme, isActive }: { theme: ThemePreferences; isActive: boolean }) {
    const classNames = getThemeClasses(theme, false);
    const Icon = THEME_ICONS[theme] || CatIcon;

    return (
        <div className={cn("rounded-t bg-background p-8", ...classNames)}>
            <div className="grid grid-cols-[min-content_1fr] gap-panel-cards rounded bg-card-background p-card-surround">
                <ImgWrapper
                    src={null}
                    alt={theme}
                    fallback={Icon}
                    className={cn(
                        "h-8 w-8",

                        isActive ? "bg-accent-background text-foreground-bright" : "text-accent-background",
                    )}
                />

                <div className="grid grid-cols-1 gap-panel-cards">
                    <div className="h-2 rounded-lg bg-foreground-bright" />
                    <div className="h-2 w-[60%] rounded-lg bg-extra-muted-foreground" />
                </div>
            </div>
        </div>
    );
}

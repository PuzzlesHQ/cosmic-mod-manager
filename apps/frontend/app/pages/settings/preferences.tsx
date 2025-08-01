import { CapitalizeAndFormatString } from "@app/utils/string";
import type React from "react";
import { ThemePreference, Themes } from "~/components/themes/config";
import { ImgWrapper } from "~/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { cn } from "~/components/utils";
import { usePreferences } from "~/hooks/preferences";
import { getThemeClassName, resolveThemePreference } from "~/hooks/preferences/theme";
import { useTranslation } from "~/locales/provider";

export default function PreferencesPage() {
    const { t } = useTranslation();
    const ctx = usePreferences();

    function toggleViewTransitions(checked: boolean) {
        ctx.updatePreferences({ viewTransitions: checked });
    }

    return (
        <>
            <ThemeSwitcher />

            <Card useSectionTag>
                <CardHeader>
                    <CardTitle>{t.settings.toggleFeatures}</CardTitle>
                    <CardDescription>{t.settings.enableOrDisableFeatures}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex w-full items-center justify-between gap-x-6 gap-y-1">
                        <label htmlFor="view-transitions" className="shrink-[2] grow basis-[min-content]">
                            <span className="my-0 block font-bold text-foreground text-lg">{t.settings.viewTransitions}</span>
                            <span className="my-0 block text-foreground-muted">{t.settings.viewTransitionsDesc}</span>
                        </label>
                        <Switch id="view-transitions" checked={ctx.viewTransitions} onCheckedChange={toggleViewTransitions} />
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

export function ThemeSwitcher() {
    const { t } = useTranslation();
    const ctx = usePreferences();
    const selectedThemeOption = ctx.theme;

    async function updateThemePreference(e: React.MouseEvent<HTMLButtonElement>, theme: ThemePreference) {
        let newTheme = theme;
        let prefersOLED = ctx.prefersOLED;

        if (theme === ThemePreference.OLED) {
            newTheme = ThemePreference.OLED;
            prefersOLED = true;
        } else if (theme === ThemePreference.DARK) {
            newTheme = ThemePreference.DARK;
            prefersOLED = false;
        } else {
            newTheme = theme;
        }

        const prevTheme = resolveThemePreference(ctx.theme, ctx.prefersOLED, true);
        const newEffectiveTheme = resolveThemePreference(newTheme, prefersOLED, true);

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
        <Card useSectionTag>
            <CardHeader>
                <CardTitle>{t.settings.colorTheme}</CardTitle>
                <CardDescription>{t.settings.colorThemeDesc}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-[repeat(auto-fit,_minmax(14rem,1fr))] gap-panel-cards">
                {Themes.map((theme) => {
                    const resolvedTheme = theme.name === ThemePreference.SYSTEM ? ctx.systemTheme : theme.name;
                    const label =
                        theme.name === ThemePreference.SYSTEM ? t.settings.system : CapitalizeAndFormatString(theme.name);

                    return (
                        <RadioBtnSelector
                            key={theme.name}
                            label={theme.label || label}
                            checked={selectedThemeOption === theme.name}
                            onClick={(e) => updateThemePreference(e, theme.name)}
                        >
                            <ThemePreview isActive={theme.name === ctx.theme} resolvedTheme={resolvedTheme} />
                        </RadioBtnSelector>
                    );
                })}
            </CardContent>
        </Card>
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
        <button
            type="button"
            className="grid appearance-none overflow-clip rounded border-2 border-border"
            onClick={props.onClick}
        >
            {props.children}

            <div className="flex items-center gap-2 rounded-b bg-raised-background px-4 py-2">
                <svg
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={cn(
                        "lucide lucide-circle-dot h-btn-icon w-btn-icon text-foreground-muted",
                        props.checked && "text-accent-bg",
                    )}
                    aria-hidden="true"
                >
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"></circle>
                    {props.checked && <circle cx="12" cy="12" r="5.5" stroke="none" fill="currentColor"></circle>}
                </svg>

                <span className={cn("font-semibold text-foreground-muted", props.checked && "text-foreground-bright")}>
                    {props.label} {props.icon}
                </span>
            </div>
        </button>
    );
}

function ThemePreview({ isActive, resolvedTheme }: { isActive: boolean; resolvedTheme: ThemePreference }) {
    const classNames = getThemeClassName(resolvedTheme, false);
    const themeObj = Themes.find((t) => t.name === resolvedTheme);

    if (!themeObj) return null;

    return (
        <div className={cn("bg-background p-8", ...classNames)}>
            <div className="grid grid-cols-[min-content_1fr] gap-panel-cards rounded bg-card-background p-card-surround">
                <ImgWrapper
                    src={null}
                    alt={themeObj.label || themeObj.name}
                    fallback={themeObj.icon}
                    className={cn("h-9 w-9", isActive ? "bg-accent-bg text-accent-bg-foreground" : "text-accent-bg")}
                />

                <div className="grid grid-cols-1 content-start gap-panel-cards">
                    <div className="h-2 rounded-lg bg-foreground-bright" />
                    <div className="h-2 w-[60%] rounded-lg bg-foreground-extra-muted" />
                </div>
            </div>
        </div>
    );
}

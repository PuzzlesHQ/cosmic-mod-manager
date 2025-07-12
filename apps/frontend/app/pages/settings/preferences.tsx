import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { cn } from "~/components/utils";
import { usePreferences } from "~/hooks/preferences";
import { getThemeClasses } from "~/hooks/preferences/theme";
import { ThemePreferences } from "~/hooks/preferences/types";
import { useTranslation } from "~/locales/provider";

export default function PreferencesPage() {
    const { t } = useTranslation();
    const ctx = usePreferences();
    const selectedThemeOption = ctx.theme;

    function toggleViewTransitions(checked: boolean) {
        ctx.updatePreferences({ viewTransitions: checked });
    }

    function updateThemePreference(theme: ThemePreferences) {
        if (theme === ThemePreferences.OLED) {
            ctx.updatePreferences({ theme: ThemePreferences.OLED, prefersOLED: true });
        } else if (theme === ThemePreferences.DARK) {
            ctx.updatePreferences({ theme: ThemePreferences.DARK, prefersOLED: false });
        } else {
            ctx.updatePreferences({ theme: theme });
        }
    }

    return (
        <>
            <Card useSectionTag className="w-full">
                <CardHeader>
                    <CardTitle>{t.settings.colorTheme}</CardTitle>
                    <CardDescription>{t.settings.colorThemeDesc}</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-[repeat(auto-fit,_minmax(12rem,1fr))] gap-panel-cards">
                    {Object.values(ThemePreferences).map((option) => {
                        const theme = option === ThemePreferences.SYSTEM ? ctx.systemTheme : option;

                        return (
                            <RadioBtnSelector
                                key={option}
                                label={option}
                                checked={selectedThemeOption === option}
                                onClick={() => updateThemePreference(option)}
                            >
                                <ThemePreview theme={theme} />
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
    onClick: () => void;
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

                <span className={cn("font-semibold text-muted-foreground", props.checked && "text-foreground")}>
                    {props.label} {props.icon}
                </span>
            </div>
        </button>
    );
}

function ThemePreview({ theme }: { theme: ThemePreferences }) {
    const classNames = getThemeClasses(theme, false);

    return (
        <div className={cn("rounded-t bg-background p-8", ...classNames)}>
            <div className="grid grid-cols-[min-content_1fr] gap-panel-cards rounded bg-card-background p-card-surround">
                <div className="size-8 rounded bg-shallower-background" />
                <div className="grid grid-cols-1 gap-panel-cards">
                    <div className="h-2 rounded-lg bg-foreground-bright" />
                    <div className="h-2 w-[60%] rounded-lg bg-extra-muted-foreground" />
                </div>
            </div>
        </div>
    );
}

import { CatIcon, MonitorIcon, MoonIcon, MoonStarIcon, SunIcon } from "lucide-react";

export enum ThemePreference {
    DARK = "dark",
    LIGHT = "light",
    SYSTEM = "system",
    OLED = "oled",
    CATPPUCCIN_MOCHA = "catppuccin-mocha",
}

export enum ThemeVariant {
    DARK = "dark",
    LIGHT = "light",
}

export interface ThemeObj {
    name: ThemePreference;
    label?: string;
    icon: React.ReactNode;
    variant: ThemeVariant | undefined;
}

export const Themes = [
    {
        name: ThemePreference.SYSTEM,
        icon: <MonitorIcon className="h-5 w-5 text-current" />,
        variant: undefined,
    },
    {
        label: "Dark",
        name: ThemePreference.DARK,
        icon: <MoonIcon className="h-5 w-5 text-current" />,
        variant: ThemeVariant.DARK,
    },
    {
        label: "Light",
        name: ThemePreference.LIGHT,
        icon: <SunIcon className="h-5 w-5 text-current" />,
        variant: ThemeVariant.LIGHT,
    },
    {
        label: "OLED",
        name: ThemePreference.OLED,
        icon: <MoonStarIcon className="h-5 w-5 text-current" />,
        variant: ThemeVariant.DARK,
    },
    {
        label: "Catppuccin Mocha",
        name: ThemePreference.CATPPUCCIN_MOCHA,
        icon: <CatIcon className="h-5 w-5 text-current" />,
        variant: ThemeVariant.DARK,
    },
] satisfies ThemeObj[];

export const DefaultTheme = Themes[1];

export function findTheme(name: ThemePreference | undefined) {
    if (!name) return DefaultTheme;
    return Themes.find((t) => t.name === name) || DefaultTheme;
}

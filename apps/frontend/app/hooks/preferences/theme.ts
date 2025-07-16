import { ThemePreferences } from "./types";

export function applyTheme(theme: ThemePreferences, prefersOLED: boolean, doc: HTMLElement, e?: MediaMatchEvent) {
    const classes = getThemeClasses(theme, prefersOLED, e || true);
    applyThemeClasses(classes, doc);
}

type MediaMatchEvent = MediaQueryList | MediaQueryListEvent | true;

export function getEffectiveTheme(themePreference: ThemePreferences, prefersOLED: boolean, e?: MediaMatchEvent) {
    if (themePreference === ThemePreferences.SYSTEM) return getSystemTheme(prefersOLED, e);
    return themePreference;
}

export const MEDIA_PREFERS_LIGHT_THEME = "(prefers-color-scheme: light)";

export function getSystemTheme(prefersOLED: boolean, e?: MediaMatchEvent) {
    let isLight = false;

    // window is undefined during SSR
    if (globalThis?.window && e) {
        const event = e === true ? window.matchMedia(MEDIA_PREFERS_LIGHT_THEME) : e;
        if (e) isLight = event.matches;
    }

    if (isLight) return ThemePreferences.LIGHT;

    if (prefersOLED) return ThemePreferences.OLED;
    else return ThemePreferences.DARK;
}

export function isDark(theme: ThemePreferences) {
    if (theme === ThemePreferences.SYSTEM) {
        return isDark(getSystemTheme(false));
    }

    if (theme === ThemePreferences.DARK || theme === ThemePreferences.OLED) {
        return true;
    } else if (theme === ThemePreferences.LIGHT) {
        return false;
    }
}

// even though 'catppuccin-mocha' doesn't need .dark styles,
// it's there so that tailwind can detect it's a dark type theme
// TODO: Don't rely on tailwind's dark directive to fix theme issues
// Instead have proper colors for each theme and use filters for hover effects
const ThemeClasses = {
    [ThemePreferences.DARK]: ["dark"],
    [ThemePreferences.LIGHT]: ["light"],
    [ThemePreferences.OLED]: ["dark", "oled"],
    [ThemePreferences.CATPPUCCIN_MOCHA]: ["dark", "catppuccin-mocha"],
};

const allThemesClasses = Object.values(ThemeClasses).flat();

export function getThemeClasses(theme: ThemePreferences, prefersOLED: boolean, e?: MediaMatchEvent) {
    if (!theme) return ThemeClasses[ThemePreferences.DARK];

    const effectiveTheme = getEffectiveTheme(theme, prefersOLED, e);
    return ThemeClasses[effectiveTheme] || ThemeClasses[ThemePreferences.DARK];
}

function applyThemeClasses(classes: string[], doc: HTMLElement) {
    if (!doc) throw new Error("Document element is required to apply themes");

    // Remove all existing theme classes
    if (allThemesClasses.length) doc.classList.remove(...allThemesClasses);

    // Add new classes
    if (classes.length) doc.classList.add(...classes);
}

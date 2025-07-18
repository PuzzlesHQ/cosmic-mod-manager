import { findTheme, ThemePreference, ThemeVariant } from "~/components/themes/config";

type MediaMatchEvent = MediaQueryList | MediaQueryListEvent | true;
export const MEDIA_PREFERS_LIGHT_THEME = "(prefers-color-scheme: light)";

export function resolveThemePreference(prefersTheme: ThemePreference, prefersOLED: boolean, e?: MediaMatchEvent) {
    if (prefersTheme !== ThemePreference.SYSTEM) return prefersTheme;

    let isLight = false;
    // window is undefined during SSR
    if (globalThis?.window && e) {
        const event = e === true ? window.matchMedia(MEDIA_PREFERS_LIGHT_THEME) : e;
        if (event) isLight = event.matches;
    }

    if (isLight) return ThemePreference.LIGHT;
    else if (prefersOLED) return ThemePreference.OLED;
    else return ThemePreference.DARK;
}

export function applyTheme(theme: ThemePreference, prefersOLED: boolean, doc: HTMLElement, e?: MediaMatchEvent) {
    const classes = getThemeClassName(theme, prefersOLED, e || true);
    applyThemeClasses(classes, doc);
}

export function getThemeClassName(theme: ThemePreference, prefersOLED: boolean, e?: MediaMatchEvent) {
    const effectiveTheme = resolveThemePreference(theme, prefersOLED, e);
    const themeObj = findTheme(effectiveTheme);

    if (!themeObj.variant) return [themeObj.name];
    return [themeObj.variant, themeObj.name];
}

const allThemesClasses = [...Object.values(ThemeVariant), ...Object.values(ThemePreference)];

function applyThemeClasses(classes: string[], doc: HTMLElement) {
    if (!doc) throw new Error("Document element is required to apply themes");

    // Remove all existing theme classes
    if (allThemesClasses.length) doc.classList.remove(...allThemesClasses);

    // Add new classes
    if (classes.length) doc.classList.add(...classes);
}

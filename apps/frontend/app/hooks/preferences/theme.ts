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

const allThemesClasses = [...Object.values(ThemeVariant), ...Object.values(ThemePreference)];

export function applyTheme(theme: ThemePreference, prefersOLED: boolean, doc: HTMLElement, e?: MediaMatchEvent) {
    if (!doc) throw new Error("Document element is required to apply themes");

    const themeInfo = findTheme(resolveThemePreference(theme, prefersOLED, e || true));

    if (allThemesClasses.length) doc.classList.remove(...allThemesClasses);
    doc.classList.add(themeInfo.name);
    doc.setAttribute("data-theme-variant", themeInfo.variant ?? "undefined");
}

export function isThemeDark(theme: ThemePreference) {
    const themeObj = findTheme(theme);
    return themeObj.variant === ThemeVariant.DARK;
}

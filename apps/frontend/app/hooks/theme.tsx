import React, { useContext, useEffect } from "react";
import { ThemeOptions, type UseThemeProps } from "~/components/types";
import { setUserConfig, useUserConfig } from "./user-config";

const MEDIA = "(prefers-color-scheme: dark)";
export const ThemeContext = React.createContext<UseThemeProps | undefined>(undefined);
const themes = [ThemeOptions.DARK, ThemeOptions.LIGHT];

export function ThemeProvider({ children, initTheme }: { children: React.ReactNode; initTheme: ThemeOptions }): React.ReactNode {
    const context = React.useContext(ThemeContext);

    // Ignore nested context providers, just passthrough children
    if (context) return children;
    return <Theme initTheme={initTheme}>{children}</Theme>;
}

function Theme({ children, initTheme }: { children: React.ReactNode; initTheme: ThemeOptions; storageKey?: string }) {
    const [theme, setThemeState] = React.useState<string>(initTheme);

    const applyTheme = React.useCallback((theme: string) => {
        let resolved = theme;
        if (!resolved) return;

        // If theme is system, resolve it before setting theme
        if (theme === "system") resolved = getSystemTheme();

        const elem = document.documentElement;
        for (const theme_name of themes) {
            elem?.classList.remove(theme_name);
        }

        if (resolved) elem?.classList.add(resolved);
    }, []);

    const setTheme = React.useCallback(
        (value: string | ((theme: string | undefined) => string)) => {
            const newTheme = typeof value === "function" ? value(theme) : value;
            setThemeState(newTheme);

            try {
                setUserConfig({ theme: newTheme as ThemeOptions });
            } catch {}
        },
        [theme],
    );

    useEffect(() => {
        const media = window.matchMedia(MEDIA);

        function handleMediaQuery(e: MediaQueryList | MediaQueryListEvent) {
            const newTheme = e.matches ? ThemeOptions.DARK : ThemeOptions.LIGHT;
            applyTheme(newTheme);
        }

        // Intentionally use deprecated listener methods to support iOS & old browsers
        media.addEventListener("change", handleMediaQuery);
        handleMediaQuery(media);

        return () => media.removeEventListener("change", handleMediaQuery);
    }, []);

    const _currTheme = useUserConfig().theme;
    useEffect(() => {
        if (!theme) return;
        applyTheme(theme);

        if (!_currTheme) setTheme(theme);
    }, [theme]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

function getSystemTheme(e?: MediaQueryList | MediaQueryListEvent) {
    const event = e ? e : window.matchMedia(MEDIA);
    const isDark = event.matches;
    const systemTheme = isDark ? ThemeOptions.DARK : ThemeOptions.LIGHT;
    return systemTheme;
}

const defaultContext: UseThemeProps = { setTheme: (_) => {}, themes: [] };
export default function useTheme() {
    return useContext(ThemeContext) || defaultContext;
}

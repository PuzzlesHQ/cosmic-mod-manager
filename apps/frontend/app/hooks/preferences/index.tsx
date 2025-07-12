import { createContext, use, useEffect, useState } from "react";
import { getUserConfig, saveUserConfig, validateConfig } from "./helpers";
import { applyTheme, getEffectiveTheme, getSystemTheme, MEDIA_PREFERS_LIGHT_THEME } from "./theme";
import { ThemePreferences, type UserPreferences } from "./types";

export const USER_PREFERENCES_NAMESPACE = "user-prefs";

interface UserPrefsContext extends UserPreferences {
    activeTheme: ReturnType<typeof getEffectiveTheme>;
    systemTheme: ThemePreferences;
    isActiveThemeDark: boolean;
    updatePreferences: (updated: Partial<UserPreferences>) => void;
}

const UserPrefsCtx = createContext<UserPrefsContext | null>(null);

export function UserPreferencesProvider({ init, children }: { init: UserPreferences; children: React.ReactNode }) {
    const [config, setConfig_State] = useState<UserPreferences>(init);
    const [systemTheme, setSystemTheme] = useState<ThemePreferences>(getSystemTheme(init.prefersOLED));
    const [activeTheme, setActiveTheme] = useState<UserPrefsContext["activeTheme"]>(
        getEffectiveTheme(init.theme, init.prefersOLED),
    );

    function updatePreferences(updated: Partial<UserPreferences>) {
        const currConfig = getUserConfig();

        const validConfig = validateConfig({
            ...currConfig,
            ...updated,
            viewPrefs: {
                ...currConfig.viewPrefs,
                ...updated.viewPrefs,
            },
        });

        saveUserConfig(validConfig);
        setConfig_State(validConfig);
    }

    function handleMediaQuery(e: MediaQueryList | MediaQueryListEvent) {
        const systemTheme = getSystemTheme(config.prefersOLED, e);
        setSystemTheme(systemTheme);

        if (config.theme === ThemePreferences.SYSTEM) {
            setActiveTheme(systemTheme);
        }
    }

    useEffect(() => {
        applyTheme(activeTheme, config.prefersOLED, document.documentElement);
    }, [activeTheme]);

    useEffect(() => {
        if (config.theme !== ThemePreferences.SYSTEM) {
            setActiveTheme(getEffectiveTheme(config.theme, config.prefersOLED, true));
        }

        const media = window.matchMedia(MEDIA_PREFERS_LIGHT_THEME);
        // Intentionally use deprecated listener methods to support iOS & old browsers
        media.addEventListener("change", handleMediaQuery);
        handleMediaQuery(media);

        return () => {
            media.removeEventListener("change", handleMediaQuery);
        };
    }, [config.theme, config.prefersOLED]);

    return (
        <UserPrefsCtx
            value={{
                ...config,
                activeTheme: activeTheme,
                systemTheme: systemTheme,
                isActiveThemeDark: activeTheme === ThemePreferences.DARK || activeTheme === ThemePreferences.OLED,
                updatePreferences: updatePreferences,
            }}
        >
            {children}
        </UserPrefsCtx>
    );
}

export function usePreferences() {
    const ctx = use(UserPrefsCtx);
    if (!ctx) throw new Error("usePreferences must be used inside a <UserPreferencesProvider>");

    return ctx;
}

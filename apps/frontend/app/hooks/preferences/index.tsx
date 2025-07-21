import { createContext, useContext, useEffect, useState } from "react";
import { ThemePreference } from "~/components/themes/config";
import { getUserConfig, saveUserConfig, validateConfig } from "./helpers";
import { applyTheme, MEDIA_PREFERS_LIGHT_THEME, resolveThemePreference } from "./theme";
import type { UserPreferences } from "./types";

export const USER_PREFERENCES_NAMESPACE = "user-prefs";

interface UserPrefsContext extends UserPreferences {
    resolvedTheme: ReturnType<typeof resolveThemePreference>;
    systemTheme: ThemePreference;
    updatePreferences: (updated: Partial<UserPreferences>) => void;
}

const UserPrefsCtx = createContext<UserPrefsContext | null>(null);

export function UserPreferencesProvider({ init, children }: { init: UserPreferences; children: React.ReactNode }) {
    const [config, setConfig_State] = useState<UserPreferences>(init);
    const [systemTheme, setSystemTheme] = useState<ThemePreference>(
        resolveThemePreference(ThemePreference.SYSTEM, init.prefersOLED),
    );
    const resolvedTheme = resolveThemePreference(config.theme, config.prefersOLED, true);

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
        const systemTheme = resolveThemePreference(ThemePreference.SYSTEM, config.prefersOLED, e);
        setSystemTheme(systemTheme);
    }

    useEffect(() => {
        const media = window.matchMedia(MEDIA_PREFERS_LIGHT_THEME);
        media.addEventListener("change", handleMediaQuery);
        handleMediaQuery(media);

        return () => {
            media.removeEventListener("change", handleMediaQuery);
        };
    }, [config.theme]);

    useEffect(() => {
        applyTheme(resolvedTheme, config.prefersOLED, document.documentElement);
    }, [resolvedTheme]);

    return (
        <UserPrefsCtx
            value={{
                ...config,
                resolvedTheme: resolvedTheme,
                systemTheme: systemTheme,
                updatePreferences: updatePreferences,
            }}
        >
            {children}
        </UserPrefsCtx>
    );
}

export function usePreferences() {
    const ctx = useContext(UserPrefsCtx);
    if (ctx === null) throw new Error("usePreferences must be used inside a <UserPreferencesProvider>");

    return ctx;
}

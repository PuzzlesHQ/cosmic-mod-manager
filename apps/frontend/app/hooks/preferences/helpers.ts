import { getCookie, setCookie } from "@app/utils/cookie";
import type { ProjectType } from "@app/utils/types";
import { ListViewType } from "~/components/misc/search-list-item";
import { USER_PREFERENCES_NAMESPACE } from ".";
import { DEFAULT_LIST_VIEW_PREFS, DEFAULT_USER_CONF, ThemePreferences, type UserPreferences } from "./types";

export function validateConfig(config?: Partial<UserPreferences>) {
    const defaultConf = {
        ...DEFAULT_USER_CONF,
        viewPrefs: { ...DEFAULT_LIST_VIEW_PREFS },
    };

    try {
        if (!config) return defaultConf;

        // Validate theme
        if (config.theme && Object.values(ThemePreferences).includes(config.theme)) {
            defaultConf.theme = config.theme;
        }
        defaultConf.prefersOLED = config.prefersOLED === true;

        // Validate viewTransitions
        defaultConf.viewTransitions = config.viewTransitions === true;

        // Validate viewPrefs
        if (config.viewPrefs) {
            for (const key of Object.keys(config.viewPrefs)) {
                const projectType = key as ProjectType;

                if (isValidViewType(config.viewPrefs[projectType]))
                    defaultConf.viewPrefs[projectType] = config.viewPrefs[projectType];
            }
        }

        // Validate locale
        if (config.locale) defaultConf.locale = config.locale;

        return defaultConf;
    } catch (err) {
        console.error(err);
        return DEFAULT_USER_CONF;
    }
}

function isValidViewType(type: string) {
    return Object.values(ListViewType).includes(type as ListViewType);
}

export function getUserConfig(cookie?: string) {
    const data = getCookie(USER_PREFERENCES_NAMESPACE, cookie);
    if (!data) {
        saveUserConfig(DEFAULT_USER_CONF);
        return DEFAULT_USER_CONF;
    }

    try {
        const config = JSON.parse(decodeURIComponent(data));
        return validateConfig(config);
    } catch {
        // Reset config if invalid
        saveUserConfig(DEFAULT_USER_CONF);
        return DEFAULT_USER_CONF;
    }
}

export function saveUserConfig(config: UserPreferences) {
    setCookie(USER_PREFERENCES_NAMESPACE, encodeURIComponent(JSON.stringify(config)));
}

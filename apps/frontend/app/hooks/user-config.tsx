import { getCookie, setCookie } from "@app/utils/cookie";
import { ProjectType, ThemeOptions } from "@app/utils/types";
import { ViewType } from "~/components/misc/search-list-item";
import { formatLocaleCode } from "~/locales";
import { DefaultLocale } from "~/locales/meta";
import { useRootData } from "./root-data";

export const USER_CONFIG_NAMESPACE = "user-prefs";

const DefaultViewPrefs = {
    [ProjectType.MOD]: ViewType.LIST,
    [ProjectType.DATAMOD]: ViewType.LIST,
    [ProjectType.RESOURCE_PACK]: ViewType.GALLERY,
    [ProjectType.SHADER]: ViewType.GALLERY,
    [ProjectType.MODPACK]: ViewType.LIST,
    [ProjectType.PLUGIN]: ViewType.LIST,
    [ProjectType.WORLD]: ViewType.GALLERY,
};

export interface UserConfig {
    theme: ThemeOptions;
    viewPrefs: typeof DefaultViewPrefs;
    viewTransitions: boolean;
    locale: string;
}

export function useUserConfig() {
    return useRootData().userConfig;
}

export async function getUserConfig(cookie: string) {
    const data = getCookie(USER_CONFIG_NAMESPACE, cookie);
    if (!data) return validateConfig();

    try {
        const config = JSON.parse(decodeURIComponent(data));
        return validateConfig(config);
    } catch {
        // Reset config if invalid
        resetConfig();
        return validateConfig();
    }
}

export async function setUserConfig(config: Partial<UserConfig>) {
    const currConfig = getUserConfig(getCookie(USER_CONFIG_NAMESPACE, undefined) || "");

    const data = encodeURIComponent(JSON.stringify(validateConfig({ ...currConfig, ...config })));
    setCookie(USER_CONFIG_NAMESPACE, data);
}

export async function resetConfig() {
    setCookie(USER_CONFIG_NAMESPACE, encodeURIComponent(JSON.stringify(validateConfig())));
}

function validateConfig(config?: Partial<UserConfig>) {
    const defaultConf = {
        theme: ThemeOptions.DARK,
        viewPrefs: DefaultViewPrefs,
        viewTransitions: false,
        locale: formatLocaleCode(DefaultLocale),
    };

    try {
        if (!config) return defaultConf;

        // Validate theme
        if (config.theme && [ThemeOptions.LIGHT, ThemeOptions.DARK, ThemeOptions.SYSTEM].includes(config.theme)) {
            defaultConf.theme = config.theme;
        }
        // Validate viewTransitions
        if (config.viewTransitions !== undefined) defaultConf.viewTransitions = config.viewTransitions;

        // Validate viewPrefs
        if (config.viewPrefs) {
            for (const item of Object.entries(config.viewPrefs)) {
                const projectType = item[0] as ProjectType;

                if (isValidViewType(config.viewPrefs[projectType]))
                    defaultConf.viewPrefs[projectType] = config.viewPrefs[projectType];
            }
        }

        // Validate locale
        if (config.locale) defaultConf.locale = config.locale;

        return defaultConf;
    } catch (err) {
        if (!config) {
            console.error(err);
            return defaultConf;
        }

        // If config is invalid, reset to default
        return validateConfig();
    }
}

function isValidViewType(type: string) {
    return Object.values(ViewType).includes(type as ViewType);
}

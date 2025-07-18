import { ProjectType } from "@app/utils/types";
import { ListViewType } from "~/components/misc/search-list-item";
import { DefaultTheme, type ThemePreference } from "~/components/themes/config";
import { formatLocaleCode } from "~/locales";
import { DefaultLocale } from "~/locales/meta";

export interface UserPreferences {
    theme: ThemePreference;
    prefersOLED: boolean;

    viewTransitions: boolean;
    locale: string;
    viewPrefs: ListViewPreferences;
}

type ListViewPreferences = typeof DEFAULT_LIST_VIEW_PREFS;

// Defaults
const defaultViewPrefs_const = {
    [ProjectType.MOD]: ListViewType.LIST,
    [ProjectType.DATAMOD]: ListViewType.LIST,
    [ProjectType.RESOURCE_PACK]: ListViewType.GALLERY,
    [ProjectType.SHADER]: ListViewType.GALLERY,
    [ProjectType.MODPACK]: ListViewType.LIST,
    [ProjectType.PLUGIN]: ListViewType.LIST,
    [ProjectType.WORLD]: ListViewType.GALLERY,
} as const;

export const DEFAULT_LIST_VIEW_PREFS = defaultViewPrefs_const as Record<ProjectType, ListViewType>;

export const DEFAULT_USER_CONF: UserPreferences = {
    theme: DefaultTheme.name,
    prefersOLED: false,

    viewTransitions: false,
    locale: formatLocaleCode(DefaultLocale),
    viewPrefs: DEFAULT_LIST_VIEW_PREFS,
};

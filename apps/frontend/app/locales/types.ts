import type default_locale from "~/locales/default/translation";

export interface LocaleMetaData {
    code: string; // es
    name: string; // Spanish
    nativeName: string; // Español
    dir: "ltr" | "rtl";
    fallback?: string;

    // Optional region information (if the locale is regional variant of the language)
    region?: {
        code: string; // ES
        name: string; // Spain
        displayName: string; // España
    };
}

type TranslationReturnType = string | number | React.ReactNode;
type TranslationFunction = (...args: any[]) => TranslationReturnType | TranslationReturnType[] | TranslationReturnType[][];

export interface Translation {
    [key: string]: string | TranslationFunction | Translation;
}

export type Locale = typeof default_locale;

import type en from "~/locales/en/translation";

export interface LocaleMetaData {
    code: string; // es
    name: string; // Spanish
    nativeName: string; // Español
    dir: "ltr" | "rtl";

    // Optional region information (if the locale is regional variant of the language)
    region?: {
        code: string; // ES
        name: string; // Spain
        displayName: string; // España
    };
}

type TranslationReturnType = string | number | React.ReactNode;
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type TranslationFunction = (...args: any[]) => TranslationReturnType | TranslationReturnType[] | TranslationReturnType[][];

export interface Translation {
    [key: string]: string | TranslationFunction | Translation;
}

export type Locale = typeof en;

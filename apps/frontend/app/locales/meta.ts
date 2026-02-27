import { formatLocaleCode } from ".";
import type { LocaleMetaData } from "./types";

const SupportedLocales = defineLocales([
    {
        code: "en",
        name: "English",
        displayName: "English",
        dir: "ltr",
    },
    {
        code: "fr",
        name: "French",
        displayName: "Français",
        dir: "ltr",
    },
    {
        code: "de",
        name: "German",
        displayName: "Deutsch",
        dir: "ltr",
    },
    {
        code: "ja",
        name: "Japanese",
        displayName: "日本語",
        dir: "ltr",
    },
    {
        code: "ru",
        name: "Russian",
        displayName: "Русский",
        dir: "ltr",
    },
    {
        code: "es",
        name: "Spanish",
        displayName: "Español",
        dir: "ltr",
        region: {
            code: "419",
            name: "Latin America",
            displayName: "Latinoamérica",
        },
    },
] as const);

type ExtractLocaleCodes<L> = L extends { code: string }
    ? L extends { region: { code: string } }
        ? `${L["code"]}-${L["region"]["code"]}`
        : L["code"]
    : never;

function defineLocales<const T extends readonly LocaleMetaData[]>(
    locales: T extends Array<infer Item>
        ? (Item & {
              fallback?: ExtractLocaleCodes<T[number]>;
          })[]
        : T,
) {
    return locales;
}

export default SupportedLocales;
export const DefaultLocale = SupportedLocales[0];
export const SupportedLocalesList = SupportedLocales as readonly LocaleMetaData[];

export function GetLocaleMetadata(code: string) {
    return SupportedLocales.find((locale) => locale.code === code || formatLocaleCode(locale) === code);
}

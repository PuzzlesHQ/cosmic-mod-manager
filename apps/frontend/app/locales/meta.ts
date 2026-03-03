import { formatLocaleCode } from "~/locales";
import type { LocaleMetaData } from "~/locales/types";

const SupportedLocales = defineLocales([
    {
        code: "en",
        name: "English",
        displayName: "English",
        dir: "ltr",
        region: {
            code: "GB",
            name: "United Kingdom",
            displayName: "United Kingdom",
        },
    },
    {
        code: "en",
        name: "English",
        displayName: "English",
        dir: "ltr",
        region: {
            code: "US",
            name: "United States",
            displayName: "United States",
        },
        fallbacks: ["en-GB"],
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
export default SupportedLocales;

type ExtractLocaleCodes<L> = L extends { code: string }
    ? L extends { region: { code: string } }
        ? `${L["code"]}-${L["region"]["code"]}`
        : L["code"]
    : never;

function defineLocales<const T extends readonly LocaleMetaData[]>(
    locales: T extends Array<infer Item>
        ? (Item & {
              fallbacks?: ExtractLocaleCodes<T[number]>[];
          })[]
        : T,
) {
    return locales;
}

export const SupportedLocalesList = SupportedLocales as readonly LocaleMetaData[];
export function getMetadataFromLocaleCode(code: string) {
    return SupportedLocales.find((locale) => locale.code === code || formatLocaleCode(locale) === code);
}

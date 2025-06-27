import default_locale from "~/locales/default/translation";
import SupportedLocales, { DefaultLocale, GetLocaleMetadata } from "./meta";
import { fillEmptyKeys } from "./obj-merge";
import type { Locale, LocaleMetaData } from "./types";

export async function getLocale(locale: string, seenLocales: string[] = []): Promise<Locale> {
    if (locale === formatLocaleCode(DefaultLocale)) return default_locale;

    if (seenLocales.includes(locale)) {
        console.error(`Circular fallback detected: ${[...seenLocales, locale].join(" -> ")}`);
        return {} as Locale;
    }
    seenLocales.push(locale);

    const meta = GetLocaleMetadata(locale);
    if (!meta || !meta.fallback || [locale, formatLocaleCode(DefaultLocale)].includes(meta.fallback)) {
        const localeModule = await getLocaleFile(locale);
        return fillEmptyKeys(localeModule.default, default_locale) as Locale;
    } else {
        const [localeModule, fallback] = await Promise.all([getLocaleFile(locale), getLocale(meta.fallback, seenLocales)]);
        return fillEmptyKeys(fillEmptyKeys(localeModule.default, fallback), default_locale) as Locale;
    }
}

function getLocaleFile(locale: string) {
    switch (parseLocale(locale)) {
        case "es-419":
            return import("./es-419/translation");

        case "ru":
            return import("./ru/translation");

        case "de":
            return import("./de/translation");

        case "ja":
            return import("./ja/translation");

        // case "en":
        default:
            return import("./en/translation");
    }
}

export function parseLocale(code: string | undefined | null) {
    for (const locale of SupportedLocales) {
        const localeCode = formatLocaleCode(locale);
        if (localeCode === code) return localeCode;
        if (locale.code === code) return localeCode;
    }

    return formatLocaleCode(DefaultLocale);
}

export function formatLocaleCode(meta: LocaleMetaData) {
    const region = meta.region;
    if (!region?.code) return meta.code;

    return `${meta.code}-${region.code}`;
}

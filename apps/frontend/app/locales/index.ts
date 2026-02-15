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
        const [localeModule, fallback] = await Promise.all([
            getLocaleFile(locale),
            getLocale(meta.fallback, seenLocales),
        ]);
        return fillEmptyKeys(fillEmptyKeys(localeModule.default, fallback), default_locale) as Locale;
    }
}

async function getLocaleFile(locale: string) {
    try {
        const translationExport = await import(`./../locales/${locale}/translation.ts`);
        if (translationExport) return translationExport;
    } catch {}

    return await import(`./../locales/${formatLocaleCode(DefaultLocale)}/translation.ts`);
}

export function parseLocale(code: string | undefined | null) {
    for (const locale of SupportedLocales) {
        const fullCode = formatLocaleCode(locale);
        if (fullCode === code) return fullCode;
        else if (!("region" in locale) && locale.code === code) return fullCode;
    }

    return formatLocaleCode(DefaultLocale);
}

export function formatLocaleCode(meta: LocaleMetaData) {
    const region = meta.region;
    if (!region?.code) return meta.code;

    return `${meta.code}-${region.code}`;
}

import default_locale from "~/locales/default/translation";
import SupportedLocales, { DefaultLocale, GetLocaleMetadata } from "./meta";
import { fillEmptyKeys } from "./obj-merge";
import type { Locale, LocaleMetaData } from "./types";

export async function getLocale(localeName: string, seenLocales: string[] = []): Promise<Locale> {
    if (localeName === formatLocaleCode(DefaultLocale)) return default_locale;

    if (seenLocales.includes(localeName)) {
        console.error(`Circular fallback detected: ${[...seenLocales, localeName].join(" -> ")}`);
        return {} as Locale;
    }
    seenLocales.push(localeName);

    const localeInfo = GetLocaleMetadata(localeName);
    if (
        !localeInfo ||
        !localeInfo.fallback ||
        [localeName, formatLocaleCode(DefaultLocale)].includes(localeInfo.fallback)
    ) {
        const locale = await getLocaleFile(localeName);
        return fillEmptyKeys(locale.default, default_locale) as Locale;
    }

    //
    else {
        const [localeModule, fallback] = await Promise.all([
            getLocaleFile(localeName),
            getLocale(localeInfo.fallback, seenLocales),
        ]);
        return fillEmptyKeys(fillEmptyKeys(localeModule.default, fallback), default_locale) as Locale;
    }
}

async function getLocaleFile(locale: string): Promise<{ default: Locale }> {
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

import defaultLocale from "~/locales/default/translation";
import SupportedLocales, { DefaultLocale_Meta, getMetadataFromLocaleCode } from "~/locales/meta";
import { fillEmptyKeys } from "~/locales/obj-merge";
import type { Locale, LocaleMetaData, PartialLocale } from "~/locales/types";

export async function getLocale(localeName: string): Promise<Locale> {
    if (localeName === formatLocaleCode(DefaultLocale_Meta)) return defaultLocale;

    const fallbackLocaleCodes = resolveFallbacks(localeName);

    const localeModules = await Promise.all(
        fallbackLocaleCodes.map(async (code) => {
            return (await getLocaleFile(code)).default;
        }),
    );

    let resolvedLocale: PartialLocale = {};
    for (const localeModule of localeModules) {
        resolvedLocale = fillEmptyKeys(resolvedLocale, localeModule);
    }

    if (fallbackLocaleCodes.includes(formatLocaleCode(DefaultLocale_Meta))) {
        return resolvedLocale as Locale;
    }
    return fillEmptyKeys(resolvedLocale, defaultLocale);
}

function resolveFallbacks(localeName: string): string[] {
    const fallbacksList: string[] = [];
    const visited = new Set<string>();

    function visit(localeCode: string) {
        if (visited.has(localeCode)) return;
        visited.add(localeCode);
        fallbacksList.push(localeCode);

        const metadata = getMetadataFromLocaleCode(localeCode);
        if (!metadata || !metadata.fallbacks) return;

        for (const fallback of metadata.fallbacks) {
            visit(fallback);
        }
    }

    visit(localeName);
    return fallbacksList;
}

async function getLocaleFile(locale: string): Promise<{ default: PartialLocale }> {
    try {
        const translationExport = await import(`./../locales/${locale}/translation.ts`);
        if (translationExport) return translationExport;
    } catch {}

    return await import(`./../locales/${formatLocaleCode(DefaultLocale_Meta)}/translation.ts`);
}

export function getValidLocaleCode(code: string | undefined | null) {
    for (const locale of SupportedLocales) {
        const fullCode = formatLocaleCode(locale);
        if (fullCode === code) return fullCode;
        else if (!("region" in locale) && locale.code === code) return fullCode;
    }

    return formatLocaleCode(DefaultLocale_Meta);
}

export function formatLocaleCode(meta: LocaleMetaData) {
    const region = meta.region;
    if (!region?.code) return meta.code;

    return `${meta.code}-${region.code}`;
}

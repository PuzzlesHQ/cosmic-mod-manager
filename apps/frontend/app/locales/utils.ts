import { formatLocaleCode, getValidLocaleCode } from "~/locales/index";
import type { LocaleMetaData } from "~/locales/types";
import Config from "~/utils/config";
import { stringifyLocation } from "~/utils/urls";
import { DefaultLocale_Meta } from "./meta";

export const HINT_LOCALE_KEY = "hl";

export function getHintLocale(params: URLSearchParams) {
    const hlParam = params.get(HINT_LOCALE_KEY);
    if (!hlParam) return "";

    return getValidLocaleCode(hlParam);
}

export function setHintLocale(url: string | URL, locale: LocaleMetaData | string, omitDefaultLocale = true) {
    const isFullUrl = typeof url !== "string" || url.startsWith("http");
    const urlObj = typeof url === "string" ? new URL(url, Config.FRONTEND_URL) : url;

    const localeCode = typeof locale === "string" ? locale : formatLocaleCode(locale);

    if (omitDefaultLocale === true && localeCode === formatLocaleCode(DefaultLocale_Meta)) {
        urlObj.searchParams.delete(HINT_LOCALE_KEY);
    } else {
        urlObj.searchParams.set(HINT_LOCALE_KEY, localeCode);
    }

    return isFullUrl ? urlObj.href : stringifyLocation(urlObj);
}

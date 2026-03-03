import en_gb from "~/locales/en-GB/translation";
import { formatLocaleCode } from "~/locales/index";
import SupportedLocales from "~/locales/meta";

export const DefaultLocale_Meta =
    SupportedLocales.find((locale) => formatLocaleCode(locale) === "en-GB") || SupportedLocales[0];
export default en_gb;

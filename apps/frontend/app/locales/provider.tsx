import { disableInteractions, enableInteractions } from "@app/utils/dom";
import { createContext, type ReactNode, use, useState } from "react";
import default_locale from "~/locales/default/translation";
import { formatLocaleCode, getLocale, parseLocale } from ".";
import { DefaultLocale, GetLocaleMetadata } from "./meta";
import type { Locale, LocaleMetaData } from "./types";

interface LocaleContext {
    locale: LocaleMetaData;
    t: Locale;
    formattedLocaleName: string;
    changeLocale: (locale: string) => Promise<void>;
}
const LocaleContext = createContext<LocaleContext>({
    locale: DefaultLocale,
    t: default_locale,
    formattedLocaleName: formatLocaleCode(DefaultLocale),
    changeLocale: async (_locale) => {},
});

export function LocaleProvider({ children, initLocale, initMetadata }: Props) {
    const [translation, setTranslation] = useState(initLocale);
    const [localeMetadata, setLocaleMetadata] = useState(initMetadata || DefaultLocale);

    async function changeLocale(locale: string) {
        disableInteractions();

        setTranslation(await getLocale(locale));
        setLocaleMetadata(GetLocaleMetadata(parseLocale(locale)) || DefaultLocale);

        enableInteractions();
    }

    return (
        <LocaleContext
            value={{
                locale: localeMetadata,
                t: translation,
                changeLocale: changeLocale,
                formattedLocaleName: formatLocaleCode(localeMetadata),
            }}
        >
            {children}
        </LocaleContext>
    );
}

interface Props {
    children: ReactNode;
    initLocale: Locale;
    initMetadata?: LocaleMetaData;
}

export function useTranslation() {
    return use(LocaleContext);
}

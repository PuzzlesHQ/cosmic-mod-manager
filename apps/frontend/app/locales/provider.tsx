import { disableInteractions, enableInteractions } from "@app/utils/dom";
import { createContext, type ReactNode, use, useState } from "react";
import defaultLocale from "~/locales/default/translation";
import { formatLocaleCode, getLocale, getValidLocaleCode } from "~/locales/index";
import { DefaultLocale_Meta, getMetadataFromLocaleCode } from "~/locales/meta";
import type { Locale, LocaleMetaData } from "~/locales/types";

interface LocaleContext {
    locale: LocaleMetaData;
    t: Locale;
    formattedLocaleName: string;
    changeLocale: (locale: string) => Promise<void>;
}
const LocaleContext = createContext<LocaleContext>({
    locale: DefaultLocale_Meta,
    t: defaultLocale,
    formattedLocaleName: formatLocaleCode(DefaultLocale_Meta),
    changeLocale: async (_locale) => {},
});

export function LocaleProvider({ children, initLocale, initMetadata }: Props) {
    const [translation, setTranslation] = useState(initLocale);
    const [localeMetadata, setLocaleMetadata] = useState(initMetadata || DefaultLocale_Meta);

    async function changeLocale(locale: string) {
        disableInteractions();

        const newLocale = getMetadataFromLocaleCode(getValidLocaleCode(locale)) ?? DefaultLocale_Meta;
        setLocaleMetadata(newLocale);
        setTranslation(await getLocale(formatLocaleCode(newLocale)));

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

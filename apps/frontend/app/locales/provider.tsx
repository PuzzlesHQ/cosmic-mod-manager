import { disableInteractions, enableInteractions } from "@app/utils/dom";
import { createContext, type ReactNode, use, useState } from "react";
import defaultLocale from "~/locales/default/translation";
import { formatLocaleCode, getLocale } from "~/locales/index";
import { DefaultLocale_Meta, getMetadataFromLocaleCode } from "~/locales/meta";
import type { Locale, LocaleMetaData } from "~/locales/types";

interface LocaleContext {
    locale: LocaleMetaData;
    t: Locale;
    formattedLocaleName: string;
    setLocale: (locale: string) => void;
}
const LocaleContext = createContext<LocaleContext>({
    locale: DefaultLocale_Meta,
    t: defaultLocale,
    formattedLocaleName: formatLocaleCode(DefaultLocale_Meta),
    setLocale: () => {},
});

export function LocaleProvider({ children, initLocale, initMetadata }: Props) {
    const [translation, setTranslation] = useState(initLocale);
    const [localeMetadata, setLocaleMetadata] = useState(initMetadata || DefaultLocale_Meta);

    async function setLocale(locale: string) {
        disableInteractions();

        const newLocale_Meta = getMetadataFromLocaleCode(locale) ?? DefaultLocale_Meta;
        const newLocale_Obj = await getLocale(formatLocaleCode(newLocale_Meta));

        setLocaleMetadata(newLocale_Meta);
        setTranslation(newLocale_Obj);

        enableInteractions();
    }

    return (
        <LocaleContext
            value={{
                locale: localeMetadata,
                t: translation,
                setLocale,
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

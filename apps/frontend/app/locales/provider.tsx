import { disableInteractions, enableInteractions } from "@app/utils/dom";
import { createContext, type ReactNode, useContext, useState } from "react";
import type { NavigateFunction } from "~/components/ui/link";
import default_locale from "~/locales/default/translation";
import { changeHintLocale, omitOrigin } from "~/utils/urls";
import { formatLocaleCode, getLocale, parseLocale } from ".";
import { DefaultLocale, GetLocaleMetadata } from "./meta";
import type { Locale, LocaleMetaData } from "./types";

interface LocaleContext {
    locale: LocaleMetaData;
    t: Locale;
    formattedLocaleName: string;
    changeLocale: (locale: string, navigate?: NavigateFunction) => void;
}
const LocaleContext = createContext<LocaleContext>({
    locale: DefaultLocale,
    t: default_locale,
    formattedLocaleName: formatLocaleCode(DefaultLocale),
    changeLocale: (_locale: string, _navigate?: NavigateFunction) => {},
});

export function LocaleProvider({ children, initLocale, initMetadata }: Props) {
    const [translation, setTranslation] = useState(initLocale);
    const [localeMetadata, setLocaleMetadata] = useState(initMetadata || DefaultLocale);

    async function changeLocale(locale: string, navigate?: NavigateFunction) {
        disableInteractions();

        if (navigate) {
            const newLangMetadata = GetLocaleMetadata(locale);
            const updatedPath = changeHintLocale(newLangMetadata || DefaultLocale, omitOrigin(new URL(window.location.href)));
            navigate(updatedPath, { preventScrollReset: true });
        }

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
    return useContext(LocaleContext);
}

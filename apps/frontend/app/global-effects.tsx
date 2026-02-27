import { useEffect } from "react";
import { useLocation } from "react-router";
import { getValidLocaleCode } from "~/locales";
import { useTranslation } from "~/locales/provider";
import { getHintLocale } from "~/locales/utils";
import { stringifyLocation } from "~/utils/urls";

export function UpdateLocaleOnHintChange() {
    const { setLocale, formattedLocaleName } = useTranslation();
    const location = useLocation();
    const locationStr = stringifyLocation(location);

    useEffect(() => {
        const updatedLocale = getValidLocaleCode(getHintLocale(new URLSearchParams(location.search)));
        if (updatedLocale !== formattedLocaleName) {
            setLocale(updatedLocale);
        }
    }, [locationStr]);

    return null;
}

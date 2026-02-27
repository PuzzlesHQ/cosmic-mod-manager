import { startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { getLocale } from "~/locales";
import { getMetadataFromLocaleCode } from "~/locales/meta";
import { LocaleProvider } from "~/locales/provider";
import { getHintLocale } from "~/utils/urls";

startTransition(async () => {
    const hintLocale = getHintLocale(new URLSearchParams(window.location.search));
    const initLocaleModule = await getLocale(hintLocale);
    const initLocaleMetadata = getMetadataFromLocaleCode(hintLocale);

    hydrateRoot(
        document,

        <LocaleProvider initLocale={initLocaleModule} initMetadata={initLocaleMetadata}>
            <HydratedRouter />
        </LocaleProvider>,
    );
});

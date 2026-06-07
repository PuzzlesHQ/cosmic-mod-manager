import { useEffect } from "react";
import { useLocation } from "react-router";
import { MarkdownLinkHandler } from "~/components/md-editor/link-handler";
import { DownloadRipple } from "~/components/misc/file-downloader";
import { Toaster } from "~/components/ui/sonner";
import { getValidLocaleCode } from "~/locales";
import { useTranslation } from "~/locales/provider";
import { getHintLocale } from "~/locales/utils";
import { stringifyLocation } from "~/utils/urls";
import { PageBreadCrumbs } from "./hooks/breadcrumb";
import clientFetch from "./utils/client-fetch";

export function AppWidgets() {
    return (
        <>
            <ValidateClientSession />

            <Toaster />
            <DownloadRipple />
            <PageBreadCrumbs />

            <UpdateLocaleOnHintChange />
            <MarkdownLinkHandler />
        </>
    );
}

function UpdateLocaleOnHintChange() {
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

function ValidateClientSession() {
    useEffect(() => {
        clientFetch("/api/auth/me");
    }, []);

    return null;
}

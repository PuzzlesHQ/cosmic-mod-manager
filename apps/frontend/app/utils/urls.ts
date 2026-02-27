import { append, prepend, removeLeading, removeTrailing } from "@app/utils/string";
import type { Location } from "react-router";
import { useLocation } from "react-router";
import { formatLocaleCode, getValidLocaleCode } from "~/locales";
import { DefaultLocale_Meta } from "~/locales/meta";
import type { LocaleMetaData } from "~/locales/types";
import Config from "./config";

export const HINT_LOCALE_KEY = "hl";

export { isCurrLinkActive } from "@app/utils/string";
export { append, prepend, removeLeading, removeTrailing };

export function getHintLocale(params: URLSearchParams) {
    const hlParam = params.get(HINT_LOCALE_KEY);
    const localeCode = getValidLocaleCode(hlParam);

    if (localeCode === getValidLocaleCode(undefined) && !hlParam) return "";
    return localeCode;
}

export function getCurrLocation() {
    // biome-ignore lint/correctness/useHookAtTopLevel: the condition never changes, it's always true in the browser and always false on the server
    const loc = globalThis?.window ? window.location : useLocation();
    return new URL(`${Config.FRONTEND_URL}${loc.pathname}${loc.search}${loc.hash}`);
}

export function omitOrigin(loc: Location<unknown> | URL) {
    let path = loc.pathname;
    if (loc.search.length > 1) path += loc.search;
    if (loc.hash.length > 1) path += loc.hash;

    return path;
}

/**
 * Changes the existing hint locale in the url to be the one provided, if doesn't exist already adds the hint locale param
 */
export function changeHintLocale(locale: LocaleMetaData, _path: string, omitDefaultLocale = true) {
    const isFullUrl = _path.startsWith("http");
    const url = new URL(_path, Config.FRONTEND_URL);

    const localeCode = formatLocaleCode(locale);

    if (omitDefaultLocale === true && localeCode === formatLocaleCode(DefaultLocale_Meta)) {
        url.searchParams.delete(HINT_LOCALE_KEY);
    } else {
        url.searchParams.set(HINT_LOCALE_KEY, localeCode);
    }

    if (isFullUrl) return url.href;
    return omitOrigin(url);
}

export function ProjectPagePath(type: string, projectSlug: string, extra?: string) {
    return joinPaths(type, projectSlug, extra);
}

export function VersionPagePath(type: string, projectSlug: string, versionSlug: string, extra?: string) {
    return joinPaths(ProjectPagePath(type, projectSlug), "version", versionSlug, extra);
}

export function OrgPagePath(orgSlug: string, extra?: string) {
    return joinPaths("organization", orgSlug, extra);
}

export function UserProfilePath(username: string, extra?: string) {
    return joinPaths("user", username, extra);
}

export function CollectionPagePath(id: string, extra?: string) {
    return joinPaths("collection", id, extra);
}

export function ReportPagePath(reportId: string, isMod = false) {
    return isMod ? joinPaths("moderation/report", reportId) : joinPaths("dashboard/report", reportId);
}

export function joinPaths(...paths: (string | undefined | null)[]) {
    if (!paths || paths.length === 0) return "";

    const pathFragments: string[] = [];

    for (let i = 0; i < paths.length; i++) {
        const path = paths[i];

        if (path && path.length > 0) {
            // An empty string in the start so that Array.join adds a leading slash
            if (i === 0 && !path?.startsWith("http")) pathFragments.push("");

            pathFragments.push(removeLeading("/", removeTrailing("/", path)));
        }
    }

    return pathFragments.join("/");
}

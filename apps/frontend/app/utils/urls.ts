import { append, prepend, removeLeading, removeTrailing } from "@app/utils/string";
import { useLocation } from "react-router";
import { parseLocale } from "~/locales";
import Config from "./config";

export const HINT_LOCALE_KEY = "hl";

export { isCurrLinkActive } from "@app/utils/string";
export { append, prepend, removeLeading, removeTrailing };

export function getHintLocale(searchParams?: URLSearchParams) {
    const params = searchParams ? searchParams : getCurrLocation().searchParams;
    const hlParam = params.get(HINT_LOCALE_KEY);
    const localeCode = parseLocale(hlParam);

    if (localeCode === parseLocale(undefined) && !hlParam) return "";
    return localeCode;
}

export function getCurrLocation() {
    // biome-ignore lint/correctness/useHookAtTopLevel: the condition never changes, it's always true in the browser and always false on the server
    const loc = globalThis?.window ? window.location : useLocation();
    return new URL(`${Config.FRONTEND_URL}${loc.pathname}${loc.search}${loc.hash}`);
}

// ? URL Formatters

/**
 * Constructs a URL path with an optional language prefix and additional path segment.
 *
 * @param url - The main path segment of the URL.
 * @param hl - An optional language prefix to prepend to the URL.
 * @returns The constructed URL path as a string.
 */
export function FormatUrl_WithHintLocale(url: string, hl?: string) {
    if (url.startsWith("http") || url.startsWith("mailto:")) return url;

    const hintLocale = hl ? hl : getHintLocale();
    const searchParams = new URLSearchParams(url.split("?")[1] || `?${HINT_LOCALE_KEY}=${hintLocale}`);

    if (!hintLocale) searchParams.delete(HINT_LOCALE_KEY);
    else searchParams.set(HINT_LOCALE_KEY, hintLocale);

    const fragment = url.split("#")[1];

    let newUrl = url.split("?")[0]?.split("#")[0];
    if (searchParams.size) newUrl += `?${searchParams.toString()}`;
    if (fragment) newUrl += `#${fragment}`;

    return prepend("/", newUrl);
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

    // An empty string in the start so that Array.join adds a leading slash
    const pathFragments: string[] = [""];
    for (const path of paths) {
        if (path && path.length > 0) {
            pathFragments.push(removeLeading("/", removeTrailing("/", path)));
        }
    }

    return pathFragments.join("/");
}

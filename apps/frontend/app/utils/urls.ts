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
    let path = `${type}/${projectSlug}`;
    if (extra) path += `/${extra}`;

    return FormatUrl_WithHintLocale(path);
}

export function VersionPagePath(type: string, projectSlug: string, versionSlug: string, extra?: string) {
    const projectPgPath = ProjectPagePath(type, projectSlug);

    let appendStr = `version/${versionSlug}`;
    if (extra) appendStr += `/${extra}`;

    return appendPathInUrl(projectPgPath, appendStr);
}

export function OrgPagePath(orgSlug: string, extra?: string) {
    const orgUrl = FormatUrl_WithHintLocale(`organization/${orgSlug}`);
    if (!extra) return orgUrl;

    return appendPathInUrl(orgUrl, extra);
}

export function UserProfilePath(username: string, extra?: string) {
    const userProfileUrl = FormatUrl_WithHintLocale(`user/${username}`);
    if (!extra) return userProfileUrl;

    return appendPathInUrl(userProfileUrl, extra);
}

export function CollectionPagePath(id: string, extra?: string) {
    const collectionPageUrl = FormatUrl_WithHintLocale(`collection/${id}`);
    if (!extra) return collectionPageUrl;

    return appendPathInUrl(collectionPageUrl, extra);
}

export function ReportPagePath(reportId: string, extra?: string) {
    const pageUrl = FormatUrl_WithHintLocale(`dashboard/report/${reportId}`);
    if (!extra) return pageUrl;

    return appendPathInUrl(pageUrl, extra);
}

export function appendPathInUrl(_url: string | URL, str: string) {
    let url: URL;
    if (typeof _url === "string") {
        if (_url.startsWith("/")) url = new URL(`${Config.FRONTEND_URL}${_url}`);
        else if (_url.startsWith("http")) url = new URL(_url);
        else url = new URL(`${Config.FRONTEND_URL}/${_url}`);
    } else {
        url = _url;
    }

    if (url.pathname.endsWith("/") || str.startsWith("/")) url.pathname = `${url.pathname}${str}`;
    else if (str.length) url.pathname = `${url.pathname}/${str}`;

    return url.href.replace(url.origin, "");
}

export const lowerCaseAlphabets = "abcdefghijklmnopqrstuvwxyz";
export const upperCaseAlphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const digits = "0123456789";

export function trimWhitespaces(str: string) {
    return str.replace(/\s/g, "");
}

export function Capitalize(str: string, eachWord = false) {
    if (eachWord === false) return `${str[0].toUpperCase()}${str.slice(1)}`;

    let newStr = "";
    for (const word of str.split(" ")) {
        newStr += `${word[0].toUpperCase()}${word.length > 1 ? word.slice(1) : ""} `;
    }

    return newStr;
}

export function FormatString(str: string) {
    return str.replaceAll("_", " ").replaceAll("-", " ");
}

export function CapitalizeAndFormatString<T extends string | null | undefined>(str: T): T {
    if (!str) return str;
    return Capitalize(FormatString(str.toLowerCase())) as T;
}

export function createURLSafeSlug(slug: string, additionalAllowedChars?: string) {
    const allowedURLCharacters = `${lowerCaseAlphabets}${upperCaseAlphabets}${digits}\`!@$()-+_.,"${additionalAllowedChars || ""}`;

    const result = {
        validInput: false,
        value: "",
    };

    for (const char of slug.replaceAll(" ", "-").toLowerCase()) {
        if (allowedURLCharacters.includes(char)) {
            result.value += char;
        }
    }

    return result;
}

export function formatUserName(str: string, additionalChars?: string) {
    const allowedCharacters = `${lowerCaseAlphabets}${upperCaseAlphabets}${digits}-_${additionalChars || ""}`;

    let formattedString = "";
    for (const char of str) {
        if (allowedCharacters.includes(char)) formattedString += char;
    }

    return formattedString;
}

export function isValidUrl(url?: string) {
    if (!url) return false;

    const regex =
        /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/;
    return !!regex.exec(url);
}

export function isCurrLinkActive(_targetUrl: string, currUrl: string, exactEnds = true) {
    const targetUrl = getPathnameFromUrlString(_targetUrl);

    if (exactEnds === true) {
        return append("/", currUrl) === append("/", targetUrl);
    }
    return currUrl.includes(targetUrl);
}

export function getPathnameFromUrlString(str: string) {
    let url: URL;

    if (str.startsWith("http")) url = new URL(str);
    else if (str.startsWith("/")) url = new URL(`https://example.com${str}`);
    else url = new URL(`https://example.com/${str}`);

    return url.pathname;
}

export function prepend(str: string, path: string) {
    return path.startsWith(str) ? path : `${str}${path}`;
}

export function append(str: string, path: string) {
    return path.endsWith(str) ? path : `${path}${str}`;
}

export function removeLeading(str: string, path: string) {
    if (!str.length) return path;
    if (!path.startsWith(str)) return path;

    return removeLeading(str, path.slice(str.length || 1));
}

export function removeTrailing(str: string, path: string) {
    if (!str.length) return path;
    if (!path.endsWith(str)) return path;

    return removeTrailing(str, path.slice(0, -1 * str.length));
}

export function BoolFromStr(str: string | null | undefined) {
    if (!str) return false;
    return str.toLowerCase() === "true";
}

export function ParseInt(str: string) {
    return Number.parseInt(str, 10);
}

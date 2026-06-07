export function imageUrl(url: undefined | string | null) {
    if (!url) return "";
    return url;
}

export function isUrl(str: string) {
    try {
        new URL(str);

        return true;
    } catch {
        return false;
    }
}

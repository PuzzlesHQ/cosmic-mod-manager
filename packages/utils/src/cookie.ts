export function getCookie(key: string, _src: string | undefined) {
    let src = _src;
    if (typeof src !== "string") src = document.cookie;

    for (const cookie of src.split("; ")) {
        if (cookie.split("=")[0] === key) {
            return cookie.split("=")[1];
        }
    }
    return null;
}

export function setCookie(key: string, value: string, expires = 365) {
    const domain = `.${location.hostname}`;
    // biome-ignore lint/suspicious/noDocumentCookie: cookieStore is not supported in all browsers
    document.cookie = `${key}=${value}; expires=${new Date(Date.now() + expires * 24 * 60 * 60 * 1000).toUTCString()}; path=/; domain=${domain}; samesite=Lax`;
}

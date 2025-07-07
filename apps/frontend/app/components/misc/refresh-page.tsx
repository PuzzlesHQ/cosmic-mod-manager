import type { Location, NavigateFunction } from "react-router";

export default function RefreshPage(navigate: NavigateFunction, location: Location | URL | string) {
    let _url = new URL("https://example.com");

    if (typeof location === "string") {
        _url = new URL(`https://example.com${location}`);
    } else {
        _url = new URL(`https://example.com${location.pathname}${location.search}${location.hash}`);
    }

    _url.searchParams.set("revalidate", "true");
    const navigatePath = _url.toString().replace(_url.origin, "");

    navigate(navigatePath, { replace: true });
}

import type { Location } from "react-router";
import type { NavigateFunction } from "~/components/ui/link";
import { omitOrigin } from "~/utils/urls";

export default function RefreshPage(navigate: NavigateFunction, location: Location | URL | string) {
    let _url = new URL("https://example.com");

    if (typeof location === "string") {
        _url = new URL(`https://example.com${location}`);
    } else {
        _url = new URL(`https://example.com${omitOrigin(location)}`);
    }

    const randomString = window.crypto.randomUUID().split("-")[0];

    _url.searchParams.set("revalidate", randomString || "1");
    const navigatePath = omitOrigin(_url);

    navigate(navigatePath, { replace: true, viewTransition: false, preventScrollReset: true });
}

export function shouldForceRevalidate(currParams: URLSearchParams, nextParams: URLSearchParams) {
    const nextRevalidate = nextParams.get("revalidate");
    const currRevalidate = currParams.get("revalidate");

    // return false if the query param is not present in the navigated url
    if (!nextRevalidate?.length) return false;

    // return true only if the param value is different
    if (currRevalidate !== nextRevalidate) return false;
    return false;
}

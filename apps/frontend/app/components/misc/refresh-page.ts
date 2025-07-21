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

    _url.searchParams.set("revalidate", "true");
    const navigatePath = omitOrigin(_url);

    navigate(navigatePath, { replace: true, viewTransition: false, preventScrollReset: true });
}

import { useRouteLoaderData } from "react-router";
import type { RootOutletData } from "~/root";

export function useSession() {
    return (useRouteLoaderData("root") as RootOutletData)?.session;
}

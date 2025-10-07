import { getProjectTypeFromPath } from "~/hooks/project";
import type { Route } from "./+types/data-wrapper";

export function getProjectLoaderData<T extends Route.MetaArgs["matches"]>(matches: T, pathname: string) {
    const _data = matches[1].loaderData;
    const projectType = getProjectTypeFromPath(pathname);

    type RouteData = {
        [K in keyof typeof _data]-?: NonNullable<(typeof _data)[K]>;
    } & {
        projectType: typeof projectType;
    };

    return {
        ...(_data as RouteData),
        projectType: projectType,
    };
}

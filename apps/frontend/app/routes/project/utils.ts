import { useProjectType } from "~/hooks/project";
import type { Route } from "./+types/data-wrapper";

export function getProjectLoaderData<T extends Route.MetaArgs["matches"]>(matches: T) {
    const _data = matches[1].data;
    const projectType = useProjectType();

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

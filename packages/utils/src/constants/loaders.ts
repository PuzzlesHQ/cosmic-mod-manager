import { ProjectType } from "~/types";

export type Loader = {
    name: string;
    supportedProjectTypes: ProjectType[];
};

export const loaders_list = [
    {
        name: "quilt",
        supportedProjectTypes: [ProjectType.MOD, ProjectType.MODPACK, ProjectType.WORLD],
    },
    {
        name: "puzzle_loader",
        supportedProjectTypes: [ProjectType.MOD, ProjectType.MODPACK, ProjectType.WORLD],
    },
    {
        name: "paradox",
        supportedProjectTypes: [ProjectType.PLUGIN],
    },
    {
        name: "simply_shaders",
        supportedProjectTypes: [ProjectType.SHADER],
    },
    {
        name: "void",
        supportedProjectTypes: [ProjectType.PLUGIN],
    },
] as const satisfies Loader[];

export type LoaderNames = (typeof loaders_list)[number]["name"];

export const loaders = loaders_list as Loader[];

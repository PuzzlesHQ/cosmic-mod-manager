import { ProjectType } from "~/types";

export type Loader = {
    name: string;
    supportedProjectTypes: ProjectType[];
    metadata: {
        foreground?: {
            light: string;
            dark: string;
        };
    };
};

export const loaders_list = [
    {
        name: "quilt",
        supportedProjectTypes: [ProjectType.MOD, ProjectType.MODPACK, ProjectType.WORLD],
        metadata: {
            foreground: {
                light: "#8B61B4",
                dark: "#C796F9",
            },
        },
    },
    {
        name: "puzzle_loader",
        supportedProjectTypes: [ProjectType.MOD, ProjectType.MODPACK, ProjectType.WORLD],
        metadata: {
            foreground: {
                light: "#4A953F",
                dark: "#A5E388",
            },
        },
    },
    {
        name: "paradox",
        supportedProjectTypes: [ProjectType.PLUGIN],
        metadata: {
            foreground: {
                light: "#4A953F",
                dark: "#A5E388",
            },
        },
    },
    {
        name: "simply_shaders",
        supportedProjectTypes: [ProjectType.SHADER],
        metadata: {
            foreground: {
                light: "#4B98B0",
                dark: "#83D5EF",
            },
        },
    },
    {
        name: "void",
        supportedProjectTypes: [ProjectType.PLUGIN],
        metadata: {
            foreground: {
                light: "",
                dark: "",
            },
        },
    },
] as const satisfies Loader[];

export type LoaderNames = (typeof loaders_list)[number]["name"];

export const loaders = loaders_list as Loader[];

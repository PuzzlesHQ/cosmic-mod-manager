import { projectTypes } from "~/config/project";
import { ProjectType, TagType } from "~/types";

export interface CategoryT {
    name: string;
    projectTypes: ProjectType[];
    type: TagType;
    isDisplayed?: boolean;
}

export const categories_list = [
    {
        name: "8x-",
        projectTypes: [ProjectType.RESOURCE_PACK],
        type: TagType.RESOLUTION,
        isDisplayed: false,
    },
    {
        name: "16x",
        projectTypes: [ProjectType.RESOURCE_PACK],
        type: TagType.RESOLUTION,
        isDisplayed: false,
    },
    {
        name: "32x",
        projectTypes: [ProjectType.RESOURCE_PACK],
        type: TagType.RESOLUTION,
        isDisplayed: false,
    },
    {
        name: "48x",
        projectTypes: [ProjectType.RESOURCE_PACK],
        type: TagType.RESOLUTION,
        isDisplayed: false,
    },
    {
        name: "64x",
        projectTypes: [ProjectType.RESOURCE_PACK],
        type: TagType.RESOLUTION,
        isDisplayed: false,
    },
    {
        name: "128x",
        projectTypes: [ProjectType.RESOURCE_PACK],
        type: TagType.RESOLUTION,
        isDisplayed: false,
    },
    {
        name: "256x",
        projectTypes: [ProjectType.RESOURCE_PACK],
        type: TagType.RESOLUTION,
        isDisplayed: false,
    },
    {
        name: "512x+",
        projectTypes: [ProjectType.RESOURCE_PACK],
        type: TagType.RESOLUTION,
        isDisplayed: false,
    },
    {
        name: "adventure",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.MODPACK, ProjectType.WORLD],
        type: TagType.CATEGORY,
    },
    {
        name: "atmosphere",
        projectTypes: [ProjectType.SHADER],
        type: TagType.FEATURE,
    },
    {
        name: "audio",
        projectTypes: [ProjectType.RESOURCE_PACK],
        type: TagType.FEATURE,
    },
    {
        name: "blocks",
        projectTypes: [ProjectType.RESOURCE_PACK],
        type: TagType.FEATURE,
    },
    {
        name: "bloom",
        projectTypes: [ProjectType.SHADER],
        type: TagType.FEATURE,
    },
    {
        name: "bug-fix",
        projectTypes: [ProjectType.MOD],
        type: TagType.CATEGORY,
    },
    {
        name: "cartoon",
        projectTypes: [ProjectType.SHADER],
        type: TagType.CATEGORY,
    },
    {
        name: "challenging",
        projectTypes: [ProjectType.MODPACK],
        type: TagType.CATEGORY,
    },
    {
        name: "christmas",
        projectTypes: [ProjectType.WORLD],
        type: TagType.CATEGORY,
    },
    {
        name: "city",
        projectTypes: [ProjectType.WORLD],
        type: TagType.CATEGORY,
    },
    {
        name: "colored-lighting",
        projectTypes: [ProjectType.SHADER],
        type: TagType.FEATURE,
    },
    {
        name: "combat",
        projectTypes: [ProjectType.MODPACK, ProjectType.RESOURCE_PACK],
        type: TagType.CATEGORY,
    },
    {
        name: "core-shaders",
        projectTypes: [ProjectType.RESOURCE_PACK],
        type: TagType.FEATURE,
    },
    {
        name: "cursed",
        projectTypes: projectTypes,
        type: TagType.CATEGORY,
    },
    {
        name: "decoration",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.RESOURCE_PACK],
        type: TagType.CATEGORY,
    },
    {
        name: "economy",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        type: TagType.CATEGORY,
    },
    {
        name: "entities",
        projectTypes: [ProjectType.RESOURCE_PACK],
        type: TagType.FEATURE,
    },
    {
        name: "environment",
        projectTypes: [ProjectType.RESOURCE_PACK],
        type: TagType.FEATURE,
    },
    {
        name: "equipment",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN, ProjectType.RESOURCE_PACK],
        type: TagType.CATEGORY,
    },
    {
        name: "escape",
        projectTypes: [ProjectType.WORLD],
        type: TagType.CATEGORY,
    },
    {
        name: "fantasy",
        projectTypes: [ProjectType.SHADER],
        type: TagType.CATEGORY,
    },
    {
        name: "foliage",
        projectTypes: [ProjectType.SHADER],
        type: TagType.FEATURE,
    },
    {
        name: "fonts",
        projectTypes: [ProjectType.RESOURCE_PACK],
        type: TagType.FEATURE,
    },
    {
        name: "food",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        type: TagType.CATEGORY,
    },
    {
        name: "game-mechanics",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        type: TagType.CATEGORY,
    },
    {
        name: "gui",
        projectTypes: [ProjectType.RESOURCE_PACK],
        type: TagType.FEATURE,
    },
    {
        name: "island",
        projectTypes: [ProjectType.WORLD],
        type: TagType.CATEGORY,
    },
    {
        name: "items",
        projectTypes: [ProjectType.RESOURCE_PACK],
        type: TagType.FEATURE,
    },
    {
        name: "kitchen-sink",
        projectTypes: [ProjectType.MODPACK],
        type: TagType.CATEGORY,
    },
    {
        name: "library",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        type: TagType.CATEGORY,
    },
    {
        name: "lightweight",
        projectTypes: [ProjectType.MODPACK],
        type: TagType.CATEGORY,
    },
    {
        name: "locale",
        projectTypes: [ProjectType.RESOURCE_PACK],
        type: TagType.FEATURE,
    },
    {
        name: "magic",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.MODPACK, ProjectType.PLUGIN],
        type: TagType.CATEGORY,
    },
    {
        name: "management",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        type: TagType.CATEGORY,
    },
    {
        name: "medieval",
        projectTypes: [ProjectType.MODPACK, ProjectType.WORLD],
        type: TagType.CATEGORY,
    },
    {
        name: "minigame",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN, ProjectType.WORLD],
        type: TagType.CATEGORY,
    },
    {
        name: "mobs",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        type: TagType.CATEGORY,
    },
    {
        name: "modded",
        projectTypes: [ProjectType.RESOURCE_PACK],
        type: TagType.CATEGORY,
    },
    {
        name: "models",
        projectTypes: [ProjectType.RESOURCE_PACK],
        type: TagType.FEATURE,
    },
    {
        name: "multiplayer",
        projectTypes: [ProjectType.MODPACK, ProjectType.WORLD],
        type: TagType.CATEGORY,
    },
    {
        name: "optimization",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.MODPACK, ProjectType.PLUGIN],
        type: TagType.CATEGORY,
    },
    {
        name: "parkour",
        projectTypes: [ProjectType.WORLD],
        type: TagType.CATEGORY,
    },
    {
        name: "path-tracing",
        projectTypes: [ProjectType.SHADER],
        type: TagType.FEATURE,
    },
    {
        name: "pbr",
        projectTypes: [ProjectType.SHADER],
        type: TagType.FEATURE,
    },
    {
        name: "pixel-art",
        projectTypes: [ProjectType.WORLD],
        type: TagType.CATEGORY,
    },
    {
        name: "potato",
        projectTypes: [ProjectType.SHADER],
        type: TagType.PERFORMANCE_IMPACT,
    },
    {
        name: "puzzle",
        projectTypes: [ProjectType.WORLD],
        type: TagType.CATEGORY,
    },
    {
        name: "low",
        projectTypes: [ProjectType.SHADER],
        type: TagType.PERFORMANCE_IMPACT,
    },
    {
        name: "maze",
        projectTypes: [ProjectType.WORLD],
        type: TagType.CATEGORY,
    },
    {
        name: "medium",
        projectTypes: [ProjectType.SHADER],
        type: TagType.PERFORMANCE_IMPACT,
    },
    {
        name: "halloween",
        projectTypes: [ProjectType.WORLD],
        type: TagType.CATEGORY,
    },
    {
        name: "hide-and-seek",
        projectTypes: [ProjectType.WORLD],
        type: TagType.CATEGORY,
    },
    {
        name: "high",
        projectTypes: [ProjectType.SHADER],
        type: TagType.PERFORMANCE_IMPACT,
    },
    {
        name: "horror",
        projectTypes: [ProjectType.WORLD],
        type: TagType.CATEGORY,
    },
    {
        name: "screenshot",
        projectTypes: [ProjectType.SHADER],
        type: TagType.PERFORMANCE_IMPACT,
    },
    {
        name: "skyblock",
        projectTypes: [ProjectType.WORLD],
        type: TagType.CATEGORY,
    },
    {
        name: "survival",
        projectTypes: [ProjectType.WORLD],
        type: TagType.CATEGORY,
    },
    {
        name: "quests",
        projectTypes: [ProjectType.MODPACK],
        type: TagType.CATEGORY,
    },
    {
        name: "realistic",
        projectTypes: [ProjectType.RESOURCE_PACK, ProjectType.SHADER],
        type: TagType.CATEGORY,
    },
    {
        name: "reflections",
        projectTypes: [ProjectType.SHADER],
        type: TagType.FEATURE,
    },
    {
        name: "semi-realistic",
        projectTypes: [ProjectType.SHADER],
        type: TagType.CATEGORY,
    },
    {
        name: "shadows",
        projectTypes: [ProjectType.SHADER],
        type: TagType.FEATURE,
    },
    {
        name: "simplistic",
        projectTypes: [ProjectType.RESOURCE_PACK],
        type: TagType.CATEGORY,
    },
    {
        name: "social",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        type: TagType.CATEGORY,
    },
    {
        name: "storage",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        type: TagType.CATEGORY,
    },
    {
        name: "technology",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.MODPACK, ProjectType.PLUGIN],
        type: TagType.CATEGORY,
    },
    {
        name: "themed",
        projectTypes: [ProjectType.RESOURCE_PACK],
        type: TagType.CATEGORY,
    },
    {
        name: "transportation",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        type: TagType.CATEGORY,
    },
    {
        name: "tweaks",
        projectTypes: [ProjectType.RESOURCE_PACK],
        type: TagType.CATEGORY,
    },
    {
        name: "utility",
        projectTypes: [ProjectType.RESOURCE_PACK, ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        type: TagType.CATEGORY,
    },
    {
        name: "vanilla-like",
        projectTypes: [ProjectType.SHADER],
        type: TagType.CATEGORY,
    },
    {
        name: "vanilla-like",
        projectTypes: [ProjectType.RESOURCE_PACK],
        type: TagType.CATEGORY,
    },
    {
        name: "worldgen",
        projectTypes: [ProjectType.MOD, ProjectType.DATAMOD, ProjectType.PLUGIN],
        type: TagType.CATEGORY,
    },
] as const satisfies CategoryT[];

export const categories = categories_list as CategoryT[];

export type CategoriesT = {
    [K in (typeof categories_list)[number]["name"]]: string;
};
export type CategoriesUnion = (typeof categories_list)[number]["name"];

export type Keys_ToNotTranslate = "8x-" | "16x" | "32x" | "48x" | "64x" | "128x" | "256x" | "512x+";

export const tagTypes = Object.values(TagType);

// ?                LIGHT       DARK
// fabric:          #8A7B71     #DBB69B;
// quilt:           #8B61B4     #C796F9;
// forge:           #5B6197     #959EEF;
// neoforge:        #DC895C     #F99E6B;
// liteloader:      #4C90DE     #7AB0EE;
// bukkit:          #E78362     #F6AF7B;
// bungeecord:      #C69E39     #D2C080;
// folia:           #6AA54F     #A5E388;
// paper:           #E67E7E     #EEAAAA;
// purpur:          #7763A3     #C3ABF7;
// spigot:          #CD7A21     #F1CC84;
// velocity:        #4B98B0     #83D5EF;
// waterfall:       #5F83CB     #78A4FB;
// sponge:          #C49528     #F9E580;

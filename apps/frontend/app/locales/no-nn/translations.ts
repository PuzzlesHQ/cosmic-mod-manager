import type { Locale } from "~/locales/types";

export default {
    common: {
        settings: "innstillingar",
        home: "Heim",
        somethingWentWrong: "Noko gjekk gale",
        more: "Meir",
        open: "Opne",
    },
    count: {
        downloads: (count, formattedCount) => {
            const downloads = Pluralize(count, "nedlasting", "nedlastingar");
            return [formattedCount, " ", downloads];
        },
        followers: (count, formattedCount) => {
            const followers = Pluralize(count, "følgjar", "følgjarar");
            return [formattedCount, " ", followers];
        },
        projects: (count, formattedCount) => {
            const projects = Pluralize(count, "prosjekt", "prosjekt");
            return [formattedCount, " ", projects];
        },
        members: (count, formattedCount) => {
            const members = Pluralize(count, "medlem", "medlemmar");
            return [formattedCount, " ", members];
        },
    },
    navbar: {
        mod: "modifikasjon",
        mods: "modifikasjonar",
        datamod: "datamodifikasjon",
        datamods: "datamodifikasjonar",
        "resource-pack": "ressurspakke",
        "resource-packs": "ressurspakka",
        shader: "skjermskildrar",
        shaders: "skjermskildrarar",
        modpack: "modifikasjonspakke",
        modpacks: "modifikasjonspakkar",
        plugin: "plugin",
        plugins: "pluginar",
        world: "verd",
        worlds: "verder",
        skipToMainContent: "Hopp til hovudinnhald",
    },
} satisfies Locale;
import { defineConfig } from "vitepress";

export default defineConfig({
    title: "CRMM Docs",
    description: "Documentation for CRMM backend API",
    sitemap: {
        hostname: "https://docs.crmm.tech",
    },
    srcDir: "src",

    metaChunk: true,
    lastUpdated: true,

    themeConfig: {
        logo: { src: "https://cdn.crmm.tech/icon.svg", width: 24, height: 24 },

        editLink: {
            pattern: (data) => {
                return `https://github.com/PuzzlesHQ/cosmic-mod-manager/blob/main/apps/docs/${data.filePath}`;
            },
        },

        search: {
            provider: "local",
        },

        sidebar: [
            {
                text: "Introduction",
                items: [
                    { text: "Getting Started", link: "/" },
                    { text: "Contributing", link: "/contributing" },
                    { text: "Translating", link: "/translating" },
                    { text: "API Endpoints", link: "/endpoints" },
                    { text: "Credits", link: "/credits" },
                ],
            },

            {
                text: "Authentication",
                items: [{ text: "Personal Access Tokens", link: "/auth/pat" }],
            },
            {
                text: "Project",
                items: [
                    { text: "Search Projects", link: "/project/search" },
                    { text: "Get a project", link: "/project/get" },
                    { text: "Get multiple projects", link: "/project/get-multiple" },
                    { text: "Get random projects", link: "/project/random" },
                    { text: "Modify a project", link: "/project/modify" },
                ],
            },
            {
                text: "Version",
                items: [
                    { text: "Get project versions", link: "/version/get-project-versions" },
                    { text: "Upload a version", link: "/version/upload" },
                ],
            },
            {
                text: "Version files",
                items: [
                    { text: "Get version from hash", link: "/version-files/version-from-hash" },
                    { text: "Get latest version from hash", link: "/version-files/latest-version-from-hash" },
                    { text: "Get versions from hashes", link: "/version-files/versions-from-hashes" },
                    { text: "Get latest versions from hashes", link: "/version-files/latest-versions-from-hashes" },
                ],
            },
            {
                text: "User",
                items: [
                    { text: "Get a user", link: "/user/get" },
                    { text: "Update profile", link: "/user/update" },
                ],
            },
            {
                text: "Organization",
                items: [
                    { text: "Get an organization", link: "/organization/get" },
                    { text: "Modify an organization", link: "/organization/modify" },
                ],
            },
            {
                text: "Team",
                items: [{ text: "Manage team members", link: "/team/manage" }],
            },
            {
                text: "Tags",
                items: [{ text: "Tags", link: "/tags/tags" }],
            },
        ],

        socialLinks: [{ icon: "github", link: "https://github.com/PuzzlesHQ/cosmic-mod-manager" }],
    },

    markdown: {
        config: (md) => {
            md.use((md) => {
                md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
                    const token = tokens[idx];
                    if (!token.attrs) return self.renderToken(tokens, idx, options);

                    for (let i = 0; i < token.attrs.length; i++) {
                        const attr = token.attrs[i];
                        if (attr[0] !== "href") continue;
                        if (attr[1].startsWith("http") || attr[1].startsWith("#")) continue;

                        token.attrs.push(["target", "_blank"]);

                        // Prefix all /api links with the api url
                        if (attr[1].startsWith("/api/")) {
                            attr[1] = `https://api.crmm.tech${attr[1]}`;
                        }

                        // Prefix all relative links with the GitHub URL
                        else if (attr[1].startsWith("/apps/") || attr[1].startsWith("/packages/")) {
                            attr[1] = `https://github.com/PuzzlesHQ/cosmic-mod-manager/blob/main${attr[1]}`;
                        }
                    }

                    return self.renderToken(tokens, idx, options);
                };
            });
        },
    },
});

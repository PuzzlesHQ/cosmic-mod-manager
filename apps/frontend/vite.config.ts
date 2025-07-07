import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { ASSETS_URL } from "./app/utils/server-config";

const CustomSrcChunks = [
    ["utils-extras", ["packages/utils/src"]],
    ["app-layout-components", ["apps/frontend/app/components/layout"]],
] as const;

export default defineConfig({
    server: {
        port: 3000,
    },
    base: ASSETS_URL,
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // Vendor
                    if (id.includes("node_modules")) {
                        // Special cases
                        if (id.includes("radix-ui")) return "radix-ui";
                        if (id.includes("highlight.js") || id.includes("xss")) return "md-renderer";
                        if (id.includes("markdown-it")) return "markdown-it";

                        const parts = id.split("/node_modules/")[1].split("/");
                        if (id.includes("/react-router/")) return `vendor/react-router-${parts[1]}`;

                        return `vendor/${parts[0]}`;
                    }

                    // Utils package
                    if (id.includes("packages/utils/src")) {
                        const parts = id.split("/packages/utils/src/")[1].split("/");
                        if (!parts[1]) return "utils/core";
                        return `utils/${parts[0]}`;
                    }

                    // Styles
                    if (id.endsWith(".css")) return "styles";

                    // Icons
                    if (id.includes("components/icons/tag-icons")) return "tag-icons";
                    if (id.includes("components/icons")) return "icons";

                    for (let i = 0; i < CustomSrcChunks.length; i++) {
                        const [chunkName, paths] = CustomSrcChunks[i];

                        for (const path of paths) {
                            if (id.includes(path)) return chunkName;
                        }
                    }
                },
            },
        },
    },
    css: {
        postcss: {
            plugins: [tailwindcss, autoprefixer],
        },
    },
    plugins: [reactRouter(), tsconfigPaths()],
});

import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { ASSETS_URL } from "./app/utils/server-config";

export default defineConfig({
    server: {
        port: 3000,
    },
    base: ASSETS_URL,
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        if (id.includes("d3-")) return "vendor/d3";
                        if (id.includes("/react-router/")) return "vendor/react-router";
                        if (id.includes("highlight") || id.includes("xss") || id.includes("markdown-it")) {
                            return "vendor/md-renderer";
                        }
                        return "vendor";
                    }
                    // Styles
                    else if (id.endsWith(".css")) return "styles";
                    // Utils package
                    else if (id.includes("packages/utils")) return "pkg-utils";
                    // Components
                    else if (id.includes("app/components")) {
                        if (id.includes("icons")) return "icons";
                        // if (id.includes("app/components/ui")) return "components-ui";
                        // if (id.includes("app/components/misc")) return "components-misc";
                        // if (id.includes("app/components/md-editor")) return "components-md-editor";
                        if (id.includes("app/components/")) return "components";
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

import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import tsconfigPaths from "vite-tsconfig-paths";
import Config from "./app/utils/config";
import { ASSETS_SERVER_URL } from "./app/utils/env";

const ReactCompilerConfig = {
    target: "19",
};

export default defineConfig({
    server: {
        port: 3000,
        proxy: {
            "/api": {
                target: Config.BACKEND_URL_PUBLIC,
                changeOrigin: true,
                secure: true,
            },
        },
    },
    base: ASSETS_SERVER_URL,
    build: {
        rollupOptions: {
            output: {
                experimentalMinChunkSize: 307200, // 300 KiB
                manualChunks(id) {
                    // Vendor
                    if (id.includes("node_modules")) {
                        // Special cases
                        if (id.includes("d3-")) return "vendor/d3";
                        if (id.includes("radix-ui")) return "vendor/radix-ui";

                        if (
                            [
                                "punycode",
                                "uc.micro",
                                "eventemitter",
                                "internmap",
                                "tiny-invariant",
                                "decimal.js",
                                "lodash",
                                "get-nonce",
                                "tslib",
                                "ua-parser-js",
                                "turbo-stream",
                                "scheduler",
                            ].some((pkg) => id.includes(pkg))
                        ) {
                            return "vendor/misc";
                        }

                        if (["tailwind-merge", "clsx", "class-variance-authority"].some((pkg) => id.includes(pkg))) {
                            return "vendor/tailwind";
                        }

                        if (
                            [
                                "react-remove",
                                "react-is",
                                "aria-hidden",
                                "@hookform",
                                "react-hook-form",
                                "react-style",
                                "@floating-ui",
                                "cmdk",
                                "fast-equals",
                                "prop-types",
                                "react-smooth",
                                "sonner",
                            ].some((pkg) => id.includes(pkg))
                        ) {
                            return "vendor/react-libs";
                        }

                        if (id.includes("recharts")) return "vendor/recharts";

                        if (
                            ["highlight.js", "xss", "markdown-it", "cssfilter", "mdurl", "linkify-it"].some((pkg) =>
                                id.includes(pkg),
                            )
                        ) {
                            return "vendor/md-renderer";
                        }

                        if (id.includes("/react-router/")) return "vendor/react-router";

                        const parts = id.split("/node_modules/")[1].split("/");
                        return `vendor/${parts[0]}`;
                    }

                    // Utils package
                    if (id.includes("packages/utils/src")) return "pkg-utils";

                    // Styles
                    if (id.endsWith(".css")) return "styles";

                    // Icons
                    if (id.includes("app/components/icons/tag-icons")) return "tag-icons";
                    if (id.includes("app/components/icons")) return "icons";
                    if (id.includes("app/components/ui")) return "ui-components";
                    if (id.includes("app/components/misc")) return "misc-components";
                    if (id.includes("app/components")) return "components";
                },
            },
        },
    },
    css: {
        postcss: {
            plugins: [tailwindcss, autoprefixer],
        },
    },
    plugins: [
        tsconfigPaths(),
        reactRouter(),
        babel({
            filter: /\.[jt]sx?$/,
            babelConfig: {
                presets: ["@babel/preset-typescript"],
                plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
            },
        }),
    ],
});

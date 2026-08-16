import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
    server: {
        port: 3000,
        proxy: {
            "/api": {
                target: "https://api.crmods.org",
                changeOrigin: true,
                secure: true,
            },
        },
    },
    base:
        process.env.NODE_ENV === "production" && process.env.VITE_ASSETS_SERVER_URL
            ? process.env.VITE_ASSETS_SERVER_URL
            : "/",
    resolve: {
        tsconfigPaths: true,
    },
    build: {
        rolldownOptions: {
            optimization: {
                inlineConst: {
                    mode: "smart",
                    pass: 1,
                },
            },
            output: {
                codeSplitting: {
                    groups: [
                        {
                            name: "modules/d3",
                            test: /node_modules.*d3-/,
                        },
                        {
                            name: "modules/radix-ui",
                            test: /node_modules.*radix-ui/,
                        },
                        {
                            name: "modules/misc",
                            test: /node_modules.*(punycode|uc\.micro|eventemitter|internmap|tiny-invariant|decimal\.js|lodash|get-nonce|tslib|ua-parser-js|turbo-stream|scheduler)/,
                        },
                        {
                            name: "modules/tailwind",
                            test: /node_modules.*(tailwind-merge|clsx|class-variance-authority)/,
                        },
                        {
                            name: "modules/react-libs",
                            test: /node_modules.*(react-remove|react-is|aria-hidden|@hookform|react-hook-form|react-style|@floating-ui|cmdk|fast-equals|prop-types|react-smooth|sonner)/,
                        },
                        {
                            name: "modules/recharts",
                            test: /node_modules.*recharts/,
                        },
                        {
                            name: "modules/md-renderer",
                            test: /node_modules.*(highlight\.js|xss|markdown-it|cssfilter|mdurl|linkify-it)/,
                        },
                        {
                            name: "modules/react-router",
                            test: /node_modules.*\/react-router\//,
                        },

                        {
                            name: "pkg-utils",
                            test: /packages[\\/]utils[\\/]src/,
                        },
                        {
                            name: "styles",
                            test: /\.css$/,
                        },

                        {
                            name: "tag-icons",
                            test: /app[\\/]components[\\/]icons[\\/]tag-icons/,
                        },
                        {
                            name: "icons",
                            test: /app[\\/]components[\\/]icons/,
                        },
                        {
                            name: "ui-components",
                            test: /app[\\/]components[\\/]ui/,
                        },
                        {
                            name: "misc-components",
                            test: /app[\\/]components[\\/]misc/,
                        },
                        {
                            name: "components",
                            test: /app[\\/]components/,
                        },
                    ],
                },
            },
        },
    },

    plugins: [tailwindcss(), reactRouter()],
});

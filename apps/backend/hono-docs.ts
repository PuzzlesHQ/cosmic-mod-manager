import { defineConfig } from "@rcmade/hono-docs";

export default defineConfig({
    tsConfigPath: "./tsconfig.json",
    openApi: {
        openapi: "3.0.0",
        info: {
            title: "CrMods API",
            version: "1.0.0",
            description: "CrMods API reference",
        },
        servers: [
            { url: "https://api.crmods.org", description: "Prod" },
            { url: "http://localhost:5500", description: "Local" },
        ],
    },
    outputs: {
        openApiJson: "./openapi/openapi.json.txt",
    },
    apis: [
        {
            name: "CrMods API",
            apiPrefix: "",
            appTypePath: "src/index.ts",
        },
    ],
}) as unknown;

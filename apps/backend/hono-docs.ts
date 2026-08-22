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
        servers: [{ url: "", description: "Prod" }],
    },
    outputs: {
        openApiJson: "./openapi/openapi.json.txt",
    },
    apis: [
        {
            name: "",
            apiPrefix: "",
            appTypePath: "src/index.ts",
        },
    ],
}) as unknown;

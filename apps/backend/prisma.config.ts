import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
    datasource: {
        url: env("PG_DATABASE_URL"),
    },
    experimental: {
        extensions: true,
    },
});

import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const envKeys = ["CLOUDFLARE_SECRET", "ASSETS_SERVER_URL"] as const;

type EnvKeys = (typeof envKeys)[number];
const env = {} as Record<EnvKeys, string>;

for (const key of envKeys) {
    const value = process.env[key];
    if (value === undefined && !!process.env) {
        console.error(`Missing environment variable: ${key}`);
        process.exit(1);
    }

    if (value) env[key] = value;
}

let ASSETS_SERVER_URL: string | undefined;

if (import.meta.env?.PROD) {
    if (env.ASSETS_SERVER_URL) ASSETS_SERVER_URL = env.ASSETS_SERVER_URL;
}

export { ASSETS_SERVER_URL, env };

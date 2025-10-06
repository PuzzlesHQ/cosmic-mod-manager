const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config({ path: "./.env" });

const isDev = process.env.NODE_ENV !== "production";
const rootDir = "/var/www/cosmic-mod-manager"; // The dir in which the repo will be cloned in prod

const sourceDir = !isDev ? `${rootDir}/current` : "/home/abhinav/Code/Projects/cosmic-mod-manager"; // The actual root of the project
const backendDir = `${sourceDir}/apps/backend`; // Root of the backend

const apps = [
    {
        name: "crmm-redis",
        command: "/usr/bin/valkey-server",
        args: ["--port", "5501"],
        cwd: `${backendDir}/redis`,
        autorestart: true,
        watch: false,
    },
    {
        name: "crmm-meilisearch",
        command: "/usr/bin/meilisearch",
        args: ["--master-key", `${process.env.MEILISEARCH_MASTER_KEY}`, "--no-analytics"],
        cwd: `${backendDir}/meilisearch`,
        autorestart: true,
        watch: false,
    },
    {
        name: "crmm-backend",
        command: `bun run ${isDev ? "dev" : "start"}`,
        cwd: backendDir,
        autorestart: true,
        watch: false,
    }
];


if (!isDev) {
    apps.push({
        name: "crmm-auto-backups",
        command: "bun run file-backup",
        cwd: backendDir,
        autorestart: false,
        watch: false,
        cron_restart: "0 0 * * *", // Every day at midnight
    })

    apps.push({
        name: "crmm-github-webhook",
        command: "bun run scripts/deploy-webhook.ts",
        cwd: sourceDir,
        autorestart: true,
        watch: false,
    })
}

module.exports = {
    apps: apps
};

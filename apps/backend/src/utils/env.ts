const envKeys = [
    "FRONTEND_URL",
    "CORS_ALLOWED_URLS",
    "OAUTH_REDIRECT_URI",
    "CDN_SERVER_URL",
    "CACHE_CDN_URL",
    "COOKIE_DOMAIN",
    "PG_DATABASE_URL",
    "HASH_SECRET_KEY",
    "GITHUB_ID",
    "GITHUB_SECRET",
    "DISCORD_ID",
    "DISCORD_SECRET",
    "GOOGLE_ID",
    "GOOGLE_SECRET",
    "GITLAB_ID",
    "GITLAB_SECRET",
    "MEILISEARCH_MASTER_KEY",
    "NODE_ENV",
    "CDN_SECRET",
    "CLOUDFLARE_SECRET",
    "BREVO_USER",
    "SUPPORT_EMAIL",
    "SUPPORT_EMAIL_PASSWORD",
    "NOREPLY_EMAIL",
    "NOREPLY_EMAIL_PASSWORD",
    "ADMIN_EMAIL",
    "ADMIN_EMAIL_PASSWORD",
    "SAFE_BROWSING_API_KEY",
    "BACKBLAZE_BACKUP_API_KEY_ID",
    "BACKBLAZE_BACKUP_API_KEY",
    "ARCHIVE_USER_ID",
    "CLICKHOUSE_PORT",
    "CLICKHOUSE_USER",
    "CLICKHOUSE_PASSWORD",
] as const;

type EnvKeys = (typeof envKeys)[number];
const env = {} as Record<EnvKeys, string>;

for (const key of envKeys) {
    const value = process.env[key];
    if (value === undefined) {
        console.error(`Missing environment variable: ${key}`);
        process.exit(1);
    }

    env[key] = value;
}

export default env;

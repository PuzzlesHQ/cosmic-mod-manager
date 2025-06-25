import { SITE_NAME_LONG, SITE_NAME_SHORT } from "@app/utils/constants";

const isDev = import.meta.env?.DEV;

const Config = {
    FRONTEND_URL: "https://crmm.tech",
    BACKEND_URL_LOCAL: "http://localhost:5500", // If the frontend and backend are both on the same server, localhost can be used for lower latency
    BACKEND_URL_PUBLIC: "https://api.crmm.tech", // The public URL of the backend,
    SITE_ICON: "https://crmm.tech/icon.png",
    proxy: false,

    SITE_NAME_SHORT: SITE_NAME_SHORT,
    SITE_NAME_LONG: SITE_NAME_LONG,

    // Additional configuration things
    SUPPORT_EMAIL: "support@crmm.tech",
    ADMIN_EMAIL: "admin@crmm.tech",
    SECURITY_EMAIL: "security@crmm.tech",
    DISCORD_INVITE: "https://discord.gg/6avTnupc6D",
    REPO_LINK: "https://github.com/PuzzlesHQ/cosmic-mod-manager",
};

if (isDev === true) {
    Config.FRONTEND_URL = "http://localhost:3000";
    Config.BACKEND_URL_LOCAL = "http://localhost:5500";
    Config.BACKEND_URL_PUBLIC = "http://localhost:5500";
    Config.proxy = false;
}

export default Config;

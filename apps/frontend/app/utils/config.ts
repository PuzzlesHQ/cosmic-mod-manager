// Can't use path aliases because this file is used in vite config also
import { SITE_NAME_LONG, SITE_NAME_SHORT } from "../../../../packages/utils/src/constants";

const Config = {
    FRONTEND_URL: "https://crmods.org",
    BACKEND_URL_LOCAL: "http://localhost:5500", // If the frontend and backend are both on the same server, localhost can be used for lower latency
    BACKEND_URL_PUBLIC: "https://api.crmods.org", // The public URL of the backend,
    SITE_ICON: "https://crmods.org/icon.png",
    proxy: false,

    SITE_NAME_SHORT: SITE_NAME_SHORT,
    SITE_NAME_LONG: SITE_NAME_LONG,

    // Additional configuration things
    SUPPORT_EMAIL: "support@crmods.org",
    ADMIN_EMAIL: "admin@crmods.org",
    SECURITY_EMAIL: "admin@crmods.org",
    DISCORD_INVITE: "https://discord.gg/6avTnupc6D",
    REPO_LINK: "https://github.com/PuzzlesHQ/cosmic-mod-manager",
    DOCS_URL: "https://docs.crmods.org",
};

const isDev = import.meta.env?.DEV;
if (isDev === true) {
    Config.FRONTEND_URL = "http://localhost:3000";
    // Config.BACKEND_URL_LOCAL = "http://localhost:5500";
    // Config.BACKEND_URL_PUBLIC = "http://localhost:5500";
    Config.BACKEND_URL_LOCAL = "https://api.crmods.org";
    Config.BACKEND_URL_PUBLIC = "https://api.crmods.org";
    Config.proxy = true;
}

export default Config;

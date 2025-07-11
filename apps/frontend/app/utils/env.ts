let ASSETS_SERVER_URL: string | undefined;

const env_ASSETS_SERVER_URL = process.env.ASSETS_SERVER_URL;
if (process.env.NODE_ENV === "production" && env_ASSETS_SERVER_URL) {
    ASSETS_SERVER_URL = env_ASSETS_SERVER_URL;
}

export { ASSETS_SERVER_URL };

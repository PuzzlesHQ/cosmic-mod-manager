let ASSETS_SERVER_URL: string | undefined;

if (import.meta.env?.PROD) {
    const env_ASSETS_SERVER_URL = process.env.ASSETS_SERVER_URL;
    if (env_ASSETS_SERVER_URL) ASSETS_SERVER_URL = env_ASSETS_SERVER_URL;
}

export { ASSETS_SERVER_URL };

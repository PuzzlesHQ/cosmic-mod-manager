import Config from "./config";

export default async function clientFetch(pathname: string, init?: RequestInit): Promise<Response> {
    const startTime = Date.now();

    let fetchPath = pathname;
    let credentials: RequestCredentials = "same-origin";

    if (fetchPath.startsWith("/")) {
        fetchPath = fetchUrl(pathname);
        credentials = "include";
    }

    const res = await fetch(fetchPath, {
        credentials: credentials,
        ...init,
    });

    console.log(
        `%c[Fetch]: %c${pathname} %c${Date.now() - startTime}%cms`,
        "color: #8288A4; font-weight: bold;",
        "color: #50fa7b;",
        "color: #FF88D5; font-weight: bold;",
        "color: #FF88D5; font-style: italic;",
    );
    return res;
}

// Not prefixing non-localhost URLs so that vite can proxy them to the defined proxy in vite.config.ts (Only for development)
function fetchUrl(path: string) {
    if (Config?.proxy === true) {
        return path;
    }

    return `${Config.BACKEND_URL_PUBLIC}${path}`;
}

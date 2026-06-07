import { getSessionIp } from "@app/utils/headers";
import Config from "./config";

const reset = "\x1b[0m";
const cyan = "\x1b[36m";
const green = "\x1b[32m";
const magenta = "\x1b[35m";
const gray = "\x1b[90m";

export async function serverFetch(clientReq: Request, pathname: string, init?: RequestInit): Promise<Response> {
    function getHeader(key: string) {
        return clientReq.headers.get(key);
    }

    try {
        const startTime = Date.now();
        const backendHost = Config.BACKEND_URL_LOCAL;

        let fetchUrl = pathname;
        const userAgent = getHeader("User-Agent") || "";

        const headers = {
            "User-Agent": userAgent,
            Cookie: "",

            "X-Forwarded-For": getHeader("X-Forwarded-For") || "",
            "Cloudflare-Secret": "",
            "CF-Connecting-IP": "",
        };

        if (fetchUrl.startsWith("/")) {
            fetchUrl = `${backendHost}${fetchUrl}`;

            headers.Cookie = getHeader("Cookie") || "";
            headers["CF-Connecting-IP"] = getHeader("CF-Connecting-IP") || "";
            headers["Cloudflare-Secret"] = getHeader("Cloudflare-Secret") || "";
        }

        const res = await fetch(fetchUrl, {
            ...init,
            headers: { ...init?.headers, ...headers },
        });

        const clientIp = getSessionIp(getHeader, {
            fallbackIp: "::1",
            cloudflareSecret: process.env.CLOUDFLARE_SECRET || "",
        });

        console.log(`${green}${pathname} ${magenta}${Date.now() - startTime}ms ${gray}| ${cyan}${clientIp}${reset}`);
        return res;
    } catch (error) {
        console.error("Server fetch error\n", error);
        return new Response(null, { status: 500 });
    }
}

export async function resJson<T>(res: Response): Promise<T | null> {
    try {
        return (await res.json()) as T;
    } catch (err) {
        console.error("Failed to parse response json\n", err);
        return null;
    }
}

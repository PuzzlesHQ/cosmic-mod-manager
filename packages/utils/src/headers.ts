import { UAParser } from "ua-parser-js";

type GetHeader = (key: string) => string | null | undefined;

export function getSessionIp(getHeader: GetHeader, fallbackIp: string): string {
    const cloudflareIp = getHeader("CF-Connecting-IP");
    if (cloudflareIp) return cloudflareIp;

    const forwardedFor = getHeader("X-Forwarded-For");
    if (!forwardedFor) return fallbackIp;

    if (forwardedFor.includes(",")) {
        return forwardedFor.replaceAll(" ", "").split(",")[0];
    }

    return forwardedFor;
}

export interface SessionMetadata {
    ipAddr: string | null;
    country?: string;
    city?: string;
    browserName?: string;
    userAgent?: string;
    os: {
        name: string;
        version: string;
    };
}

export function getSessionMetadata(getHeader: GetHeader, fallbackIp: string): SessionMetadata {
    const ipAddr = getSessionIp(getHeader, fallbackIp);
    const userAgent = getHeader("User-Agent") || "";

    const parsedResult = new UAParser(userAgent).getResult();
    const browserName = parsedResult?.browser?.name || "";
    const os = {
        name: parsedResult?.os?.name || "",
        version: parsedResult?.os?.version || "",
    };

    const country = getHeader("CF-IPCountry");
    const city = getHeader("CF-IPCity");
    const region = getHeader("CF-Region");

    return {
        ipAddr,
        country: country || undefined,
        city: city ? `${city} ${region}` : undefined,
        browserName,
        userAgent,
        os,
    };
}

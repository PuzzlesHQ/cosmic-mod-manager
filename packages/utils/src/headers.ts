import { UAParser } from "ua-parser-js";

type GetHeader = (key: string) => string | null | undefined;

interface getSessionIpOptions {
    fallbackIp: string;
    cdnSecret?: string;
    cloudflareSecret?: string;
}

export function getSessionIp(getHeader: GetHeader, options: getSessionIpOptions): string {
    let ipStr: string | null = null;

    const cdnSecret = getHeader("cdn-secret");
    const cfSecret = getHeader("cloudflare-secret");

    if (options.cloudflareSecret && cfSecret === options.cloudflareSecret) {
        ipStr = getHeader("cf-connecting-ip");
    } else if (options.cdnSecret && cdnSecret === options.cdnSecret) {
        ipStr = getHeader("fastly-client-ip");
    } else {
        ipStr = getHeader("x-forwarded-for");
    }

    if (!ipStr) ipStr = options.fallbackIp;

    if (ipStr.includes(",")) {
        ipStr = ipStr.replaceAll(" ", "").split(",")[0];
    }

    return ipStr;
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

export function getSessionMetadata(getHeader: GetHeader, ipAddr: string): SessionMetadata {
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

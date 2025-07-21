import { describe, expect, test } from "bun:test";
import { getSessionIp } from "./headers";

describe("getSessionIp", () => {
    const fallbackAddress = "::1";

    function makeGetHeader(headers: Record<string, string | undefined | null>) {
        return (key: string) => headers[key] ?? null;
    }

    test("should return cloudflare ip when cloudflare secret matches", () => {
        const headers = {
            "cloudflare-secret": "cf-secret",
            "cf-connecting-ip": "1.2.3.4",
        };
        const getHeader = makeGetHeader(headers);
        const ip = getSessionIp(getHeader, {
            fallbackIp: fallbackAddress,
            cloudflareSecret: "cf-secret",
        });
        expect(ip).toBe(headers["cf-connecting-ip"]);
    });

    test("should return fastly provided ip when cdn secret matches", () => {
        const headers = {
            "cdn-secret": "cdn-secret-value",
            "fastly-client-ip": "5.6.7.8",
            "cloudflare-secret": "wrong-secret",
        };
        const getHeader = makeGetHeader(headers);
        const ip = getSessionIp(getHeader, {
            fallbackIp: fallbackAddress,
            cdnSecret: "cdn-secret-value",
            cloudflareSecret: "cf-secret",
        });
        expect(ip).toBe(headers["fastly-client-ip"]);
    });

    test("should return x-forwarded-for when no secrets match", () => {
        const headers = {
            "x-forwarded-for": "9.10.11.12",
        };
        const getHeader = makeGetHeader(headers);
        const ip = getSessionIp(getHeader, {
            fallbackIp: fallbackAddress,
            cdnSecret: "cdn-secret-value",
            cloudflareSecret: "cf-secret",
        });
        expect(ip).toBe(headers["x-forwarded-for"]);
    });

    test("should return fallbackAddress when no IP headers are present", () => {
        const headers = {};
        const getHeader = makeGetHeader(headers);
        const ip = getSessionIp(getHeader, {
            fallbackIp: fallbackAddress,
            cdnSecret: "cdn-secret-value",
            cloudflareSecret: "cf-secret",
        });
        expect(ip).toBe(fallbackAddress);
    });

    test("should return first IP if x-forwarded-for contains multiple IPs", () => {
        const headers = {
            "x-forwarded-for": "1.1.1.1, 2.2.2.2, 3.3.3.3",
        };
        const getHeader = makeGetHeader(headers);
        const ip = getSessionIp(getHeader, {
            fallbackIp: fallbackAddress,
        });
        expect(ip).toBe("1.1.1.1");
    });

    test("should return first IP if cf-connecting-ip contains multiple IPs", () => {
        const headers = {
            "cloudflare-secret": "cf-secret",
            "cf-connecting-ip": "4.4.4.4, 5.5.5.5",
        };
        const getHeader = makeGetHeader(headers);
        const ip = getSessionIp(getHeader, {
            fallbackIp: fallbackAddress,
            cloudflareSecret: "cf-secret",
        });
        expect(ip).toBe("4.4.4.4");
    });

    test("should trim spaces in multi-IP header values", () => {
        const headers = {
            "x-forwarded-for": " 6.6.6.6 , 7.7.7.7 ",
        };
        const getHeader = makeGetHeader(headers);
        const ip = getSessionIp(getHeader, {
            fallbackIp: fallbackAddress,
        });
        expect(ip).toBe("6.6.6.6");
    });
});

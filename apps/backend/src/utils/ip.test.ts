import { describe, expect, test } from "bun:test";
import { convertToIPv6, stripIp } from "./ip";

describe("convertToIPv6", () => {
    test("converts IPv4 to IPv6-mapped address", () => {
        expect(convertToIPv6("192.168.1.1")).toBe("::ffff:192.168.1.1");
        expect(convertToIPv6("127.0.0.1")).toBe("::ffff:127.0.0.1");
        expect(convertToIPv6("8.8.8.8")).toBe("::ffff:8.8.8.8");
    });

    test("returns normalized IPv6 address for valid IPv6 input", () => {
        expect(convertToIPv6("2001:0db8:85a3:0000:0000:8a2e:0370:7334")).toBe("2001:db8:85a3::8a2e:370:7334");
        expect(convertToIPv6("000:0000:0000:0000:0000:0000:0000:0001")).toBe("::1");
        expect(convertToIPv6("::1")).toBe("::1");
    });

    test("returns null for invalid IP address", () => {
        expect(convertToIPv6("not.an.ip")).toBeNull();
        expect(convertToIPv6("gggg:hhhh:iiii:jjjj:kkkk:llll:mmmm:nnnn")).toBeNull();
        expect(convertToIPv6("")).toBe("::"); // Empty string should return the unspecified address
    });
});

describe("stripIp", () => {
    test("handles full IPv6 addresses", () => {
        expect(stripIp("2001:db8:85a3:0000:0000:8a2e:0370:7334").toString(16)).toBe("20010db885a30000");
        expect(stripIp("2001:db8:85a3::8a2e:370:7334").toString(16)).toBe("20010db885a30000");
        expect(stripIp("::1").toString(16)).toBe("0");
        expect(stripIp("::").toString(16)).toBe("0");
    });
});

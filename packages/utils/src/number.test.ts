import { describe, expect, test } from "bun:test";
import { FormatCount, GiB, KiB, MiB, parseFileSize } from "./number";

describe("parseFileSize", () => {
    test("should return '0 Bytes' when input is 0 or negative", () => {
        expect(parseFileSize(0)).toBe("0 Bytes");
        expect(parseFileSize(-KiB)).toBe("0 Bytes");
    });

    test("should return correct size for small numbers", () => {
        expect(parseFileSize(500)).toBe("500 Bytes");
    });

    test("should return value in KiB range when input is in KiB", () => {
        expect(parseFileSize(KiB)).toBe("1.0 KiB");
        expect(parseFileSize(KiB + 500)).toEndWith("KiB");
    });

    test("should return value in MiB range when input is in MiB", () => {
        expect(parseFileSize(MiB)).toBe("1.00 MiB");
        expect(parseFileSize(4 * MiB)).toEndWith("MiB");
    });

    test("should return value in GiB range when input is in GiB", () => {
        expect(parseFileSize(GiB)).toBe("1.00 GiB");
        expect(parseFileSize(21 * GiB)).toEndWith("GiB");
    });
});

describe("FormatCount", () => {
    test("should format numbers less than 1,000 without compact notation", () => {
        expect(FormatCount(0)).toBe("0");
        expect(FormatCount(999)).toBe("999");
    });

    test("should format numbers between 1,000 and 1,000,000 with 1 decimal", () => {
        expect(FormatCount(1000, "en-US")).toBe("1K");
        expect(FormatCount(1500, "en-US")).toBe("1.5K");
        expect(FormatCount(9999, "en-US")).toBe("10K");
        expect(FormatCount(1_000_000, "en-US")).toBe("1M");
    });

    test("should format numbers greater than 1,000,000 with max 2 decimals", () => {
        expect(FormatCount(1_540_000, "en-US")).toBe("1.54M");
        expect(FormatCount(10_000_000, "en-US")).toBe("10M");
    });

    test("should handle locale-specific formatting", () => {
        expect(FormatCount(99_000, "fr-FR")).toBe("99 k");

        // German doesn't use "k" for thousands
        expect(FormatCount(99_000, "de-DE")).toBe("99.000");
        expect(FormatCount(1_000_000, "de-DE")).toBe("1 Mio.");
        expect(FormatCount(1_430_000, "de-DE")).toBe("1,43 Mio.");
    });
});

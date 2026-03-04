import { describe, expect, test } from "bun:test";
import { DefaultLocale_Meta } from "~/locales/meta";
import { formatLocaleCode } from "./index";
import { getHintLocale, setHintLocale } from "./utils";

describe("getHintLocale", () => {
    test("should return empty string when hl is missing", () => {
        const params = new URLSearchParams("page=1");
        expect(getHintLocale(params)).toBe("");
    });

    test("should return validated locale code when hl exists", () => {
        const params = new URLSearchParams("hl=en-US");
        expect(getHintLocale(params)).toBe("en-US");
    });

    test("should fallback unknown locale to default locale", () => {
        const params = new URLSearchParams("hl=unknown-locale");
        expect(getHintLocale(params)).toBe(formatLocaleCode(DefaultLocale_Meta));
    });
});

describe("setHintLocale", () => {
    test("should omit hl for default locale when user preference matches", () => {
        const defaultLocale = formatLocaleCode(DefaultLocale_Meta);
        expect(setHintLocale("/test?hl=fr", defaultLocale, defaultLocale)).toBe("/test");
    });

    test("should keep hl when setting non-default locale", () => {
        expect(setHintLocale("/test", "fr")).toBe("/test?hl=fr");
    });

    test("should keep hl for default locale when user preference differs", () => {
        const defaultLocale = formatLocaleCode(DefaultLocale_Meta);
        expect(setHintLocale("/test", defaultLocale, "fr")).toBe(`/test?hl=${defaultLocale}`);
    });

    test("should return full URL when input is full URL", () => {
        const output = setHintLocale("https://example.com/test", "fr");
        expect(output).toBe("https://example.com/test?hl=fr");
    });
});

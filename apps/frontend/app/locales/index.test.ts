import { describe, expect, test } from "bun:test";
import defaultLocale from "~/locales/default/translation";
import { DefaultLocale_Meta } from "~/locales/meta";
import type { LocaleMetaData } from "~/locales/types";
import { formatLocaleCode, getLocale, getValidLocaleCode } from "./index";

describe("formatLocaleCode", () => {
    test("should include region when present", () => {
        expect(formatLocaleCode({ code: "en" } as LocaleMetaData)).toBe("en");

        expect(
            formatLocaleCode({
                code: "en",
                region: {
                    code: "US",
                },
            } as LocaleMetaData),
        ).toBe("en-US");
    });
});

describe("getLocale", () => {
    test("getLocale should return default locale object for default locale code", async () => {
        const locale = await getLocale(formatLocaleCode(DefaultLocale_Meta));
        expect(locale).toBe(defaultLocale);
    });

    test("getLocale should resolve fallbacks and keep locale-specific overrides", async () => {
        const locale = await getLocale("en-US");

        expect(locale.settings.colorTheme).toBe("Color theme");
        expect(locale.common.settings).toBe("Settings");
    });

    test("getLocale should fallback to default locale for unknown locale", async () => {
        const locale = await getLocale("zz-XX");

        expect(locale).toEqual(defaultLocale);
    });
});

describe("getValidLocaleCode", () => {
    test("getValidLocaleCode should resolve known locale and fallback unknown values", () => {
        expect(getValidLocaleCode("en-US")).toBe("en-US");
        expect(getValidLocaleCode("fr")).toBe("fr");
        expect(getValidLocaleCode("unknown-locale")).toBe(formatLocaleCode(DefaultLocale_Meta));
        expect(getValidLocaleCode(undefined)).toBe(formatLocaleCode(DefaultLocale_Meta));
    });
});

import { describe, expect, test } from "bun:test";
import { fillEmptyKeys } from "./obj-merge";

describe("fillEmptyKeys", () => {
    test("should recursively fill missing keys from fallback", () => {
        const target = {
            common: { settings: "Preferences" },
        };

        const fallback = {
            common: {
                settings: "Settings",
                home: "Home",
            },
            dashboard: { title: "Dashboard" },
        };

        const result = fillEmptyKeys(target, fallback);

        expect(result.common.settings).toBe(target.common.settings); // shouldn't override existing value
        expect(result.dashboard.title).toBe(fallback.dashboard.title); // should create nested objects
    });

    test("should throw when fallback is not a non-null object", () => {
        expect(() => fillEmptyKeys({}, null as unknown as Record<string, unknown>)).toThrow(
            "Fallback must be a non-null object",
        );
        expect(() => fillEmptyKeys({}, "fallback" as unknown as Record<string, unknown>)).toThrow(
            "Fallback must be a non-null object",
        );
    });
});

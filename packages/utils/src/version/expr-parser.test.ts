import { describe, expect, it } from "bun:test";
import { parseVersionExpression as __parseVersionExpression } from "./expr-parser";

describe("parseVersionExpression", () => {
    // test game-versions list
    const testGameVersions = [
        "1.21.1",
        "1.21.0",
        "1.20.6",
        "1.20.5",
        "1.20.4",
        "1.20.3",
        "1.20.2",
        "1.20.1",
        "1.20.0",
        "1.19.4",
        "1.19.3",
        "1.19.2-rc4",
        "1.19.2-rc3",
        "1.19.2-rc2",
        "1.19.2-rc1",
        "1.19.2",
        "1.19.1",
        "1.19.0",
    ];

    function parseVersionExpression(expr: string) {
        return __parseVersionExpression(expr, testGameVersions);
    }

    function includedVersions(result: ReturnType<typeof parseVersionExpression>) {
        return result.filter((r) => r.action === "include").map((r) => r.version);
    }

    function excludedVersions(result: ReturnType<typeof parseVersionExpression>) {
        return result.filter((r) => r.action === "exclude").map((r) => r.version);
    }

    it("should handle specific versions", () => {
        const result = parseVersionExpression("1.20.3, 1.19.2, !1.20.5");
        expect(includedVersions(result)).toEqual(["1.20.3", "1.19.2"]);
        expect(excludedVersions(result)).toEqual(["1.20.5"]);
    });

    it("should handle range expressions", () => {
        const result = parseVersionExpression(">=1.20.0, <1.20.5, !1.20.2");
        expect(includedVersions(result)).toEqual(["1.20.4", "1.20.3", "1.20.1", "1.20.0"]);
        expect(excludedVersions(result)).toContain("1.20.2");
    });

    it("should handle hyphen ranges", () => {
        const result = parseVersionExpression("1.20.2-1.20.5, !1.19.3-1.19.4");
        expect(includedVersions(result)).toEqual(["1.20.5", "1.20.4", "1.20.3", "1.20.2"]);
        expect(excludedVersions(result)).toEqual(["1.19.4", "1.19.3"]);
    });

    it("should handle hyphen ranges when version itself contains hyphens", () => {
        const result = parseVersionExpression("1.19.2-rc2-1.19.2-rc4, !1.19.2-rc3");
        expect(includedVersions(result)).toEqual(["1.19.2-rc4", "1.19.2-rc2"]);
        expect(excludedVersions(result)).toEqual(["1.19.2-rc3"]);
    });

    it("should treat single hyphenated version as one version, not a range", () => {
        const result = parseVersionExpression("1.19.2-rc1, !1.19.2-rc2");
        expect(includedVersions(result)).toEqual(["1.19.2-rc1"]);
        expect(excludedVersions(result)).toEqual(["1.19.2-rc2"]);
    });

    it("should handle range from normal version to hyphenated version", () => {
        const result = parseVersionExpression("1.19.2-1.19.2-rc4");
        expect(includedVersions(result)).toEqual(["1.19.2-rc4", "1.19.2-rc3", "1.19.2-rc2", "1.19.2-rc1", "1.19.2"]);
    });

    it("should handle 'latest' keyword in ranges", () => {
        const result = parseVersionExpression("1.20.0-latest");
        expect(includedVersions(result)).toContain("1.21.1");
        expect(includedVersions(result)).toContain("1.20.0");
    });

    it("specific expressions should override ranges regardless of the order", () => {
        const result = parseVersionExpression("!1.20.2, >=1.20.0, <1.20.4");
        expect(includedVersions(result)).toEqual(["1.20.3", "1.20.1", "1.20.0"]);
    });

    it("later expressions should override earlier ones", () => {
        const result = parseVersionExpression("1.20.0-1.20.4, !1.20.3, 1.20.3");
        expect(includedVersions(result)).toEqual(["1.20.4", "1.20.3", "1.20.2", "1.20.1", "1.20.0"]);
        expect(excludedVersions(result)).toEqual([]);
    });

    it("should handle a complex expression", () => {
        const result = parseVersionExpression(">=1.19.3, <1.20.0, !1.19.2, 1.20.3-1.20.5, !1.20.4");
        expect(includedVersions(result)).toEqual(["1.20.5", "1.20.3", "1.19.4", "1.19.3"]);
        expect(excludedVersions(result)).toContainValues(["1.20.4", "1.19.2"]);
    });

    it("should handle empty expression", () => {
        const result = parseVersionExpression("");
        expect(includedVersions(result)).toEqual([]);
        expect(excludedVersions(result)).toEqual([]);
    });

    it("should handle invalid versions gracefully", () => {
        const result = parseVersionExpression(">=2.0.0, !invalid-version, 1.20.3");
        expect(includedVersions(result)).toEqual(["1.20.3"]);
    });

    it("should handle malformed expressions gracefully", () => {
        const result = parseVersionExpression(">>1.20.0, , , 1.20.3-asdf");
        expect(includedVersions(result)).toEqual([]);
        expect(excludedVersions(result)).toEqual([]);
    });
});

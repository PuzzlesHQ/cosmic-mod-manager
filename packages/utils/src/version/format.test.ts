import { describe, expect, test } from "bun:test";
import { formatVersionsForDisplay } from "./format";

describe("formatVersionsForDisplay", () => {
    test("should return empty array when input is empty", () => {
        expect(formatVersionsForDisplay([])).toEqual([]);
    });

    test("should return single version as is", () => {
        expect(formatVersionsForDisplay(["0.1.1"])).toEqual(["0.1.1"]);
    });

    test("should return versions in descending order when versions are non-continuous", () => {
        expect(formatVersionsForDisplay(["0.1.1", "0.1.3"])).toEqual(["0.1.3", "0.1.1"]);
    });

    test("should return version range when versions are continuous", () => {
        expect(formatVersionsForDisplay(["0.1.1", "0.1.2", "0.1.3"])).toEqual(["0.1.1–0.1.3"]);
    });

    test("should group the versions as a.b.x when all the minor versions are present", () => {
        expect(formatVersionsForDisplay(["0.2.0", "0.2.1", "0.2.2", "0.2.3", "0.2.4", "0.2.5", "0.3.0"])).toEqual([
            "0.3",
            "0.2.x",
        ]);
    });

    test("should handle range when different release types are in between", () => {
        expect(formatVersionsForDisplay(["0.3.3", "0.3.2", "0.3.2-pre2", "0.3.2-pre1", "0.3.1"])).toEqual(["0.3.1–0.3.3"]);
    });
});

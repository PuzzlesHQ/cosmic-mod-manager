import { describe, expect, test } from "bun:test";
import { formatVersionsForDisplay_noOmit } from "./format-verbose";

describe("formatGameVersionsList_verbose", () => {
    test("should return empty array when input is empty", () => {
        expect(formatVersionsForDisplay_noOmit([])).toEqual([]);
    });

    test("should return single version as is", () => {
        expect(formatVersionsForDisplay_noOmit(["0.1.1"])).toEqual(["0.1.1"]);
    });

    test("should return non-continuous versions in descending order", () => {
        expect(formatVersionsForDisplay_noOmit(["0.1.1", "0.1.3"])).toEqual(["0.1.3", "0.1.1"]);
    });

    test("should merge continuous versions into a range", () => {
        expect(formatVersionsForDisplay_noOmit(["0.1.1", "0.1.2", "0.1.3"])).toEqual(["0.1.1–0.1.3"]);
    });

    test("should merge continuous versions and keep non-continuous separately", () => {
        expect(formatVersionsForDisplay_noOmit(["0.1.1", "0.1.2", "0.1.3", "0.4.1"])).toEqual(["0.4.1", "0.1.1–0.1.3"]);
    });

    test("should not omit non-release versions and merge pre-releases correctly", () => {
        expect(formatVersionsForDisplay_noOmit(["0.3.3", "0.3.2", "0.3.2-pre2", "0.3.2-pre1", "0.3.1"])).toEqual([
            "0.3.2–0.3.3",
            "0.3.2-pre1–0.3.2-pre2",
            "0.3.1",
        ]);
    });
});

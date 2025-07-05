import { describe, expect, test } from "bun:test";
import { formatVersionsForDisplay_noOmit } from "./format-verbose";

describe("formatGameVersionsList_verbose", () => {
    test("empty input", () => {
        expect(formatVersionsForDisplay_noOmit([])).toEqual([]);
    });

    test("returns single version as is", () => {
        expect(formatVersionsForDisplay_noOmit(["0.1.1"])).toEqual(["0.1.1"]);
    });

    test("non-continuous versions", () => {
        expect(formatVersionsForDisplay_noOmit(["0.1.1", "0.1.3"])).toEqual(["0.1.3", "0.1.1"]);
    });

    test("continuous versions", () => {
        expect(formatVersionsForDisplay_noOmit(["0.1.1", "0.1.2", "0.1.3"])).toEqual(["0.1.1–0.1.3"]);
    });

    test("mix of continuous and non-continuous versions", () => {
        expect(formatVersionsForDisplay_noOmit(["0.1.1", "0.1.2", "0.1.3", "0.4.1"])).toEqual(["0.4.1", "0.1.1–0.1.3"]);
    });

    test("doesn't omit non-release versions", () => {
        expect(formatVersionsForDisplay_noOmit(["0.3.3", "0.3.2", "0.3.2-pre2", "0.3.2-pre1", "0.3.1"])).toEqual([
            "0.3.2–0.3.3",
            "0.3.2-pre1–0.3.2-pre2",
            "0.3.1",
        ]);
    });
});

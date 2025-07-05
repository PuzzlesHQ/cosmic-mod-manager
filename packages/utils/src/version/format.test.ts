import { describe, expect, test } from "bun:test";
import { formatVersionsForDisplay } from "./format";

describe("formatVersionsForDisplay", () => {
    test("empty input", () => {
        expect(formatVersionsForDisplay([])).toEqual([]);
    });

    test("returns single version as is", () => {
        expect(formatVersionsForDisplay(["0.1.1"])).toEqual(["0.1.1"]);
    });

    test("non-continuous versions", () => {
        expect(formatVersionsForDisplay(["0.1.1", "0.1.3"])).toEqual(["0.1.3", "0.1.1"]);
    });

    test("continuous versions", () => {
        expect(formatVersionsForDisplay(["0.1.1", "0.1.2", "0.1.3"])).toEqual(["0.1.1–0.1.3"]);
    });

    test("special case when all minor versions are present", () => {
        expect(formatVersionsForDisplay(["0.2.0", "0.2.1", "0.2.2", "0.2.3", "0.2.4", "0.2.5", "0.3.0"])).toEqual([
            "0.3",
            "0.2.x",
        ]);
    });

    test("handles range when different release types are in between", () => {
        expect(formatVersionsForDisplay(["0.3.3", "0.3.2-pre2", "0.3.2-pre1", "0.3.2", "0.3.0"])).toEqual(["0.3.2–0.3.3", "0.3"]);
    });
});

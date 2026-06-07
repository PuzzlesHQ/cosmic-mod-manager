import { describe, expect, test } from "bun:test";
import {
    AddDays,
    AddMonths,
    AddYears,
    date,
    DateFromStr,
    getTimeRange,
    ISO_DateStr,
    SubtractDays,
    SubtractMonths,
    SubtractYears,
    timeSince,
} from "./date";
import { TimelineOptions } from "./types";

describe("DateFromStr", () => {
    test("should parse valid date strings and reject invalid values", () => {
        expect(DateFromStr("2024-02-03T10:20:30Z")).toBeInstanceOf(Date);
        expect(DateFromStr("not-a-date")).toBeNull();
        expect(DateFromStr(undefined)).toBeNull();
    });
});

describe("date", () => {
    test("should return same Date instance when input is a Date", () => {
        const input = new Date(2024, 0, 10, 12, 30, 0);
        expect(date(input)).toBe(input);
    });
});

describe("ISO_DateStr", () => {
    test("should return UTC yyyy-mm-dd format when utc is true", () => {
        expect(ISO_DateStr("2024-02-03T10:20:30Z", true)).toBe("2024-02-03");
    });

    test("should return empty string for missing date", () => {
        expect(ISO_DateStr(null)).toBe("");
        expect(ISO_DateStr(undefined)).toBe("");
    });
});

describe("date arithmetic", () => {
    test("should return a new Date obj instead of modifying the source", () => {
        const source = new Date(2024, 0, 15, 12, 0, 0);

        const added = AddDays(source, 5);
        const subtracted = SubtractDays(source, 5);

        expect(source.getDate()).toBe(15);
        expect(added.getDate()).toBe(20);
        expect(subtracted.getDate()).toBe(10);
    });

    test("should add/subtracts correctly", () => {
        const source = new Date(2024, 5, 10, 12, 0, 0);

        expect(AddMonths(source, 2).getMonth()).toBe(7);
        expect(SubtractMonths(source, 2).getMonth()).toBe(3);
        expect(AddYears(source, 1).getFullYear()).toBe(2025);
        expect(SubtractYears(source, 1).getFullYear()).toBe(2023);
    });
});

describe("getTimeRange", () => {
    test("should return epoch start for all-time", () => {
        const [start, end] = getTimeRange(TimelineOptions.ALL_TIME);

        expect(start.getTime()).toBe(0);
        expect(end.getTime()).toBeLessThan(Date.now());
    });

    test("should return first day of month for this-month start", () => {
        const [start, end] = getTimeRange(TimelineOptions.THIS_MONTH);

        expect(start.getDate()).toBe(1);
        expect(end.getTime()).toBeLessThan(Date.now());
    });
});

describe("timeSince", () => {
    test("should return a non-empty relative time string", () => {
        const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
        expect(timeSince(thirtySecondsAgo)).not.toBe("");
    });
});

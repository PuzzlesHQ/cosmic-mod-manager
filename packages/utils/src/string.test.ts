import { describe, expect, test } from "bun:test";
import { Capitalize, createURLSafeSlug, decodeStringArray, encodeArrayIntoStr, isCurrLinkActive } from "./string";

describe("Capitalize", () => {
    test("should capitalize the first letter of a string", () => {
        expect(Capitalize("hello")).toBe("Hello");
    });

    test("should return an empty string when input is empty", () => {
        expect(Capitalize("")).toBe("");
        expect(Capitalize(null)).toBe("");
    });

    test("should capitalize each word when input has multiple space separated words", () => {
        expect(Capitalize("some title", true)).toBe("Some Title");
    });
});

describe("createURLSafeSlug", () => {
    test("should convert spaces to hyphens and lowercase the string", () => {
        expect(createURLSafeSlug("a B")).toBe("a-b");
    });

    test("should remove characters not in the allowed set", () => {
        // '#' is not allowed, so it should be removed
        expect(createURLSafeSlug("foo#!bar")).toBe("foo!bar");
    });

    test("should respect additional allowed characters", () => {
        expect(createURLSafeSlug("foo#bar", "#")).toBe("foo#bar");
    });

    test("should remove all disallowed special characters", () => {
        // '/', '?' and '=' are not allowed
        expect(createURLSafeSlug("foo/bar?baz=qux")).toBe("foobarbazqux");
    });
});

describe("isCurrLinkActive", () => {
    test("should handle trailing slashes", () => {
        expect(isCurrLinkActive("/foo/bar", "/foo/bar")).toBe(true);
        expect(isCurrLinkActive("/foo/", "/foo")).toBe(true);
        expect(isCurrLinkActive("/foo", "/foo/")).toBe(true);
    });

    test("should return false when URLs are different", () => {
        expect(isCurrLinkActive("/bar", "/baz")).toBe(false);
        expect(isCurrLinkActive("/foo", "/foo/bar")).toBe(false);
        expect(isCurrLinkActive("/foo/bar", "/foo")).toBe(false);
    });

    test("should handle partial matches when allowed", () => {
        expect(isCurrLinkActive("/foo", "/foo/bar", false)).toBe(true);
        expect(isCurrLinkActive("/foo/bar", "/foo/bar/baz", false)).toBe(true);
        expect(isCurrLinkActive("/foo", "/foo", false)).toBe(true);
        expect(isCurrLinkActive("/foo/bar", "/foo", false)).toBe(false);
    });
});

describe("encodeArrayIntoStr", () => {
    test("should encode an array of strings into a single string", () => {
        const encoded = encodeArrayIntoStr(["0", "1", "2"]);
        expect(encoded).toBe("0,1,2");
    });

    test("should return an empty string for an empty array or invalid input", () => {
        expect(encodeArrayIntoStr([])).toBe("");
        expect(encodeArrayIntoStr(null)).toBe("");
    });

    test("should ignore empty strings in the array", () => {
        const encoded = encodeArrayIntoStr(["0", "", "1"]);
        expect(encoded).toBe("0,1");
    });

    test("should encode non-compatible URI characters", () => {
        const encoded = encodeArrayIntoStr(["$ 79", "true=!false"]);
        expect(encoded).toBe("%24%2079,true%3D!false");
    });
});

describe("decodeStringArray", () => {
    test("should decode a string into an array of strings", () => {
        const decoded = decodeStringArray("0,1,2");
        expect(decoded).toEqual(["0", "1", "2"]);
    });

    test("should return an empty array for an empty string", () => {
        expect(decodeStringArray("")).toEqual([]);
        expect(decodeStringArray(null)).toEqual([]);
    });

    test("should ignore invalid commas", () => {
        expect(decodeStringArray(",0,1,2,")).toEqual(["0", "1", "2"]);
        expect(decodeStringArray("a,,b,c")).toEqual(["a", "b", "c"]);
    });

    test("should decode URI encoded characters", () => {
        const decoded = decodeStringArray("%24%2079,true%3D!false");
        expect(decoded).toEqual(["$ 79", "true=!false"]);
    });
});

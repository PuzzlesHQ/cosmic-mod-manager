import { describe, expect, test } from "bun:test";
import { Capitalize, createURLSafeSlug, decodeStringArray, encodeArrayIntoStr, isCurrLinkActive } from "./string";

describe("Capitalize", () => {
    test("capitalizes the first letter of a string", () => {
        expect(Capitalize("hello")).toBe("Hello");
    });

    test("returns an empty string when input is empty", () => {
        expect(Capitalize("")).toBe("");
    });

    test("works with multiple space separated words", () => {
        expect(Capitalize("some title", true)).toBe("Some Title");
    });
});

describe("createURLSafeSlug", () => {
    test("converts spaces to hyphens and lowercases the string", () => {
        expect(createURLSafeSlug("a B")).toBe("a-b");
    });

    test("removes characters not in the allowed set", () => {
        // '#' is not allowed, so it should be removed
        expect(createURLSafeSlug("foo#!bar")).toBe("foo!bar");
    });

    test("respects given additional characters", () => {
        expect(createURLSafeSlug("foo#bar", "#")).toBe("foo#bar");
    });

    test("removes all disallowed special characters", () => {
        // '/', '?' and '=' are not allowed
        expect(createURLSafeSlug("foo/bar?baz=qux")).toBe("foobarbazqux");
    });
});

describe("isCurrLinkActive", () => {
    test("handles trailing slashes", () => {
        expect(isCurrLinkActive("/foo/bar", "/foo/bar")).toBe(true);
        expect(isCurrLinkActive("/foo/", "/foo")).toBe(true);
        expect(isCurrLinkActive("/foo", "/foo/")).toBe(true);
    });

    test("returns false on different URLs (the obvious)", () => {
        expect(isCurrLinkActive("/bar", "/baz")).toBe(false);
        expect(isCurrLinkActive("/foo", "/foo/bar")).toBe(false);
        expect(isCurrLinkActive("/foo/bar", "/foo")).toBe(false);
    });

    test("handles partial matches (when told to)", () => {
        expect(isCurrLinkActive("/foo", "/foo/bar", false)).toBe(true);
        expect(isCurrLinkActive("/foo/bar", "/foo/bar/baz", false)).toBe(true);
        expect(isCurrLinkActive("/foo", "/foo", false)).toBe(true);
        expect(isCurrLinkActive("/foo/bar", "/foo", false)).toBe(false);
    });
});

describe("encodeArrayIntoStr", () => {
    test("encodes an array of strings into a single string", () => {
        const encoded = encodeArrayIntoStr(["0", "1", "2"]);
        expect(encoded).toBe("0,1,2");
    });

    test("returns an empty string for an empty array", () => {
        expect(encodeArrayIntoStr([])).toBe("");
    });

    test("handles arrays with empty strings", () => {
        const encoded = encodeArrayIntoStr(["0", "", "1"]);
        expect(encoded).toBe("0,1");
    });

    test("encodes non compatible URI characters", () => {
        const encoded = encodeArrayIntoStr(["$ 79", "true=!false"]);
        expect(encoded).toBe("%24%2079,true%3D!false");
    });
});

describe("decodeStringArray", () => {
    test("decodes a string into an array of strings", () => {
        const decoded = decodeStringArray("0,1,2");
        expect(decoded).toEqual(["0", "1", "2"]);
    });

    test("returns an empty array for an empty string", () => {
        expect(decodeStringArray("")).toEqual([]);
    });

    test("handles strings with leading/trailing commas", () => {
        expect(decodeStringArray(",0,1,2,")).toEqual(["0", "1", "2"]);
    });

    test("decodes URI encoded characters", () => {
        const decoded = decodeStringArray("%24%2079,true%3D!false");
        expect(decoded).toEqual(["$ 79", "true=!false"]);
    });
});

import { describe, expect, test } from "bun:test";
import {
    CollectionPagePath,
    joinPaths,
    omitOrigin,
    OrgPagePath,
    ProjectPagePath,
    ReportPagePath,
    stringifyLocation,
    UserProfilePath,
    VersionPagePath,
} from "./urls";

describe("stringifyLocation", () => {
    test("should include pathname, search and hash when present", () => {
        expect(
            stringifyLocation({
                pathname: "/project/demo",
                search: "?page=2",
                hash: "#files",
            }),
        ).toBe("/project/demo?page=2#files");
    });

    test("should omit empty search and hash", () => {
        expect(
            stringifyLocation({
                pathname: "/project/demo",
                search: "",
                hash: "",
            }),
        ).toBe("/project/demo");
    });
});

describe("joinPaths", () => {
    test("should normalize slashes and skip empty fragments", () => {
        expect(joinPaths("/project/", "/demo/", "", undefined, "versions")).toBe("/project/demo/versions");
    });

    test("should keep absolute URLs as-is without forcing leading slash", () => {
        expect(joinPaths("https://example.com/", "/a/", "b")).toBe("https://example.com/a/b");
    });

    test("should return empty string when no valid fragments are provided", () => {
        expect(joinPaths()).toBe("");
        expect(joinPaths("", null, undefined)).toBe("");
    });
});

describe("route path helpers", () => {
    test("should generate expected resource paths", () => {
        expect(ProjectPagePath("mod", "abc-mod")).toBe("/mod/abc-mod");
        expect(VersionPagePath("mod", "abc-mod", "v1.0.0")).toBe("/mod/abc-mod/version/v1.0.0");
        expect(OrgPagePath("random-org")).toBe("/organization/random-org");
        expect(UserProfilePath("the-user")).toBe("/user/the-user");
        expect(CollectionPagePath("collection-id")).toBe("/collection/collection-id");
    });

    test("should generate moderation and dashboard report paths", () => {
        expect(ReportPagePath("rpt_1", true)).toBe("/moderation/report/rpt_1");
        expect(ReportPagePath("rpt_1", false)).toBe("/dashboard/report/rpt_1");
    });
});

describe("omitOrigin", () => {
    test("should return location without origin for URL objects", () => {
        const url = new URL("https://crmods.org/project/demo?tab=files#download");
        expect(omitOrigin(url)).toBe("/project/demo?tab=files#download");
    });
});

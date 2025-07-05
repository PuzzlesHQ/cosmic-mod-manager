import { describe, expect, test } from "bun:test";

import { VersionReleaseChannel } from "@app/utils/types";
import { GetReleaseChannelFilter } from "./project";

describe("GetReleaseChannelFilter", () => {
    test("handles undefined/invalid input", () => {
        expect(GetReleaseChannelFilter()).toEqual([VersionReleaseChannel.RELEASE]);
        expect(GetReleaseChannelFilter("invalid-channel")).toEqual([VersionReleaseChannel.RELEASE]);
    });

    test("returns correct channels", () => {
        expect(GetReleaseChannelFilter("alpha")).toEqual([
            VersionReleaseChannel.RELEASE,
            VersionReleaseChannel.BETA,
            VersionReleaseChannel.ALPHA,
        ]);
    });

    test("handles -only suffix", () => {
        expect(GetReleaseChannelFilter("dev-only")).toEqual([VersionReleaseChannel.DEV]);
    });
});

import { describe, expect, test } from "bun:test";

import { VersionReleaseChannel } from "@app/utils/types";
import { GetReleaseChannelFilter } from "./project";

describe("GetReleaseChannelFilter", () => {
    test("should return RELEASE by default when input is undefined or invalid", () => {
        expect(GetReleaseChannelFilter()).toEqual([VersionReleaseChannel.RELEASE]);
        expect(GetReleaseChannelFilter("invalid-channel")).toEqual([VersionReleaseChannel.RELEASE]);
    });

    test("should return all the channels more stable than the input channel", () => {
        expect(GetReleaseChannelFilter("alpha")).toEqual([
            VersionReleaseChannel.RELEASE,
            VersionReleaseChannel.BETA,
            VersionReleaseChannel.ALPHA,
        ]);
    });

    test("should return only the specified channel when suffixed with '-only'", () => {
        expect(GetReleaseChannelFilter("dev-only")).toEqual([VersionReleaseChannel.DEV]);
    });
});

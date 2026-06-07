import { VersionReleaseChannel } from "@app/utils/types";

/**
 * Returns all the channels that are more stable that the one specified \
 * For example: `GetReleaseChannelFilter("beta")` would return \
 * `["release", "beta"]` \
 * \
 * Suffixing the input string with `"-only"` will returns only the specified channel \
 * `GetReleaseChannelFilter("beta-only")` => `"beta"`
 */
export function GetReleaseChannelFilter(channel?: string) {
    // eg: beta-only
    // idk why someone would want that specifically but whatever
    let onlySpecifiedChannel = false;
    if (typeof channel === "string" && channel.endsWith("-only")) {
        onlySpecifiedChannel = true;
        channel = channel.replace("-only", "");
    }

    const filterChannels = [VersionReleaseChannel.RELEASE];

    // The last entry should always match the specified release channel
    // so that we can handle the "-only" case easily
    switch (channel?.toLowerCase()) {
        case VersionReleaseChannel.DEV:
            filterChannels.push(VersionReleaseChannel.BETA, VersionReleaseChannel.ALPHA, VersionReleaseChannel.DEV);
            break;

        case VersionReleaseChannel.ALPHA:
            filterChannels.push(VersionReleaseChannel.BETA, VersionReleaseChannel.ALPHA);
            break;

        case VersionReleaseChannel.BETA:
            filterChannels.push(VersionReleaseChannel.BETA);
            break;

        case VersionReleaseChannel.RELEASE:
            // Release is there by default
            break;
    }

    if (onlySpecifiedChannel) return [filterChannels.at(-1) as VersionReleaseChannel];
    return filterChannels;
}

import GAME_VERSIONS, { gameVersionsList as AllGameVersions, type GameVersion } from "~/constants/game-versions";
import { sortVersionsWithReference } from "~/project";
import { ParseInt } from "~/string";
import { GameVersionReleaseType } from "~/types";

// Full credits to modrinth
// Source: https://github.com/modrinth/code/blob/10ef25eabb478275129518b606333ecb14b609e4/apps/frontend/src/helpers/projects.js#L85

/**
 * Formats an array of game versions for display purposes.
 *
 * This function takes an array of game versions and sorts them based on a reference list of all game versions.
 * It then categorizes the versions into releases, snapshots, and legacy versions. The function groups the versions
 * into ranges where applicable and returns an array of formatted version strings.
 *
 * @param gameVersions - An array of game version strings to be formatted.
 * @returns An array of formatted version strings for display.
 */
export function formatVersionsForDisplay(gameVersions: string[]) {
    const allVersions = GAME_VERSIONS.slice();
    const inputVersions = sortVersionsWithReference(gameVersions, AllGameVersions);

    const allReleases = allVersions.filter(
        (version) =>
            version.releaseType === GameVersionReleaseType.RELEASE || version.releaseType === GameVersionReleaseType.ALPHA,
    );
    const allSnapshots = allVersions.filter(
        (version) =>
            version.releaseType === GameVersionReleaseType.SNAPSHOT || version.releaseType === GameVersionReleaseType.PRE_RELEASE,
    );
    const allLegacy = allVersions.filter(
        (version) =>
            version.releaseType !== GameVersionReleaseType.SNAPSHOT &&
            version.releaseType !== GameVersionReleaseType.RELEASE &&
            version.releaseType !== GameVersionReleaseType.PRE_RELEASE &&
            version.releaseType !== GameVersionReleaseType.ALPHA,
    );

    const releaseVersions = inputVersions.filter((projVer) => allReleases.some((gameVer) => gameVer.value === projVer));

    const latestSnapshot = inputVersions.find((projVer) =>
        allSnapshots.some(
            (gameVer) =>
                gameVer.value === projVer &&
                (AllGameVersions.indexOf(gameVer.value) < AllGameVersions.indexOf(releaseVersions[0]) || !releaseVersions[0]),
        ),
    );

    const allReleasesGrouped = groupVersions(
        allReleases.map((release) => release.value),
        false,
    );
    const projectVersionsGrouped = groupVersions(releaseVersions, true);

    const releaseVersionsAsRanges = projectVersionsGrouped.map(({ major, minor }) => {
        if (minor.length === 1) {
            return formatVersion(major, minor[0]);
        }

        const foundRelease = allReleasesGrouped.find((x) => x.major === major);
        if (foundRelease?.minor.every((value, index) => value === minor[index])) {
            return `${major}.x`;
        }

        return `${formatVersion(major, minor[0])}–${formatVersion(major, minor[minor.length - 1])}`;
    });

    const legacyVersionsAsRanges = groupConsecutiveIndices(
        inputVersions.filter((projVer) => allLegacy.some((gameVer) => gameVer.value === projVer)),
        allLegacy,
    );

    let output = [...legacyVersionsAsRanges];
    // show all snapshots if there's no release versions
    if (releaseVersionsAsRanges.length === 0) {
        const snapshotVersionsAsRanges = groupConsecutiveIndices(
            inputVersions.filter((projVer) => allSnapshots.some((gameVer) => gameVer.value === projVer)),
            allSnapshots,
        );
        output = [...snapshotVersionsAsRanges, ...output];
    } else {
        output = [...releaseVersionsAsRanges, ...output];
    }

    if (latestSnapshot && !output.includes(latestSnapshot)) {
        output = [latestSnapshot, ...output];
    }
    return output;
}

const gameVersionRegex = /^([0-9]+.[0-9]+)(.[0-9]+)?$/;

interface Range {
    major: string;
    minor: number[];
}

/**
 * Groups an array of version strings into ranges based on their major and minor versions.
 *
 * @param versions - An array of version strings to be grouped.
 * @param consecutive - A boolean indicating whether to group only consecutive minor versions.
 * @returns An array of ranges, where each range contains a major version and an array of minor versions.
 */
function groupVersions(versions: string[], consecutive = false) {
    return versions
        .slice()
        .reverse()
        .reduce<Range[]>((ranges, version) => {
            const matchesVersion = version.match(gameVersionRegex);

            if (matchesVersion) {
                const majorVersion = matchesVersion[1];
                const minorVersion = matchesVersion[2];
                const minorNumeric = minorVersion ? ParseInt(minorVersion.replace(".", "")) : 0;

                let prevInRange: Range | undefined;

                prevInRange = ranges.find(
                    (x) => x.major === majorVersion && (!consecutive || x.minor.at(-1) === minorNumeric - 1),
                );
                if (prevInRange) {
                    prevInRange.minor.push(minorNumeric);
                    return ranges;
                }

                return [...ranges.slice(), { major: majorVersion, minor: [minorNumeric] }];
            }

            return ranges;
        }, [])
        .reverse();
}

function groupConsecutiveIndices(versions: string[], referenceList: GameVersion[]) {
    if (!versions || versions.length === 0) {
        return [];
    }

    const referenceMap = new Map();
    referenceList.forEach((item, index) => {
        referenceMap.set(item.value, index);
    });

    const sortedList = versions.slice().sort((a, b) => referenceMap.get(a) - referenceMap.get(b));

    const ranges = [];
    let start = sortedList[0];
    let previous = sortedList[0];

    for (let i = 1; i < sortedList.length; i++) {
        const current = sortedList[i];
        if (referenceMap.get(current) !== referenceMap.get(previous) + 1) {
            ranges.push(`${previous}–${start}`);
            start = current;
        }
        previous = current;
    }

    ranges.push(`${previous}–${start}`);

    return ranges;
}

function formatVersion(major: string | number, minor: string | number) {
    return minor === 0 ? `${major}` : `${major}.${minor}`;
}

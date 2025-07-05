import GAME_VERSIONS, { type GameVersion, getGameVersionsFromValues, isExperimentalGameVersion } from "~/constants/game-versions";
import { sortVersionsWithReference } from "~/project";

/**
 * does the same thing as ./format.ts/formatVersionsForDisplay, but does not omit any versions.
 *
 * @example
 * formatVersionsForDisplay_noOmit(["0.3.3", "0.3.2", "0.3.2-pre2", "0.3.2-pre1", "0.3.1"]);
 * // Returns ["0.3.2–0.3.3", "0.3.2-pre1–0.3.2-pre2", "0.3.1"];
 */

export function formatVersionsForDisplay_noOmit(inputVersions: string[]): string[] {
    if (!inputVersions.length) return [];

    const formattedList: string[] = [];
    const groupedVersions = groupContinuousVersions(inputVersions);

    for (const versionGroup of groupedVersions) {
        const firstItem = versionGroup[0]?.label;

        if (firstItem && versionGroup.length === 1) formattedList.push(firstItem);
        else {
            const lastItem = versionGroup.at(-1)?.label;
            formattedList.push(`${lastItem}–${firstItem}`);
        }
    }
    return formattedList;
}

function groupContinuousVersions(versions: string[]): GameVersion[][] {
    let referenceList = GAME_VERSIONS;
    const groupedList: GameVersion[][] = [[]];
    const sortedVersions = getGameVersionsFromValues(
        sortVersionsWithReference(
            versions,
            referenceList.map((version) => version.value),
        ),
    );

    if (!sortedVersions.length) return groupedList;

    // If the original version list doesn't have experimental versions, filter them out from the reference list
    if (!sortedVersions.some((item) => isExperimentalGameVersion(item.releaseType))) {
        referenceList = referenceList.filter((version) => !isExperimentalGameVersion(version.releaseType));
    }

    let refListIndex = gameVersionIndex(sortedVersions[0], referenceList);
    if (refListIndex === -1) return [[]];

    for (let i = 0; i < sortedVersions.length; i++) {
        const currItem = sortedVersions[i];
        const nextItem = sortedVersions[i + 1];
        refListIndex = gameVersionIndex(currItem, referenceList);

        groupedList.at(-1)?.push(currItem);

        const currItemIsExperimental = isExperimentalGameVersion(currItem.releaseType);
        const nextItemIsExperimental = nextItem ? isExperimentalGameVersion(nextItem.releaseType) : false;

        // If the next item is not the next version in the reference list, start a new group
        if (nextItem && gameVersionIndex(nextItem, referenceList) !== refListIndex + 1) {
            groupedList.push([]);
        }

        // If the next item is experimental and the current item is not or vice versa, start a new group
        else if (nextItem && currItemIsExperimental !== nextItemIsExperimental) {
            groupedList.push([]);
        }
    }

    return groupedList;
}

function gameVersionIndex(version: GameVersion, referenceList: GameVersion[]): number {
    for (let i = 0; i < referenceList.length; i++) {
        if (referenceList[i].value === version.value) return i;
    }

    return -1;
}

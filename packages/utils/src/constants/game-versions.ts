import gameVersions_raw from "~/constants/game-versions.json" with { type: "json" };
import { GameVersionReleaseType } from "~/types";

export interface GameVersion {
    label: string;
    value: string;
    releaseType: GameVersionReleaseType;
    major: boolean;
}

const GAME_VERSIONS: GameVersion[] = [];
for (const version of gameVersions_raw) {
    if (!Object.values(GameVersionReleaseType).includes(version.releaseType as GameVersionReleaseType)) {
        throw new Error(`Invalid release type: '${version.releaseType}' for version: ${version.label}`);
    }

    GAME_VERSIONS.push({
        label: version.label,
        value: version.value,
        releaseType: version.releaseType as GameVersionReleaseType,
        major: version.major,
    });
}

export default GAME_VERSIONS;

export const gameVersionsList = GAME_VERSIONS.map((version) => version.value);

export function getGameVersionFromLabel(label: string): GameVersion | null {
    return GAME_VERSIONS.find((version) => version.label === label) || null;
}

export function getGameVersionFromValue(value: string): GameVersion | null {
    return GAME_VERSIONS.find((version) => version.value === value) || null;
}

export function getGameVersionsFromLabels(labels: string[]): GameVersion[] {
    return labels.map((label) => getGameVersionFromLabel(label)).filter((version) => version !== null) as GameVersion[];
}

export function getGameVersionsFromValues(values: string[]): GameVersion[] {
    return values.map((value) => getGameVersionFromValue(value)).filter((version) => version !== null) as GameVersion[];
}

export function isExperimentalGameVersion(releaseType: GameVersionReleaseType) {
    return [
        GameVersionReleaseType.SNAPSHOT,
        GameVersionReleaseType.PRE_RELEASE,
        // TODO: Uncomment when ALPHA versions are considered experimental
        // GameVersionReleaseType.ALPHA,
        // GameVersionReleaseType.BETA,
    ].includes(releaseType);
}

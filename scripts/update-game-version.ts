import GAME_VERSIONS, { type GameVersion } from "@app/utils/src/constants/game-versions";
import { GameVersionReleaseType } from "@app/utils/src/types";

const CR_ARCHIVE_VERSION_FILE_URL = "https://raw.githubusercontent.com/PuzzlesHQ/CRArchive/refs/heads/main/versions.json";

interface CRArchive {
    latest: Record<string, string>;
    versions: CRArchiveVersion[];
}

interface CRArchiveVersion {
    id: string;
    phase: "pre_alpha" | "alpha" | "beta" | "release";
    releaseTime: number;
}

await main();
async function main() {
    const response = await fetch(CR_ARCHIVE_VERSION_FILE_URL);
    if (!response.ok) {
        throw new Error(
            `Failed to fetch version file from ${CR_ARCHIVE_VERSION_FILE_URL}: ${response.status} ${response.statusText}`,
        );
    }

    const newAddedVersions: GameVersion[] = [];

    const data: CRArchive = (await response.json()) as CRArchive;

    for (const ver of data.versions) {
        const parsedId = parseId(ver.id);
        if (!GAME_VERSIONS.some((v) => v.value === parsedId)) {
            newAddedVersions.push({
                label: formatLabel(parsedId),
                value: parsedId,
                releaseType: getReleaseChannel(ver.phase),
                major: false,
            });
        } else {
            // the moment we find a version that already exists, we can
            // break out of the loop since versions are in descending order
            break;
        }
    }
    if (!newAddedVersions.length) {
        console.log("No new versions to add.");
        return;
    }

    const updatedList = newAddedVersions.concat(GAME_VERSIONS);
    await Bun.write("packages/utils/src/constants/game-versions.json", JSON.stringify(updatedList, null, 4));
}

function parseId(id: string) {
    const regex = /^(\d+)\.(\d+)(\.)?(\d+)?/;
    const match = id.match(regex);
    if (!match) {
        throw new Error(`Invalid version id: ${id}`);
    }

    return match[0];
}

function formatLabel(id: string) {
    const parts = id.split(".");
    if (parts.length === 3 && parts[2] === "0") {
        parts.pop();
        return parts.join(".");
    } else {
        return id;
    }
}

function getReleaseChannel(phase: string) {
    const enumMatch = Object.values(GameVersionReleaseType).find((ver) => ver === phase);
    if (enumMatch) return enumMatch;

    return GameVersionReleaseType.ALPHA;
}

import type { ProjectVersionData } from "@app/utils/types/api";

export function findProjectVersion(
    gameVersions: ProjectVersionData[] | undefined,
    slug: string | undefined,
    searchParams: URLSearchParams,
) {
    if (!slug || !gameVersions?.length) return null;
    // direct match
    if (slug !== "latest") return gameVersions.find((version) => version.slug === slug || version.id === slug);

    // find the latest version based on filters
    const gameVersion = searchParams.get("gameVersion");
    const loader = searchParams.get("loader");
    const releaseChannel = searchParams.get("releaseChannel");

    if (!gameVersion && !loader && !releaseChannel) return gameVersions[0];

    for (let i = 0; i < gameVersions.length; i++) {
        const version = gameVersions[i];

        if (gameVersion?.length && !version.gameVersions.includes(gameVersion)) continue;
        if (loader?.length && !version.loaders.includes(loader)) continue;
        if (releaseChannel?.length && version.releaseChannel !== releaseChannel.toLowerCase()) continue;

        return version;
    }

    return null;
}

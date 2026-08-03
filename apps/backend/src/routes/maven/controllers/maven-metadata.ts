import { VersionReleaseChannel } from "@app/utils/types";
import { GetProject_ListItem } from "~/db/project_item";
import { GetVersions } from "~/db/version_item";
import { isProjectAccessible } from "~/routes/project/utils";
import type { SessionUserData } from "~/types";
import { HTTP_STATUS, notFoundResponseData } from "~/utils/http";
import { GROUP_ID } from "../consts";

export async function GetProjectMetadata(projectSlug: string, sessionUser: SessionUserData | null) {
    const project = await GetProject_ListItem(projectSlug, projectSlug);
    if (!project) return notFoundResponseData();
    if (!isProjectAccessible(project, sessionUser)) {
        return notFoundResponseData();
    }

    const versions = await GetVersions(project.id);
    if (!versions?.versions?.length) return notFoundResponseData();

    const latest = versions.versions[0];
    let stableRelease = versions.versions.find((v) => v.releaseChannel === VersionReleaseChannel.RELEASE);
    if (!stableRelease) stableRelease = latest;

    // Maven expects timestamps in exactly YYYYMMDDHHMMSS format
    const lastUpdated = new Date(latest.datePublished)
        .toISOString()
        .replace(/[-:T.]/g, "")
        .slice(0, 14);

    const versionsXml = versions.versions
        .reverse()
        .map((v) => `      <version>${v.slug}</version>`)
        .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<metadata>
    <groupId>${GROUP_ID}</groupId>
    <artifactId>${projectSlug}</artifactId>
    <versioning>
        <latest>${latest.slug}</latest>
        <release>${stableRelease.slug}</release>
        <versions>
${versionsXml}
        </versions>
        <lastUpdated>${lastUpdated}</lastUpdated>
    </versioning>
</metadata>`;

    return {
        data: {
            success: true,
            data: xml,
        },
        status: HTTP_STATUS.OK,
    } as const;
}

export async function GetVersionMetadata(artifactId: string, version: string) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" 
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>${GROUP_ID}</groupId>
    <artifactId>${artifactId}</artifactId>
    <version>${version}</version>
</project>`;
}

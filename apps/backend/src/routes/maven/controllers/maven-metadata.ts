import { mapObjectList } from "@app/utils/arrays";
import { VersionReleaseChannel } from "@app/utils/types";
import { GetProject_ListItem } from "~/db/project_item";
import { GetVersions, type TVersions } from "~/db/version_item";
import { isProjectAccessible } from "~/routes/project/utils";
import type { UserSessionData } from "~/types";
import { HTTP_STATUS, notFoundResponseData } from "~/utils/http";
import { GROUP_ID } from "../consts";

export async function GetProjectMetadata(projectSlug: string, sessionUser: UserSessionData | null) {
    const project = await GetProject_ListItem(projectSlug, projectSlug);
    if (!project) return notFoundResponseData();
    if (
        !isProjectAccessible({
            visibility: project.visibility,
            publishingStatus: project.status,
            userId: sessionUser?.id,
            sessionUserRole: sessionUser?.role,
            teamMembers: mapObjectList(project.team.members, "userId"),
            orgMembers: mapObjectList(project.organisation?.team.members ?? [], "userId"),
        })
    ) {
        return notFoundResponseData();
    }

    const versions = await GetVersions(project.id);
    if (!versions?.versions?.length) return notFoundResponseData();

    const latest = versions.versions[0];
    let stableRelease: TVersions["versions"][number] | undefined;

    for (const v of versions.versions) {
        if (v.releaseChannel === VersionReleaseChannel.RELEASE) {
            stableRelease = v;
            break;
        }
    }
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
    <artifactId>${project.slug}</artifactId>
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
            metadata: xml,
        },
        status: HTTP_STATUS.OK,
    };
}

export async function GetVersionMetadata(artifactId: string, version: string) {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" 
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>${GROUP_ID}</groupId>
    <artifactId>${artifactId}</artifactId>
    <version>${version}</version>
</project>`;

    return {
        data: {
            success: true,
            metadata: xml,
        },
        status: HTTP_STATUS.OK,
    };
}

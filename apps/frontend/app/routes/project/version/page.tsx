import { FormatDate_ToLocaleString } from "@app/utils/date";
import { FormatCount } from "@app/utils/number";
import { CapitalizeAndFormatString } from "@app/utils/string";
import type { ProjectVersionData } from "@app/utils/types/api";
import { formatVersionsForDisplay } from "@app/utils/version/format";
import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router";
import { useNavigate } from "~/components/ui/link";
import { useProjectData } from "~/hooks/project";
import NotFoundPage from "~/pages/not-found";
import VersionPage from "~/pages/project/version/page";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { ProjectPagePath, VersionPagePath, getCurrLocation } from "~/utils/urls";
import type { Route } from "./+types/page";

export default function () {
    const ctx = useProjectData();
    const { projectSlug, versionSlug } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const versionData = filterGameVersion(ctx.allProjectVersions, versionSlug, searchParams);
    if (!versionData?.id || !projectSlug || !versionSlug) {
        return (
            <NotFoundPage
                className="no_full_page py-16"
                title="Version not found"
                description="The version you are looking for doesn't exist"
                linkLabel="See versions list"
                linkHref={ProjectPagePath(ctx.projectType, projectSlug || "", "versions")}
            />
        );
    }

    useEffect(() => {
        navigate(VersionPagePath(ctx.projectType, projectSlug, versionData.slug));
    }, []);

    return <VersionPage ctx={ctx} versionData={versionData} projectSlug={projectSlug} />;
}

export function meta(props: Route.MetaArgs) {
    const parentMetaTags = props.matches?.at(-3)?.meta;
    // 2nd from top is the __mod__data-wrapper which holds the project related data returned from the loader
    const parentData = props.matches[1].data;
    const project = parentData?.projectData;
    const versionSlug = props.params?.versionSlug;

    if (!parentData || !project?.id) {
        return MetaTags({
            title: "Project not found",
            description: `The project with the slug/ID "${parentData.projectSlug}" does not exist.`,
            image: Config.SITE_ICON,
            url: `${Config.FRONTEND_URL}`,
            suffixTitle: true,
        });
    }

    const url = getCurrLocation();
    const version = filterGameVersion(parentData.versions, versionSlug, new URLSearchParams(url.search));

    if (!version?.id) {
        return MetaTags({
            title: `Version not found - ${project.name}`,
            description: `${project.name} does not have a version with the slug/ID "${versionSlug}".`,
            image: Config.SITE_ICON,
            url: `${Config.FRONTEND_URL}${ProjectPagePath(project.type?.[0], project.slug, "versions")}`,
        });
    }

    const loaders = version.loaders.length ? version.loaders.map((l) => CapitalizeAndFormatString(l)).join(" & ") : null;
    const publishedAt = FormatDate_ToLocaleString(version.datePublished, {
        includeTime: false,
        shortMonthNames: false,
        utc: true,
    });

    const titleIncludesProjectName = version.title.toLowerCase().includes(project.name.toLowerCase());

    return MetaTags({
        title: `${version.title}${titleIncludesProjectName ? "" : ` - ${project.name}`}`,
        description: `Download ${project.name} ${version.versionNumber} on ${Config.SITE_NAME_SHORT}. Supports cosmic reach ${formatVersionsForDisplay(version.gameVersions).join(", ")}${loaders ? ` on ${loaders}` : ""}. Published on ${publishedAt} by ${version.author?.userName}. ${FormatCount(version.downloads)} downloads.`,
        url: `${Config.FRONTEND_URL}${ProjectPagePath(project.type?.[0], project.slug, `version/${version.slug}`)}`,
        image: project.icon || "",
        parentMetaTags,
    });
}

function filterGameVersion(gameVersions: ProjectVersionData[] | undefined, slug: string | undefined, searchParams: URLSearchParams) {
    if (!slug || !gameVersions?.length) return null;
    if (slug !== "latest") return gameVersions?.find((version) => version.slug === slug || version.id === slug);

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

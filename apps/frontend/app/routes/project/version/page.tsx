import { getProjectTypeFromName } from "@app/utils/convertors";
import { FormatDate_ToLocaleString } from "@app/utils/date";
import { FormatCount } from "@app/utils/number";
import { CapitalizeAndFormatString } from "@app/utils/string";
import type { ProjectVersionData } from "@app/utils/types/api";
import { formatVersionsForDisplay } from "@app/utils/version/format";
import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router";
import { useNavigate } from "~/components/ui/link";
import { useProjectData } from "~/hooks/project";
import { useTranslation } from "~/locales/provider";
import NotFoundPage from "~/pages/not-found";
import VersionPage from "~/pages/project/version/page";
import { getProjectLoaderData } from "~/routes/project/utils";
import Config from "~/utils/config";
import { MetaTags } from "~/utils/meta";
import { ProjectPagePath, VersionPagePath } from "~/utils/urls";
import type { Route } from "./+types/page";

export default function () {
    const { t } = useTranslation();
    const ctx = useProjectData();
    const { projectSlug, versionSlug } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const versionData = filterGameVersion(ctx.allProjectVersions, versionSlug, searchParams);

    useEffect(() => {
        if (versionSlug !== "latest" || !projectSlug || !versionData) return;
        // If the version slug is "latest", we redirect to the specific version page
        // This is to ensure that the URL is always specific to a version
        // and not just "latest", which can be confusing for users.
        navigate(VersionPagePath(ctx.projectType, projectSlug, versionData.slug));
    }, [versionSlug]);

    if (!versionData?.id || !projectSlug || !versionSlug) {
        return (
            <NotFoundPage
                className="no_full_page py-16"
                title={t.error.versionNotFound}
                description={t.error.versionNotFoundDesc(
                    ctx.projectData.name,
                    t.navbar[getProjectTypeFromName(ctx.projectData.type[0])],
                )}
                linkLabel={t.error.gotoVersionsList}
                linkHref={ProjectPagePath(ctx.projectType, projectSlug || "", "versions")}
            />
        );
    }

    return <VersionPage ctx={ctx} versionData={versionData} projectSlug={projectSlug} />;
}

export function meta(props: Route.MetaArgs) {
    const { t, formattedLocaleName } = useTranslation();
    const ctx = getProjectLoaderData(props.matches, props.location.pathname);
    const project = ctx?.projectData;
    const versionSlug = props.params?.versionSlug;

    const version = filterGameVersion(ctx.versions, versionSlug, new URLSearchParams(props.location.search));

    if (!project?.id) {
        return null;
    }

    if (!version?.id) {
        return MetaTags({
            location: props.location,
            title: t.meta.addContext(t.error.versionNotFound, project.name),
            description: t.error.versionNotFoundDesc(project.name, t.navbar[getProjectTypeFromName(project.type[0])]),
            image: project.icon || Config.SITE_ICON,
            url: undefined,
            parentMetaTags: props.matches[1].meta,
        });
    }

    const loaders = version.loaders.length ? version.loaders.map((l) => CapitalizeAndFormatString(l)).join(" & ") : null;
    const publishedAt = FormatDate_ToLocaleString(version.datePublished, {
        includeTime: false,
        shortMonthNames: false,
        utc: true,
    });

    const titleIncludesProjectName = version.title.toLowerCase().includes(project.name.toLowerCase());

    const description = t.meta.versionPageDesc({
        project: project.name,
        versionNumber: version.versionNumber,
        siteName_short: Config.SITE_NAME_SHORT,
        supportedGameVersions: formatVersionsForDisplay(version.gameVersions).join(", "),
        loaders: loaders,
        publishedAt: publishedAt,
        author: version.author.userName,
        downloads: FormatCount(version.downloads, formattedLocaleName),
    });

    return MetaTags({
        location: props.location,
        title: titleIncludesProjectName ? version.title : t.meta.addContext(version.title, project.name),
        description: description,
        image: project.icon || "",
        url: Config.FRONTEND_URL + ProjectPagePath(project.type?.[0], project.slug, `version/${version.slug}`),
        parentMetaTags: props.matches[1].meta,
    });
}

function filterGameVersion(
    gameVersions: ProjectVersionData[] | undefined,
    slug: string | undefined,
    searchParams: URLSearchParams,
) {
    if (!slug || !gameVersions?.length) return null;
    if (slug !== "latest") return gameVersions.find((version) => version.slug === slug || version.id === slug);

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

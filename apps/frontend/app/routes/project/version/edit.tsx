import { getProjectTypeFromName } from "@app/utils/convertors";
import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router";
import { useNavigate } from "~/components/ui/link";
import Redirect from "~/components/ui/redirect";
import { useProjectData } from "~/hooks/project";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import NotFoundPage from "~/pages/not-found";
import EditVersionPage from "~/pages/project/version/edit-version";
import { ProjectPagePath, VersionPagePath } from "~/utils/urls";
import { findProjectVersion } from "./find-version";

export default function () {
    const session = useSession();
    const { t } = useTranslation();
    const ctx = useProjectData();
    const { projectSlug, versionSlug } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const versionData = findProjectVersion(ctx.allProjectVersions, versionSlug, searchParams);

    useEffect(() => {
        if (versionSlug !== "latest" || !projectSlug || !versionData) return;
        navigate(VersionPagePath(ctx.projectType, projectSlug, versionData.slug));
    }, [versionSlug]);

    if (!session) return <Redirect to="/login" />;
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
                linkHref={ProjectPagePath(ctx.projectType, projectSlug ?? "", "versions")}
            />
        );
    }
    return <EditVersionPage versionData={versionData} />;
}

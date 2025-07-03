import { fallbackProjectIcon, fallbackUserIcon } from "@app/components/icons";
import { DownloadAnimationContext } from "@app/components/misc/download-animation";
import { ContentCardTemplate } from "@app/components/misc/panel";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@app/components/ui/breadcrumb";
import { Card } from "@app/components/ui/card";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@app/components/ui/context-menu";
import CopyBtn, { copyTextToClipboard } from "@app/components/ui/copy-btn";
import { Prefetch } from "@app/components/ui/link";
import ReleaseChannelChip from "@app/components/ui/release-channel-pill";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@app/components/ui/tooltip";
import { cn } from "@app/components/utils";
import { parseFileSize } from "@app/utils/number";
import { doesMemberHaveAccess } from "@app/utils/project";
import { CapitalizeAndFormatString } from "@app/utils/string";
import { ProjectPermission } from "@app/utils/types";
import type { ProjectVersionData } from "@app/utils/types/api";
import { ReportItemType } from "@app/utils/types/api/report";
import { imageUrl } from "@app/utils/url";
import { formatGameVersionsListString_verbose } from "@app/utils/version/format-verbose";
import { ChevronRightIcon, CopyIcon, DownloadIcon, Edit3Icon, FileIcon, LinkIcon, StarIcon } from "lucide-react";
import { lazy, Suspense, useContext } from "react";
import MarkdownRenderBox from "~/components/md-renderer";
import { ImgWrapper } from "~/components/ui/avatar";
import { FormattedCount } from "~/components/ui/count";
import { FormattedDate } from "~/components/ui/date";
import Link, { VariantButtonLink } from "~/components/ui/link";
import type { ProjectContextData } from "~/hooks/project";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import ReportButton from "~/pages/report/report-btn";
import { appendPathInUrl, ProjectPagePath, VersionPagePath } from "~/utils/urls";
import { TeamMember_Card } from "../layout";

const DeleteVersionDialog = lazy(() => import("./delete-version"));

interface Props {
    ctx: ProjectContextData;
    versionData: ProjectVersionData;
    projectSlug: string;
}

export default function VersionPage({ ctx, versionData, projectSlug }: Props) {
    const { t } = useTranslation();
    const { show: showDownloadAnimation } = useContext(DownloadAnimationContext);

    const session = useSession();
    const currUsersMembership = ctx.currUsersMembership;
    const projectDependencies = ctx.dependencies;

    const projectPageUrl = ProjectPagePath(ctx.projectType, projectSlug);

    return (
        <>
            <Card className="w-full flex flex-col items-start justify-start p-card-surround gap-4">
                <Breadcrumb>
                    <BreadcrumbList className="flex items-center">
                        <BreadcrumbItem>
                            <BreadcrumbLink href={appendPathInUrl(projectPageUrl, "versions")} className="text-base">
                                {t.project.versions}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="flex items-center justify-center">
                            <ChevronRightIcon aria-hidden size="1rem" className=" text-foreground" />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-base">{versionData?.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="w-full flex flex-wrap items-center justify-start gap-x-4">
                    <h1 className="text-2xl font-[700] text-foreground leading-tight">{versionData.title}</h1>
                    {versionData.featured ? (
                        <span className="flex items-center justify-center gap-1 text-extra-muted-foreground italic">
                            <StarIcon aria-hidden className="w-btn-icon h-btn-icon" />
                            {t.version.featured}
                        </span>
                    ) : null}
                </div>

                <div className="flex flex-wrap gap-x-2 gap-y-1.5">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <VariantButtonLink
                                    variant="default"
                                    url={versionData.primaryFile?.url ? versionData.primaryFile?.url : ""}
                                    onClick={showDownloadAnimation}
                                    rel="nofollow noindex"
                                >
                                    <DownloadIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                    {t.common.download}
                                </VariantButtonLink>
                            </TooltipTrigger>
                            <TooltipContent>
                                {versionData.primaryFile?.name} ({parseFileSize(versionData.primaryFile?.size || 0)})
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {!currUsersMembership?.userId ? (
                        <ReportButton itemType={ReportItemType.VERSION} itemId={versionData.id} btnVariant="secondary" />
                    ) : null}

                    {doesMemberHaveAccess(
                        ProjectPermission.UPLOAD_VERSION,
                        currUsersMembership?.permissions,
                        currUsersMembership?.isOwner,
                        session?.role,
                    ) ? (
                        <VariantButtonLink
                            url={VersionPagePath(ctx.projectType, ctx.projectData.slug, versionData.slug, "edit")}
                            prefetch={Prefetch.Render}
                        >
                            <Edit3Icon aria-hidden className="w-btn-icon h-btn-icon" />
                            {t.form.edit}
                        </VariantButtonLink>
                    ) : null}

                    {doesMemberHaveAccess(
                        ProjectPermission.DELETE_VERSION,
                        currUsersMembership?.permissions,
                        currUsersMembership?.isOwner,
                        session?.role,
                    ) ? (
                        <Suspense>
                            <DeleteVersionDialog
                                projectData={ctx.projectData}
                                projectSlug={ctx.projectData.slug}
                                versionSlug={versionData.slug}
                            />
                        </Suspense>
                    ) : null}
                </div>
            </Card>

            <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_min-content] gap-panel-cards items-start justify-start">
                <div className="overflow-auto flex flex-col gap-panel-cards items-start justify-start">
                    {versionData.changelog?.length ? (
                        <ContentCardTemplate title={t.project.changelog}>
                            <MarkdownRenderBox text={versionData.changelog} />
                        </ContentCardTemplate>
                    ) : null}

                    {versionData.dependencies.length ? (
                        <ContentCardTemplate title={t.version.dependencies} className="gap-2">
                            {versionData.dependencies.map((dependency) => {
                                const dependencyProject = projectDependencies.projects.find(
                                    (project) => project.id === dependency.projectId,
                                );
                                const dependencyVersion = projectDependencies.versions.find(
                                    (version) => version.id === dependency.versionId,
                                );

                                if (!dependencyProject?.id) return null;
                                const dependencyProjectPageUrl = ProjectPagePath(
                                    dependencyProject.type[0],
                                    dependencyProject.slug,
                                );
                                const dependencyVersionPageUrl = dependencyVersion?.id
                                    ? VersionPagePath(dependencyProject.type[0], dependencyProject.slug, dependencyVersion.slug)
                                    : null;

                                const redirectUrl = dependencyVersionPageUrl || dependencyProjectPageUrl;

                                return (
                                    <Link
                                        to={redirectUrl}
                                        key={`${dependencyProject.id}-${dependencyVersion?.id}`}
                                        className="bg_hover_stagger w-full flex items-center justify-start gap-3 text-muted-foreground hover:bg-background/75 cursor-pointer p-2 rounded-lg "
                                    >
                                        <ImgWrapper
                                            vtId={dependencyProject.id}
                                            src={imageUrl(dependencyProject.icon)}
                                            alt={dependencyProject.name}
                                            className="h-12 w-12"
                                            fallback={fallbackProjectIcon}
                                        />
                                        <div className="flex flex-col items-start justify-center">
                                            <span className="font-bold">{dependencyProject.name}</span>
                                            <span className="text-muted-foreground/85">
                                                {dependencyVersion
                                                    ? t.version.depencency[`${dependency.dependencyType}_desc`](
                                                          dependencyVersion.versionNumber,
                                                      )
                                                    : t.version.depencency[dependency.dependencyType]}
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </ContentCardTemplate>
                    ) : null}

                    <ContentCardTemplate title={t.version.files} className="gap-2">
                        {versionData.primaryFile?.id ? (
                            <FileDetailsItem
                                fileName={versionData.primaryFile.name}
                                fileSize={versionData.primaryFile.size}
                                isPrimary={true}
                                downloadLink={versionData.primaryFile.url}
                                sha1_hash={versionData.primaryFile.sha1_hash}
                                sha512_hash={versionData.primaryFile.sha512_hash}
                                showDownloadAnimation={showDownloadAnimation}
                            />
                        ) : null}

                        {versionData.files?.length
                            ? versionData.files.map((file) => {
                                  if (file.isPrimary) return null;
                                  return (
                                      <FileDetailsItem
                                          key={file.id}
                                          fileName={file.name}
                                          fileSize={file.size}
                                          isPrimary={false}
                                          downloadLink={file.url}
                                          sha1_hash={file.sha1_hash}
                                          sha512_hash={file.sha512_hash}
                                          showDownloadAnimation={showDownloadAnimation}
                                      />
                                  );
                              })
                            : null}
                    </ContentCardTemplate>
                </div>

                <Card className="p-card-surround grid grid-cols-1 w-full sm:min-w-[19rem] text-muted-foreground gap-3">
                    <h3 className="text-lg font-bold text-foreground">{t.version.metadata}</h3>
                    <div className="grid grid-cols-1 gap-5">
                        {[
                            {
                                label: t.version.releaseChannel,
                                content: <ReleaseChannelChip releaseChannel={versionData.releaseChannel} className="mt-0.5" />,
                            },
                            {
                                label: t.version.versionNumber,
                                content: <span className="leading-none">{versionData.versionNumber}</span>,
                            },
                            {
                                label: t.search.loaders,
                                content: versionData.loaders.length ? (
                                    <span className="leading-none">
                                        {versionData.loaders.map((loader) => CapitalizeAndFormatString(loader)).join(", ")}
                                    </span>
                                ) : null,
                            },
                            {
                                label: t.search.gameVersions,
                                content: (
                                    <span className="leading-tight">
                                        {formatGameVersionsListString_verbose(versionData.gameVersions)}
                                    </span>
                                ),
                            },
                            {
                                label: t.project.downloads,
                                content: (
                                    <span className="leading-none">
                                        <FormattedCount count={versionData.downloads} notation="standard" />
                                    </span>
                                ),
                            },
                            {
                                label: t.version.publicationDate,
                                content: (
                                    <span className="leading-none">
                                        <FormattedDate date={versionData.datePublished} />
                                    </span>
                                ),
                            },
                            {
                                label: t.version.publisher,
                                content: (
                                    <TeamMember_Card
                                        userName={versionData.author.userName}
                                        avatarImageUrl={imageUrl(versionData.author.avatar)}
                                        fallbackIcon={fallbackUserIcon}
                                        isOwner={false}
                                        roleName={versionData.author.role}
                                    />
                                ),
                            },
                            {
                                label: t.version.versionID,
                                content: <CopyBtn text={versionData.id} id="version-page-version-id" label={versionData.id} />,
                            },
                        ].map((item) => {
                            if (!item.content) return null;

                            return (
                                <div key={item.label} className="w-full flex flex-col items-start justify-start gap-1.5">
                                    <span className="font-bold leading-none">{item.label}</span>
                                    {item.content}
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>
        </>
    );
}

interface FileDetailsItemProps {
    fileName: string;
    fileSize: number;
    isPrimary: boolean;
    downloadLink: string;
    sha1_hash: string | null;
    sha512_hash: string | null;
    showDownloadAnimation?: () => void;
}

function FileDetailsItem({
    fileName,
    fileSize,
    isPrimary,
    downloadLink,
    sha1_hash,
    sha512_hash,
    showDownloadAnimation,
}: FileDetailsItemProps) {
    const { t } = useTranslation();

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <div
                    className={cn(
                        "w-full flex flex-wrap sm:flex-nowrap items-center justify-between rounded px-4 py-2.5 pe-3 gap-x-4 gap-y-2 cursor-context-menu",
                        isPrimary ? "bg-shallow-background" : "bg-shallow-background/70",
                    )}
                >
                    <div>
                        <FileIcon
                            aria-hidden
                            className={cn(
                                "inline me-1.5 flex-shrink-0 w-btn-icon h-btn-icon text-muted-foreground",
                                !isPrimary && "text-extra-muted-foreground",
                            )}
                        />

                        <span className={!isPrimary ? "text-muted-foreground" : ""}>
                            <strong className="font-semibold">{fileName}</strong>{" "}
                            <span className="whitespace-nowrap ms-0.5">({parseFileSize(fileSize)})</span>{" "}
                            {isPrimary ? <span className="text-muted-foreground italic ms-1">{t.version.primary}</span> : null}
                        </span>
                    </div>

                    <VariantButtonLink
                        variant={isPrimary ? "secondary-dark" : "ghost"}
                        url={downloadLink}
                        className={cn(!isPrimary && "hover:bg-transparent dark:hover:bg-transparent hover:text-foreground")}
                        onClick={showDownloadAnimation}
                        rel="nofollow noindex"
                    >
                        <DownloadIcon aria-hidden className="w-btn-icon h-btn-icon" />
                        {t.common.download}
                    </VariantButtonLink>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem className="flex gap-2" onClick={() => copyTextToClipboard(sha1_hash)}>
                    <CopyIcon aria-hidden className="w-btn-icon-sm h-btn-icon-sm text-extra-muted-foreground" />
                    {t.version.copySha1}
                </ContextMenuItem>

                <ContextMenuItem className="flex gap-2" onClick={() => copyTextToClipboard(sha512_hash)}>
                    <CopyIcon aria-hidden className="w-btn-icon-sm h-btn-icon-sm text-extra-muted-foreground" />
                    {t.version.copySha512}
                </ContextMenuItem>

                <ContextMenuItem className="flex gap-2" onClick={() => copyTextToClipboard(downloadLink)}>
                    <LinkIcon aria-hidden className="w-btn-icon-sm h-btn-icon-sm text-extra-muted-foreground" />
                    {t.version.copyFileUrl}
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}

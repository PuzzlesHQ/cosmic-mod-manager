import { getLoadersFromNames } from "@app/utils/convertors";
import { getProjectCategoriesDataFromNames } from "@app/utils/project";
import { CapitalizeAndFormatString } from "@app/utils/string";
import { type EnvironmentSupport, ProjectType, ProjectVisibility } from "@app/utils/types";
import { imageUrl } from "@app/utils/url";
import { Building2Icon, CalendarIcon, DownloadIcon, HeartIcon, RefreshCcwIcon } from "lucide-react";
import { useMemo } from "react";
import { fallbackProjectIcon } from "~/components/icons";
import { TagIcon } from "~/components/icons/tag-icons";
import { itemType, MicrodataItemProps, MicrodataItemType } from "~/components/microdata";
import { ImgWrapper } from "~/components/ui/avatar";
import Chip from "~/components/ui/chip";
import { FormattedCount } from "~/components/ui/count";
import { FormattedDate, TimePassedSince } from "~/components/ui/date";
import Link from "~/components/ui/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { cn } from "~/components/utils";
import { viewTransitionStyleObj } from "~/components/view-transitions";
import { useTranslation } from "~/locales/provider";
import ProjectSupportedEnv from "~/pages/project/supported-env";
import { OrgPagePath, ProjectPagePath, UserProfilePath } from "~/utils/urls";

export enum ListViewType {
    GALLERY = "gallery",
    LIST = "list",
}

interface SearchListItemProps {
    // Which project type is the current page for
    // "project" means no filter based on project type
    pageProjectType: ProjectType | "project";
    projectType: ProjectType;

    projectName: string;
    projectSlug: string;
    icon: string | null;
    featuredGallery: string | null;
    color: string | null;
    className?: string;
    author?: string;
    summary: string;
    clientSide: EnvironmentSupport;
    serverSide: EnvironmentSupport;
    loaders: string[];
    featuredCategories: string[];
    downloads: number;
    followers: number;
    dateUpdated: Date;
    datePublished: Date;
    showDatePublished?: boolean;
    viewType?: ListViewType;
    isOrgOwned?: boolean;
    visibility: ProjectVisibility;
    vtId: string; // View Transition ID

    // Search page type for view transitions
    pageId: string;
}

const HideEnvSupportFor = [ProjectType.RESOURCE_PACK, ProjectType.SHADER, ProjectType.PLUGIN, ProjectType.WORLD];

export default function ProjectCardItem(props: SearchListItemProps) {
    return <BaseView {...props} viewType={props.viewType || ListViewType.LIST} />;
}

function BaseView(props: SearchListItemProps) {
    const { t } = useTranslation();

    const projectCategoriesData = getProjectCategoriesDataFromNames(props.featuredCategories);
    const loadersData = getLoadersFromNames(props.loaders);

    const effectiveProjectType =
        !props.pageProjectType || props.pageProjectType === "project" ? props.projectType : props.pageProjectType;
    const projectPageUrl = ProjectPagePath(effectiveProjectType, props.projectSlug);

    // View Types
    const galleryViewType = props.viewType === ListViewType.GALLERY;
    const listViewType = props.viewType === ListViewType.LIST;

    const vtStyle = useMemo(() => viewTransitionStyleObj(`${props.pageId}-search-item-${props.vtId}`), [props.vtId]);

    return (
        // biome-ignore lint/a11y/useSemanticElements: idk, <li> doesn't make sense here
        <article
            role="listitem"
            itemScope
            itemType={itemType(MicrodataItemType.SoftwareApplication)}
            className={cn(
                "search-list-item view-transition-item grid h-full gap-x-3 gap-y-2 rounded-lg bg-card-background text-foreground-muted",
                listViewType && "p-card-surround",
                galleryViewType && "pb-4",
                props.viewType,
                props.className,
            )}
            aria-label={props.projectName}
            style={vtStyle}
        >
            {galleryViewType && (
                <Link
                    to={projectPageUrl}
                    className="m-0.5 mb-0 h-44 overflow-hidden rounded-t-lg rounded-b-none"
                    aria-label={props.projectName}
                    tabIndex={-1}
                    style={{
                        gridArea: "gallery",
                        backgroundColor: props.color ? props.color : "hsla(var(--raised-background))",
                    }}
                >
                    {props.featuredGallery && (
                        <img
                            src={props.featuredGallery}
                            alt={`Featured gallery of ${props.projectName}`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />
                    )}
                </Link>
            )}

            <Link
                to={projectPageUrl}
                className={cn(
                    "relative flex h-fit w-max shrink-0 items-start justify-center",
                    galleryViewType && "-mt-12 ms-card-surround",
                )}
                aria-label={props.projectName}
                tabIndex={-1}
                style={{
                    gridArea: "icon",
                }}
            >
                <ImgWrapper
                    itemProp={MicrodataItemProps.image}
                    vtId={props.vtId}
                    loading="lazy"
                    src={imageUrl(props.icon)}
                    alt={`Icon of ${props.projectName}`}
                    fallback={fallbackProjectIcon}
                    className="h-24 w-24 rounded-xl"
                />
            </Link>

            <div
                className={cn(
                    "h-fit whitespace-break-spaces text-wrap leading-none",
                    galleryViewType && "me-card-surround leading-tight",
                )}
                style={{ gridArea: "title" }}
            >
                {!props.author ? (
                    <ProjectLink
                        projectName={props.projectName}
                        projectPageUrl={projectPageUrl}
                        galleryViewType={galleryViewType}
                    />
                ) : (
                    t.search.searchItemAuthor(
                        <ProjectLink
                            key="project"
                            projectName={props.projectName}
                            projectPageUrl={projectPageUrl}
                            galleryViewType={galleryViewType}
                        />,

                        <AuthorLink
                            key="project-author"
                            author={props.author}
                            authorDisplayName={props.author}
                            isOrgOwned={props.isOrgOwned === true}
                            galleryViewType={galleryViewType}
                            Organization_translation={t.project.organization}
                        />,
                    )
                )}

                {props.visibility === ProjectVisibility.ARCHIVED && (
                    <>
                        {" "}
                        <Chip className="ms-1 inline bg-warning-bg font-medium text-sm text-warning-fg leading-none">
                            {t.projectSettings.archived}
                        </Chip>
                    </>
                )}
            </div>

            <p
                itemProp={MicrodataItemProps.description}
                className={cn(
                    "mobile-break-words max-w-[80ch] leading-tight sm:text-pretty",
                    galleryViewType && "mx-card-surround",
                )}
                style={{ gridArea: "summary" }}
            >
                {props.summary}
            </p>

            <div
                itemProp={MicrodataItemProps.about}
                itemScope
                itemType={itemType(MicrodataItemType.Thing)}
                className={cn(
                    "flex flex-wrap items-center justify-start gap-x-4 gap-y-0 text-foreground-extra-muted",
                    galleryViewType && "mx-card-surround",
                    listViewType && "xl:pe-4",
                )}
                style={{ gridArea: "tags" }}
            >
                {!HideEnvSupportFor.includes(props.pageProjectType as ProjectType) && (
                    <ProjectSupportedEnv
                        clientSide={props.clientSide}
                        serverSide={props.serverSide}
                        className="text-foreground-extra-muted"
                    />
                )}

                {projectCategoriesData.map((category) => {
                    // @ts-ignore
                    const tagName = t.search.tags[category.name] || CapitalizeAndFormatString(category.name);

                    return (
                        <span
                            className="flex items-center justify-center gap-1"
                            key={category.name}
                            title={`${t.search[category.type]} / ${tagName}`}
                        >
                            <TagIcon name={category.name} />
                            <span itemProp={MicrodataItemProps.name}>{tagName}</span>
                        </span>
                    );
                })}

                {loadersData.map((loader) => {
                    const loaderName = CapitalizeAndFormatString(loader.name);

                    return (
                        <span
                            key={loader.name}
                            className="flex items-center justify-center gap-1"
                            title={`${t.search.loaders} / ${loaderName}`}
                        >
                            <TagIcon name={loader.name} />
                            {loaderName}
                        </span>
                    );
                })}
            </div>

            <div
                className={cn("flex flex-wrap justify-end gap-x-4", galleryViewType && "mx-card-surround justify-between")}
                style={{
                    gridArea: "stats",
                }}
            >
                <div className={cn("flex flex-row flex-wrap gap-x-5 lg:flex-col", galleryViewType && "lg:flex-row")}>
                    <div className="flex h-fit items-center justify-end gap-x-1.5">
                        <DownloadIcon aria-hidden className="inline h-[1.17rem] w-[1.17rem] text-foreground-extra-muted" />{" "}
                        <p className="text-nowrap">
                            <span
                                key="downloads-count"
                                className={cn("inline font-extrabold text-lg-plus sm:hidden", galleryViewType && "sm:inline")}
                            >
                                <FormattedCount count={props.downloads} />
                            </span>

                            <span className={cn("hidden sm:inline", galleryViewType && "sm:hidden")}>
                                {t.count.downloads(
                                    props.downloads,
                                    <strong key="followers-count" className="font-extrabold text-lg-plus">
                                        <FormattedCount count={props.downloads} />
                                    </strong>,
                                )}
                            </span>
                        </p>
                    </div>

                    <div className="flex h-fit items-center justify-end gap-x-1.5">
                        <HeartIcon aria-hidden className="inline h-[1.07rem] w-[1.07rem] text-foreground-extra-muted" />{" "}
                        <p className="text-nowrap">
                            <span
                                key="downloads-count"
                                className={cn("inline font-extrabold text-lg-plus sm:hidden", galleryViewType && "sm:inline")}
                            >
                                <FormattedCount count={props.followers} />
                            </span>

                            <span className={cn("hidden sm:inline", galleryViewType && "sm:hidden")}>
                                {t.count.followers(
                                    props.followers,
                                    <strong key="downloads-count" className="font-extrabold text-lg-plus">
                                        <FormattedCount count={props.followers} />
                                    </strong>,
                                )}
                            </span>
                        </p>
                    </div>
                </div>

                <div
                    className={cn(
                        "flex h-fit items-center gap-1.5 whitespace-nowrap",
                        listViewType && "my-auto ms-auto justify-end lg:mb-0",
                        galleryViewType && "my-auto justify-start",
                    )}
                >
                    <TooltipProvider>
                        {props.showDatePublished === true ? (
                            <Tooltip>
                                <CalendarIcon aria-hidden className="h-[1.1rem] w-[1.1rem] text-foreground-extra-muted" />
                                <TooltipTrigger asChild>
                                    <p className="flex items-baseline justify-center gap-1 text-nowrap">
                                        {t.project.publishedAt(TimePassedSince({ date: props.datePublished }))}
                                    </p>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <FormattedDate date={props.datePublished} />
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            <Tooltip>
                                <RefreshCcwIcon aria-hidden className="h-[1.1rem] w-[1.1rem] text-foreground-extra-muted" />
                                <TooltipTrigger asChild>
                                    <p className="flex items-baseline justify-center gap-1 text-nowrap">
                                        {t.project.updatedAt(TimePassedSince({ date: props.dateUpdated }))}
                                    </p>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <FormattedDate date={props.dateUpdated} />
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </TooltipProvider>
                </div>
            </div>
        </article>
    );
}

interface ProjectLinkProps {
    projectName: string;
    projectPageUrl: string;
    galleryViewType: boolean;
}

function ProjectLink(props: ProjectLinkProps) {
    return (
        <Link
            itemProp={MicrodataItemProps.url}
            to={props.projectPageUrl}
            className={cn(
                "mobile-break-words w-fit font-bold text-xl leading-none",
                props.galleryViewType && "block leading-tight",
            )}
            aria-label={props.projectName}
        >
            <span
                itemProp={MicrodataItemProps.name}
                className={cn("inline leading-none", props.galleryViewType && "leading-tight")}
            >
                {props.projectName}
            </span>
        </Link>
    );
}

interface AuthorLinkProps {
    author: string;
    authorDisplayName: string;
    isOrgOwned: boolean;
    galleryViewType: boolean;
    Organization_translation: string;
}

function AuthorLink(props: AuthorLinkProps) {
    return (
        <Link
            to={props.isOrgOwned ? OrgPagePath(props.author) : UserProfilePath(props.author)}
            className={cn(
                "mobile-break-words leading-none underline hover:brightness-110",
                props.galleryViewType && "leading-tight",
            )}
            title={props.isOrgOwned ? `${props.author} (${props.Organization_translation})` : props.author}
        >
            {props.authorDisplayName}
            {props.isOrgOwned ? (
                <>
                    {" "}
                    <Building2Icon aria-hidden className="inline-block h-4 w-4" />
                </>
            ) : null}
        </Link>
    );
}

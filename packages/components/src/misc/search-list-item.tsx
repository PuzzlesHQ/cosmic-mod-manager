import { categories } from "@app/utils/constants/categories";
import { getLoadersFromNames } from "@app/utils/convertors";
import { getProjectCategoriesDataFromNames } from "@app/utils/project";
import { CapitalizeAndFormatString } from "@app/utils/string";
import { type EnvironmentSupport, ProjectType, ProjectVisibility, TagType } from "@app/utils/types";
import { imageUrl } from "@app/utils/url";
import { Building2Icon, CalendarIcon, DownloadIcon, HeartIcon, RefreshCcwIcon } from "lucide-react";
import { type ReactNode, useMemo } from "react";
import { TagIcon } from "~/icons/tag-icons";
import { MicrodataItemProps, MicrodataItemType, itemType } from "~/microdata";
import { ImgWrapper } from "~/ui/avatar";
import Chip from "~/ui/chip";
import Link from "~/ui/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/ui/tooltip";
import { cn } from "~/utils";
import { fallbackProjectIcon } from "../icons";

export enum ViewType {
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
    author?: string;
    summary: string;
    clientSide: EnvironmentSupport;
    serverSide: EnvironmentSupport;
    supportedEnv: React.ReactNode;
    loaders: string[];
    featuredCategories: string[];
    downloads: number;
    followers: number;
    dateUpdated: Date;
    datePublished: Date;
    showDatePublished?: boolean;
    viewType?: ViewType;
    isOrgOwned?: boolean;
    visibility: ProjectVisibility;
    vtId: string; // View Transition ID
    viewTransitions?: boolean;
    t?: ReturnType<typeof getDefaultStrings>;

    // Functions to override default behavior
    ProjectPagePath: ProjectPagePath;
    OrgPagePath: OrgPagePath;
    UserProfilePath: UserProfilePath;
    TimeSince_Fn: (date: string | Date) => string;
    NumberFormatter: (num: number) => string;
    DateFormatter: (date: string | Date) => ReactNode;
}

const HideEnvSupportFor = [ProjectType.RESOURCE_PACK, ProjectType.SHADER, ProjectType.PLUGIN, ProjectType.WORLD];

export default function SearchListItem(props: SearchListItemProps) {
    return <BaseView {...props} viewType={props.viewType || ViewType.LIST} />;
}

function BaseView(props: SearchListItemProps) {
    const t = props.t || getDefaultStrings();
    const projectCategoriesData = getProjectCategoriesDataFromNames(props.featuredCategories);
    const loadersData = getLoadersFromNames(props.loaders);

    const effectiveProjectType = !props.pageProjectType || props.pageProjectType === "project" ? props.projectType : props.pageProjectType;
    const projectPageUrl = props.ProjectPagePath(effectiveProjectType, props.projectSlug);

    // View Types
    const galleryViewType = props.viewType === ViewType.GALLERY;
    const listViewType = props.viewType === ViewType.LIST;

    const ProjectDownloads = t.count.downloads(props.downloads);
    const ProjectFollowers = t.count.followers(props.followers);

    const SearchItemHeader = useMemo(() => {
        if (!props.author) {
            return ProjectLink({
                projectName: props.projectName,
                projectPageUrl,
                galleryViewType,
            });
        }

        return t.search.searchItemAuthor(
            <ProjectLink
                key={`${props.projectSlug}`}
                projectName={props.projectName}
                projectPageUrl={projectPageUrl}
                galleryViewType={galleryViewType}
            />,
            <AuthorLink
                key={`${props.projectSlug}-${props.author}`}
                author={props.author}
                authorDisplayName={props.author}
                OrgPagePath={props.OrgPagePath}
                UserProfilePath={props.UserProfilePath}
                isOrgOwned={props.isOrgOwned === true}
                galleryViewType={galleryViewType}
                Organization_translation={t.project.organization}
            />,
        );
    }, [galleryViewType]);

    return (
        <article
            // biome-ignore lint/a11y/useSemanticElements: <explanation>
            role="listitem"
            itemProp={MicrodataItemProps.works}
            itemScope
            itemType={itemType(MicrodataItemType.CreativeWork)}
            className={cn(
                "h-full search-list-item grid gap-x-3 gap-y-2 text-muted-foreground bg-card-background rounded-lg",
                listViewType && "p-card-surround",
                galleryViewType && "pb-4",
                props.viewType,
            )}
            aria-label={props.projectName}
        >
            {galleryViewType && (
                <Link
                    to={projectPageUrl}
                    className="h-44 overflow-hidden rounded-t-lg rounded-b-none m-0.5 mb-0"
                    aria-label={props.projectName}
                    tabIndex={-1}
                    style={{
                        gridArea: "gallery",
                        backgroundColor: props.color ? props.color : "hsla(var(--foreground), 0.15)",
                    }}
                >
                    {props.featuredGallery && (
                        <img
                            src={props.featuredGallery}
                            alt={`Featured gallery of ${props.projectName}`}
                            className="object-cover w-full h-full"
                            loading="lazy"
                        />
                    )}
                </Link>
            )}

            <Link
                to={projectPageUrl}
                className={cn(
                    "w-max h-fit flex shrink-0 relative items-start justify-center",
                    galleryViewType && "ms-card-surround -mt-12",
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
                    viewTransitions={props.viewTransitions}
                />
            </Link>

            <div
                className={cn("h-fit whitespace-break-spaces text-wrap leading-none", galleryViewType && "me-card-surround leading-tight")}
                style={{ gridArea: "title" }}
            >
                {SearchItemHeader}

                {props.visibility === ProjectVisibility.ARCHIVED && (
                    <>
                        {" "}
                        <Chip className="inline leading-none text-sm font-medium bg-warning-background/15 text-warning-foreground ms-1">
                            {t.projectSettings.archived}
                        </Chip>
                    </>
                )}
            </div>

            <p
                itemProp={MicrodataItemProps.description}
                className={cn("leading-tight sm:text-pretty max-w-[80ch] mobile-break-words", galleryViewType && "mx-card-surround")}
                style={{ gridArea: "summary" }}
            >
                {props.summary}
            </p>

            <div
                itemProp={MicrodataItemProps.about}
                itemScope
                itemType={itemType(MicrodataItemType.Thing)}
                className={cn(
                    "flex items-center justify-start gap-x-4 gap-y-0 flex-wrap text-extra-muted-foreground",
                    galleryViewType && "mx-card-surround",
                )}
                style={{ gridArea: "tags" }}
            >
                {!HideEnvSupportFor.includes(props.pageProjectType as ProjectType) && props.supportedEnv}

                {projectCategoriesData.map((category) => {
                    // @ts-ignore
                    const tagName = t.search.tags[category.name] || CapitalizeAndFormatString(category.name);

                    return (
                        <span
                            className="flex gap-1 items-center justify-center"
                            key={category.name}
                            aria-label={category.name}
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
                            className="flex gap-1 items-center justify-center"
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
                <div className={cn("flex flex-wrap flex-row lg:flex-col gap-x-5", galleryViewType && "lg:flex-row")}>
                    <div className="h-fit flex justify-end items-center gap-x-1.5">
                        <DownloadIcon aria-hidden className="inline w-[1.17rem] h-[1.17rem] text-extra-muted-foreground" />{" "}
                        <p className="text-nowrap">
                            {!galleryViewType && ProjectDownloads[0]?.toString().length > 0 && (
                                <span className="hidden sm:inline lowercase">{ProjectDownloads[0]} </span>
                            )}
                            <strong className="text-lg-plus font-extrabold">{props.NumberFormatter(props.downloads)}</strong>
                            {!galleryViewType && ProjectDownloads[2]?.toString().length > 0 && (
                                <span className="hidden sm:inline lowercase"> {ProjectDownloads[2]}</span>
                            )}
                        </p>
                    </div>

                    <div className="h-fit flex justify-end items-center gap-x-1.5">
                        <HeartIcon aria-hidden className="inline w-[1.07rem] h-[1.07rem] text-extra-muted-foreground" />{" "}
                        <p className="text-nowrap">
                            {!galleryViewType && ProjectFollowers[0]?.toString().length > 0 && (
                                <span className="hidden sm:inline lowercase">{ProjectFollowers[0]} </span>
                            )}
                            <strong className="text-lg-plus font-extrabold">{props.NumberFormatter(props.followers)}</strong>
                            {!galleryViewType && ProjectFollowers[2]?.toString().length > 0 && (
                                <span className="hidden sm:inline lowercase"> {ProjectFollowers[2]}</span>
                            )}
                        </p>
                    </div>
                </div>

                <div
                    className={cn(
                        "h-fit flex items-center gap-1.5 whitespace-nowrap",
                        listViewType && "justify-end ms-auto my-auto lg:mb-0",
                        galleryViewType && "justify-start my-auto",
                    )}
                >
                    <TooltipProvider>
                        {props.showDatePublished === true ? (
                            <Tooltip>
                                <CalendarIcon aria-hidden className="w-[1.1rem] h-[1.1rem] text-extra-muted-foreground" />
                                <TooltipTrigger asChild>
                                    <p className="flex items-baseline justify-center gap-1 text-nowrap">
                                        {t.project.publishedAt(props.TimeSince_Fn(props.datePublished))}
                                    </p>
                                </TooltipTrigger>
                                <TooltipContent>{props.DateFormatter(props.datePublished)}</TooltipContent>
                            </Tooltip>
                        ) : (
                            <Tooltip>
                                <RefreshCcwIcon aria-hidden className="w-[1.1rem] h-[1.1rem] text-extra-muted-foreground" />
                                <TooltipTrigger asChild>
                                    <p className="flex items-baseline justify-center gap-1 text-nowrap">
                                        {t.project.updatedAt(props.TimeSince_Fn(props.dateUpdated))}
                                    </p>
                                </TooltipTrigger>
                                <TooltipContent>{props.DateFormatter(props.dateUpdated)}</TooltipContent>
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
            className={cn("w-fit text-xl font-bold leading-none mobile-break-words", props.galleryViewType && "block leading-tight")}
            aria-label={props.projectName}
        >
            <p itemProp={MicrodataItemProps.name} className={cn("inline leading-none", props.galleryViewType && "leading-tight")}>
                {props.projectName}
            </p>
        </Link>
    );
}

interface AuthorLinkProps {
    author: string;
    authorDisplayName: string;
    OrgPagePath: OrgPagePath;
    UserProfilePath: UserProfilePath;
    isOrgOwned: boolean;
    galleryViewType: boolean;
    Organization_translation: string;
}

function AuthorLink(props: AuthorLinkProps) {
    return (
        <Link
            to={props.isOrgOwned ? props.OrgPagePath(props.author) : props.UserProfilePath(props.author)}
            className={cn("underline hover:brightness-110 mobile-break-words leading-none", props.galleryViewType && "leading-tight")}
            title={props.isOrgOwned ? `${props.author} (${props.Organization_translation})` : props.author}
        >
            {props.authorDisplayName}
            {props.isOrgOwned ? (
                <>
                    {" "}
                    <Building2Icon aria-hidden className="inline-block w-4 h-4" />
                </>
            ) : null}
        </Link>
    );
}

function getDefaultStrings() {
    const tags: Record<string, string> = {};
    for (const c of categories) {
        tags[c.name] = c.name;
    }

    const headerStrings: Record<TagType, string> = {
        [TagType.CATEGORY]: CapitalizeAndFormatString(TagType.CATEGORY),
        [TagType.FEATURE]: CapitalizeAndFormatString(TagType.FEATURE),
        [TagType.RESOLUTION]: CapitalizeAndFormatString(TagType.RESOLUTION),
        [TagType.PERFORMANCE_IMPACT]: CapitalizeAndFormatString(TagType.PERFORMANCE_IMPACT),
    };

    return {
        count: {
            downloads: (count: number) => ["", count, "downloads"],
            followers: (count: number) => ["", count, "followers"],
        },

        project: {
            organization: "Organization",
            updatedAt: (when: string) => `Updated ${when}`,
            publishedAt: (when: string) => `Published ${when}`,
        },
        projectSettings: {
            archived: "Archived",
        },
        search: Object.assign(
            {
                tags: tags,
                searchItemAuthor: (project: React.ReactNode, author: React.ReactNode) => [project, " by ", author],
                loaders: "",
            },
            headerStrings,
        ),
    };
}

type ProjectPagePath = (type: string, projectSlug: string, extra?: string) => string;
type OrgPagePath = (orgSlug: string, extra?: string) => string;
type UserProfilePath = (username: string, extra?: string) => string;

import { getProjectTypesFromNames } from "@app/utils/convertors";
import { FormatCount } from "@app/utils/number";
import { GlobalUserRole } from "@app/utils/types";
import type { Collection, Organisation, ProjectListItem } from "@app/utils/types/api";
import { ReportItemType } from "@app/utils/types/api/report";
import type { UserProfileData } from "@app/utils/types/api/user";
import { imageUrl } from "@app/utils/url";
import { CalendarIcon, ClipboardCopyIcon, DownloadIcon, EditIcon } from "lucide-react";
import { useEffect } from "react";
import { Outlet } from "react-router";
import { CubeIcon, fallbackOrgIcon, fallbackUserIcon } from "~/components/icons";
import { itemType, MicrodataItemProps, MicrodataItemType } from "~/components/microdata";
import { ContentCardTemplate } from "~/components/misc/panel";
import { PageHeader } from "~/components/page-header";
import { ImgWrapper } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import Chip from "~/components/ui/chip";
import { TimePassedSince } from "~/components/ui/date";
import Link, { Prefetch, useNavigate, VariantButtonLink } from "~/components/ui/link";
import { PopoverClose } from "~/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { cn } from "~/components/utils";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import ReportButton from "~/pages/report/report-btn";
import type { UserOutletData } from "~/routes/user/layout";
import { OrgPagePath, UserProfilePath } from "~/utils/urls";
import SecondaryNav from "../project/secondary-nav";

interface Props {
    userData: UserProfileData;
    projectsList: ProjectListItem[];
    orgsList: Organisation[];
    collections: Collection[];
}

export default function UserPageLayout(props: Props) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const aggregatedDownloads = (props.projectsList || [])?.reduce((acc, project) => acc + project.downloads, 0) || 0;
    const totalProjects = (props.projectsList || [])?.length;

    const aggregatedProjectTypes = new Set<string>();
    for (const project of props.projectsList || []) {
        for (const type of project.type) {
            aggregatedProjectTypes.add(type);
        }
    }
    const projectTypesList = Array.from(aggregatedProjectTypes);

    const navLinks = [];
    if (props.projectsList.length > 0) navLinks.push({ label: t.common.all, href: "" });
    if (props.collections.length > 0) navLinks.push({ label: t.dashboard.collections, href: "/collections" });

    if (projectTypesList.length > 1) {
        navLinks.push(
            ...getProjectTypesFromNames(projectTypesList).map((type) => ({
                label: t.navbar[`${type}s`],
                href: `/${type}s`,
            })),
        );
    }

    useEffect(() => {
        if (props.projectsList.length === 0 && props.collections.length > 0) {
            navigate(UserProfilePath(props.userData.userName, "collections"));
        }
    }, []);

    // Using JSX syntax returns an Element object which is not easy to check if it's null or not, so using the function syntax
    const sidebar = PageSidebar({
        displayName: props.userData.name,
        userId: props.userData.id,
        orgsList: props.orgsList || [],
    });

    return (
        <main
            className={cn("header-content-sidebar-layout gap-y-panel-cards pb-12", sidebar && "gap-x-panel-cards")}
            itemScope
            itemType={itemType(MicrodataItemType.Person)}
        >
            <ProfilePageHeader userData={props.userData} totalDownloads={aggregatedDownloads} totalProjects={totalProjects} />

            <div className="page-content grid h-fit grid-cols-1 gap-panel-cards">
                {navLinks?.length > 1 || navLinks[0]?.href?.length > 0 ? (
                    <SecondaryNav
                        className="rounded-lg bg-card-background px-3 py-2"
                        urlBase={UserProfilePath(props.userData.userName)}
                        links={navLinks}
                    />
                ) : null}

                {navLinks.length < 1 ? (
                    <div className="flex w-full items-center justify-center py-12">
                        <p className="text-center text-lg text-muted-foreground italic">
                            {t.user.doesntHaveProjects(props.userData.name)}
                        </p>
                    </div>
                ) : (
                    // biome-ignore lint/a11y/useSemanticElements: --
                    <div className="flex w-full flex-col gap-panel-cards" role="list">
                        <Outlet
                            context={
                                {
                                    projectsList: props.projectsList,
                                    collections: props.collections,
                                    userData: props.userData,
                                } satisfies UserOutletData
                            }
                        />
                    </div>
                )}
            </div>

            {sidebar}
        </main>
    );
}

function PageSidebar({ userId, orgsList }: { displayName: string; userId: string; orgsList: Organisation[] }) {
    const { t } = useTranslation();
    const joinedOrgs = orgsList.filter((org) => {
        const member = org.members.find((member) => member.userId === userId);
        return member?.accepted === true;
    });

    if (!joinedOrgs.length) return null;

    return (
        <div className="page-sidebar flex w-full flex-col gap-panel-cards lg:w-sidebar">
            <ContentCardTemplate title={t.dashboard.organizations} titleClassName="text-lg">
                <div className="flex flex-wrap items-start justify-start gap-2">
                    <TooltipProvider>
                        {joinedOrgs.map((org) => (
                            <Tooltip key={org.id}>
                                <TooltipTrigger asChild>
                                    <Link to={OrgPagePath(org.slug)}>
                                        <ImgWrapper
                                            vtId={org.id}
                                            src={imageUrl(org.icon)}
                                            alt={org.name}
                                            fallback={fallbackOrgIcon}
                                            className="h-14 w-14"
                                        />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>{org.name}</TooltipContent>
                            </Tooltip>
                        ))}
                    </TooltipProvider>
                </div>
            </ContentCardTemplate>

            {
                // TODO:
                /* <ContentCardTemplate title="Badges" titleClassName="text-lg">
                    <span className="text-muted-foreground italic">List of badges the user has earned</span>
                </ContentCardTemplate> */
            }
        </div>
    );
}

interface ProfilePageHeaderProps {
    totalProjects: number;
    totalDownloads: number;
    userData: UserProfileData;
}

function ProfilePageHeader({ userData, totalProjects, totalDownloads }: ProfilePageHeaderProps) {
    const { t, formattedLocaleName } = useTranslation();
    const session = useSession();
    let title = null;

    if (GlobalUserRole.ADMIN === userData.role) {
        title = t.user[GlobalUserRole.ADMIN];
    } else if (GlobalUserRole.MODERATOR === userData.role) {
        title = t.user[GlobalUserRole.MODERATOR];
    }

    return (
        <PageHeader
            vtId={userData.id}
            icon={imageUrl(userData.avatar)}
            iconClassName="rounded-full"
            fallbackIcon={fallbackUserIcon}
            title={userData.name}
            description={userData.bio || ""}
            titleBadge={
                title ? (
                    <Chip className="!text-tiny bg-card-background font-semibold text-purple-600 uppercase dark:text-purple-400">
                        {title}
                    </Chip>
                ) : null
            }
            threeDotMenu={
                <>
                    {session?.id !== userData.id && (
                        <ReportButton
                            itemType={ReportItemType.USER}
                            itemId={userData.id}
                            btnVariant="ghost-destructive"
                            btnSize="sm"
                            className="w-full justify-start"
                        />
                    )}

                    <PopoverClose asChild>
                        <Button
                            className="w-full"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                navigator.clipboard.writeText(userData.id);
                            }}
                        >
                            <ClipboardCopyIcon aria-hidden className="h-btn-icon w-btn-icon" />
                            {t.common.copyId}
                            <span itemProp={MicrodataItemProps.itemid} className="sr-only">
                                {userData.id}
                            </span>
                        </Button>
                    </PopoverClose>
                </>
            }
            actionBtns={
                userData.id === session?.id ? (
                    <VariantButtonLink variant="secondary-inverted" url="/settings/profile" prefetch={Prefetch.Render}>
                        <EditIcon aria-hidden className="h-btn-icon w-btn-icon" />
                        {t.form.edit}
                    </VariantButtonLink>
                ) : null
            }
        >
            <div className="flex items-center gap-2 border-0 border-card-background border-e pe-4 dark:border-shallow-background">
                <CubeIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                <span className="font-semibold">{t.count.projects(totalProjects, totalProjects)}</span>
            </div>
            <div className="flex items-center gap-2 border-0 border-card-background border-e pe-4 dark:border-shallow-background">
                <DownloadIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                <span className="font-semibold">
                    {t.count.downloads(totalDownloads, FormatCount(totalDownloads, formattedLocaleName))}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <CalendarIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                <span className="font-semibold">{t.user.joined(TimePassedSince({ date: userData.dateJoined }))}</span>
            </div>
        </PageHeader>
    );
}

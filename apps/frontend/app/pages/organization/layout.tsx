import { getProjectTypesFromNames } from "@app/utils/convertors";
import { FormatCount } from "@app/utils/number";
import { isModerator } from "@app/utils/src/constants/roles";
import type { LoggedInUserData, ProjectType } from "@app/utils/types";
import type { Organisation, TeamMember } from "@app/utils/types/api";
import { imageUrl } from "@app/utils/url";
import { Building2Icon, ClipboardCopyIcon, DownloadIcon, SettingsIcon, UsersIcon } from "lucide-react";
import { Outlet, useLocation } from "react-router";
import { CubeIcon, fallbackOrgIcon } from "~/components/icons";
import { itemType, MicrodataItemType } from "~/components/microdata";
import { PageHeader } from "~/components/misc/page-header";
import RefreshPage from "~/components/misc/refresh-page";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { LinkPrefetchStrategy, useNavigate, VariantButtonLink } from "~/components/ui/link";
import { PopoverClose } from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { useOrgData } from "~/hooks/org";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import { OrgPagePath } from "~/utils/urls";
import TeamInvitationBanner from "../project/join-project-banner";
import { TeamMember_Card } from "../project/layout";
import SecondaryNav from "../project/secondary-nav";

export default function OrgPageLayout() {
    const { t } = useTranslation();
    const session = useSession();
    const ctx = useOrgData();
    const projects = ctx.orgProjects;
    const orgData = ctx.orgData;

    const navigate = useNavigate();
    const location = useLocation();

    const aggregatedDownloads = (projects || []).reduce((acc, project) => acc + project.downloads, 0) || 0;
    const totalProjects = (projects || []).length;
    const aggregatedProjectTypes = new Set<string>();
    for (const project of projects || []) {
        for (const type of project.type) {
            aggregatedProjectTypes.add(type);
        }
    }
    const projectTypesList = Array.from(aggregatedProjectTypes);

    async function refreshOrgData() {
        RefreshPage(navigate, location);
    }

    return (
        <main
            className="header-content-sidebar-layout gap-panel-cards pb-12"
            itemScope
            itemType={itemType(MicrodataItemType.Organization)}
        >
            <OrgInfoHeader
                session={session}
                orgData={orgData}
                currUsersMembership={ctx.currUsersMembership}
                totalDownloads={aggregatedDownloads}
                totalProjects={totalProjects}
                fetchOrgData={refreshOrgData}
            />

            <div className="page-content grid h-fit grid-cols-1 gap-panel-cards">
                {projectTypesList?.length > 1 && totalProjects > 1 ? (
                    <SecondaryNav
                        className="rounded-lg bg-card-background px-3 py-2"
                        urlBase={OrgPagePath(orgData.slug)}
                        links={[
                            { label: t.common.all, href: "" },
                            ...getProjectTypesFromNames(projectTypesList).map((type: ProjectType) => ({
                                label: t.navbar[`${type}s`],
                                href: `/${type}s`,
                            })),
                        ]}
                    />
                ) : null}

                {totalProjects ? (
                    <Outlet />
                ) : (
                    <div className="flex w-full items-center justify-center py-12">
                        <p className="text-center text-lg text-foreground-muted italic">{t.organization.orgDoesntHaveProjects}</p>
                    </div>
                )}
            </div>
            <PageSidebar members={orgData.members} />
        </main>
    );
}

function PageSidebar({ members }: { members: TeamMember[] }) {
    const { t } = useTranslation();

    return (
        <aside className="page-sidebar flex w-full flex-col gap-panel-cards lg:w-sidebar">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg ">{t.projectSettings.members}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-1">
                    {members.map((member) => {
                        if (!member.accepted) return null;

                        return (
                            <TeamMember_Card
                                vtId={member.userId}
                                key={member.id}
                                userName={member.userName}
                                isOwner={member.isOwner}
                                roleName={member.role}
                                avatarImageUrl={imageUrl(member.avatar)}
                            />
                        );
                    })}
                </CardContent>
            </Card>
        </aside>
    );
}

interface OrgInfoHeaderProps {
    session: LoggedInUserData | null;
    totalProjects: number;
    totalDownloads: number;
    orgData: Organisation;
    currUsersMembership: TeamMember | null;
    fetchOrgData: () => Promise<void>;
}

function OrgInfoHeader({
    session,
    orgData,
    totalProjects,
    totalDownloads,
    currUsersMembership,
    fetchOrgData,
}: OrgInfoHeaderProps) {
    const { t, formattedLocaleName } = useTranslation();

    return (
        <div className="page-header flex w-full flex-col gap-1">
            <PageHeader
                vtId={orgData.id}
                icon={imageUrl(orgData.icon)}
                iconClassName="rounded"
                fallbackIcon={fallbackOrgIcon}
                title={orgData.name}
                description={orgData.description || ""}
                titleBadge={
                    <div className="ms-2 flex items-center justify-center gap-1.5 font-bold text-foreground-extra-muted">
                        <Building2Icon aria-hidden className="h-btn-icon w-btn-icon" />
                        {t.project.organization}
                    </div>
                }
                threeDotMenu={
                    <>
                        {currUsersMembership?.id || isModerator(session?.role) ? (
                            <>
                                <VariantButtonLink
                                    variant="ghost"
                                    to={OrgPagePath(orgData.slug, "settings/projects")}
                                    prefetch={LinkPrefetchStrategy.Render}
                                    size="sm"
                                >
                                    <CubeIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                                    {t.organization.manageProjects}
                                </VariantButtonLink>

                                <Separator />
                            </>
                        ) : null}

                        <PopoverClose asChild>
                            <Button
                                className="w-full justify-start"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    navigator.clipboard.writeText(orgData.id);
                                }}
                            >
                                <ClipboardCopyIcon aria-hidden className="h-btn-icon w-btn-icon" />
                                {t.common.copyId}
                            </Button>
                        </PopoverClose>
                    </>
                }
                actionBtns={
                    currUsersMembership?.id || isModerator(session?.role) ? (
                        <VariantButtonLink variant="secondary" to={OrgPagePath(orgData.slug, "settings")}>
                            <SettingsIcon aria-hidden className="h-btn-icon w-btn-icon" />
                            {t.dashboard.manage}
                        </VariantButtonLink>
                    ) : null
                }
            >
                <div className="flex items-center gap-2">
                    <UsersIcon aria-hidden className="h-[1.1rem] w-[1.1rem]" />
                    <span className="font-semibold">
                        {t.count.members(orgData.members.length, FormatCount(orgData.members.length, formattedLocaleName))}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <CubeIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                    <span className="font-semibold">{t.count.projects(totalProjects, totalProjects)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <DownloadIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                    <span className="font-semibold">
                        {t.count.downloads(totalDownloads, FormatCount(totalDownloads, formattedLocaleName))}
                    </span>
                </div>
            </PageHeader>

            {currUsersMembership && currUsersMembership?.accepted !== true ? (
                <TeamInvitationBanner
                    refreshData={fetchOrgData}
                    role={currUsersMembership.role}
                    teamId={currUsersMembership.teamId}
                    isOrg
                />
            ) : null}
        </div>
    );
}

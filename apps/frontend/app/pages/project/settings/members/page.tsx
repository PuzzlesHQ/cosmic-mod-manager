import RefreshPage from "@app/components/misc/refresh-page";
import { Button } from "@app/components/ui/button";
import { Card, CardTitle } from "@app/components/ui/card";
import { toast } from "@app/components/ui/sonner";
import { doesMemberHaveAccess } from "@app/utils/project";
import { hasRootAccess } from "@app/utils/src/constants/roles";
import { type LoggedInUserData, ProjectPermission } from "@app/utils/types";
import type { Organisation, TeamMember } from "@app/utils/types/api";
import { UserXIcon } from "lucide-react";
import { type Location, useLocation } from "react-router";
import ConfirmDialog from "~/components/confirm-dialog";
import { useNavigate } from "~/components/ui/link";
import { useProjectData } from "~/hooks/project";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import { OrgTeamMember, ProjectTeamMember } from "./edit-member";
import InviteMemberForm from "./invite-member";
import { RemoveProjectFromOrg, TransferProjectManagementCard } from "./transfer-management";
import { leaveTeam } from "./utils";

interface Props {
    userOrgs: Organisation[];
}

export default function ProjectMemberSettingsPage({ userOrgs }: Props) {
    const { t } = useTranslation();
    // Session cant be null here, as the user is redirected to login if they are not logged in
    const session = useSession() as LoggedInUserData;

    const ctx = useProjectData();
    const projectData = ctx.projectData;
    const currUsersMembership = ctx.currUsersMembership;

    const navigate = useNavigate();
    const location = useLocation();

    const canInviteMembers = doesMemberHaveAccess(
        ProjectPermission.MANAGE_INVITES,
        currUsersMembership?.permissions,
        currUsersMembership?.isOwner,
        session?.role,
    );

    async function refreshProjectData(path: string | Location = location) {
        RefreshPage(navigate, path);
    }

    const isProjectTeamMember = projectData.members.some((member) => member.userId === session.id);
    const isOrgMember = projectData.organisation?.members?.some((member) => member.userId === session.id && member.accepted);

    return (
        <>
            <Card className="w-full flex flex-col p-card-surround gap-4">
                <CardTitle>{t.projectSettings.manageMembers}</CardTitle>
                <InviteMemberForm teamId={projectData.teamId} canInviteMembers={canInviteMembers} dataRefetch={refreshProjectData} />
                {isProjectTeamMember && !isOrgMember ? (
                    <LeaveTeam teamId={projectData.teamId} currUsersMembership={currUsersMembership} refreshData={refreshProjectData} />
                ) : null}
            </Card>

            {projectData.members
                .filter((member) => !projectData.organisation?.members?.some((orgMember) => orgMember.userId === member.userId))
                .map((member) => (
                    <ProjectTeamMember
                        session={session}
                        key={member.userId}
                        member={member}
                        currUsersMembership={currUsersMembership}
                        fetchProjectData={refreshProjectData}
                        projectTeamId={projectData.teamId}
                        doesProjectHaveOrg={!!projectData.organisation}
                    />
                ))}

            {userOrgs?.length && !projectData.organisation && hasRootAccess(currUsersMembership?.isOwner, session.role) ? (
                <TransferProjectManagementCard organisations={userOrgs} projectId={projectData.id} />
            ) : null}

            {projectData.organisation ? <RemoveProjectFromOrg org={projectData.organisation} projectId={projectData.id} /> : null}

            {projectData.organisation?.members?.map((member) => (
                <OrgTeamMember
                    session={session}
                    key={member.userId}
                    project={projectData}
                    orgMember={member}
                    currUsersMembership={currUsersMembership}
                    fetchProjectData={refreshProjectData}
                />
            ))}
        </>
    );
}

interface LeaveTeamProps {
    currUsersMembership: TeamMember | null;
    teamId: string;
    isOrgTeam?: boolean;
    refreshData: () => Promise<void>;
}

export function LeaveTeam({ currUsersMembership, teamId, refreshData, isOrgTeam }: LeaveTeamProps) {
    const { t } = useTranslation();

    async function handleLeaveProject() {
        const data = await leaveTeam(teamId);
        if (!data?.success) return toast.error(data?.message || t.common.error);

        await refreshData();
        return toast.success(t.projectSettings.leftProjectTeam);
    }

    const leaveTeamMsg = isOrgTeam ? t.projectSettings.leaveOrg : t.projectSettings.leaveProject;
    const leaveTeamDesc = isOrgTeam ? t.projectSettings.leaveOrgDesc : t.projectSettings.leaveProjectDesc;

    const disabled = currUsersMembership?.isOwner || currUsersMembership?.teamId !== teamId;
    let disabledReason = null;
    if (currUsersMembership?.isOwner === true) disabledReason = "Transfer ownership of this project to someone else to leave the team!";
    if (currUsersMembership?.id) disabledReason = "You're the only member of this team!";

    return (
        <div
            className="w-full flex flex-wrap items-center justify-between gap-x-6 gap-y-2"
            title={disabled && disabledReason ? disabledReason : undefined}
        >
            <div>
                <h2 className="text-lg font-semibold">{leaveTeamMsg}</h2>
                <p className="text-muted-foreground">{leaveTeamDesc}</p>
            </div>

            <ConfirmDialog
                title={leaveTeamMsg}
                description={t.projectSettings.sureToLeaveTeam}
                confirmText={leaveTeamMsg}
                onConfirm={handleLeaveProject}
                confirmIcon={<UserXIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" strokeWidth={2.5} />}
                variant="destructive"
            >
                <Button variant="secondary-destructive" disabled={disabled}>
                    <UserXIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" strokeWidth={2.5} />
                    {leaveTeamMsg}
                </Button>
            </ConfirmDialog>
        </div>
    );
}

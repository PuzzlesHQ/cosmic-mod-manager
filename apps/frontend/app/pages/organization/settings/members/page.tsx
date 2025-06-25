import RefreshPage from "@app/components/misc/refresh-page";
import { CardTitle, SectionCard } from "@app/components/ui/card";
import { doesOrgMemberHaveAccess } from "@app/utils/project";
import { OrganisationPermission } from "@app/utils/types";
import { useLocation } from "react-router";
import { useNavigate } from "~/components/ui/link";
import { useOrgData } from "~/hooks/org";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import InviteMemberForm from "~/pages/project/settings/members/invite-member";
import { LeaveTeam } from "~/pages/project/settings/members/page";
import { OrgPagePath } from "~/utils/urls";
import { OrgTeamMember } from "./edit-member";

export default function OrgMemberSettings() {
    const { t } = useTranslation();
    const session = useSession();
    const ctx = useOrgData();
    const currUsersMembership = ctx.currUsersMembership;
    const orgData = ctx.orgData;

    const navigate = useNavigate();
    const location = useLocation();

    async function refreshOrgData() {
        RefreshPage(navigate, location);
    }
    async function RedirectToOrgPage() {
        RefreshPage(navigate, OrgPagePath(orgData.slug));
    }

    const canInviteMembers = doesOrgMemberHaveAccess(
        OrganisationPermission.MANAGE_INVITES,
        currUsersMembership?.organisationPermissions,
        currUsersMembership?.isOwner,
        session?.role,
    );

    return (
        <>
            <title>{`Members - ${orgData.name}`}</title>

            <SectionCard className="w-full flex flex-col p-card-surround gap-4">
                <CardTitle>{t.projectSettings.manageMembers}</CardTitle>
                <InviteMemberForm
                    teamId={orgData.teamId}
                    canInviteMembers={canInviteMembers}
                    dataRefetch={refreshOrgData}
                    isOrg
                />
                <LeaveTeam
                    teamId={orgData.teamId}
                    currUsersMembership={currUsersMembership}
                    refreshData={RedirectToOrgPage}
                    isOrgTeam
                />
            </SectionCard>

            {orgData.members.map((member) => {
                return (
                    <OrgTeamMember
                        session={session}
                        key={member.userId}
                        org={orgData}
                        member={member}
                        currMember={currUsersMembership}
                        fetchOrgData={refreshOrgData}
                    />
                );
            })}
        </>
    );
}

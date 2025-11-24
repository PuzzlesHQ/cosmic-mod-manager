import { hasRootAccess } from "@app/utils/constants/roles";
import type { Context } from "hono";
import { UpdateTeamMember } from "~/db/team-member_item";
import { GetTeam } from "~/db/team_item";
import { addInvalidAuthAttempt } from "~/middleware/rate-limit/invalid-auth-attempt";
import { UpdateProjects_SearchIndex } from "~/routes/search/search-db";
import type { ContextUserData } from "~/types";
import {
    HTTP_STATUS,
    invalidRequestResponseData,
    notFoundResponseData,
    unauthorizedReqResponseData,
} from "~/utils/http";

export async function changeTeamOwner(
    ctx: Context,
    userSession: ContextUserData,
    teamId: string,
    newOwner_UserId: string,
) {
    const team = await GetTeam(teamId);
    if (!team) return notFoundResponseData();

    const newOwner = team.members.find((member) => member.userId === newOwner_UserId);
    if (!newOwner || !newOwner.accepted) return notFoundResponseData("Member not found");

    const currOwner = team.members.find((member) => member.isOwner);
    const currMember = team.members.find((member) => member.userId === userSession.id);
    if (!hasRootAccess(currMember?.isOwner, userSession.role)) {
        await addInvalidAuthAttempt(ctx);
        return unauthorizedReqResponseData("You don't have access to change the team owner");
    }

    if (currOwner?.id === newOwner.id)
        return invalidRequestResponseData("The target member is already the owner of the team");

    // Remove ownership from the current owner
    if (currOwner?.id) {
        await UpdateTeamMember({
            where: {
                id: currOwner.id,
            },
            data: {
                isOwner: false,
                role: "Member",
                permissions: [],
                organisationPermissions: [],
            },
        });
    }

    // Give ownership to the target member
    await UpdateTeamMember({
        where: {
            id: newOwner.id,
        },
        data: {
            isOwner: true,
            role: "Owner",
            permissions: [],
            organisationPermissions: [],
        },
    });

    // Update the index of team's project
    if (team.project?.id) await UpdateProjects_SearchIndex([team.project.id]);

    return { data: { success: true, message: "Team owner changed" }, status: HTTP_STATUS.OK };
}

import clientFetch from "~/utils/client-fetch";

export async function acceptTeamInvite(teamId: string) {
    if (!teamId) return;

    const res = await clientFetch(`/api/team/${teamId}/invite`, {
        method: "PATCH",
    });
    const data = await res.json();
    return data;
}

export async function leaveTeam(teamId: string) {
    if (!teamId) return;

    const res = await clientFetch(`/api/team/${teamId}/leave`, {
        method: "POST",
    });
    const data = await res.json();
    return data;
}

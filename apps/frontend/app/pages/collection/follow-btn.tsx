import { Button } from "@app/components/ui/button";
import { HeartIcon } from "lucide-react";
import { useSession } from "~/hooks/session";
import { LoginDialog } from "../auth/login/login-card";
import useCollections from "./provider";

export function FollowProject_Btn(props: { projectId: string }) {
    const session = useSession();
    const ctx = useCollections();
    const isFollowing = ctx.followingProjects.includes(props.projectId);

    async function toggleFollow() {
        if (isFollowing) {
            ctx.unfollowProject(props.projectId);
        } else {
            ctx.followProject(props.projectId);
        }
    }

    if (!session?.id) {
        return (
            <LoginDialog>
                <Button variant="secondary-inverted" className="rounded-full w-11 h-11 p-0">
                    <HeartIcon aria-hidden className="w-btn-icon-lg h-btn-icon-lg" fill={isFollowing ? "currentColor" : "none"} />
                </Button>
            </LoginDialog>
        );
    }

    return (
        <Button variant="secondary-inverted" className="rounded-full w-11 h-11 p-0" onClick={toggleFollow}>
            <HeartIcon aria-hidden className="w-btn-icon-lg h-btn-icon-lg" fill={isFollowing ? "currentColor" : "none"} />
        </Button>
    );
}

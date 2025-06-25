import { Button } from "@app/components/ui/button";
import { HeartIcon } from "lucide-react";
import { useLocation } from "react-router";
import { useNavigate } from "~/components/ui/link";
import { useSession } from "~/hooks/session";
import { setReturnUrl } from "~/pages/auth/oauth-providers";
import useCollections from "./provider";

export function FollowProject_Btn(props: { projectId: string }) {
    const session = useSession();
    const ctx = useCollections();
    const navigate = useNavigate();
    const location = useLocation();
    const isFollowing = ctx.followingProjects.includes(props.projectId);

    async function toggleFollow() {
        // Redirect to login page if the user isn't logged in
        if (!session?.id) {
            setReturnUrl(location);
            return navigate("/login");
        }

        if (isFollowing) {
            ctx.unfollowProject(props.projectId);
        } else {
            ctx.followProject(props.projectId);
        }
    }

    return (
        <Button variant="secondary-inverted" className="rounded-full w-11 h-11 p-0" aria-label="Follow" onClick={toggleFollow}>
            <HeartIcon aria-hidden className="w-btn-icon-lg h-btn-icon-lg" fill={isFollowing ? "currentColor" : "none"} />
        </Button>
    );
}

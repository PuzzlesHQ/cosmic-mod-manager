import { isApproved, isRejected, isUnderReview } from "@app/utils/config/project";
import { isModerator } from "@app/utils/constants/roles";
import { TriangleAlertIcon } from "lucide-react";
import { ChatThread } from "~/components/layout/chat/chat-thread";
import MarkdownRenderBox from "~/components/md-editor/md-renderer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { ProjectStatusBadge } from "~/components/ui/project-status-badge";
import { useProjectData } from "~/hooks/project";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import Config from "~/utils/config";

export default function ModerationPage() {
    const { t } = useTranslation();
    const session = useSession();

    const ctx = useProjectData();
    const project = ctx.projectData;

    let msg: React.ReactNode;
    if (isApproved(project.status)) {
        msg = null;
    } else if (isUnderReview(project.status)) {
        msg = <MarkdownRenderBox text={t.moderation.underReview_msg(Config.DISCORD_INVITE)} />;
    } else if (isRejected(project.status)) {
        msg = (
            <div>
                <MarkdownRenderBox text={t.moderation.rejected_msg("/legal/rules")} />
                <p className="mt-0.5 font-semibold text-warning-foreground">
                    <TriangleAlertIcon className="inline-block h-btn-icon w-btn-icon" /> {t.moderation.repeatedSubmission_warning}
                </p>
            </div>
        );
    }

    if (!isModerator(session?.role) && !ctx.currUsersMembership) return null;

    return (
        <div className="grid gap-panel-cards">
            <Card>
                <CardHeader className="flex-row gap-x-2 pb-2">
                    <CardTitle className="w-fit text-lg-plus">{t.moderation.projectStatus}</CardTitle>
                    <ProjectStatusBadge status={project.status} t={t} />
                </CardHeader>
                <CardContent>{msg}</CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="w-fit text-lg-plus">{t.moderation.messages}</CardTitle>

                    <CardDescription>{t.moderation.pageDesc}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChatThread threadId={project.threadId} />
                </CardContent>
            </Card>
        </div>
    );
}

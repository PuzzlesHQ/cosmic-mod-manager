import { fallbackUserIcon } from "@app/components/icons";
import { ContentCardTemplate, PanelContent_AsideCardLayout } from "@app/components/misc/panel";
import { CardContent, CardHeader, CardTitle, SectionCard } from "@app/components/ui/card";
import type { ProjectListItem } from "@app/utils/types/api";
import { imageUrl } from "@app/utils/url";
import { ChevronRightIcon, HistoryIcon } from "lucide-react";
import { ImgWrapper } from "~/components/ui/avatar";
import Link, { ButtonLink } from "~/components/ui/link";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import { UserProfilePath } from "~/utils/urls";
import { type NotificationsData, NotificationsList } from "./notification/page";

interface Props extends NotificationsData {
    userProjects: ProjectListItem[];
}

export default function OverviewPage({ userProjects, notifications, relatedProjects, relatedOrgs, relatedUsers }: Props) {
    const { t } = useTranslation();
    const session = useSession();
    const unreadNotifications = notifications?.filter((notification) => !notification.read);

    const totalProjects = (userProjects || []).length;
    const totalDownloads = (userProjects || []).reduce((acc, project) => acc + project.downloads, 0) || 0;
    const totalFollowers = 0;

    if (!session?.id) return null;

    return (
        <div className="w-full flex flex-col items-start justify-start gap-panel-cards">
            <ContentCardTemplate sectionTag>
                <div className="w-full flex flex-wrap gap-6">
                    <ImgWrapper
                        vtId={session.id}
                        src={imageUrl(session?.avatar)}
                        alt={session.userName}
                        fallback={fallbackUserIcon}
                        className="rounded-full"
                    />

                    <div className="flex flex-col items-start justify-center">
                        <span className="text-xl font-semibold">{session.userName}</span>
                        <Link to={UserProfilePath(session.userName)} className="flex gap-1 items-center justify-center link_blue">
                            {t.settings.visitYourProfile}
                            <ChevronRightIcon aria-hidden className="w-btn-icon h-btn-icon" />
                        </Link>
                    </div>
                </div>
            </ContentCardTemplate>

            <PanelContent_AsideCardLayout>
                <SectionCard className="w-full">
                    <CardHeader className="w-full flex flex-row items-center justify-between gap-x-6 gap-y-2">
                        <CardTitle className="w-fit">{t.dashboard.notifications}</CardTitle>
                        {(unreadNotifications?.length || 0) > 0 ? (
                            <Link to="/dashboard/notifications" className="link_blue flex items-center justify-center">
                                {t.dashboard.seeAll}
                                <ChevronRightIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                            </Link>
                        ) : null}
                    </CardHeader>
                    <CardContent>
                        <NotificationsList
                            notifications={unreadNotifications}
                            relatedProjects={relatedProjects}
                            relatedUsers={relatedUsers}
                            relatedOrgs={relatedOrgs}
                            concise={true}
                            showMarkAsReadButton={false}
                        />

                        {!unreadNotifications?.length && (
                            <div aria-label={t.dashboard.noUnreadNotifs}>
                                <span className="text-muted-foreground">{t.dashboard.noUnreadNotifs}</span>

                                <ButtonLink url="/dashboard/notifications/history" className="w-fit bg-shallow-background">
                                    <HistoryIcon aria-hidden className="w-btn-icon h-btn-icon" />
                                    {t.dashboard.viewNotifHistory}
                                </ButtonLink>
                            </div>
                        )}
                    </CardContent>
                </SectionCard>

                <ContentCardTemplate
                    sectionTag
                    title={t.dashboard.analytics}
                    className="w-full flex flex-wrap flex-row items-start justify-start gap-panel-cards"
                >
                    <div className="w-[14rem] flex flex-col items-start justify-center bg-background p-4 rounded">
                        <span className="text-lg text-muted-foreground font-semibold mb-1">{t.dashboard.totalDownloads}</span>
                        <span className="text-2xl font-semibold">{totalDownloads}</span>
                        <span className="text-muted-foreground">{t.dashboard.fromProjects(totalProjects)}</span>
                    </div>
                    <div className="w-[14rem] flex flex-col items-start justify-center bg-background p-4 rounded">
                        <span className="text-lg text-muted-foreground font-semibold mb-1">{t.dashboard.totalFollowers}</span>
                        <span className="text-2xl font-semibold">{totalFollowers}</span>
                        <span className="text-muted-foreground">{t.dashboard.fromProjects(totalProjects)}</span>
                    </div>
                </ContentCardTemplate>
            </PanelContent_AsideCardLayout>
        </div>
    );
}

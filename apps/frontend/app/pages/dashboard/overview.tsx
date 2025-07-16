import type { ProjectListItem } from "@app/utils/types/api";
import { imageUrl } from "@app/utils/url";
import { ChevronRightIcon, HistoryIcon } from "lucide-react";
import { fallbackUserIcon } from "~/components/icons";
import { ContentCardTemplate, PanelContent_AsideCardLayout } from "~/components/misc/panel";
import { ImgWrapper } from "~/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { TextLink, VariantButtonLink } from "~/components/ui/link";
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
        <div className="flex w-full flex-col items-start justify-start gap-panel-cards">
            <ContentCardTemplate sectionTag>
                <div className="flex w-full flex-wrap gap-6">
                    <ImgWrapper
                        vtId={session.id}
                        src={imageUrl(session?.avatar)}
                        alt={session.userName}
                        fallback={fallbackUserIcon}
                        className="rounded-full"
                    />

                    <div className="flex flex-col items-start justify-center">
                        <span className="font-semibold text-xl">{session.userName}</span>
                        <TextLink to={UserProfilePath(session.userName)} className="flex items-center justify-center gap-1">
                            {t.settings.visitYourProfile}
                            <ChevronRightIcon aria-hidden className="h-btn-icon w-btn-icon" />
                        </TextLink>
                    </div>
                </div>
            </ContentCardTemplate>

            <PanelContent_AsideCardLayout>
                <Card useSectionTag className="w-full">
                    <CardHeader className="flex w-full flex-row items-center justify-between gap-x-6 gap-y-2">
                        <CardTitle className="w-fit">{t.dashboard.notifications}</CardTitle>
                        {(unreadNotifications?.length || 0) > 0 ? (
                            <TextLink to="/dashboard/notifications" className="flex items-center justify-center">
                                {t.dashboard.seeAll}
                                <ChevronRightIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                            </TextLink>
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
                            <div className="grid gap-4">
                                <span className="text-foreground-muted">{t.dashboard.noUnreadNotifs}</span>

                                <VariantButtonLink to="/dashboard/notifications/history" className="w-fit" variant="secondary">
                                    <HistoryIcon aria-hidden className="h-btn-icon w-btn-icon" />
                                    {t.dashboard.viewNotifHistory}
                                </VariantButtonLink>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <ContentCardTemplate
                    sectionTag
                    title={t.dashboard.analytics}
                    className="flex w-full flex-row flex-wrap items-start justify-start gap-panel-cards"
                >
                    <div className="flex w-[14rem] flex-col items-start justify-center rounded bg-background p-4">
                        <span className="mb-1 font-semibold text-foreground-muted text-lg">{t.dashboard.totalDownloads}</span>
                        <span className="font-semibold text-2xl">{totalDownloads}</span>
                        <span className="text-foreground-muted">{t.dashboard.fromProjects(totalProjects)}</span>
                    </div>
                    <div className="flex w-[14rem] flex-col items-start justify-center rounded bg-background p-4">
                        <span className="mb-1 font-semibold text-foreground-muted text-lg">{t.dashboard.totalFollowers}</span>
                        <span className="font-semibold text-2xl">{totalFollowers}</span>
                        <span className="text-foreground-muted">{t.dashboard.fromProjects(totalProjects)}</span>
                    </div>
                </ContentCardTemplate>
            </PanelContent_AsideCardLayout>
        </div>
    );
}

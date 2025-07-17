import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useTranslation } from "~/locales/provider";
import { FormatUrl_WithHintLocale } from "~/utils/urls";
import { type NotificationsData, NotificationsList } from "./page";

export default function NotificationsHistoryPage({
    notifications,
    relatedProjects,
    relatedOrgs,
    relatedUsers,
}: NotificationsData) {
    const { t } = useTranslation();

    return (
        <Card className="w-full">
            <CardHeader className="flex w-full flex-col gap-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={FormatUrl_WithHintLocale("/dashboard/notifications")}>
                                {t.dashboard.notifications}
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{t.dashboard.history}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <CardTitle className="w-fit">{t.dashboard.notifHistory}</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-panel-cards">
                {!notifications?.length && <span className="text-foreground-muted">{t.dashboard.noUnreadNotifs}</span>}

                <NotificationsList
                    notifications={notifications}
                    relatedProjects={relatedProjects}
                    relatedUsers={relatedUsers}
                    relatedOrgs={relatedOrgs}
                    showMarkAsReadButton={true}
                    showDeleteButton={true}
                />
            </CardContent>
        </Card>
    );
}

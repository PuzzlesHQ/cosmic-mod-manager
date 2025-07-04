import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@app/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@app/components/ui/card";
import { isModerator } from "@app/utils/constants/roles";
import type { DetailedReport } from "@app/utils/types/api/report";
import MarkdownRenderBox from "~/components/md-renderer";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import { ChatThread } from "../chat/chat-thread";
import { ReportInfo } from "./report-list";

interface Props {
    data: DetailedReport;
}

export function ReportDetails(props: Props) {
    const session = useSession();
    const { t } = useTranslation();

    const reportsPage_BaseUrl = isModerator(session?.role) ? "/moderation/reports" : "/dashboard/reports";

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>{t.report.reportDetails}</CardTitle>

                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href={reportsPage_BaseUrl}>{t.moderation.reports}</BreadcrumbLink>
                            </BreadcrumbItem>

                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{props.data.id}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </CardHeader>

                <CardContent className="gap-panel-cards">
                    <ReportInfo report={props.data} viewReportBtn={false} />

                    <div className="w-full grid gap-2">
                        <span className="text-lg font-bold px-1">{t.form.description}</span>
                        <MarkdownRenderBox
                            text={props.data.body}
                            className="p-card-surround border-2 dark:border-shallow-background rounded-lg"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t.moderation.messages}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChatThread threadId={props.data.threadId} report={props.data} />
                </CardContent>
            </Card>
        </>
    );
}

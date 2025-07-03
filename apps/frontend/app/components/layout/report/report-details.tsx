import { Card, CardContent, CardHeader, CardTitle } from "@app/components/ui/card";
import type { DetailedReport } from "@app/utils/types/api/report";
import MarkdownRenderBox from "~/components/md-renderer";
import { useTranslation } from "~/locales/provider";
import { ChatThread } from "../chat/chat-thread";
import { ReportInfo } from "./report-list";

interface Props {
    data: DetailedReport;
}

export function ReportDetails(props: Props) {
    const { t } = useTranslation();

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>{t.report.reportDetails}</CardTitle>
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

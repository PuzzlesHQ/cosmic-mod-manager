import { fallbackProjectIcon, fallbackUserIcon } from "@app/components/icons";
import { Badge } from "@app/components/ui/badge";
import CopyBtn from "@app/components/ui/copy-btn";
import { TooltipProvider, TooltipTemplate } from "@app/components/ui/tooltip";
import { cn } from "@app/components/utils";
import { isModerator } from "@app/utils/constants/roles";
import { type DetailedReport, ReportItemType } from "@app/utils/types/api/report";
import { ChevronRightIcon, GitCommitHorizontalIcon, LockKeyholeIcon } from "lucide-react";
import { useMemo } from "react";
import { ImgWrapper } from "~/components/ui/avatar";
import { FormattedDate, TimePassedSince } from "~/components/ui/date";
import Link, { TextLink } from "~/components/ui/link";
import { useSession } from "~/hooks/session";
import { useTranslation } from "~/locales/provider";
import { ProjectPagePath, ReportPagePath, UserProfilePath, VersionPagePath } from "~/utils/urls";
import { getDetailedReports, type ReportsData } from "./_additional-data-loader";

interface Props {
    data: ReportsData;
}

export default function ReportList(props: Props) {
    const data = props.data;

    const detailedReports = useMemo(() => {
        return getDetailedReports(data);
    }, [props.data.reports]);

    return (
        <div className="w-full grid gap-panel-cards">
            {detailedReports.map((report) => (
                <ReportInfo key={report.id} report={report} />
            ))}
        </div>
    );
}

interface ReportInfoProps {
    report: DetailedReport;
    viewReportBtn?: boolean;
}

export function ReportInfo(props: ReportInfoProps) {
    const { t } = useTranslation();
    const session = useSession();

    const reporter = props.report.reporterUser;

    return (
        <div className="w-full grid gap-2 bg-background p-card-surround rounded-lg text-muted-foreground group/report-item">
            <div className="flex items-center justify-between gap-x-3 gap-y-1 flex-wrap">
                <ReportedItem report={props.report} />

                <div className="flex gap-2 items-center">
                    {props.report.closed && (
                        <Badge
                            variant="destructive"
                            className="flex items-center justify-center gap-0.5"
                            title={t.report.status(t.common.closed).join("")}
                        >
                            <LockKeyholeIcon className="w-3 h-3" strokeWidth={2.5} />
                            {t.common.closed}
                        </Badge>
                    )}
                    <Badge
                        variant="warning"
                        title={t.report.ruleViolated(t.report.violationType[props.report.reportType]).join("")}
                    >
                        {t.report.violationType[props.report.reportType]}
                    </Badge>
                </div>
            </div>

            <div className="flex items-center gap-x-space flex-wrap">
                {t.report.reportedBy(
                    props.report.reporter === session?.id ? (
                        t.common.you
                    ) : (
                        <Link
                            key="reporter-user"
                            to={UserProfilePath(reporter.userName)}
                            className="w-fit inline-flex items-center justify-center gap-space group/profile-link"
                        >
                            <ImgWrapper
                                alt={reporter.userName}
                                src={reporter.avatar}
                                fallback={fallbackUserIcon}
                                className="w-5 h-5 rounded-full"
                            />

                            <span className="font-medium group-hover/profile-link:underline">{reporter.userName}</span>
                        </Link>
                    ),
                )}

                <TooltipProvider>
                    <TooltipTemplate content={<FormattedDate date={props.report.createdAt} />}>
                        <span className="text-extra-muted-foreground cursor-help">
                            <TimePassedSince date={props.report.createdAt} />
                        </span>
                    </TooltipTemplate>
                </TooltipProvider>

                {props.viewReportBtn !== false && (
                    <TextLink
                        to={ReportPagePath(props.report.id, isModerator(session?.role))}
                        className="ms-auto flex items-center justify-center gap-space"
                    >
                        {t.report.viewReport}
                        <ChevronRightIcon className="w-btn-icon-md h-btn-icon-md" />
                    </TextLink>
                )}
            </div>
        </div>
    );
}

function ReportedItem({ report }: { report: DetailedReport }) {
    const { t } = useTranslation();

    function NotFoundMsg({ msg }: { msg: string }) {
        return (
            <span className="w-fit flex items-center justify-center gap-2">
                {msg}: <CopyBtn id={report.itemId} text={report.itemId} label={report.itemId} />
            </span>
        );
    }

    switch (report.itemType) {
        case ReportItemType.PROJECT: {
            const project = report.project;

            if (!project) {
                return <NotFoundMsg msg={t.error.projectNotFound} />;
            }

            return (
                <ReportedItem_Comp
                    url={ProjectPagePath(project.type[0], project.slug)}
                    imgAlt={project.name}
                    icon={project.icon}
                    fallback={fallbackProjectIcon}
                    itemTitle={project.name}
                    itemType={report.itemType}
                    itemType_translated={t.project.project}
                />
            );
        }

        case ReportItemType.VERSION: {
            const version = report.version;

            if (!version) {
                return <NotFoundMsg msg={t.error.versionNotFound} />;
            }

            return (
                <ReportedItem_Comp
                    url={VersionPagePath("project", version.projectId, version.id)}
                    imgAlt={version.title}
                    icon={null}
                    fallback={<GitCommitHorizontalIcon className="w-[100%] h-[100%] text-extra-muted-foreground" />}
                    itemTitle={version.title}
                    itemType={report.itemType}
                    itemType_translated={t.version.version}
                />
            );
        }

        case ReportItemType.USER: {
            const user = report.user;

            if (!user) {
                return <NotFoundMsg msg={t.error.userNotFound} />;
            }

            return (
                <ReportedItem_Comp
                    url={UserProfilePath(user.userName)}
                    imgAlt={user.userName}
                    icon={user.avatar}
                    fallback={fallbackUserIcon}
                    itemTitle={user.userName}
                    itemType={report.itemType}
                    itemType_translated={t.user.user}
                />
            );
        }
    }

    return null;
}

interface ReportedItem_CompProps {
    url: string;
    imgAlt: string;
    icon: string | null;
    fallback: React.ReactNode;
    itemTitle: string;
    itemType: string;
    itemType_translated: string;
}

function ReportedItem_Comp(props: ReportedItem_CompProps) {
    const { t } = useTranslation();

    return (
        <Link to={props.url} className="w-fit flex items-center justify-center gap-2 group/item-link">
            <ImgWrapper
                alt={props.imgAlt}
                src={props.icon}
                fallback={props.fallback}
                className={cn("w-10 h-10 bg-card-background", props.itemType === ReportItemType.USER && "rounded-full")}
            />

            <span className="font-bold group-hover/item-link:underline">{props.itemTitle}</span>

            <Badge
                variant="outline"
                className="text-extra-muted-foreground"
                title={t.report.reportedItem(props.itemType_translated).join("")}
            >
                {props.itemType_translated}
            </Badge>
        </Link>
    );
}

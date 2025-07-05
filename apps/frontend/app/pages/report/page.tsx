import { Button } from "@app/components/ui/button";
import { Input } from "@app/components/ui/input";
import { Label } from "@app/components/ui/label";
import { ButtonStyleRadioGroup, RadioGroup } from "@app/components/ui/radio-group";
import { toast } from "@app/components/ui/sonner";
import { LoadingSpinner } from "@app/components/ui/spinner";
import type { z } from "@app/utils/schemas";
import type { newReportFormSchema } from "@app/utils/schemas/report";
import type { ProjectDetailsData, ProjectVersionData } from "@app/utils/types/api";
import { type Report, ReportItemType, RuleViolationType } from "@app/utils/types/api/report";
import type { UserProfileData } from "@app/utils/types/api/user";
import {
    AlertTriangleIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    CheckCircle2Icon,
    ScaleIcon,
    SendIcon,
    XCircleIcon,
} from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router";
import MarkdownEditor from "~/components/md-editor";
import Link, { TextLink, useNavigate, VariantButtonLink } from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";
import Config from "~/utils/config";
import { ProjectPagePath, ReportPagePath, UserProfilePath, VersionPagePath } from "~/utils/urls";

export const ITEM_ID_PARAM_KEY = "itemId";
export const ITEM_TYPE_PARAM_KEY = "itemType";

export default function ReportPage({ data }: { data: LoaderData }) {
    const { t } = useTranslation();

    let reportingItemId: string | undefined;
    let reportingItem: string | undefined;
    let reportingItem_link: string | undefined;
    let reportingItemType: string | undefined;
    switch (data?.itemType) {
        case ReportItemType.PROJECT:
            if (data.project) {
                reportingItemId = data.project.id;
                reportingItemType = t.project.project;
                reportingItem = data.project?.name;
                reportingItem_link = ProjectPagePath(data.project.type[0], data.project.slug);
            }
            break;

        case ReportItemType.VERSION:
            if (data.version) {
                reportingItemId = data.version.id;
                reportingItemType = t.version.version;
                reportingItem = data.version.title;
                reportingItem_link = VersionPagePath("project", data.version.projectId, data.version.id);
            }
            break;

        case ReportItemType.USER:
            if (data.user) {
                reportingItemId = data.user.id;
                reportingItemType = t.user.user;
                reportingItem = data.user.userName;
                reportingItem_link = UserProfilePath(data.user.userName);
            }
            break;
    }

    function Main(props: { children: React.ReactNode }) {
        return (
            <main className="w-full grid max-w-4xl p-card-surround mx-auto gap-4">
                <div className="grid text-center">
                    <ScaleIcon className="w-full h-12 text-warning-foreground" />
                    <h1 className="text-xl-plus font-bold text-foreground-bright leading-loose">
                        {data?.existingReport?.id
                            ? t.report.alreadyReported(reportingItem || t.report.content)
                            : t.report.reportToMods(reportingItem || t.report.content)}
                    </h1>
                    <div className="h-[1px] bg-gradient-to-l from-warning-foreground/5 via-warning-foreground to-warning-foreground/5" />
                </div>

                {props.children}
            </main>
        );
    }

    if (data?.existingReport?.id) {
        return (
            <Main>
                <div className="grid gap-3">
                    <p className="text-muted-foreground">{t.report.alreadyReportedDesc(reportingItemType || t.report.content)}</p>
                    <div className="flex gap-3 items-center justify-end">
                        {reportingItem_link && reportingItemType ? (
                            <VariantButtonLink url={reportingItem_link} variant="secondary">
                                <ArrowLeftIcon className="w-btn-icon-md h-btn-icon-md" />
                                {t.report.backToContent(reportingItemType)}
                            </VariantButtonLink>
                        ) : null}

                        <VariantButtonLink url={ReportPagePath(data.existingReport.id)} variant="default">
                            {t.report.goToReport}
                            <ArrowRightIcon className="w-btn-icon-md h-btn-icon-md" />
                        </VariantButtonLink>
                    </div>
                </div>
            </Main>
        );
    }

    return (
        <Main>
            <div className="grid items-start sm:grid-cols-2 gap-4 px-card-surround">
                {[
                    {
                        heading: t.report.pleaseReport,
                        icon: "positive",
                        items: [
                            {
                                key: "report-violations",
                                title: t.report.rulesViolation(
                                    Config.SITE_NAME_SHORT,
                                    <TextLink key="content-rules" to="/legal/rules">
                                        {t.legal.rules}
                                    </TextLink>,
                                    <TextLink key="terms-of-use" to="/legal/terms">
                                        {t.legal.termsTitle}
                                    </TextLink>,
                                ),
                                desc: t.report.violationExamples,
                            },
                        ],
                    },
                    {
                        heading: t.report.itsNotFor,
                        icon: "negative",
                        items: [
                            {
                                key: "no-bug-reports",
                                title: t.report.bugReports,
                            },
                            {
                                key: "no-dmca-takedown-reports",
                                title: t.report.dmcaTakedowns,
                                desc: t.report.seeCopyrightPolicy(
                                    <TextLink key="copyright-policy" to="/legal/copyright">
                                        {t.legal.copyrightPolicyTitle}
                                    </TextLink>,
                                ),
                            },
                        ],
                    },
                ].map((section) => {
                    const icon =
                        section.icon === "positive" ? (
                            <CheckCircle2Icon className="size-8 text-success-background" />
                        ) : (
                            <XCircleIcon className="size-8 text-danger-background" />
                        );

                    return (
                        <div key={section.heading} className="grid gap-2">
                            <h2 className="text-lg font-bold text-foreground-bright">{section.heading}</h2>
                            {section.items.map((item) => {
                                return (
                                    <div key={item.key} className="grid grid-cols-[min-content_1fr] items-center gap-2">
                                        {icon}
                                        <div className="grid">
                                            <span className="text-base text-foreground-bright font-semibold">{item.title}</span>
                                            {!!item.desc && (
                                                <span className="text-sm text-extra-muted-foreground leading-tight">
                                                    {item.desc}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {reportingItemId && reportingItemType && data?.itemType && (
                <ReportSelectedItem itemId={reportingItemId} itemType={data.itemType} itemTypeTranslated={reportingItemType} />
            )}

            {!reportingItemId && <SelectWhatToReport />}
        </Main>
    );
}

function ReportSelectedItem(props: { itemId: string; itemType: ReportItemType; itemTypeTranslated: string }) {
    const { t } = useTranslation();
    const [reportBody, setReportBody] = useState("");
    const [violationType, setViolationType] = useState<RuleViolationType>(RuleViolationType.SPAM);
    const [submittingReport, setSubmittingReport] = useState(false);
    const navigate = useNavigate();

    async function submitReport() {
        if (!reportBody || submittingReport) return;
        setSubmittingReport(true);

        const data = {
            itemId: props.itemId,
            itemType: props.itemType,
            reportType: violationType,
            body: reportBody,
        } satisfies z.infer<typeof newReportFormSchema>;

        try {
            const res = await clientFetch("/api/report", {
                method: "POST",
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const error = await res.json();
                if (error?.message) {
                    toast.error(error.message);
                } else {
                    toast.error(t.error.sthWentWrong);
                }
                return;
            }

            const report = (await res.json()) as { reportId: string };
            navigate(ReportPagePath(report.reportId));
        } finally {
            setSubmittingReport(false);
        }
    }

    return (
        <div className="grid gap-5 p-card-surround rounded-lg bg-card-background">
            <div className="grid gap-2">
                <Label>{t.report.whichRuleIsBeingViolated(Config.SITE_NAME_SHORT, props.itemType)}</Label>

                <RadioGroup
                    value={violationType}
                    onValueChange={(val) => setViolationType(val as RuleViolationType)}
                    className="flex flex-wrap gap-2"
                >
                    <ButtonStyleRadioGroup
                        currvalue={violationType}
                        items={Object.values(RuleViolationType).map((type) => {
                            return {
                                value: type,
                                label: t.report.violationType[type],
                            };
                        })}
                    />
                </RadioGroup>
            </div>

            {(violationType === RuleViolationType.REUPLOADED_WORK || RuleViolationType.MALICIOUS === violationType) && (
                <div className="p-card-surround rounded border-2 border-warning-foreground bg-warning-background/20 text-foreground-bright grid grid-cols-[min-content,_1fr] gap-2">
                    <AlertTriangleIcon className="w-btn-icon-lg h-btn-icon-lg mt-[0.15em] text-warning-foreground" />

                    <div className="grid gap-2">
                        {violationType === RuleViolationType.MALICIOUS && (
                            <>
                                <p className="leading-snug">{t.report.violationType.malicious_desc[0]}</p>
                                <p className="leading-snug">{t.report.violationType.malicious_desc[1]}</p>
                            </>
                        )}
                        {violationType === RuleViolationType.REUPLOADED_WORK && (
                            <>
                                <p className="leading-snug">{t.report.violationType.reuploaded_work_desc._1}</p>
                                <p className="leading-snug">
                                    {t.report.violationType.reuploaded_work_desc._2(
                                        <Link key="copyright-policy" to="/legal/copyright" className="link_blue hover:underline">
                                            {t.legal.copyrightPolicyTitle}
                                        </Link>,
                                    )}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}

            {!!violationType && (
                <>
                    <div className="grid gap-2">
                        <div className="grid gap-1">
                            <Label>{t.report.provideAdditionalContext}</Label>
                            <p className="text-extra-muted-foreground">{t.report.additionalContextDesc}</p>
                        </div>
                        <MarkdownEditor editorValue={reportBody} setEditorValue={setReportBody} />
                    </div>

                    <Button className="justify-self-end" disabled={!reportBody || submittingReport} onClick={submitReport}>
                        {submittingReport ? <LoadingSpinner size="xs" /> : <SendIcon className="w-btn-icon-md h-btn-icon-md" />}
                        {t.report.submitReport}
                    </Button>
                </>
            )}
        </div>
    );
}

function SelectWhatToReport() {
    const { t } = useTranslation();
    const [, setSearchParams] = useSearchParams();

    const [itemType, setItemType] = useState<ReportItemType | "">("");
    const [itemId, setItemId] = useState("");

    const cantSubmit = !itemType || !itemId;

    function updateParams() {
        if (cantSubmit) return;

        setSearchParams((prev) => {
            prev.set(ITEM_TYPE_PARAM_KEY, itemType);
            prev.set(ITEM_ID_PARAM_KEY, itemId);
            return prev;
        });
    }

    return (
        <div className="grid gap-5 p-card-surround rounded-lg bg-card-background">
            <div className="grid gap-2">
                <Label>{t.report.whatTypeOfContent}</Label>
                <RadioGroup
                    value={itemType}
                    onValueChange={(val) => setItemType(val as ReportItemType)}
                    className="flex flex-wrap gap-2"
                >
                    <ButtonStyleRadioGroup
                        currvalue={itemType}
                        items={Object.values(ReportItemType).map((type) => {
                            // @ts-ignore
                            const reportingItemType = t[type][type] || type;

                            return {
                                value: type,
                                label: reportingItemType,
                            };
                        })}
                    />
                </RadioGroup>
            </div>

            {!!itemType && (
                <>
                    <Label className="grid gap-2 w-full sm:w-[24ch]">
                        {/* @ts-ignore */}
                        {t.report.whatIsContentId(!itemType ? t.report.content : t[itemType][itemType] || itemType)}
                        <Input
                            value={itemId}
                            onChange={(e) => setItemId(e.target.value)}
                            // @ts-ignore
                            placeholder={!itemType ? t.report.content : t[itemType][itemType] || itemType}
                        />
                    </Label>

                    <Button onClick={updateParams} className="justify-self-end" disabled={cantSubmit}>
                        <ArrowRightIcon className="w-btn-icon-md h-btn-icon-md" />
                        {t.form.continue}
                    </Button>
                </>
            )}
        </div>
    );
}

export type LoaderData =
    | {
          itemType: ReportItemType.PROJECT;
          project: ProjectDetailsData | null;
          existingReport: Report | null;
      }
    | {
          itemType: ReportItemType.VERSION;
          version: ProjectVersionData | null;
          existingReport: Report | null;
      }
    | {
          itemType: ReportItemType.USER;
          user: UserProfileData | null;
          existingReport: Report | null;
      }
    | null;

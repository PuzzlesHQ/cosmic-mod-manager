import { Button } from "@app/components/ui/button";
import { Input } from "@app/components/ui/input";
import { Label } from "@app/components/ui/label";
import type { ProjectDetailsData, ProjectVersionData } from "@app/utils/types/api";
import { ReportItemType } from "@app/utils/types/api/report";
import type { UserProfileData } from "@app/utils/types/api/user";
import { ScaleIcon } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "~/locales/provider";

export const ITEM_ID_PARAM_KEY = "itemId";
export const ITEM_TYPE_PARAM_KEY = "itemType";

export default function ReportPage({ data }: { data: LoaderData }) {
    const { t } = useTranslation();
    const [, setSearchParams] = useSearchParams();
    const [itemId, setItemId] = useState("");
    const [complimentaryItemId, setComplimentaryItemId] = useState("");

    function updateParams() {
        setSearchParams((prev) => {
            prev.set(ITEM_ID_PARAM_KEY, itemId);
            return prev;
        });
    }

    let reportingItem: string | undefined;
    switch (data?.itemType) {
        case ReportItemType.PROJECT:
            if (data.project) reportingItem = data.project?.name;
            break;

        case ReportItemType.VERSION:
            if (data.version) reportingItem = data.version.title;
            break;

        case ReportItemType.USER:
            if (data.user) reportingItem = data.user.userName;
            break;
    }

    // bg-card-background rounded-lg
    return (
        <main className="w-full grid max-w-4xl p-card-surround justify-self-center gap-4">
            <div className="grid text-center">
                <ScaleIcon className="w-full h-10 text-warning-foreground" />
                <h1 className="text-xl-plus font-bold text-foreground-bright leading-loose">
                    {t.report.reportToMods(reportingItem || t.report.content)}
                </h1>
                <div className="h-[1px] bg-gradient-to-l from-warning-foreground/5 via-warning-foreground to-warning-foreground/5" />
            </div>

            {!reportingItem && <SelectReportItem />}

            <h1 className="font-semibold">REPORT</h1>
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-start gap-2">
                    <Input
                        value={itemId}
                        onChange={(e) => setItemId(e.target.value)}
                        // className="no_input_box_styles border-b-2 border-shallower-background bg-transparent w-[16ch]"
                        placeholder={t.project.project}
                    />

                    <Input
                        value={complimentaryItemId}
                        onChange={(e) => setComplimentaryItemId(e.target.value)}
                        // className="no_input_box_styles border-b-2 border-shallower-background bg-transparent w-[16ch]"
                        placeholder={t.version.versionID}
                    />
                </div>
                <Button onClick={updateParams}>DONE</Button>
            </div>
        </main>
    );
}

function SelectReportItem() {
    const { t } = useTranslation();
    const [, setSearchParams] = useSearchParams();

    const [itemType, setItemType] = useState<ReportItemType | null>(null);
    const [itemId, setItemId] = useState("");
    const [complimentaryItemId, setComplimentaryItemId] = useState("");

    function updateParams() {
        setSearchParams((prev) => {
            prev.set(ITEM_ID_PARAM_KEY, itemId);
            return prev;
        });
    }

    return (
        <div className="p-card-surround rounded-lg bg-card-background">
            <Label>{t.report.whatTypeOfContent}</Label>

            <Label>{t.report.whatTypeOfContent}</Label>
        </div>
    );
}

export type LoaderData =
    | {
          itemType: ReportItemType.PROJECT;
          project: ProjectDetailsData | null;
      }
    | {
          itemType: ReportItemType.VERSION;
          version: ProjectVersionData | null;
      }
    | {
          itemType: ReportItemType.USER;
          user: UserProfileData | null;
      }
    | null;

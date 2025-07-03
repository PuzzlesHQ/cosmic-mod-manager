import { z } from "zod/v4";
import { MAX_REPORT_DESCRIPTION_LENGTH } from "~/constants";
import { ReportItemType, RuleViolationType } from "~/types/api/report";

export const newReportFormSchema = z.object({
    reportType: z.enum(RuleViolationType),
    itemType: z.enum(ReportItemType),
    itemId: z.string(),
    body: z.string().max(MAX_REPORT_DESCRIPTION_LENGTH),
});

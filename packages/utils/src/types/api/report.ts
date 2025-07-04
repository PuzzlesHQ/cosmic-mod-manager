import type { ProjectListItem, ProjectVersionData } from "~/types/api";
import type { UserProfileData } from "~/types/api/user";

export enum ReportItemType {
    PROJECT = "project",
    VERSION = "version",
    USER = "user",
}

export enum RuleViolationType {
    SPAM = "spam",
    REUPLOADED_WORK = "reuploaded_work",
    INAPPROPRIATE = "inappropriate",
    MALICIOUS = "malicious",
    NAME_SQUATTING = "name_squatting",
    POOR_DESCRIPTION = "poor_description",
    INVALID_METADATA = "invalid_metadata",
    OTHER = "other",
}

export interface Report {
    id: string;
    reportType: RuleViolationType;
    itemType: ReportItemType;
    itemId: string;
    body: string;
    reporter: string;
    closed: boolean;
    createdAt: Date;
    threadId: string;
}

type ReportItemData =
    | {
          itemType: ReportItemType.PROJECT;
          project: ProjectListItem | null;
      }
    | {
          itemType: ReportItemType.VERSION;
          version: ProjectVersionData | null;
      }
    | {
          itemType: ReportItemType.USER;
          user: UserProfileData | null;
      };

export type DetailedReport = Report &
    ReportItemData & {
        reporterUser: UserProfileData;
    };

//  Filters

export enum ReportStatus_Filter {
    ALL = "all",
    OPEN = "open",
    CLOSED = "closed",
}

export interface ReportFilters {
    status: ReportStatus_Filter;
    itemType: ReportItemType | "all";
    itemId: string;
    ruleViolated: RuleViolationType[];
    reportedBy: string;
}

export const reportFilters_defaults = {
    status: ReportStatus_Filter.OPEN,
    itemType: "all",
    itemId: "",
    ruleViolated: [],
    reportedBy: "",
} as const satisfies ReportFilters;

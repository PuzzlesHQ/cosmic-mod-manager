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
    reportedItem: ReportItemType;
    reportedItemId: string;
    body: string;
    reporter: string;
    closed: boolean;
    createdAt: Date;
    threadId: string;
}

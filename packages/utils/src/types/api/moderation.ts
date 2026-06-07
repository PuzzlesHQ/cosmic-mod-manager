import type { ProjectPublishingStatus, ProjectVisibility } from "..";

export interface ModerationProjectItem {
    id: string;
    slug: string;
    name: string;
    summary: string;
    type: string[];
    icon: string | null;
    downloads: number;
    followers: number;
    dateQueued: Date;
    status: ProjectPublishingStatus;
    requestedStatus: ProjectPublishingStatus;
    visibility: ProjectVisibility;

    author: {
        name: string;
        icon: string | null;
        slug: string;
        isOrg: boolean;
    };
}

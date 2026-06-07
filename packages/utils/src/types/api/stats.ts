export interface Statistics {
    users: number;
    authors: number;
    files: number;
    projects: number;
    versions: number;
}

export interface ProjectDownloads_Analytics {
    [projectId: string]: {
        [date: string]: number;
    };
}

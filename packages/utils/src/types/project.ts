export interface DependencyProjectData {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    type: string[];
}

export interface DependencyVersionData {
    id: string;
    title: string;
    versionNumber: string;
    slug: string;
}

export interface DependencyData {
    projects: DependencyProjectData[];
    versions: DependencyVersionData[];
}

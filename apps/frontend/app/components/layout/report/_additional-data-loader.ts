import { encodeArrayIntoStr } from "@app/utils/string";
import type { ProjectListItem, ProjectVersionData } from "@app/utils/types/api";
import { type DetailedReport, type Report, ReportItemType } from "@app/utils/types/api/report";
import type { UserProfileData } from "@app/utils/types/api/user";
import { resJson, serverFetch } from "~/utils/server-fetch";

export type ReportsData = Awaited<ReturnType<typeof ReportsDataLoader>>;

export async function ReportsDataLoader(clientReq: Request, reports: Report[] | null) {
    const initData = {
        reports: [] as Report[],
        users: new Map<string, UserProfileData>(),
        reportedProjects: new Map<string, ProjectListItem>(),
        reportedVersions: new Map<string, ProjectVersionData>(),
    };

    if (!reports || reports.length === 0) {
        return initData;
    }

    const userIds = new Set<string>();

    const reportedProjects = new Set<string>();
    const reportedVersions = new Set<string>();

    for (const report of reports) {
        if (report.itemType === ReportItemType.USER) {
            userIds.add(report.itemId);
        } else if (report.itemType === ReportItemType.PROJECT) {
            reportedProjects.add(report.itemId);
        } else if (report.itemType === ReportItemType.VERSION) {
            reportedVersions.add(report.itemId);
        }

        userIds.add(report.reporter);
    }

    const [users_res, projects_res, versions_res] = await Promise.all([
        userIds.size > 0 ? serverFetch(clientReq, `/api/users?ids=${encodeArrayIntoStr(userIds)}`) : Response.json([]),
        reportedProjects.size > 0
            ? serverFetch(clientReq, `/api/projects?ids=${encodeArrayIntoStr(reportedProjects)}`)
            : Response.json([]),
        reportedVersions.size > 0
            ? serverFetch(clientReq, `/api/version?ids=${encodeArrayIntoStr(reportedVersions)}`)
            : Response.json([]),
    ]);

    const [users, projects, versions] = await Promise.all([
        resJson<UserProfileData[]>(users_res),
        resJson<ProjectListItem[]>(projects_res),
        resJson<ProjectVersionData[]>(versions_res),
    ]);

    for (const user of users || []) {
        initData.users.set(user.id, user);
    }
    for (const project of projects || []) {
        initData.reportedProjects.set(project.id, project);
    }
    for (const version of versions || []) {
        initData.reportedVersions.set(version.id, version);
    }
    initData.reports = reports;

    return initData;
}

export function getDetailedReports(data: ReportsData) {
    const _reports: DetailedReport[] = [];

    for (const report of data.reports) {
        const reporter = data.users.get(report.reporter);
        if (!reporter) continue;

        switch (report.itemType) {
            case ReportItemType.PROJECT:
                _reports.push({
                    ...report,
                    itemType: ReportItemType.PROJECT,
                    project: data.reportedProjects.get(report.itemId) || null,
                    reporterUser: reporter,
                });
                break;
            case ReportItemType.VERSION:
                _reports.push({
                    ...report,
                    itemType: ReportItemType.VERSION,
                    version: data.reportedVersions.get(report.itemId) || null,
                    reporterUser: reporter,
                });
                break;
            case ReportItemType.USER:
                _reports.push({
                    ...report,
                    itemType: ReportItemType.USER,
                    user: data.users.get(report.itemId) || null,
                    reporterUser: reporter,
                });
                break;
        }
    }

    return _reports;
}

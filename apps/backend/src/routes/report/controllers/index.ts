import { isModerator } from "@app/utils/constants/roles";
import type { z } from "@app/utils/schemas";
import type { newReportFormSchema } from "@app/utils/schemas/report";
import {
    type Report,
    type ReportFilters,
    ReportItemType,
    type RuleViolationType,
    reportFilters_defaults,
} from "@app/utils/types/api/report";
import { type MessageBody, MessageType, ThreadType } from "@app/utils/types/api/thread";
import type { Prisma } from "@prisma-client";
import { GetProject_ListItem } from "~/db/project_item";
import { GetUser_ByIdOrUsername } from "~/db/user_item";
import { getVersionsData } from "~/routes/versions/handler";
import prisma from "~/services/prisma";
import type { ContextUserData } from "~/types";
import {
    HTTP_STATUS,
    invalidRequestResponseData,
    notFoundResponseData,
    unauthorizedReqResponseData,
} from "~/utils/http";
import { generateDbId } from "~/utils/str";

export async function createReport(data: z.infer<typeof newReportFormSchema>, user: ContextUserData) {
    if (data.body.length < 10) {
        return invalidRequestResponseData("Pleaes provide a detailed description of the issue.");
    }

    const existingReport = await getExistingReport(data.itemType, data.itemId, user);
    if (existingReport?.data?.id) {
        return invalidRequestResponseData(
            "You have already reported this item. Please wait for the moderators to review your report.",
        );
    }

    const itemData = await getReportEntityData(data.itemType, data.itemId);
    if (!itemData) return invalidRequestResponseData("The item you are trying to report does not exist.");
    if (itemData.itemType === ReportItemType.USER && itemData.data.id === user.id) {
        return invalidRequestResponseData("You cannot report yourself.");
    }

    const reportId = generateDbId();
    const reportThread = await prisma.thread.create({
        data: {
            id: generateDbId(),
            type: ThreadType.REPORT,
            relatedEntity: reportId,
            members: [user.id],
        },
    });

    const report = await prisma.report.create({
        data: {
            id: reportId,
            reporter: user.id,
            reportType: data.reportType,
            itemType: data.itemType,
            itemId: itemData.data.id,
            body: data.body,
            threadId: reportThread.id,
        },
    });

    return {
        data: {
            success: true,
            reportId: report.id,
        },
        status: HTTP_STATUS.OK,
    };
}

export async function getReportData(reportId: string, user: ContextUserData) {
    const report = await prisma.report.findUnique({
        where: {
            id: reportId,
        },
    });
    if (!report?.id || (report.reporter !== user.id && !isModerator(user.role))) {
        return notFoundResponseData("Report not found.");
    }

    const reportData: Report = {
        id: report.id,
        reportType: report.reportType as RuleViolationType,
        itemType: report.itemType as ReportItemType,
        itemId: report.itemId,
        body: report.body,
        reporter: report.reporter,
        closed: report.closed,
        createdAt: report.createdAt,
        threadId: report.threadId,
    };

    return {
        data: reportData,
        status: HTTP_STATUS.OK,
    };
}

export async function getExistingReport(itemType: ReportItemType, itemId: string, user: ContextUserData) {
    const existingReport = await prisma.report.findFirst({
        where: {
            itemType: itemType,
            itemId: itemId,
            reporter: user.id,
            closed: false,
        },
    });

    if (!existingReport) {
        return {
            data: null,
            status: HTTP_STATUS.NOT_FOUND,
        };
    }

    const report: Report = {
        id: existingReport.id,
        reportType: existingReport.reportType as RuleViolationType,
        itemType: itemType,
        itemId: itemId,
        body: existingReport.body,
        reporter: user.id,
        closed: existingReport.closed,
        createdAt: existingReport.createdAt,
        threadId: existingReport.threadId,
    };

    return {
        data: report,
        status: HTTP_STATUS.OK,
    };
}

async function getReportEntityData(itemType: ReportItemType, itemId: string) {
    switch (itemType) {
        case ReportItemType.PROJECT: {
            const project = await GetProject_ListItem(itemId);
            if (!project?.id) return null;
            return {
                itemType: ReportItemType.PROJECT,
                data: project,
            };
        }

        case ReportItemType.VERSION: {
            const version = (await getVersionsData([itemId])).data?.[0];
            if (!version?.id) return null;

            return {
                itemType: ReportItemType.VERSION,
                data: version,
            };
        }

        case ReportItemType.USER: {
            const reportedUser = await GetUser_ByIdOrUsername(undefined, itemId);
            if (!reportedUser?.id) {
                return null;
            }
            return {
                itemType: ReportItemType.USER,
                data: reportedUser,
            };
        }
    }
}

export async function getAllUserReports(user: ContextUserData, userId?: string, filters?: ReportFilters) {
    if (!userId && !isModerator(user.role)) {
        return invalidRequestResponseData("User ID is required to get reports.");
    }

    if (userId && user.id !== userId && !isModerator(user.role)) {
        return unauthorizedReqResponseData("You cannot access someone else's reports!");
    }

    const whereConditions: Prisma.ReportWhereInput = {};
    if (filters) {
        if (filters.status === "closed") {
            whereConditions.closed = true;
        } else if (filters.status === "open") {
            whereConditions.closed = false;
        }

        if (filters.itemType && filters.itemType !== reportFilters_defaults.itemType) {
            whereConditions.itemType = filters.itemType;
        }

        if (filters.itemId.trim().length > 0) {
            whereConditions.itemId = filters.itemId;
        }

        if (filters.ruleViolated.length > 0) {
            whereConditions.reportType = {
                in: filters.ruleViolated,
            };
        }
    }

    if (filters?.reportedBy || userId) {
        whereConditions.reporter = userId || filters?.reportedBy;
    }

    const reports = await prisma.report.findMany({
        where: whereConditions,
        orderBy: {
            createdAt: "desc",
        },
        take: 100,
    });

    const reportList: Report[] = [];

    for (const report of reports) {
        reportList.push({
            id: report.id,
            reportType: report.reportType as RuleViolationType,
            itemType: report.itemType as ReportItemType,
            itemId: report.itemId,
            body: report.body,
            reporter: report.reporter,
            closed: report.closed,
            createdAt: report.createdAt,
            threadId: report.threadId,
        });
    }

    return {
        data: reportList,
        status: HTTP_STATUS.OK,
    };
}

export async function patchReport(reportId: string, closed: boolean, user: ContextUserData) {
    const report = await prisma.report.findUnique({
        where: {
            id: reportId,
        },
    });

    if (!report?.id || !isModerator(user.role)) {
        return notFoundResponseData("Report not found.");
    }

    await prisma.report.update({
        where: {
            id: reportId,
        },
        data: {
            closed: closed === true,
        },
    });

    // create a message in the report thread
    const msg_data: MessageBody = {
        type: closed === true ? MessageType.THREAD_CLOSURE : MessageType.THREAD_REOPEN,
        body: null,
    };

    await prisma.threadMessage.create({
        data: {
            id: generateDbId(),
            threadId: report.threadId,
            authorId: user.id,
            type: msg_data.type,
            authorHidden: isModerator(user.role),
        },
    });

    return {
        data: {
            success: true,
        },
        status: HTTP_STATUS.OK,
    };
}

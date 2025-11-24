import { DateFromStr, ISO_DateStr } from "@app/utils/date";
import { UpdateProject } from "~/db/project_item";
import { UpdateVersion } from "~/db/version_item";
import { Analytics_InsertProjectDownloads } from "~/services/clickhouse/project-downloads";
import prisma from "~/services/prisma";
import valkey from "~/services/redis";
import { generateRandomId } from "~/utils/str";
import { UpdateProjects_SearchIndex } from "../search/search-db";

interface DownloadsQueueItem {
    id: string;
    ipAddress: string;
    userId?: string;
    projectId: string;
    versionId: string;
}

const QUEUE_PROCESS_INTERVAL = 600_000; // 10 minutes
const HISTORY_VALIDITY = 10800_000; // 3 hours

const DOWNLOADS_QUEUE_KEY = "downloads-counter-queue";
const DOWNLOADS_HISTORY_KEY = "downloads-history";

const MAX_DOWNLOADS_PER_USER_PER_HISTORY_WINDOW = 3;

await processDownloads();
queueDownloadsHistoryRefresh();

async function getDownloadsHistory() {
    const list: DownloadsQueueItem[] = [];
    const historyItems = await valkey.lrange(DOWNLOADS_HISTORY_KEY, 0, -1);

    for (let i = 0; i < historyItems.length; i++) {
        const item = historyItems[i];
        try {
            list.push(JSON.parse(item) as DownloadsQueueItem);
        } catch {}
    }

    return list;
}

async function refreshDownloadsHistory() {
    await valkey.del(DOWNLOADS_HISTORY_KEY);
}

async function addToHistory(item: DownloadsQueueItem) {
    await valkey.lpush(DOWNLOADS_HISTORY_KEY, JSON.stringify(item));
}

function queueDownloadsHistoryRefresh() {
    // @ts-expect-error
    const intervalId = global.historyRefreshIntervalId;
    if (intervalId) clearInterval(intervalId);

    // @ts-expect-error
    global.historyRefreshIntervalId = setTimeout(refreshDownloadsHistory, HISTORY_VALIDITY);
}

async function flushDownloadsCounterQueue() {
    await valkey.del(DOWNLOADS_QUEUE_KEY);
}

async function getDownloadsCounterQueue(flushQueue = false) {
    const list = await valkey.lrange(DOWNLOADS_QUEUE_KEY, 0, -1);
    if (flushQueue === true) await flushDownloadsCounterQueue();

    const listItems: DownloadsQueueItem[] = [];
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        try {
            listItems.push(JSON.parse(item));
        } catch {}
    }

    return listItems;
}

export async function processDownloads() {
    try {
        if (await DownloadsProcessing()) return;
        await SetDownloadsProcessing(true);

        // Push previous day's downloads data from stats table to analytics db
        await pushOldDownloadsToAnalytics();

        const downloadsQueue = await getDownloadsCounterQueue(true);
        const downloadsHistory = await getDownloadsHistory();

        const versionDownloadsMap = new Map<string, number>();
        const projectDownloadsMap = new Map<string, number>();

        // History counters
        const userDownloadsHistory = new Map<string, number>();
        const ipDownloadsHistory = new Map<string, number>();

        for (let i = 0; i < downloadsQueue.length; i++) {
            const queueItem = downloadsQueue[i];
            let isDuplicateDownload = false;

            for (let j = 0; j < downloadsHistory.length; j++) {
                const historyItem = downloadsHistory[j];
                const userDownloads =
                    userDownloadsHistory.get(userDownloadsHistoryMapKey(queueItem.userId || "", queueItem.projectId)) ||
                    0;
                const ipDownloads =
                    ipDownloadsHistory.get(ipDownloadsHistoryMapKey(queueItem.ipAddress, queueItem.projectId)) || 0;

                userDownloadsHistory.set(
                    userDownloadsHistoryMapKey(historyItem.userId || "", historyItem.projectId),
                    userDownloads + 1,
                );
                ipDownloadsHistory.set(
                    ipDownloadsHistoryMapKey(historyItem.ipAddress, historyItem.projectId),
                    ipDownloads + 1,
                );

                if (
                    historyItem.id !== queueItem.id &&
                    historyItem.projectId === queueItem.projectId &&
                    (historyItem.ipAddress === queueItem.ipAddress ||
                        (!!historyItem.userId && historyItem.userId === queueItem.userId)) &&
                    (historyItem.versionId === queueItem.versionId ||
                        userDownloads >= MAX_DOWNLOADS_PER_USER_PER_HISTORY_WINDOW ||
                        ipDownloads >= MAX_DOWNLOADS_PER_USER_PER_HISTORY_WINDOW)
                ) {
                    isDuplicateDownload = true;
                    break;
                }
            }

            if (!isDuplicateDownload) {
                await addToHistory(queueItem); // redis
                downloadsHistory.push(queueItem); // also push to the current history array

                versionDownloadsMap.set(queueItem.versionId, (versionDownloadsMap.get(queueItem.versionId) || 0) + 1);
                projectDownloadsMap.set(queueItem.projectId, (projectDownloadsMap.get(queueItem.projectId) || 0) + 1);
            }
        }

        const promises = [];

        // Update all the versions
        const versionIds = Array.from(versionDownloadsMap.keys());
        for (const versionId of versionIds) {
            const downloadsCount = versionDownloadsMap.get(versionId);
            try {
                promises.push(
                    UpdateVersion({
                        where: { id: versionId },
                        data: { downloads: { increment: downloadsCount } },
                    }),
                );
            } catch {}
        }

        // Update all the projects
        const projectIds = Array.from(projectDownloadsMap.keys());
        const today = ISO_DateStr();

        for (const projectId of projectIds) {
            const downloadsCount = projectDownloadsMap.get(projectId) || 0;
            if (!downloadsCount) continue;

            try {
                promises.push(
                    UpdateProject({
                        where: { id: projectId },
                        data: { downloads: { increment: downloadsCount } },
                    }),
                );

                promises.push(
                    prisma.projectDailyStats.upsert({
                        where: { projectId },
                        update: {
                            downloads: {
                                increment: downloadsCount,
                            },
                            date: today,
                        },

                        create: {
                            projectId: projectId,
                            downloads: downloadsCount,
                            date: today,
                        },
                    }),
                );
            } catch {}
        }

        await Promise.all(promises);
        UpdateProjects_SearchIndex(projectIds);
    } finally {
        await SetDownloadsProcessing(false);
    }
}

export async function queueDownloadsCounterQueueProcessing() {
    // @ts-expect-error
    const intervalId = global.downloadsCounterQueueIntervalId;
    if (intervalId) clearInterval(intervalId);

    // @ts-expect-error
    global.downloadsCounterQueueIntervalId = setInterval(processDownloads, QUEUE_PROCESS_INTERVAL);
}

export async function DownloadsProcessing() {
    return (await valkey.get("downloadsQueueProcessing")) === "true";
}

export async function SetDownloadsProcessing(val: boolean) {
    await valkey.set("downloadsQueueProcessing", val === true ? "true" : "false");
}

export async function addToDownloadsQueue(item: Omit<DownloadsQueueItem, "id">) {
    await valkey.lpush(DOWNLOADS_QUEUE_KEY, JSON.stringify({ ...item, id: generateRandomId() }));
}

function userDownloadsHistoryMapKey(userId: string, projectId: string) {
    return `${userId}:${projectId}`;
}
function ipDownloadsHistoryMapKey(ipAddr: string, projectId: string) {
    return `${ipAddr}:${projectId}`;
}

async function pushOldDownloadsToAnalytics() {
    const today = ISO_DateStr();

    const stats = await prisma.projectDailyStats.findMany({
        where: {
            downloads: {
                gt: 0,
            },
            date: {
                not: today,
            },
        },
    });

    const projectIds: string[] = [];

    for (const item of stats) {
        projectIds.push(item.projectId);

        Analytics_InsertProjectDownloads([
            {
                projectId: item.projectId,
                downloadsCount: item.downloads,
                date: DateFromStr(item.date),
            },
        ]);
    }

    await prisma.projectDailyStats.updateMany({
        where: {
            projectId: {
                in: projectIds,
            },
        },
        data: {
            date: today,
            downloads: 0,
        },
    });
}

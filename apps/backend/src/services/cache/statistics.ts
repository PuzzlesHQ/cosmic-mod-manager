import type { Statistics } from "@app/utils/types/api/stats";
import { STATISTICS_CACHE_EXPIRY_seconds } from "~/db/_cache";
import valkey from "~/services/redis";
import { STATISTICS_CACHE_KEY } from "~/types/namespaces";
import { parseJson } from "~/utils/str";

export async function getStatisticsCache() {
    const str = await valkey.get(STATISTICS_CACHE_KEY);
    return await parseJson<Statistics>(str);
}

export async function setStatisticsCache(data: Statistics) {
    const str = JSON.stringify(data);
    await valkey.set(STATISTICS_CACHE_KEY, str, "EX", STATISTICS_CACHE_EXPIRY_seconds);
}

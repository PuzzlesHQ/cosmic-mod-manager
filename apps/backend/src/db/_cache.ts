import { cacheKey } from "~/services/cache/utils";
import valkey from "~/services/redis";
import { parseJson } from "~/utils/str";

// const TIME_3HR = 10800;
// const TIME_6HR = 21600;
const TIME_12HR = 43200; // seconds

export const USER_DATA_CACHE_EXPIRY_seconds = TIME_12HR;
export const PAT_CACHE_EXPIRY_seconds = 600; // 10 minutes; short expiry for security reasons
export const USER_SESSION_CACHE_EXPIRY_seconds = 600;

export const PROJECT_CACHE_EXPIRY_seconds = TIME_12HR;
export const VERSION_CACHE_EXPIRY_seconds = TIME_12HR;

export const ORGANIZATION_DATA_CACHE_EXPIRY_seconds = TIME_12HR;

export const COLLECTION_CACHE_EXPIRY_seconds = TIME_12HR;

export const TEAM_DATA_CACHE_EXPIRY_seconds = TIME_12HR;

export const FILE_ITEM_EXPIRY_seconds = TIME_12HR;

export const STATISTICS_CACHE_EXPIRY_seconds = TIME_12HR;

export async function GetData_FromCache<T extends object | null>(NAMESPACE: string, key?: string): Promise<T | null> {
    const rawData = await GetRawData_FromCache(NAMESPACE, key);
    if (!rawData) return null;

    return await parseJson<T>(rawData);
}

export async function GetRawData_FromCache(NAMESPACE: string, key?: string): Promise<string | null> {
    if (!key) return null;

    const primaryKeyData = await valkey.get(cacheKey(key, NAMESPACE));
    if (!primaryKeyData) return null;

    if (primaryKeyData.startsWith("{") || primaryKeyData.startsWith("[")) return primaryKeyData;

    // If the primaryKeyData is not a JSON object, it is most likely a secondary key
    // Use the primaryKeyData to get the main data
    const secondaryKeyData = await valkey.get(cacheKey(primaryKeyData, NAMESPACE));
    if (!secondaryKeyData) return null;

    return secondaryKeyData;
}

export async function SetCache(NAMESPACE: string, key: string, data: string, expiry_seconds: number) {
    await valkey.set(cacheKey(key, NAMESPACE), data, "EX", expiry_seconds);
}

export async function DeleteCache(...keys: string[]) {
    await valkey.del(keys);
}

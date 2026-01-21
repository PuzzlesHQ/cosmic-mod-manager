import valkey from "~/services/redis";

interface BucketConsumptionResult {
    rateLimited: boolean;
    remaining: number;
    max: number;
    timeWindow_seconds: number;
}

export class TokenBucket {
    private storageKey: string;

    max: number;
    timeWindow_seconds: number;

    constructor(storageKey: string, max: number, timeWindow_seconds: number) {
        this.storageKey = storageKey;
        this.max = max;
        this.timeWindow_seconds = timeWindow_seconds;
    }

    async consume(key: string, cost = 1): Promise<BucketConsumptionResult> {
        try {
            const bucketKey = this.bucketKey(key);
            const used = await this.getBucket(bucketKey);
            const remaining = Math.max(this.max - used, 0);

            if (used < this.max && cost > 0) {
                await valkey.incrby(bucketKey, cost);
            }

            if (remaining > 0) {
                return {
                    rateLimited: false,
                    remaining: remaining,
                    timeWindow_seconds: this.timeWindow_seconds,
                    max: this.max,
                };
            }
        } catch (error) {
            console.error(error);
        }

        return {
            rateLimited: true,
            remaining: 0,
            timeWindow_seconds: this.timeWindow_seconds,
            max: this.max,
        };
    }

    private bucketKey(key: string): string {
        return `${this.storageKey}:${key}`;
    }

    private async getBucket(bucketKey: string): Promise<number> {
        let used = Number.parseInt((await valkey.get(bucketKey)) || "-1", 10);
        if (Number.isNaN(used) || used < 0) {
            used = 1;
            await valkey.set(bucketKey, 1, "EX", this.timeWindow_seconds);
        }

        return used;
    }
}

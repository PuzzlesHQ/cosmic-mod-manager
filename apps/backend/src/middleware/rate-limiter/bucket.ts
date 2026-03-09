import valkey from "~/services/redis";

// the Buffer stored in redis contains data in the following order
// all values are 32 bits, so the timestamps are in seconds
// [0] = currWindowTimestamp
// [1] = currWindowCount
// [2] = prevWindowTimestamp
// [3] = prevWindowCount

class SlidingWindowCounter {
    constructor(
        private timeWindow_s: number,
        private storeNamespace: string,
    ) {}

    async consume(id: string, limit: number, amount = 1) {
        const now = this.now_s();
        const stats = await this.getCount(id);

        // more than 2 windows have elapsed so all previous data is stale
        if (stats[0] + 2 * this.timeWindow_s < now) {
            stats[0] = now;
            stats[1] = 0;
            stats[2] = 0;
            stats[3] = 0;
        }
        // only one window has elapsed, so slide the current window to previous and zero the current one
        else if (stats[0] + this.timeWindow_s < now) {
            stats[2] = stats[0];
            stats[3] = stats[1];

            // zero the curr window
            stats[0] = now;
            stats[1] = 0;
        }

        const prevWeight = 1 - (now - stats[0]) / this.timeWindow_s;
        const effectiveCurrCount = stats[1] + prevWeight * stats[3];

        if (effectiveCurrCount + amount > limit) {
            return { allowed: false };
        } else {
            stats[1] += amount;
            await this.saveCount(id, stats);
            return { allowed: true };
        }
    }

    private async getCount(id: string) {
        const data = await valkey.getBuffer(this.storeKey(id));

        if (!data || data.byteLength < 16) {
            return new Uint32Array(4);
        }

        return new Uint32Array(data.buffer.slice(data.byteOffset, data.byteOffset + 16));
    }

    private async saveCount(id: string, stats: Uint32Array) {
        const buf = Buffer.from(stats.buffer);
        await valkey.set(this.storeKey(id), buf, "EX", this.timeWindow_s * 2);
    }

    private storeKey(id: string) {
        return `${this.storeNamespace}:${id}`;
    }

    private now_s() {
        return Math.floor(Date.now() / 1000);
    }
}

const UNIVERSAL_RATE_LIMIT_NAMESPACE = "global-rateLimit";
const GLOBAL_RATE_LIMIT_TIME_WINDOW_s = 120;
export const universalRateLimiterBucket = new SlidingWindowCounter(
    GLOBAL_RATE_LIMIT_TIME_WINDOW_s,
    UNIVERSAL_RATE_LIMIT_NAMESPACE,
);

// Fixed window bucket
interface BucketConsumptionResult {
    allowed: boolean;
}

export class FixedWindowBucket {
    constructor(
        private storageKey: string,
        public max: number,
        public timeWindow_seconds: number,
    ) {}

    async consume(key: string, cost = 1): Promise<BucketConsumptionResult> {
        try {
            const bucketKey = this.bucketKey(key);
            const used = await this.getBucket(bucketKey);
            const remaining = Math.max(this.max - used, 0);

            if (used < this.max && cost > 0) {
                await valkey.incrby(bucketKey, cost);
            }

            if (remaining > 0) {
                return { allowed: true };
            }
        } catch (error) {
            console.error(error);
        }

        return { allowed: false };
    }

    private bucketKey(key: string): string {
        return `${this.storageKey}:${key}`;
    }

    private async getBucket(bucketKey: string): Promise<number> {
        let used = Number.parseInt((await valkey.get(bucketKey)) || "-1", 10);
        if (Number.isNaN(used) || used < 0) {
            used = 0;
            await valkey.set(bucketKey, 0, "EX", this.timeWindow_seconds);
        }

        return used;
    }
}

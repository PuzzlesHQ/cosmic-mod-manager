import valkey from "~/services/redis";

// the Buffer stored in redis contains data in the following order
// all values are 32 bits, so the timestamps are in seconds
// [0] = currWindowTimestamp
// [1] = currWindowCount
// [2] = prevWindowTimestamp
// [3] = prevWindowCount

export class SlidingWindowCounter {
    constructor(
        private storeNamespace: string,
        private maxAllowed: number,
        private timeWindow_s: number,
    ) {}

    async consume(id: string, amount = 1) {
        const now = this.now_s();
        const stats = await this.getCount(id, now);

        const prevWeight = 1 - (now - stats[0]) / this.timeWindow_s;
        const effectiveCurrCount = stats[1] + prevWeight * stats[3];

        if (effectiveCurrCount + amount > this.maxAllowed) {
            return { allowed: false };
        } else {
            stats[1] += amount;
            await this.saveCount(id, stats);
            return { allowed: true };
        }
    }

    private async getCount(id: string, now: number) {
        const stats = await this.getCountBuffer(id);

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

        return stats;
    }

    private async getCountBuffer(id: string) {
        const data = await valkey.getBuffer(this.storeKey(id));
        if (data && data.byteLength >= 16) {
            return new Uint32Array(data.buffer.slice(data.byteOffset, data.byteOffset + 16));
        }

        return new Uint32Array(4);
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

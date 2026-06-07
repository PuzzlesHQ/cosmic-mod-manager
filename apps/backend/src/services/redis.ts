import { Redis as Valkey } from "ioredis";
import env from "~/utils/env";

let valkey: Valkey;
const redisPort = 5501;

if (env.NODE_ENV === "production") {
    valkey = newValkeyClient();
} else {
    // @ts-expect-error
    if (!global.valkey) {
        // @ts-expect-error
        global.valkey = newValkeyClient();
    }
    // @ts-expect-error
    valkey = global.valkey;
}

export default valkey;

function newValkeyClient() {
    const client = new Valkey(redisPort);

    return client;
}

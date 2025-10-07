import { MeiliSearch } from "meilisearch";
import env from "~/utils/env";

function newMeilisearchClient() {
    return new MeiliSearch({
        host: "http://127.0.0.1:7700",
        apiKey: env.MEILISEARCH_MASTER_KEY,
    });
}

let meilisearch: MeiliSearch;

if (env.NODE_ENV === "production") {
    meilisearch = newMeilisearchClient();
} else {
    // @ts-expect-error
    if (!global.meilisearch) {
        // @ts-expect-error
        global.meilisearch = newMeilisearchClient();
    }
    // @ts-expect-error
    meilisearch = global.meilisearch;
}

export default meilisearch;

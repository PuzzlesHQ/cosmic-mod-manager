import { type ClickHouseClient, createClient } from "@clickhouse/client";
import env from "~/utils/env";

let clickhouse: ClickHouseClient;

if (env.NODE_ENV === "production") {
    clickhouse = newClickhouseClient();
} else {
    // @ts-expect-error
    if (!global.clickhouse) global.clickhouse = newClickhouseClient();
    // @ts-expect-error
    clickhouse = global.clickhouse;
}

function newClickhouseClient() {
    return createClient({
        url: `http://localhost:${env.CLICKHOUSE_PORT}`,
        username: env.CLICKHOUSE_USER,
        password: env.CLICKHOUSE_PASSWORD,
    });
}

// Initialize schemas

export const ANALYTICS_DB = "crmm_analytics";

async function InitializeClickhouseSchemas() {
    try {
        await clickhouse.command({
            query: `CREATE DATABASE IF NOT EXISTS ${ANALYTICS_DB};`,
        });
        await clickhouse.command({
            query: `
            CREATE TABLE IF NOT EXISTS ${ANALYTICS_DB}.project_downloads (
                project_id String NOT NULL,
                downloads_count UInt64 NOT NULL DEFAULT 0,
                date Date NOT NULL DEFAULT toDate(NOW()),
            ) ENGINE = MergeTree()
            PRIMARY KEY (project_id, date)
            PARTITION BY date
            ORDER BY (project_id, date, downloads_count);
            `,
        });
        await clickhouse.command({
            query: `
            OPTIMIZE TABLE ${ANALYTICS_DB}.project_downloads FINAL;
            `,
        });

        console.log("Clickhouse schemas initialized");
    } catch (error) {
        console.error("Error initializing Clickhouse schemas");
        console.error(error);
    }
}
await InitializeClickhouseSchemas();

export default clickhouse;

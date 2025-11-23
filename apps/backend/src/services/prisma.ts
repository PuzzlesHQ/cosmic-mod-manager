import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client/extension";
import env from "~/utils/env";

let prisma: PrismaClient;

function newDbClient() {
    const adapter = new PrismaPg({ connectionString: env.PG_DATABASE_URL });
    return new PrismaClient({ adapter });
}

if (env.NODE_ENV === "production") {
    prisma = newDbClient();
} else {
    // @ts-expect-error
    if (!global.prisma) {
        // @ts-expect-error
        global.prisma = newDbClient();
    }
    // @ts-expect-error
    prisma = global.prisma;
}

export default prisma;

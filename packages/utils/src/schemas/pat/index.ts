import { z } from "zod/v4";

export const createPAT_FormSchema = z.object({
    name: z.string().min(1).max(64),
    dateExpires: z.date(),
    authScopes: z.bigint().nonnegative(),
});

import { z } from "zod/v4";
import { API_SCOPE } from "~/pats";

export const createPAT_FormSchema = z.object({
    name: z.string().min(1).max(64),
    dateExpires: z.iso.date(),
    authScopes: z.enum(API_SCOPE).array(),
});

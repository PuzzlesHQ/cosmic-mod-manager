import { z } from "zod/v4";
import { nullableStringUrl } from "../index";

export const updateExternalLinksFormSchema = z.object({
    issueTracker: nullableStringUrl,
    sourceCode: nullableStringUrl,
    wikiPage: nullableStringUrl,
    discordServer: nullableStringUrl,
});

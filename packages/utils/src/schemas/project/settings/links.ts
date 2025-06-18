import { z } from "zod/v4";
import { formLink } from "../index";

export const updateExternalLinksFormSchema = z.object({
    issueTracker: formLink.optional(),
    sourceCode: formLink.optional(),
    wikiPage: formLink.optional(),
    discordServer: formLink.optional(),
});

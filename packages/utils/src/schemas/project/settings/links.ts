import { z } from "zod/v4";
import { formLink } from "../index";

export const updateExternalLinksFormSchema = z.object({
    issueTracker: formLink.nullable(),
    sourceCode: formLink.nullable(),
    wikiPage: formLink.nullable(),
    discordServer: formLink.nullable(),
});

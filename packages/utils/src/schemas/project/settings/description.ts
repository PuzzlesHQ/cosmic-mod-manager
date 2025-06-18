import { z } from "zod/v4";
import { MAX_PROJECT_DESCRIPTION_LENGTH } from "~/constants";

export const updateDescriptionFormSchema = z.object({
    description: z.string().max(MAX_PROJECT_DESCRIPTION_LENGTH).optional(),
});

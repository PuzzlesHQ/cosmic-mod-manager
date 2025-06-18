import { z } from "zod";
import { MAX_PROJECT_DESCRIPTION_LENGTH } from "~/constants";

export const updateDescriptionFormSchema = z.object({
    description: z.string().max(MAX_PROJECT_DESCRIPTION_LENGTH).optional(),
});

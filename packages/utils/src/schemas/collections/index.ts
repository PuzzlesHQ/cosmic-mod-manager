import { z } from "zod/v4";
import { MAX_COLLECTION_DESCRIPTION_LENGTH, MAX_COLLECTION_NAME_LENGTH } from "~/constants";
import { CollectionVisibility } from "~/types";
import { iconFieldSchema } from "..";

export const createCollectionFormSchema = z.object({
    name: z.string().min(2).max(MAX_COLLECTION_NAME_LENGTH),
    description: z.string().max(MAX_COLLECTION_DESCRIPTION_LENGTH).optional(),
});

export const updateCollectionFormSchema = createCollectionFormSchema.extend({
    icon: iconFieldSchema.or(z.string()).optional(),
    visibility: z.enum(CollectionVisibility),
});

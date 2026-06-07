import { z } from "zod/v4";
import { MAX_COLLECTION_DESCRIPTION_LENGTH, MAX_COLLECTION_NAME_LENGTH } from "~/constants";
import { iconFieldSchema } from "~/schemas";
import { CollectionVisibility } from "~/types";

export const createCollectionFormSchema = z.object({
    name: z.string().min(2).max(MAX_COLLECTION_NAME_LENGTH),
    description: z.string().max(MAX_COLLECTION_DESCRIPTION_LENGTH).nullable(),
});

export const updateCollectionFormSchema = createCollectionFormSchema.extend({
    icon: iconFieldSchema.or(z.string()).nullable(),
    visibility: z.enum(CollectionVisibility),
});

import { z } from "zod/v4";
import { MAX_ORGANISATION_DESCRIPTION_LENGTH, MAX_ORGANISATION_NAME_LENGTH } from "~/constants";
import { createURLSafeSlug } from "~/string";
import { mustBeURLSafe } from "../utils";

export const orgSlugField = z
    .string()
    .min(2)
    .max(MAX_ORGANISATION_NAME_LENGTH)
    .refine(
        (slug) => {
            if (slug !== createURLSafeSlug(slug)) return false;
            return true;
        },
        { error: mustBeURLSafe("Organization slug") },
    );

export const createOrganisationFormSchema = z.object({
    name: z.string().min(2).max(MAX_ORGANISATION_NAME_LENGTH),
    slug: orgSlugField,
    description: z.string().min(5).max(MAX_ORGANISATION_DESCRIPTION_LENGTH),
});

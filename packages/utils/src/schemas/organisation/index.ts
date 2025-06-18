import { z } from "zod";
import { MAX_ORGANISATION_DESCRIPTION_LENGTH, MAX_ORGANISATION_NAME_LENGTH } from "~/constants";
import { createURLSafeSlug } from "~/string";

export const orgSlugField = z
    .string()
    .min(2)
    .max(MAX_ORGANISATION_NAME_LENGTH)
    .refine(
        (slug) => {
            if (slug !== createURLSafeSlug(slug).value) return false;
            return true;
        },
        { message: "Slug must be a URL safe string" },
    );

export const createOrganisationFormSchema = z.object({
    name: z.string().min(2).max(MAX_ORGANISATION_NAME_LENGTH),
    slug: orgSlugField,
    description: z.string().min(5).max(MAX_ORGANISATION_DESCRIPTION_LENGTH),
});

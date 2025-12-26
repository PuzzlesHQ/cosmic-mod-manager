import { z } from "zod/v4";
import { RESERVED_PROJECT_SLUGS } from "~/config/reserved";
import { MAX_PROJECT_NAME_LENGTH, MAX_PROJECT_SUMMARY_LENGTH, MIN_PROJECT_NAME_LENGTH } from "~/constants";
import { validateProjectTypesCompatibility } from "~/project";
import { createURLSafeSlug } from "~/string";
import { ProjectType, ProjectVisibility } from "~/types";
import { mustBeURLSafe } from "../utils";

// export const stringUrl = z.preprocess((val: string) => (val === "" ? null : val), z.url({ protocol: /^https?/ }));
export const nullableStringUrl = z
    .preprocess((val: string) => (val === "" ? null : val), z.url({ protocol: /^https?/ }).nullable())
    .nullable();

export const ProjectTypeField = z
    .enum(ProjectType)
    .array()
    .min(1)
    .refine(
        (values) => {
            const filteredTypes = validateProjectTypesCompatibility(values);
            for (const value of values) {
                if (!filteredTypes.includes(value)) return false;
            }

            return true;
        },
        { error: "Invalid project types combination" },
    );

export const ProjectSlugField = z
    .string()
    .min(MIN_PROJECT_NAME_LENGTH)
    .max(MAX_PROJECT_NAME_LENGTH)
    .refine(
        (slug) => {
            if (slug !== createURLSafeSlug(slug)) return false;
            return true;
        },
        { error: mustBeURLSafe("Project slug") },
    )
    .refine(
        (slug) => {
            if (RESERVED_PROJECT_SLUGS.includes(slug)) return false;
            return true;
        },
        { error: "Can't use a reserved project slug" },
    );

export type newProjectFormSchemaType = z.infer<typeof newProjectFormSchema>;

export const newProjectFormSchema = z.object({
    name: z.string().min(MIN_PROJECT_NAME_LENGTH).max(MAX_PROJECT_NAME_LENGTH),
    slug: ProjectSlugField,
    type: ProjectTypeField,
    visibility: z.enum(ProjectVisibility),
    summary: z.string().min(1).max(MAX_PROJECT_SUMMARY_LENGTH),
    orgId: z.string().max(32).nullable(),
});

import { z } from "zod/v4";
import { MAX_PROJECT_NAME_LENGTH, MAX_PROJECT_SUMMARY_LENGTH, MIN_PROJECT_NAME_LENGTH } from "~/constants";
import { iconFieldSchema } from "~/schemas";
import { EnvironmentSupport, ProjectVisibility } from "~/types";
import { ProjectSlugField, ProjectTypeField } from "..";

export const generalProjectSettingsFormSchema = z.object({
    icon: iconFieldSchema.or(z.string()).optional(),
    name: z.string().min(MIN_PROJECT_NAME_LENGTH).max(MAX_PROJECT_NAME_LENGTH),
    slug: ProjectSlugField,
    type: ProjectTypeField,
    visibility: z.enum(ProjectVisibility),
    clientSide: z.enum(EnvironmentSupport),
    serverSide: z.enum(EnvironmentSupport),
    summary: z.string().min(1).max(MAX_PROJECT_SUMMARY_LENGTH),
});

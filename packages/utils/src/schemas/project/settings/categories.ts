import { z } from "zod/v4";
import { MAX_FEATURED_PROJECT_TAGS } from "~/constants";
import { categories } from "~/constants/categories";

const categoryNames = [...categories.map((category) => category.name)] as const;

const projectCategories = z.array(z.enum([categoryNames[0], ...categoryNames.slice(1)]));
export const updateProjectTagsFormSchema = z.object({
    categories: projectCategories,
    featuredCategories: projectCategories.max(
        MAX_FEATURED_PROJECT_TAGS,
        `You can feature at most ${MAX_FEATURED_PROJECT_TAGS} tags only!`,
    ),
});

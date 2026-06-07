import { z } from "zod/v4";
import { MAX_FEATURED_PROJECT_TAGS } from "~/constants";
import { categories_list } from "~/constants/categories";

const categoryNames = categories_list.map((category) => category.name);

const projectCategories = z.enum(categoryNames).array();
export const updateProjectTagsFormSchema = z.object({
    categories: projectCategories,
    featuredCategories: projectCategories.max(
        MAX_FEATURED_PROJECT_TAGS,
        `You can feature at most ${MAX_FEATURED_PROJECT_TAGS} tags only!`,
    ),
});

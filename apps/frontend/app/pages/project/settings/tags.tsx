import { type CategoriesUnion, type CategoryT, tagTypes } from "@app/utils/constants/categories";
import { getValidProjectCategories } from "@app/utils/project";
import type { z } from "@app/utils/schemas";
import { updateProjectTagsFormSchema } from "@app/utils/schemas/project/settings/categories";
import { MAX_FEATURED_PROJECT_TAGS } from "@app/utils/src/constants";
import { CapitalizeAndFormatString } from "@app/utils/string";
import type { TagType } from "@app/utils/types";
import { SaveIcon, StarIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "react-router";
import { TagIcon } from "~/components/icons/tag-icons";
import RefreshPage from "~/components/misc/refresh-page";
import { Button } from "~/components/ui/button";
import { Card, CardTitle } from "~/components/ui/card";
import { LabelledCheckbox } from "~/components/ui/checkbox";
import { Form, FormField } from "~/components/ui/form";
import { FormErrorMessage } from "~/components/ui/form-message";
import { useNavigate } from "~/components/ui/link";
import { toast } from "~/components/ui/sonner";
import { LoadingSpinner } from "~/components/ui/spinner";
import { useProjectData } from "~/hooks/project";
import { useFormHook } from "~/hooks/use-form";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";
import { submitFormWithErrorHandling } from "~/utils/form";

export default function TagsSettingsPage() {
    const { t } = useTranslation();
    const projectData = useProjectData().projectData;
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const form = useFormHook(updateProjectTagsFormSchema, {
        values: {
            categories: (projectData?.categories as CategoriesUnion[]) || [],
            featuredCategories: (projectData?.featuredCategories as CategoriesUnion[]) || [],
        },
    });
    const selectedCategoriesList = form.watch("categories");
    const selectedFeaturedTagsList = form.watch("featuredCategories");

    async function updateTags(values: z.infer<typeof updateProjectTagsFormSchema>) {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const res = await clientFetch(`/api/project/${projectData.id}/tags`, {
                method: "PATCH",
                body: JSON.stringify(values),
            });
            const data = await res.json();

            if (!res.ok || !data?.success) {
                toast.error(data?.message || t.common.error);
                return;
            }

            RefreshPage(navigate, location);
            toast.success(data?.message || t.common.success);
            return;
        } finally {
            setIsLoading(false);
        }
    }

    const availableTags = useMemo(() => {
        const _tags: [TagType, CategoryT[]][] = [];
        for (const type of tagTypes) {
            const items = getValidProjectCategories(projectData.type, type);
            if (!items.length) continue;

            _tags.push([type, items]);
        }

        return _tags;
    }, [projectData.type.toString()]);

    const projectType = t.navbar[projectData.type[0]];
    if (!availableTags[0]?.[1]?.length) {
        return <FormErrorMessage text="No categories available for the selected project type!" />;
    }

    return (
        <Form {...form}>
            <form
                onSubmit={(e) => {
                    submitFormWithErrorHandling(e, updateProjectTagsFormSchema, form, updateTags);
                }}
                className="w-full"
            >
                <Card className="flex w-full flex-col gap-4 p-card-surround">
                    <div className="flex w-full flex-col items-start justify-start gap-1">
                        <CardTitle>{t.projectSettings.tags}</CardTitle>
                        <span className="text-foreground-muted">
                            {t.projectSettings.tagsDesc(projectType.toLowerCase())}
                        </span>
                    </div>

                    {availableTags.map(([type, tags]) => {
                        return (
                            <div key={type} className="flex w-full flex-col items-start justify-start">
                                <span className="font-bold text-foreground-muted text-lg">{t.search[type]}</span>
                                <FormField
                                    control={form.control}
                                    name="categories"
                                    render={({ field }) => (
                                        <div className="autofit-grid grid w-full">
                                            {tags.map((tag) => {
                                                // @ts-expect-error
                                                const tagName = t.search.tags[tag.name] || tag.name;

                                                return (
                                                    <LabelledCheckbox
                                                        title={`${t.search[tag.type]} / ${CapitalizeAndFormatString(tagName)}`}
                                                        key={tagName}
                                                        name={tagName}
                                                        checked={field.value.includes(tag.name as CategoriesUnion)}
                                                        onCheckedChange={(e) => {
                                                            if (e === true) {
                                                                field.onChange([...field.value, tag.name]);
                                                            } else {
                                                                // Also remove the category from featured tags if it was featured
                                                                if (
                                                                    selectedFeaturedTagsList.includes(
                                                                        tag.name as CategoriesUnion,
                                                                    )
                                                                ) {
                                                                    form.setValue(
                                                                        "featuredCategories",
                                                                        selectedFeaturedTagsList.filter(
                                                                            (val) => val !== tag.name,
                                                                        ),
                                                                    );
                                                                }

                                                                field.onChange(
                                                                    field.value.filter((val) => val !== tag.name),
                                                                );
                                                            }
                                                        }}
                                                        icon={<TagIcon name={tag.name} />}
                                                    >
                                                        {CapitalizeAndFormatString(tagName)}
                                                    </LabelledCheckbox>
                                                );
                                            })}
                                        </div>
                                    )}
                                />
                            </div>
                        );
                    })}

                    <div className="flex w-full flex-col items-start justify-start">
                        <span className="flex items-center justify-center gap-2 font-bold text-lg">
                            <StarIcon aria-hidden className="h-btn-icon w-btn-icon text-foreground-muted" />
                            {t.projectSettings.featuredCategories}
                        </span>
                        <span className="text-foreground-muted">
                            {t.projectSettings.featuredCategoriesDesc(MAX_FEATURED_PROJECT_TAGS)}
                        </span>
                        <FormField
                            control={form.control}
                            name="featuredCategories"
                            render={({ field }) => (
                                <div className="autofit-grid mt-2 grid w-full">
                                    {selectedCategoriesList.map((tag) => {
                                        // @ts-expect-error
                                        const tagName = t.search.tags[tag] || tag;

                                        return (
                                            <LabelledCheckbox
                                                key={tagName}
                                                name={tagName}
                                                className="w-fit"
                                                checked={field.value.includes(tag)}
                                                disabled={
                                                    field.value.length >= MAX_FEATURED_PROJECT_TAGS &&
                                                    !field.value.includes(tag)
                                                }
                                                onCheckedChange={(e) => {
                                                    if (e === true) {
                                                        if (field.value.length >= MAX_FEATURED_PROJECT_TAGS) return;
                                                        field.onChange([...field.value, tag]);
                                                    } else {
                                                        field.onChange(
                                                            field.value.filter((selectedTag) => tag !== selectedTag),
                                                        );
                                                    }
                                                }}
                                                icon={<TagIcon name={tag} />}
                                            >
                                                {CapitalizeAndFormatString(tagName)}
                                            </LabelledCheckbox>
                                        );
                                    })}
                                </div>
                            )}
                        />

                        {!selectedCategoriesList?.length ? (
                            <span className="text-foreground-muted">{t.projectSettings.selectAtLeastOneCategory}</span>
                        ) : null}
                    </div>

                    <div className="flex w-full items-center justify-end">
                        <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
                            {isLoading ? (
                                <LoadingSpinner size="xs" />
                            ) : (
                                <SaveIcon aria-hidden className="h-btn-icon w-btn-icon" />
                            )}
                            {t.form.saveChanges}
                        </Button>
                    </div>
                </Card>
            </form>
        </Form>
    );
}

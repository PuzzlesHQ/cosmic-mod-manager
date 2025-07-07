import { TagIcon } from "@app/components/icons/tag-icons";
import RefreshPage from "@app/components/misc/refresh-page";
import { Button } from "@app/components/ui/button";
import { Card, CardTitle } from "@app/components/ui/card";
import { LabelledCheckbox } from "@app/components/ui/checkbox";
import { Form, FormField } from "@app/components/ui/form";
import { FormErrorMessage } from "@app/components/ui/form-message";
import { toast } from "@app/components/ui/sonner";
import { LoadingSpinner } from "@app/components/ui/spinner";
import { type CategoryT, tagTypes } from "@app/utils/constants/categories";
import { getValidProjectCategories } from "@app/utils/project";
import type { z } from "@app/utils/schemas";
import { updateProjectTagsFormSchema } from "@app/utils/schemas/project/settings/categories";
import { handleFormError } from "@app/utils/schemas/utils";
import { MAX_FEATURED_PROJECT_TAGS } from "@app/utils/src/constants";
import { CapitalizeAndFormatString } from "@app/utils/string";
import type { TagType } from "@app/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon, StarIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";
import { useNavigate } from "~/components/ui/link";
import { useProjectData } from "~/hooks/project";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";

export default function TagsSettingsPage() {
    const { t } = useTranslation();
    const projectData = useProjectData().projectData;

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const form = useForm<z.infer<typeof updateProjectTagsFormSchema>>({
        resolver: zodResolver(updateProjectTagsFormSchema),
        defaultValues: {
            categories: projectData?.categories || [],
            featuredCategories: projectData?.featuredCategories || [],
        },
    });
    form.watch();

    async function updateTags(values: z.infer<typeof updateProjectTagsFormSchema>) {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const res = await clientFetch(`/api/project/${projectData?.slug}/tags`, {
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

    if (!projectData) return null;

    const availableTags = useMemo(() => {
        const _tags: [TagType, CategoryT[]][] = [];
        for (const type of tagTypes) {
            const items = getValidProjectCategories(projectData.type, type);
            if (!items.length) continue;

            _tags.push([type, items]);
        }

        return _tags;
    }, [projectData.type.toString()]);

    const isSubmitBtnDisabled =
        JSON.stringify(form.getValues().categories.sort()) === JSON.stringify(projectData.categories.sort()) &&
        JSON.stringify(form.getValues().featuredCategories.sort()) === JSON.stringify(projectData.featuredCategories.sort());

    const projectType = t.navbar[projectData.type[0]];

    if (!availableTags[0]?.[1]?.length) {
        return <FormErrorMessage text="No categories available for the selected project type!" />;
    }

    return (
        <Form {...form}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                }}
                className="w-full"
            >
                <Card className="flex w-full flex-col gap-4 p-card-surround">
                    <div className="flex w-full flex-col items-start justify-start gap-1">
                        <CardTitle>{t.projectSettings.tags}</CardTitle>
                        <span className="text-muted-foreground">{t.projectSettings.tagsDesc(projectType.toLowerCase())}</span>
                    </div>

                    {availableTags.map(([type, tags]) => {
                        return (
                            <div key={type} className="flex w-full flex-col items-start justify-start">
                                <span className="font-bold text-lg">{t.search[type]}</span>
                                <FormField
                                    control={form.control}
                                    name="categories"
                                    render={({ field }) => (
                                        <div className="autofit-grid grid w-full">
                                            {tags.map((tag) => {
                                                // @ts-ignore
                                                const tagName = t.search.tags[tag.name] || tag.name;

                                                return (
                                                    <LabelledCheckbox
                                                        title={`${t.search[tag.type]} / ${CapitalizeAndFormatString(tagName)}`}
                                                        key={tagName}
                                                        name={tagName}
                                                        checked={field.value.includes(tag.name)}
                                                        onCheckedChange={(e) => {
                                                            if (e === true) {
                                                                field.onChange([...field.value, tag.name]);
                                                            } else {
                                                                field.onChange(field.value.filter((val) => val !== tag.name));

                                                                // Also remove the category from featured tags if it was featured
                                                                const selectedFeaturedTagsList =
                                                                    form.getValues().featuredCategories;
                                                                if (selectedFeaturedTagsList.includes(tag.name)) {
                                                                    form.setValue(
                                                                        "featuredCategories",
                                                                        selectedFeaturedTagsList.filter(
                                                                            (val) => val !== tag.name,
                                                                        ),
                                                                    );
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <span className="flex items-center justify-start gap-1">
                                                            <TagIcon name={tag.name} />
                                                            {CapitalizeAndFormatString(tagName)}
                                                        </span>
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
                            <StarIcon aria-hidden className="h-btn-icon w-btn-icon text-muted-foreground" />
                            {t.projectSettings.featuredCategories}
                        </span>
                        <span className="text-muted-foreground">
                            {t.projectSettings.featuredCategoriesDesc(MAX_FEATURED_PROJECT_TAGS)}
                        </span>
                        <FormField
                            control={form.control}
                            name="featuredCategories"
                            render={({ field }) => (
                                <div className="autofit-grid mt-2 grid w-full">
                                    {form.getValues().categories.map((tag) => {
                                        // @ts-ignore
                                        const tagName = t.search.tags[tag] || tag;

                                        return (
                                            <LabelledCheckbox
                                                key={tagName}
                                                name={tagName}
                                                className="w-fit"
                                                checked={field.value.includes(tag)}
                                                disabled={
                                                    field.value.length >= MAX_FEATURED_PROJECT_TAGS && !field.value.includes(tag)
                                                }
                                                onCheckedChange={(e) => {
                                                    if (e === true) {
                                                        if (field.value.length >= MAX_FEATURED_PROJECT_TAGS) return;
                                                        field.onChange([...field.value, tag]);
                                                    } else {
                                                        field.onChange(field.value.filter((selectedTag) => tag !== selectedTag));
                                                    }
                                                }}
                                            >
                                                <span className="flex items-center justify-start gap-1">
                                                    <TagIcon name={tag} />
                                                    {CapitalizeAndFormatString(tagName)}
                                                </span>
                                            </LabelledCheckbox>
                                        );
                                    })}
                                </div>
                            )}
                        />

                        {!form.getValues().categories?.length ? (
                            <span className="text-muted-foreground">{t.projectSettings.selectAtLeastOneCategory}</span>
                        ) : null}
                    </div>

                    <div className="flex w-full items-center justify-end">
                        <Button
                            type="submit"
                            disabled={isLoading || isSubmitBtnDisabled}
                            onClick={async () => {
                                await handleFormError(async () => {
                                    const formValues = await updateProjectTagsFormSchema.parseAsync(form.getValues());
                                    await updateTags(formValues);
                                }, toast.error);
                            }}
                        >
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

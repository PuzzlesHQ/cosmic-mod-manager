import { disableInteractions, enableInteractions } from "@app/utils/dom";
import { parseFileSize } from "@app/utils/number";
import { getLoadersByProjectType } from "@app/utils/project";
import type { z } from "@app/utils/schemas";
import { updateVersionFormSchema } from "@app/utils/schemas/project/version";
import { VersionReleaseChannel } from "@app/utils/types";
import type { ProjectVersionData } from "@app/utils/types/api";
import { FileIcon, SaveIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import MarkdownEditor from "~/components/md-editor/editor";
import { ContentCardTemplate } from "~/components/misc/panel";
import RefreshPage from "~/components/misc/refresh-page";
import { Button } from "~/components/ui/button";
import { Form, FormField, FormItem } from "~/components/ui/form";
import { useNavigate } from "~/components/ui/link";
import { toast } from "~/components/ui/sonner";
import { useProjectData } from "~/hooks/project";
import { useFormHook } from "~/hooks/use-form";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";
import { submitFormWithErrorHandling } from "~/utils/form";
import { ProjectPagePath, VersionPagePath } from "~/utils/urls";
import {
    AddDependencies,
    FeaturedBtn,
    MetadataInputCard,
    SelectAdditionalProjectFiles,
    UploadVersionPageTopCard,
    VersionTitleInput,
} from "./_components";

interface EditVersionPageProps {
    versionData: ProjectVersionData;
}

export default function EditVersionPage({ versionData }: EditVersionPageProps) {
    const ctx = useProjectData();
    const projectData = ctx.projectData;

    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const versionAdditionalFiles = versionData.files
        .filter((file) => file.isPrimary !== true)
        .map((file) => {
            return {
                id: file.id,
                name: file.name,
                size: file.size,
                type: file.type,
            };
        });

    const availableLoaders = getLoadersByProjectType(projectData.type);
    const initialLoaders = availableLoaders.length ? versionData.loaders || [] : [];

    const form = useFormHook(updateVersionFormSchema, {
        values: {
            title: versionData.title,
            changelog: versionData.changelog,
            releaseChannel: versionData.releaseChannel || VersionReleaseChannel.RELEASE,
            featured: versionData.featured,
            versionNumber: versionData.versionNumber,
            loaders: initialLoaders,
            gameVersions: versionData.gameVersions,
            additionalFiles: versionAdditionalFiles,
            dependencies: versionData.dependencies.map((dep) => ({
                projectId: dep.projectId,
                versionId: dep.versionId,
                dependencyType: dep.dependencyType,
            })),
        },
    });

    async function handleSubmit(values: z.infer<typeof updateVersionFormSchema>) {
        if (isLoading || !projectData || !versionData) return;
        setIsLoading(true);
        disableInteractions();

        try {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("changelog", values.changelog || "");
            formData.append("releaseChannel", values.releaseChannel || VersionReleaseChannel.RELEASE);
            formData.append("featured", values.featured.toString());
            formData.append("versionNumber", values.versionNumber);
            formData.append("loaders", JSON.stringify(values.loaders || []));
            formData.append("gameVersions", JSON.stringify(values.gameVersions));
            formData.append("dependencies", JSON.stringify(values.dependencies));
            for (const file of values.additionalFiles || []) {
                if (file instanceof File) {
                    formData.append("additionalFiles", file);
                } else {
                    formData.append("additionalFiles", JSON.stringify(file));
                }
            }

            const res = await clientFetch(`/api/project/${projectData.id}/version/${versionData.id}`, {
                method: "PATCH",
                body: formData,
            });
            const result = await res.json();

            if (!res.ok || !result?.success) {
                enableInteractions();
                return toast.error(result?.message || "Failed to update version");
            }

            RefreshPage(
                navigate,
                VersionPagePath(ctx.projectType, projectData.slug, result?.data?.slug || versionData.slug),
            );
        } finally {
            setIsLoading(false);
        }
    }

    const versionsPageUrl = ProjectPagePath(ctx.projectType, projectData.slug, "versions");
    const currVersionPageUrl = VersionPagePath(ctx.projectType, projectData.slug, versionData.slug);

    return (
        <Form {...form}>
            <form
                onSubmit={(e) => {
                    submitFormWithErrorHandling(e, updateVersionFormSchema, form, handleSubmit);
                }}
                className="flex w-full flex-col items-start justify-start gap-panel-cards"
            >
                <UploadVersionPageTopCard
                    isLoading={isLoading}
                    submitBtnLabel={t.form.saveChanges}
                    submitBtnIcon={<SaveIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />}
                    versionsPageUrl={versionsPageUrl}
                    versionDetailsPage={currVersionPageUrl}
                    versionTitle={form.getValues().title}
                    backUrl={currVersionPageUrl}
                    featuredBtn={
                        <FormField
                            control={form.control}
                            name="featured"
                            render={({ field }) => (
                                <FeaturedBtn
                                    isLoading={isLoading}
                                    featured={field.value}
                                    setFeatured={field.onChange}
                                />
                            )}
                        />
                    }
                >
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <VersionTitleInput
                                    name={field.name}
                                    value={field.value}
                                    inputRef={field.ref}
                                    disabled={field.disabled === true}
                                    onChange={field.onChange}
                                />
                            </FormItem>
                        )}
                    />
                </UploadVersionPageTopCard>

                <div className="grid w-full grid-cols-1 items-start justify-start gap-panel-cards lg:grid-cols-[1fr_min-content]">
                    <div className="flex flex-col gap-panel-cards overflow-auto">
                        <ContentCardTemplate title={t.project.changelog}>
                            <FormField
                                control={form.control}
                                name="changelog"
                                render={({ field }) => (
                                    <FormItem>
                                        <MarkdownEditor
                                            editorValue={field.value || ""}
                                            setEditorValue={field.onChange}
                                        />
                                    </FormItem>
                                )}
                            />
                        </ContentCardTemplate>

                        <ContentCardTemplate title={t.version.dependencies}>
                            <FormField
                                control={form.control}
                                name="dependencies"
                                render={({ field }) => (
                                    <FormItem>
                                        <AddDependencies
                                            dependencies={field.value || []}
                                            setDependencies={field.onChange}
                                            currProjectId={projectData.id}
                                            dependenciesData={ctx.dependencies}
                                        />
                                    </FormItem>
                                )}
                            />
                        </ContentCardTemplate>

                        <ContentCardTemplate title={t.version.files} className="grid gap-form-elements">
                            {/* PRIMARY FILE */}
                            <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded bg-raised-background px-4 py-2 sm:flex-nowrap">
                                <div className="flex items-center justify-start gap-1.5">
                                    <FileIcon
                                        aria-hidden
                                        className="h-btn-icon w-btn-icon flex-shrink-0 text-foreground-muted"
                                    />

                                    <div className="flex flex-wrap items-center justify-start gap-x-2">
                                        <span>
                                            <strong className="font-semibold">{versionData.primaryFile?.name}</strong>{" "}
                                            <span className="ms-0.5 whitespace-nowrap">
                                                ({parseFileSize(versionData.primaryFile?.size || 0)})
                                            </span>{" "}
                                            <span className="ms-1 text-foreground-muted italic">
                                                {t.version.primary}
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                <Button disabled type="button" variant="secondary-dark">
                                    <Trash2Icon aria-hidden className="h-btn-icon w-btn-icon" />
                                    {t.form.remove}
                                </Button>
                            </div>

                            <FormField
                                control={form.control}
                                name="additionalFiles"
                                render={({ field }) => (
                                    <SelectAdditionalProjectFiles
                                        fieldName={field.name}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </ContentCardTemplate>
                    </div>

                    <MetadataInputCard projectType={projectData.type} formControl={form.control} />
                </div>
            </form>
        </Form>
    );
}

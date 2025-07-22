import { getFileType } from "@app/utils/convertors";
import { parseFileSize } from "@app/utils/number";
import { getLoadersByProjectType } from "@app/utils/project";
import type { z } from "@app/utils/schemas";
import type { VersionDependencies } from "@app/utils/schemas/project/version";
import GAME_VERSIONS, { isExperimentalGameVersion } from "@app/utils/src/constants/game-versions";
import { CapitalizeAndFormatString, createURLSafeSlug } from "@app/utils/string";
import { DependencyType, DependsOn, type FileObjectType, type ProjectType, VersionReleaseChannel } from "@app/utils/types";
import type { ProjectDetailsData, ProjectVersionData } from "@app/utils/types/api";
import type { DependencyData } from "@app/utils/types/project";
import { imageUrl } from "@app/utils/url";
import { CircleAlertIcon, FileIcon, PlusIcon, StarIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { useState } from "react";
import type { Control, FieldValues, RefCallBack } from "react-hook-form";
import { CancelButtonIcon } from "~/components/icons";
import { ContentCardTemplate } from "~/components/misc/panel";
import { ImgWrapper } from "~/components/ui/avatar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button, buttonVariants } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { LabelledCheckbox } from "~/components/ui/checkbox";
import { CommandSeparator } from "~/components/ui/command";
import { FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { InteractiveLabel } from "~/components/ui/label";
import { LinkPrefetchStrategy, VariantButtonLink } from "~/components/ui/link";
import { MultiSelect } from "~/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { toast } from "~/components/ui/sonner";
import { LoadingSpinner } from "~/components/ui/spinner";
import { TooltipProvider, TooltipTemplate } from "~/components/ui/tooltip";
import { cn } from "~/components/utils";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";

interface VersionTitleInputProps {
    name: string;
    value: string;
    disabled: boolean;
    inputRef: RefCallBack;
    onChange: (value: string) => void;
}
export function VersionTitleInput({ name, value, disabled, inputRef, onChange }: VersionTitleInputProps) {
    const { t } = useTranslation();

    return (
        <Input
            placeholder={t.version.enterVersionTitle}
            className="!h-12 !py-1 !px-4 !text-foreground-muted font-semibold text-xl"
            name={name}
            value={value}
            disabled={disabled}
            ref={inputRef}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}

interface FeaturedBtnProps {
    isLoading: boolean;
    featured: boolean;
    setFeatured: (value: boolean) => void;
}
export function FeaturedBtn({ isLoading, featured, setFeatured }: FeaturedBtnProps) {
    const { t } = useTranslation();

    return (
        <Button
            variant="secondary"
            disabled={isLoading}
            type="button"
            onClick={() => setFeatured(!featured)}
            title="Featured versions show up in your project sidebar."
        >
            <StarIcon aria-hidden className={cn("h-btn-icon w-btn-icon", featured === true && "fill-current")} />
            {featured === true ? t.version.unfeature : t.version.feature}
        </Button>
    );
}

interface UploadVersionPageTopCardProps {
    isLoading: boolean;
    versionsPageUrl: string;
    versionTitle: string;
    children: React.ReactNode;
    backUrl: string;
    featuredBtn: React.ReactNode;
    submitBtnLabel?: string;
    submitBtnIcon: React.ReactNode;
    onSubmitBtnClick: () => Promise<void>;
    versionDetailsPage?: string;
}
export function UploadVersionPageTopCard({
    versionsPageUrl,
    versionTitle,
    isLoading,
    backUrl,
    featuredBtn,
    children,
    submitBtnLabel,
    submitBtnIcon,
    onSubmitBtnClick,
    versionDetailsPage,
}: UploadVersionPageTopCardProps) {
    const { t } = useTranslation();

    return (
        <Card className="flex w-full flex-col items-start justify-start gap-2.5 p-card-surround">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={versionsPageUrl}>{t.project.versions}</BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbSeparator />

                    {versionDetailsPage ? (
                        <>
                            <BreadcrumbItem>
                                <BreadcrumbLink href={versionDetailsPage}>{versionTitle}</BreadcrumbLink>
                            </BreadcrumbItem>

                            <BreadcrumbSeparator />

                            <BreadcrumbItem>
                                <BreadcrumbPage>{t.form.edit}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </>
                    ) : (
                        <BreadcrumbItem>
                            <BreadcrumbPage>{versionTitle}</BreadcrumbPage>
                        </BreadcrumbItem>
                    )}
                </BreadcrumbList>
            </Breadcrumb>

            {children}

            <div className="flex w-full flex-wrap items-center justify-start gap-x-panel-cards gap-y-2">
                <Button type="submit" disabled={isLoading} onClick={onSubmitBtnClick}>
                    {isLoading ? <LoadingSpinner size="xs" /> : submitBtnIcon}
                    {submitBtnLabel || t.form.submit}
                </Button>

                {featuredBtn}

                <VariantButtonLink variant="secondary" to={backUrl} prefetch={LinkPrefetchStrategy.Render}>
                    <CancelButtonIcon aria-hidden className="h-btn-icon w-btn-icon" />
                    {t.form.cancel}
                </VariantButtonLink>
            </div>
        </Card>
    );
}

interface MetadataInputCardProps {
    projectType: ProjectType[];
    formControl: Control<FieldValues>;
}
export function MetadataInputCard({ projectType, formControl }: MetadataInputCardProps) {
    const { t } = useTranslation();
    const [showAllVersions, setShowAllVersions] = useState(false);
    const availableLoaders = getLoadersByProjectType(projectType);

    return (
        <ContentCardTemplate
            className="flex w-full min-w-[19rem] flex-col gap-form-elements px-card-surround"
            title={t.version.metadata}
        >
            <FormField
                control={formControl}
                name="releaseChannel"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t.version.releaseChannel}</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                                <SelectValue />

                                {field.value === VersionReleaseChannel.DEV ? (
                                    <TooltipProvider>
                                        <TooltipTemplate className="max-w-sm text-start" content={t.version.devReleasesNote}>
                                            <CircleAlertIcon
                                                aria-hidden
                                                className="ms-auto h-btn-icon w-btn-icon cursor-help text-warning-fg"
                                            />
                                        </TooltipTemplate>
                                    </TooltipProvider>
                                ) : null}
                            </SelectTrigger>
                            <SelectContent>
                                {[
                                    VersionReleaseChannel.RELEASE,
                                    VersionReleaseChannel.BETA,
                                    VersionReleaseChannel.ALPHA,
                                    VersionReleaseChannel.DEV,
                                ].map((channel) => (
                                    <SelectItem key={channel} value={channel}>
                                        {CapitalizeAndFormatString(channel)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormItem>
                )}
            />

            <FormField
                control={formControl}
                name="versionNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t.version.versionNumber}</FormLabel>
                        <Input
                            placeholder="# a.b.c"
                            {...field}
                            onChange={(e) => {
                                field.onChange(createURLSafeSlug(e.target.value));
                            }}
                        />
                    </FormItem>
                )}
            />

            {availableLoaders.length ? (
                <FormField
                    control={formControl}
                    name="loaders"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="supported-loaders-filter-input">{t.search.loaders}</FormLabel>

                            <MultiSelect
                                options={availableLoaders.map((loader) => ({
                                    label: CapitalizeAndFormatString(loader.name) || "",
                                    value: loader.name,
                                }))}
                                onValueChange={field.onChange}
                                selectedValues={field.value || []}
                                placeholder={t.version.selectLoaders}
                                searchBox={false}
                                noResultsElement={t.common.noResults}
                                inputPlaceholder={t.common.search}
                            />
                        </FormItem>
                    )}
                />
            ) : null}

            <FormField
                control={formControl}
                name="gameVersions"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="supported-game-versions-filter-input">{t.search.gameVersions}</FormLabel>

                        <MultiSelect
                            options={GAME_VERSIONS.filter(
                                (version) => showAllVersions || !isExperimentalGameVersion(version.releaseType),
                            ).map((version) => ({ label: version.label, value: version.value }))}
                            allOptions={GAME_VERSIONS.map((version) => ({
                                label: version.label,
                                value: version.value,
                            }))}
                            onValueChange={field.onChange}
                            selectedValues={field.value || []}
                            placeholder={t.version.selectVersions}
                            fixedFooter={
                                <>
                                    <CommandSeparator />

                                    <LabelledCheckbox
                                        checked={showAllVersions}
                                        onCheckedChange={(checked) => setShowAllVersions(checked === true)}
                                        className="mt-1 ps-3.5 text-foreground-extra-muted"
                                    >
                                        {t.form.showAllVersions}
                                    </LabelledCheckbox>
                                </>
                            }
                            noResultsElement={t.common.noResults}
                            inputPlaceholder={t.common.search}
                        />
                    </FormItem>
                )}
            />
        </ContentCardTemplate>
    );
}

interface AddDependenciesProps {
    dependencies?: z.infer<typeof VersionDependencies>;
    setDependencies: (value: z.infer<typeof VersionDependencies>) => void;
    currProjectId: string;
    dependenciesData: DependencyData | null;
}
export function AddDependencies({ dependencies, setDependencies, currProjectId, dependenciesData }: AddDependenciesProps) {
    const { t } = useTranslation();
    const [isfetchingData, setIsFetchingData] = useState(false);
    const [dependsOn, setDependsOn] = useState(DependsOn.PROJECT);
    const [projectSlug, setProjectSlug] = useState("");
    const [versionSlug, setVersionSlug] = useState("");
    const [dependencyType, setDependencyType] = useState(DependencyType.REQUIRED);

    // Data for the dependencies
    const [dependencyData, setDependencyData] = useState<DependencyData>(dependenciesData || { projects: [], versions: [] });

    function isDependencyValid(projectId: string) {
        return !dependencies?.some((dependency) => dependency.projectId === projectId);
    }

    function addNewDependency(projectId: string, versionId: string | null, type: DependencyType) {
        if (projectId === currProjectId) {
            toast.error(t.version.cantAddCurrProject);
            return;
        }
        setDependencies([...(dependencies || []), { projectId, versionId: versionId, dependencyType: type }]);
    }

    function removeDependency(projectId: string, versionId: string | null) {
        const filteredDependencies = (dependencies || []).filter((dependency) => {
            if (dependency.projectId !== projectId || dependency.versionId !== versionId) return true;
            return false;
        });
        setDependencies(filteredDependencies);
    }

    async function fetchProject(slug: string) {
        const res = await clientFetch(`/api/project/${slug}`);
        const data = (await res.json()) as { success: boolean; message?: string; project: ProjectDetailsData | null };

        if (!res.ok || !data?.project) {
            toast.error(data?.message || "Failed to fetch project");
            return null;
        }

        return data.project;
    }

    async function fetchVersion(projectSlug: string, versionSlug: string): Promise<ProjectVersionData | null> {
        const res = await clientFetch(`/api/project/${projectSlug}/version/${versionSlug}`);
        const data = (await res.json()) as { success: boolean; message?: string; data: ProjectVersionData | null };

        if (!res.ok || !data?.data) {
            toast.error(data?.message || "Failed to fetch version");
            return null;
        }

        return data.data;
    }

    async function addProjectDependency() {
        if (isfetchingData) return;
        setIsFetchingData(true);
        try {
            const project = await fetchProject(projectSlug);
            if (!project) return;

            if (!isDependencyValid(project.id)) {
                return toast.error(t.version.cantAddDuplicateDep);
            }

            addNewDependency(project.id, null, dependencyType);
            setDependencyData((prev) => ({
                ...prev,
                projects: [
                    ...prev.projects,
                    {
                        id: project.id,
                        name: project.name,
                        slug: project.slug,
                        type: project.type,
                        icon: project.icon || "",
                    },
                ],
            }));
            setProjectSlug("");
            setVersionSlug("");
        } finally {
            setIsFetchingData(false);
        }
    }

    async function addVersionDependency() {
        if (isfetchingData) return;
        setIsFetchingData(true);
        try {
            const [project, version] = await Promise.all([fetchProject(projectSlug), fetchVersion(projectSlug, versionSlug)]);
            if (!project || !version) return;

            if (!isDependencyValid(project.id)) {
                return toast.error(t.version.cantAddDuplicateDep);
            }

            addNewDependency(project.id, version.id, dependencyType);

            // This is just to update the list of dependencies data so that we can show the details of those deps
            // like icons and stuff, it's totally unrelated to adding or removing deps from the current version (kinda like totally for display purposes)
            setDependencyData((prev) => ({
                ...prev,
                projects: [
                    ...prev.projects,
                    {
                        id: project.id,
                        name: project.name,
                        slug: project.slug,
                        type: project.type,
                        icon: project.icon || "",
                    },
                ],
                versions: [
                    ...prev.versions,
                    {
                        id: version.id,
                        title: version.title,
                        versionNumber: version.versionNumber,
                        slug: version.slug,
                    },
                ],
            }));
            setProjectSlug("");
            setVersionSlug("");
        } finally {
            setIsFetchingData(false);
        }
    }

    async function addDependencyHandler() {
        if (!projectSlug) return;
        if (dependsOn === DependsOn.PROJECT) {
            await addProjectDependency();
        } else {
            await addVersionDependency();
        }
    }

    return (
        <div className="flex w-full flex-col items-start justify-center gap-3">
            {dependencies?.length ? (
                <div className="mb-2 flex w-full flex-col items-start justify-start gap-4">
                    {dependencies?.map((dependency) => (
                        <DependencyItem
                            key={dependency.versionId || dependency.projectId}
                            dependencyData={dependencyData}
                            projectId={dependency.projectId}
                            versionId={dependency.versionId || null}
                            dependencyType={dependency.dependencyType}
                            removeDependency={removeDependency}
                        />
                    ))}
                </div>
            ) : null}

            <div className="flex w-full flex-col gap-1">
                <span className="font-semibold text-foreground-muted">{t.version.addDep}</span>

                <div className="flex w-full flex-col items-start justify-center gap-2">
                    <Select
                        defaultValue={DependsOn.PROJECT}
                        value={dependsOn}
                        onValueChange={(value: string) =>
                            setDependsOn(value === DependsOn.PROJECT ? DependsOn.PROJECT : DependsOn.VERSION)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={DependsOn.PROJECT}>{CapitalizeAndFormatString(DependsOn.PROJECT)}</SelectItem>
                            <SelectItem value={DependsOn.VERSION}>{CapitalizeAndFormatString(DependsOn.VERSION)}</SelectItem>
                        </SelectContent>
                    </Select>

                    <Input
                        placeholder={t.version.enterProjectId}
                        value={projectSlug}
                        onChange={(e) => setProjectSlug(e.target.value)}
                    />

                    {dependsOn === DependsOn.VERSION ? (
                        <Input
                            placeholder={t.version.enterVersionId}
                            value={versionSlug}
                            onChange={(e) => setVersionSlug(e.target.value)}
                        />
                    ) : null}

                    <Select
                        defaultValue={DependencyType.REQUIRED}
                        value={dependencyType}
                        onValueChange={(value: string) => setDependencyType(value as DependencyType)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={DependencyType.REQUIRED}>
                                {CapitalizeAndFormatString(DependencyType.REQUIRED)}
                            </SelectItem>
                            <SelectItem value={DependencyType.OPTIONAL}>
                                {CapitalizeAndFormatString(DependencyType.OPTIONAL)}
                            </SelectItem>
                            <SelectItem value={DependencyType.EMBEDDED}>
                                {CapitalizeAndFormatString(DependencyType.EMBEDDED)}
                            </SelectItem>
                            <SelectItem value={DependencyType.INCOMPATIBLE}>
                                {CapitalizeAndFormatString(DependencyType.INCOMPATIBLE)}
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Button onClick={addDependencyHandler} type="button" disabled={isfetchingData}>
                        {isfetchingData ? (
                            <LoadingSpinner size="xs" />
                        ) : (
                            <PlusIcon aria-hidden className="h-btn-icon-md w-btn-icon-md" />
                        )}
                        {t.version.addDep}
                    </Button>
                </div>
            </div>
        </div>
    );
}

interface DependencyItemProps {
    dependencyData: DependencyData;
    projectId: string;
    versionId: string | null;
    dependencyType: DependencyType;
    removeDependency: (projectId: string, versionId: string | null) => void;
}

function DependencyItem({ dependencyData, versionId, projectId, dependencyType, removeDependency }: DependencyItemProps) {
    const { t } = useTranslation();
    const dependencyProject = dependencyData.projects.find((project) => project.id === projectId);
    const dependencyVersion = dependencyData.versions.find((version) => version.id === versionId);

    if (!dependencyProject?.id) return null;

    return (
        <div className="flex w-full items-center justify-between gap-x-4 gap-y-1 text-foreground-muted">
            <div className="flex items-center justify-start gap-2">
                <ImgWrapper src={imageUrl(dependencyProject.icon)} alt={dependencyProject.name} className="h-12 w-12 rounded" />
                <div className="flex flex-col items-start justify-start">
                    <span className="font-bold text-foreground">{dependencyProject.name}</span>
                    <span>
                        {dependencyVersion
                            ? t.version.depencency[`${dependencyType}_desc`](dependencyVersion.versionNumber)
                            : t.version.depencency[dependencyType]}
                    </span>
                </div>
            </div>

            <Button variant="secondary" type="button" onClick={() => removeDependency(projectId, versionId)}>
                <Trash2Icon aria-hidden className="h-btn-icon w-btn-icon" />
                {t.form.remove}
            </Button>
        </div>
    );
}

interface PrimaryFileInputProps {
    children: React.ReactNode;
    selectedFile?: File | FileObjectType;
    inputId: string;
}

export function SelectPrimaryFileInput({ children, selectedFile, inputId }: PrimaryFileInputProps) {
    const { t } = useTranslation();

    return (
        <div className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded bg-raised-background px-4 py-2 sm:flex-nowrap">
            {children}

            <div>
                <FileIcon aria-hidden className="me-1.5 inline h-btn-icon w-btn-icon flex-shrink-0 text-foreground-muted" />
                {selectedFile ? (
                    <span className="inline-flex flex-wrap items-center justify-start gap-x-2">
                        <strong className="font-semibold">{selectedFile.name}</strong>{" "}
                        <span className="ms-0.5 whitespace-nowrap">({parseFileSize(selectedFile.size)})</span>{" "}
                        <span className="ms-1 text-foreground-muted italic">{t.version.primary}</span>
                    </span>
                ) : (
                    <span className="text-foreground-muted italic">{t.version.noPrimaryFile}</span>
                )}
            </div>

            <InteractiveLabel htmlFor={inputId} className={cn(buttonVariants({ variant: "secondary-dark" }), "cursor-pointer")}>
                {selectedFile ? t.version.replaceFile : t.version.chooseFile}
            </InteractiveLabel>
        </div>
    );
}

export function SelectAdditionalProjectFiles({ formControl }: { formControl: Control<FieldValues> }) {
    return (
        <FormField
            control={formControl}
            name="additionalFiles"
            render={({ field }) => (
                <AdditionalFiles inputId="additional-files-input" selectedFiles={field.value} onChange={field.onChange}>
                    <input
                        type="file"
                        hidden
                        name={field.name}
                        multiple
                        id="additional-files-input"
                        className="hidden"
                        onChange={async (e) => {
                            e.preventDefault();

                            const newFiles: File[] = [];
                            mainLoop: for (let i = 0; i < (e.target.files?.length || 0); i++) {
                                const file = e.target.files?.[i];
                                if (!file?.name) continue;

                                const fileType = await getFileType(file);
                                if (!fileType) {
                                    toast.error(`Invalid file "${file.name}" with type "${fileType}"`);
                                    continue;
                                }

                                for (const existingFile of field.value || []) {
                                    if (existingFile.name.toLowerCase() === file.name.toLowerCase()) {
                                        toast.error(`Cannot add duplicate file. Adding "${file.name}"`);
                                        continue mainLoop;
                                    }
                                }

                                newFiles.push(file);
                            }
                            field.onChange([...(field.value || []), ...newFiles]);
                        }}
                    />
                </AdditionalFiles>
            )}
        />
    );
}

function AdditionalFiles({
    children,
    selectedFiles,
    inputId,
    onChange,
}: {
    children: React.ReactNode;
    selectedFiles?: (File | FileObjectType)[];
    inputId: string;
    onChange: (...event: unknown[]) => void;
}) {
    const { t } = useTranslation();

    function deleteFileFromList(index: number) {
        if (!selectedFiles?.length) return;
        onChange([...selectedFiles.slice(0, index), ...selectedFiles.slice(index + 1)]);
    }

    return (
        <FormItem className="mb-0 flex w-full flex-col items-start justify-center gap-0">
            {children}

            <div className="flex w-full flex-wrap items-center justify-between gap-x-6">
                <div className="flex flex-col">
                    <span className="font-semibold">{t.version.uploadExtraFiles}</span>
                    <span className="mb-1 text-foreground-muted text-sm">{t.version.uploadExtraFilesDesc}</span>
                </div>

                <InteractiveLabel htmlFor={inputId} className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer")}>
                    <UploadIcon aria-hidden className="h-btn-icon w-btn-icon" />
                    {t.version.selectFiles}
                </InteractiveLabel>
            </div>

            {(selectedFiles?.length || 0) > 0 ? (
                <div className="my-2 flex w-full flex-col items-start justify-center gap-2">
                    {selectedFiles?.map((file, index) => (
                        <div
                            key={`${file.name}-${index}`}
                            className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded bg-raised-background px-4 py-2 sm:flex-nowrap"
                        >
                            <div className="text-foreground-muted">
                                {children}
                                <FileIcon aria-hidden className="me-1.5 inline h-btn-icon w-btn-icon text-foreground-muted" />
                                <strong className="text-wrap font-semibold">{file.name}</strong>{" "}
                                <span className="ms-0.5 whitespace-nowrap">({parseFileSize(file.size)})</span>
                            </div>

                            <Button variant="secondary-dark" onClick={() => deleteFileFromList(index)}>
                                <Trash2Icon aria-hidden className="h-btn-icon w-btn-icon" />
                                {t.form.remove}
                            </Button>
                        </div>
                    ))}
                </div>
            ) : null}
        </FormItem>
    );
}

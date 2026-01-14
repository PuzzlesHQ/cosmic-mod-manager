import { projectTypes, ShowEnvSupportSettingsForType } from "@app/utils/config/project";
import { MAX_PROJECT_NAME_LENGTH, MAX_PROJECT_SUMMARY_LENGTH } from "@app/utils/constants";
import { getProjectTypesFromNames, getProjectVisibilityFromString } from "@app/utils/convertors";
import type { z } from "@app/utils/schemas";
import { generalProjectSettingsFormSchema } from "@app/utils/schemas/project/settings/general";
import { Capitalize, createURLSafeSlug } from "@app/utils/string";
import { EnvironmentSupport, ProjectPublishingStatus, type ProjectType, ProjectVisibility } from "@app/utils/types";
import { CheckIcon, SaveIcon, Trash2Icon, TriangleAlertIcon, XIcon } from "lucide-react";
import { useState } from "react";
import IconPicker from "~/components/icon-picker";
import { fallbackProjectIcon } from "~/components/icons";
import MarkdownRenderBox from "~/components/md-editor/md-renderer";
import { ContentCardTemplate } from "~/components/misc/panel";
import RefreshPage from "~/components/misc/refresh-page";
import { Button, CancelButton } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
    Dialog,
    DialogBody,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { CharacterCounter, Form, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useNavigate } from "~/components/ui/link";
import { MultiSelect } from "~/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { toast } from "~/components/ui/sonner";
import { LoadingSpinner } from "~/components/ui/spinner";
import { Textarea } from "~/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { VisuallyHidden } from "~/components/ui/visually-hidden";
import { useProjectData } from "~/hooks/project";
import { useSession } from "~/hooks/session";
import { useFormHook } from "~/hooks/use-form";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";
import Config from "~/utils/config";
import { submitFormWithErrorHandling } from "~/utils/form";
import { joinPaths, OrgPagePath, ProjectPagePath } from "~/utils/urls";
import { LeaveTeam } from "./members/page";

export default function GeneralSettingsPage() {
    const { t } = useTranslation();
    const ctx = useProjectData();
    const projectData = ctx.projectData;
    const session = useSession();

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const form = useFormHook(generalProjectSettingsFormSchema, {
        values: {
            icon: projectData.icon,
            name: projectData.name,
            slug: projectData.slug,
            visibility: getProjectVisibilityFromString(projectData.visibility),
            type: projectData.type as ProjectType[],
            clientSide: projectData.clientSide as EnvironmentSupport,
            serverSide: projectData.serverSide as EnvironmentSupport,
            summary: projectData.summary,
        },
    });

    let showEnvSettings = false;
    for (const type of projectData.type) {
        if (ShowEnvSupportSettingsForType.includes(type)) {
            showEnvSettings = true;
            break;
        }
    }

    async function saveSettings(values: z.infer<typeof generalProjectSettingsFormSchema>) {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("icon", values.icon || "");
            formData.append("name", values.name);
            formData.append("slug", values.slug);
            formData.append("visibility", values.visibility);
            formData.append("type", JSON.stringify(values.type));
            formData.append("clientSide", values.clientSide);
            formData.append("serverSide", values.serverSide);
            formData.append("summary", values.summary);

            const response = await clientFetch(`/api/project/${projectData.id}`, {
                method: "PATCH",
                body: formData,
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                return toast.error(result?.message || t.common.error);
            }

            const newSlug: string = result?.slug || projectData.slug;
            RefreshPage(navigate, joinPaths(ctx.projectType, newSlug, "settings"));
            toast.success(result?.message || t.common.success);
        } finally {
            setIsLoading(false);
        }
    }

    if (!session?.id) return;

    const isProjectTeamMember = projectData.members.some((member) => member.userId === session.id);
    const isOrgMember = projectData.organisation?.members?.some(
        (member) => member.userId === session.id && member.accepted,
    );

    return (
        <>
            <ContentCardTemplate title={t.projectSettings.projectInfo}>
                <Form {...form}>
                    <form
                        onSubmit={(e) => {
                            submitFormWithErrorHandling(e, generalProjectSettingsFormSchema, form, saveSettings);
                        }}
                        className="flex w-full flex-col items-start justify-start gap-form-elements"
                    >
                        <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <IconPicker
                                    icon={form.getValues().icon}
                                    fieldName={field.name}
                                    onChange={field.onChange}
                                    fallbackIcon={fallbackProjectIcon}
                                    originalIcon={projectData.icon || ""}
                                />
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="md:w-fit">
                                    <FormLabel className="font-bold" htmlFor="project-name-input">
                                        {t.form.name}
                                        <CharacterCounter currVal={field.value} max={MAX_PROJECT_NAME_LENGTH} />
                                    </FormLabel>
                                    <Input
                                        {...field}
                                        className="md:w-[32ch]"
                                        id="project-name-input"
                                        autoComplete="off"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem className="md:w-fit">
                                    <FormLabel className="font-bold" htmlFor="project-slug-input">
                                        {t.form.url}
                                        <CharacterCounter currVal={field.value} max={MAX_PROJECT_NAME_LENGTH} />
                                    </FormLabel>
                                    <div className="flex w-full flex-col items-start justify-center gap-0.5">
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(createURLSafeSlug(e.target.value));
                                            }}
                                            className="md:w-[32ch]"
                                            id="project-slug-input"
                                            autoComplete="off"
                                        />
                                        <span className="px-1 text-foreground-muted text-sm lg:text-base">
                                            {Config.FRONTEND_URL}/{form.getValues().type?.[0] || ctx.projectType}/
                                            <em className="font-[500] text-foreground not-italic">
                                                {form.getValues().slug}
                                            </em>
                                        </span>
                                    </div>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="summary"
                            render={({ field }) => (
                                <FormItem className="md:w-fit">
                                    <FormLabel className="font-bold" htmlFor="project-summary-input">
                                        {t.form.summary}
                                        <CharacterCounter currVal={field.value} max={MAX_PROJECT_SUMMARY_LENGTH} />
                                    </FormLabel>
                                    <Textarea
                                        {...field}
                                        className="min-h-32 resize-none md:w-[48ch]"
                                        spellCheck="false"
                                        id="project-summary-input"
                                    />

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem className="flex w-full flex-row flex-wrap items-center justify-between">
                                    <div className="flex flex-col items-start justify-center gap-y-1.5">
                                        <FormLabel className="font-bold">{t.form.projectType}</FormLabel>
                                        <span className="text-foreground-muted">{t.dashboard.projectTypeDesc}</span>
                                    </div>

                                    <div>
                                        <MultiSelect
                                            searchBox={false}
                                            options={projectTypes.map((type) => ({
                                                label: Capitalize(t.navbar[type]),
                                                value: type,
                                            }))}
                                            selectedValues={field.value || []}
                                            onValueChange={(values: string[]) => {
                                                field.onChange(getProjectTypesFromNames(values));
                                            }}
                                            placeholder={t.dashboard.chooseProjectType}
                                            className="w-fit sm:w-fit sm:min-w-[15rem] sm:max-w-[20rem]"
                                            popoverClassname="min-w-[15rem]"
                                            noResultsElement={t.common.noResults}
                                            inputPlaceholder={t.common.search}
                                        />
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                        {showEnvSettings && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="clientSide"
                                    render={({ field }) => (
                                        <FormItem className="flex w-full flex-row flex-wrap items-end justify-between">
                                            <div className="flex flex-col items-start justify-center gap-y-1.5">
                                                <FormLabel className="font-bold">
                                                    {t.projectSettings.clientSide}
                                                </FormLabel>
                                                <span className="text-foreground-muted">
                                                    {t.projectSettings.clientSideDesc(t.navbar[projectData.type[0]])}
                                                </span>
                                                <FormMessage />
                                            </div>

                                            <Select
                                                name={field.name}
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger
                                                    className="w-[15rem] max-w-full"
                                                    aria-label="Client-side"
                                                >
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={EnvironmentSupport.REQUIRED}>
                                                        {t.projectSettings[EnvironmentSupport.REQUIRED]}
                                                    </SelectItem>
                                                    <SelectItem value={EnvironmentSupport.OPTIONAL}>
                                                        {t.projectSettings[EnvironmentSupport.OPTIONAL]}
                                                    </SelectItem>
                                                    <SelectItem value={EnvironmentSupport.UNSUPPORTED}>
                                                        {t.projectSettings[EnvironmentSupport.UNSUPPORTED]}
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="serverSide"
                                    render={({ field }) => (
                                        <FormItem className="flex w-full flex-row flex-wrap items-end justify-between">
                                            <div className="flex flex-col items-start justify-center gap-y-1.5">
                                                <FormLabel className="font-bold">
                                                    {t.projectSettings.serverSide}
                                                </FormLabel>
                                                <span className="text-foreground-muted">
                                                    {t.projectSettings.serverSideDesc(t.navbar[projectData.type[0]])}
                                                </span>
                                                <FormMessage />
                                            </div>

                                            <Select
                                                name={field.name}
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger
                                                    className="w-[15rem] max-w-full"
                                                    aria-label="Server-side"
                                                >
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={EnvironmentSupport.REQUIRED}>
                                                        {t.projectSettings[EnvironmentSupport.REQUIRED]}
                                                    </SelectItem>
                                                    <SelectItem value={EnvironmentSupport.OPTIONAL}>
                                                        {t.projectSettings[EnvironmentSupport.OPTIONAL]}
                                                    </SelectItem>
                                                    <SelectItem value={EnvironmentSupport.UNSUPPORTED}>
                                                        {t.projectSettings[EnvironmentSupport.UNSUPPORTED]}
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                        <FormField
                            control={form.control}
                            name="visibility"
                            render={({ field }) => (
                                <FormItem className="flex w-full flex-row flex-wrap items-center justify-between gap-x-6">
                                    <div className="flex flex-col items-start justify-center gap-y-1.5">
                                        <FormLabel className="font-bold">{t.form.visibility}</FormLabel>
                                        <div className="flex max-w-[68ch] flex-col items-start justify-start gap-1.5 text-foreground-muted">
                                            <p className="leading-tight">{t.projectSettings.visibilityDesc}</p>

                                            {projectData.status !== ProjectPublishingStatus.APPROVED ? (
                                                <span>{t.projectSettings.ifApproved}</span>
                                            ) : null}

                                            <div className="flex flex-col items-start justify-center">
                                                <span className="flex items-center justify-center gap-1.5">
                                                    {field.value === ProjectVisibility.LISTED ||
                                                    field.value === ProjectVisibility.ARCHIVED ? (
                                                        <CheckIcon
                                                            aria-hidden
                                                            className="h-btn-icon w-btn-icon text-success-fg"
                                                        />
                                                    ) : (
                                                        <XIcon
                                                            aria-hidden
                                                            className="h-btn-icon w-btn-icon text-error-fg"
                                                        />
                                                    )}
                                                    {t.projectSettings.visibleInSearch}
                                                </span>
                                                <span className="flex items-center justify-center gap-1.5">
                                                    {field.value === ProjectVisibility.LISTED ||
                                                    field.value === ProjectVisibility.ARCHIVED ? (
                                                        <CheckIcon
                                                            aria-hidden
                                                            className="h-btn-icon w-btn-icon text-success-fg"
                                                        />
                                                    ) : (
                                                        <XIcon
                                                            aria-hidden
                                                            className="h-btn-icon w-btn-icon text-error-fg"
                                                        />
                                                    )}
                                                    {t.projectSettings.visibleOnProfile}
                                                </span>
                                                <span className="flex items-center justify-center gap-1.5">
                                                    {field.value === ProjectVisibility.PRIVATE ? (
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <span>
                                                                        <TriangleAlertIcon
                                                                            aria-hidden
                                                                            className="h-btn-icon w-btn-icon text-warning-fg"
                                                                        />
                                                                    </span>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    {t.projectSettings.visibleToMembersOnly}
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    ) : (
                                                        <CheckIcon
                                                            aria-hidden
                                                            className="h-btn-icon w-btn-icon text-success-fg"
                                                        />
                                                    )}
                                                    {t.projectSettings.visibleViaUrl}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-[15rem] max-w-full" aria-label={t.form.visibility}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={ProjectVisibility.LISTED}>
                                                {t.projectSettings[ProjectVisibility.LISTED]}
                                            </SelectItem>
                                            <SelectItem value={ProjectVisibility.ARCHIVED}>
                                                {t.projectSettings[ProjectVisibility.ARCHIVED]}
                                            </SelectItem>
                                            <SelectItem value={ProjectVisibility.UNLISTED}>
                                                {t.projectSettings[ProjectVisibility.UNLISTED]}
                                            </SelectItem>
                                            <SelectItem value={ProjectVisibility.PRIVATE}>
                                                {t.projectSettings[ProjectVisibility.PRIVATE]}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="mt-2 flex w-full items-center justify-end">
                            <Button type="submit" disabled={!form.formState.isDirty || isLoading}>
                                {isLoading ? (
                                    <LoadingSpinner size="xs" />
                                ) : (
                                    <SaveIcon aria-hidden className="h-btn-icon w-btn-icon" />
                                )}
                                {t.form.saveChanges}
                            </Button>
                        </div>
                    </form>
                </Form>
            </ContentCardTemplate>

            {isProjectTeamMember && !isOrgMember ? (
                // If the user is a member of the project, show the leave project button
                <Card>
                    <CardContent className="pt-card-surround">
                        <LeaveTeam
                            currUsersMembership={ctx.currUsersMembership}
                            teamId={ctx.projectData.teamId}
                            isOrgTeam={false}
                            refreshData={async () =>
                                RefreshPage(navigate, ProjectPagePath(projectData.type[0], projectData.slug))
                            }
                        />
                    </CardContent>
                </Card>
            ) : null}

            <DeleteProjectDialog
                name={projectData.name}
                projectId={projectData.id}
                returnUrl={
                    projectData.organisation?.id
                        ? OrgPagePath(projectData.organisation?.slug, "settings/projects")
                        : "/dashboard/projects"
                }
            />
        </>
    );
}

function DeleteProjectDialog({ name, projectId, returnUrl }: { name: string; projectId: string; returnUrl: string }) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [submittable, setSubmittable] = useState(false);
    const navigate = useNavigate();

    async function deleteProject() {
        if (!submittable || isLoading) return;
        setIsLoading(true);

        try {
            const res = await clientFetch(`/api/project/${projectId}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (!res.ok || !data?.success) {
                return toast.error(data?.message || t.common.error);
            }

            toast.success(data?.message || t.common.success);
            RefreshPage(navigate, returnUrl);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <ContentCardTemplate
            title={t.projectSettings.deleteProject}
            className="flex w-full flex-row flex-wrap justify-between gap-4"
        >
            <p className="max-w-[65ch] text-foreground-muted">
                {t.projectSettings.deleteProjectDesc(Config.SITE_NAME_SHORT)}
            </p>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="destructive">
                        <Trash2Icon aria-hidden className="h-btn-icon w-btn-icon" />
                        {t.projectSettings.deleteProject}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t.projectSettings.sureToDeleteProject}</DialogTitle>
                        <VisuallyHidden>
                            <DialogDescription>{t.projectSettings.deleteProject}</DialogDescription>
                        </VisuallyHidden>
                    </DialogHeader>
                    <DialogBody className="flex flex-col gap-4 text-foreground-muted">
                        <p className="leading-snug">{t.projectSettings.deleteProjectDesc2}</p>

                        <div className="flex w-full flex-col gap-1">
                            <MarkdownRenderBox divElem text={t.projectSettings.typeToVerify(name)} />

                            <Input
                                placeholder={t.projectSettings.typeHere}
                                className="w-full sm:w-[32ch]"
                                onChange={(e) => {
                                    if (e.target.value === name) {
                                        setSubmittable(true);
                                    } else if (submittable === true) {
                                        setSubmittable(false);
                                    }
                                }}
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <CancelButton />
                            </DialogClose>
                            <Button disabled={!submittable || isLoading} variant="destructive" onClick={deleteProject}>
                                {isLoading ? (
                                    <LoadingSpinner size="xs" />
                                ) : (
                                    <Trash2Icon aria-hidden className="h-btn-icon w-btn-icon" />
                                )}
                                {t.projectSettings.deleteProject}
                            </Button>
                        </DialogFooter>
                    </DialogBody>
                </DialogContent>
            </Dialog>
        </ContentCardTemplate>
    );
}

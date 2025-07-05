import RefreshPage from "@app/components/misc/refresh-page";
import { Button } from "@app/components/ui/button";
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
} from "@app/components/ui/dialog";
import { CharacterCounter, Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@app/components/ui/form";
import { Input } from "@app/components/ui/input";
import { MultiSelect } from "@app/components/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@app/components/ui/select";
import { toast } from "@app/components/ui/sonner";
import { LoadingSpinner } from "@app/components/ui/spinner";
import { Textarea } from "@app/components/ui/textarea";
import { VisuallyHidden } from "@app/components/ui/visually-hidden";
import { projectTypes } from "@app/utils/config/project";
import { MAX_PROJECT_NAME_LENGTH, MAX_PROJECT_SUMMARY_LENGTH } from "@app/utils/constants";
import { getProjectTypesFromNames } from "@app/utils/convertors";
import { disableInteractions, enableInteractions } from "@app/utils/dom";
import type { z } from "@app/utils/schemas";
import { newProjectFormSchema } from "@app/utils/schemas/project";
import { Capitalize, createURLSafeSlug } from "@app/utils/string";
import { ProjectVisibility } from "@app/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CancelButton } from "~/components/ui/button";
import { useNavigate } from "~/components/ui/link";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";
import { VersionPagePath } from "~/utils/urls";

interface Props {
    orgId?: string;
    trigger?: React.ReactNode;
}

export default function CreateNewProjectDialog({ orgId, trigger }: Props) {
    const { t } = useTranslation();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [typeSelectorOpen, setTypeSelectorOpen] = useState(false);
    const [visibilitySelectorOpen, setVisibilitySelectorOpen] = useState(false);

    const [autoFillUrlSlug, setAutoFillUrlSlug] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof newProjectFormSchema>>({
        resolver: zodResolver(newProjectFormSchema),
        defaultValues: {
            name: "",
            slug: "",
            type: [],
            visibility: ProjectVisibility.LISTED,
            summary: "",
            orgId: orgId,
        },
    });

    async function createProject(values: z.infer<typeof newProjectFormSchema>) {
        try {
            if (isLoading || !isFormSubmittable()) return;
            setIsLoading(true);
            disableInteractions();

            const response = await clientFetch("/api/project", {
                method: "POST",
                body: JSON.stringify(values),
            });
            const result = await response.json();

            if (!response.ok || !result?.success) {
                enableInteractions();
                return toast.error(result?.message || t.common.error);
            }

            RefreshPage(navigate, VersionPagePath(result?.type?.[0], result?.urlSlug, "new"));
            toast.success(result?.message || t.common.success);
        } finally {
            setIsLoading(false);
        }
    }

    function isFormSubmittable() {
        const values = form.getValues();
        const isFormInvalid = !values.name || !values.slug || !values.visibility || !values.summary || !values.type?.length;
        return !isFormInvalid;
    }

    return (
        <Dialog
            open={createDialogOpen}
            onOpenChange={(isOpen) => {
                if (typeSelectorOpen) return setTypeSelectorOpen(false);
                if (visibilitySelectorOpen) return setVisibilitySelectorOpen(false);
                setCreateDialogOpen(isOpen);
            }}
        >
            <DialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button className="space-y-0">
                        <PlusIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                        {t.dashboard.createProject}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent
                onClick={(e) => {
                    // @ts-ignore
                    if (e.target.closest(".type-selector-popover")) return;
                    if (typeSelectorOpen) return setTypeSelectorOpen(false);
                }}
            >
                <DialogHeader>
                    <DialogTitle>{t.dashboard.creatingProject}</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>{t.dashboard.creatingProject}</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <DialogBody>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(createProject)}
                            className="w-full flex flex-col items-start justify-center gap-form-elements"
                        >
                            <FormField
                                name="name"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="project-name-input">
                                            {t.form.name}
                                            <CharacterCounter currVal={field.value} max={MAX_PROJECT_NAME_LENGTH} />
                                        </FormLabel>
                                        <Input
                                            placeholder="Project name"
                                            id="project-name-input"
                                            type="text"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                if (!autoFillUrlSlug) return;
                                                const name = e.target.value;
                                                form.setValue("slug", createURLSafeSlug(name));
                                            }}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="slug"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="project-url-slug-input">
                                            {t.form.url}
                                            <CharacterCounter currVal={field.value} max={MAX_PROJECT_NAME_LENGTH} />
                                        </FormLabel>
                                        <Input
                                            id="project-url-slug-input"
                                            placeholder="Enter project URL"
                                            type="text"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                if (autoFillUrlSlug === true) setAutoFillUrlSlug(false);
                                            }}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem className="w-full flex flex-wrap flex-row items-end justify-between">
                                        <div className="flex flex-col items-start justify-center">
                                            <FormLabel>{t.form.projectType}</FormLabel>
                                            <FormDescription>{t.dashboard.projectTypeDesc}</FormDescription>
                                        </div>

                                        <MultiSelect
                                            searchBox={false}
                                            defaultMinWidth={false}
                                            open={typeSelectorOpen}
                                            onOpenChange={setTypeSelectorOpen}
                                            selectedValues={field.value || []}
                                            options={projectTypes.map((type) => ({
                                                label: Capitalize(t.navbar[type]),
                                                value: type,
                                            }))}
                                            onValueChange={(values) => {
                                                field.onChange(getProjectTypesFromNames(values));
                                            }}
                                            placeholder={t.dashboard.chooseProjectType}
                                            popoverClassname="type-selector-popover"
                                            noResultsElement={t.common.noResults}
                                            inputPlaceholder={t.common.search}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="visibility"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t.form.visibility}</FormLabel>
                                        <Select
                                            open={visibilitySelectorOpen}
                                            onOpenChange={(isOpen) => {
                                                if (typeSelectorOpen) setTypeSelectorOpen(false);
                                                setVisibilitySelectorOpen(isOpen);
                                            }}
                                            disabled={field.disabled}
                                            name={field.name}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={ProjectVisibility.LISTED}>
                                                    {t.projectSettings[ProjectVisibility.LISTED]}
                                                </SelectItem>
                                                <SelectItem value={ProjectVisibility.PRIVATE}>
                                                    {t.projectSettings[ProjectVisibility.PRIVATE]}
                                                </SelectItem>
                                                <SelectItem value={ProjectVisibility.UNLISTED}>
                                                    {t.projectSettings[ProjectVisibility.UNLISTED]}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="summary"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="project-summary-input">
                                            {t.form.summary}

                                            <CharacterCounter currVal={field.value} max={MAX_PROJECT_SUMMARY_LENGTH} />
                                        </FormLabel>
                                        <Textarea
                                            placeholder="Enter project summary..."
                                            id="project-summary-input"
                                            {...field}
                                            className="resize-none"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <DialogClose asChild>
                                    <CancelButton type="button" />
                                </DialogClose>
                                <Button disabled={isLoading || !isFormSubmittable()} type="submit">
                                    {isLoading ? (
                                        <LoadingSpinner size="xs" />
                                    ) : (
                                        <ArrowRightIcon aria-hidden className="w-btn-icon-md h-btn-icon-md" />
                                    )}
                                    {t.form.continue}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}

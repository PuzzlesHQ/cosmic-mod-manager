import type { z } from "@app/utils/schemas";
import { updateProjectLicenseFormSchema } from "@app/utils/schemas/project/settings/license";
import SPDX_LICENSE_LIST, {
    CUSTOM_LICENSE_OPTION,
    FEATURED_LICENSE_INDICES,
} from "@app/utils/src/constants/license-list";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDownIcon, SaveIcon } from "lucide-react";
import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";
import MarkdownRenderBox from "~/components/md-editor/md-renderer";
import RefreshPage from "~/components/misc/refresh-page";
import { Button } from "~/components/ui/button";
import { Card, CardTitle } from "~/components/ui/card";
import { LabelledCheckbox } from "~/components/ui/checkbox";
import ComboBox, { type ComboBoxItem } from "~/components/ui/combobox";
import { Form, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useNavigate } from "~/components/ui/link";
import { toast } from "~/components/ui/sonner";
import { LoadingSpinner } from "~/components/ui/spinner";
import { useProjectData } from "~/hooks/project";
import { useTranslation } from "~/locales/provider";
import clientFetch from "~/utils/client-fetch";
import { submitFormWithErrorHandling } from "~/utils/form";

export default function LicenseSettingsPage() {
    const { t } = useTranslation();
    const ctx = useProjectData();
    const projectData = ctx.projectData;

    const [showCustomLicenseInputFields, setShowCustomLicenseInputFields] = useState(false);
    const [doesNotHaveASpdxId, setDoesNotHaveASpdxId] = useState(!!projectData?.licenseName && !projectData?.licenseId);

    const navigate = useNavigate();
    const location = useLocation();

    const form = useForm<z.infer<typeof updateProjectLicenseFormSchema>>({
        resolver: zodResolver(updateProjectLicenseFormSchema),
        defaultValues: {
            id: projectData?.licenseId,
            name: projectData?.licenseName,
            url: projectData?.licenseUrl,
        },
    });

    async function updateLicense(values: z.infer<typeof updateProjectLicenseFormSchema>) {
        if (values.name && !values.id && !values.url) {
            toast.error("Url is required when using a custom license!");
            return;
        }

        const res = await clientFetch(`/api/project/${projectData.id}/license`, {
            method: "PATCH",
            body: JSON.stringify(values),
        });

        const data = await res.json();

        if (!res.ok || !data?.success) {
            return toast.error(data?.message || t.common.error);
        }

        RefreshPage(navigate, location);
        return toast.success(data?.message);
    }

    const currLicenseId = form.watch("id");
    const currLicenseName = form.watch("name");
    const selectedFeaturedLicense = useMemo(
        () => SPDX_LICENSE_LIST.find((license) => license.licenseId === currLicenseId),
        [currLicenseId],
    );

    const formValues = form.getValues();
    const hasFormChanged =
        formValues.id !== projectData?.licenseId ||
        formValues.name !== projectData?.licenseName ||
        formValues.url !== projectData?.licenseUrl;

    const isCustomLicense =
        showCustomLicenseInputFields || ((currLicenseId || currLicenseName) && !selectedFeaturedLicense);
    useEffect(() => {
        if (isCustomLicense && !showCustomLicenseInputFields) setShowCustomLicenseInputFields(true);
    }, [isCustomLicense]);

    const projectType = t.navbar[projectData.type[0]];
    const licenseOptions = useMemo(() => {
        const options: ComboBoxItem[] = [
            {
                label: CUSTOM_LICENSE_OPTION.name,
                value: CUSTOM_LICENSE_OPTION.licenseId,
            },
        ];

        for (let index = 0; index < SPDX_LICENSE_LIST.length; index++) {
            const license = SPDX_LICENSE_LIST[index];

            options.push({
                label: license.name,
                value: license.licenseId,
                onlyVisibleWhenSearching:
                    !FEATURED_LICENSE_INDICES.includes(index) && currLicenseId !== license.licenseId,
            });
        }

        return options;
    }, []);

    return (
        <Form {...form}>
            <form
                onSubmit={(e) => {
                    submitFormWithErrorHandling(e, updateProjectLicenseFormSchema, form, updateLicense);
                }}
                className="w-full"
            >
                <Card className="flex w-full flex-col gap-4 p-card-surround">
                    <CardTitle>{t.search.license}</CardTitle>
                    <div className="flex w-full flex-col items-start justify-between gap-x-6 gap-y-2 md:flex-row">
                        <MarkdownRenderBox
                            divElem
                            text={`
${t.projectSettings.licenseDesc(projectType)} \n
${isCustomLicense ? t.projectSettings.customLicenseDesc : ""}
`}
                        />

                        <div className="flex w-full min-w-[32ch] flex-col items-start justify-start md:w-[52ch]">
                            <FormField
                                control={form.control}
                                name="id"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <ComboBox
                                                noResultsElem={t.common.noResults}
                                                options={licenseOptions}
                                                value={
                                                    isCustomLicense
                                                        ? CUSTOM_LICENSE_OPTION.licenseId
                                                        : (field.value ?? "")
                                                }
                                                setValue={(value: string) => {
                                                    if (value === CUSTOM_LICENSE_OPTION.licenseId) {
                                                        setShowCustomLicenseInputFields(true);
                                                        field.onChange(null);
                                                    } else {
                                                        field.onChange(value);
                                                        setShowCustomLicenseInputFields(false);
                                                    }
                                                    form.setValue("name", null);
                                                }}
                                                showOptionValueTooltip
                                                inputLabel={t.projectSettings.searchAllLicenses(licenseOptions.length)}
                                            >
                                                <Button
                                                    variant="secondary"
                                                    className="w-full justify-between overflow-hidden"
                                                >
                                                    {isCustomLicense
                                                        ? t.projectSettings.custom
                                                        : (selectedFeaturedLicense?.name ??
                                                          t.projectSettings.selectLicense)}
                                                    <ChevronDownIcon
                                                        aria-hidden
                                                        className="h-btn-icon w-btn-icon shrink-0"
                                                    />
                                                </Button>
                                            </ComboBox>
                                        </FormItem>
                                    );
                                }}
                            />

                            {isCustomLicense ? (
                                <>
                                    <LabelledCheckbox
                                        checkBoxId="license-does-not-have-spdx-id-checkbox"
                                        checked={doesNotHaveASpdxId}
                                        onCheckedChange={(value) => {
                                            setDoesNotHaveASpdxId(value === true);
                                            if (value === true) {
                                                form.setValue("id", null);
                                            } else {
                                                form.setValue("name", null);
                                            }
                                        }}
                                    >
                                        <span>{t.projectSettings.doesntHaveSpdxId}</span>
                                    </LabelledCheckbox>
                                    {doesNotHaveASpdxId && (
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Input
                                                        {...{
                                                            ...field,
                                                            value: field.value ?? "",
                                                        }}
                                                        placeholder={t.projectSettings.licenseName}
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    {!doesNotHaveASpdxId && (
                                        <FormField
                                            control={form.control}
                                            name="id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Input
                                                        {...{
                                                            ...field,
                                                            value: field.value ?? "",
                                                        }}
                                                        placeholder={t.projectSettings.spdxId}
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </>
                            ) : null}

                            <FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <Input
                                            {...{
                                                ...field,
                                                value: field.value ?? "",
                                                onChange: (e: ChangeEvent<HTMLInputElement>) => {
                                                    const inputVal = e.target.value;
                                                    field.onChange(inputVal.length > 0 ? inputVal : null);
                                                },
                                            }}
                                            placeholder={t.projectSettings.licenseUrl}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="w-fit"
                            disabled={!hasFormChanged || form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? (
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
